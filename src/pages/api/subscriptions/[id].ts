import { NextApiRequest, NextApiResponse } from 'next';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '../auth/[...nextauth]';
import {
    getSubscription,
    updateSubscription,
    cancelSubscription,
} from '../../../lib/stripe-subscription';
import { logActivity } from '@/lib/activity-log';
import {
    sendEmail,
    getSubscriptionUpdatedTemplate,
    getSubscriptionCancelledTemplate,
} from '@/lib/email';
import { prisma } from '@/lib/prisma';

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse
) {
    const session = await getServerSession(req, res, authOptions);
    if (!session) {
        return res.status(401).json({ error: 'Unauthorized' });
    }

    const { id } = req.query;

    if (!id || typeof id !== 'string') {
        return res.status(400).json({ error: 'Invalid subscription ID' });
    }

    switch (req.method) {
        case 'GET':
            return handleGetSubscription(req, res, id);
        case 'PUT':
            return handleUpdateSubscription(req, res, id);
        case 'DELETE':
            return handleCancelSubscription(req, res, id);
        default:
            res.setHeader('Allow', ['GET', 'PUT', 'DELETE']);
            res.status(405).end(`Method ${req.method} Not Allowed`);
    }
}

async function handleGetSubscription(
    req: NextApiRequest,
    res: NextApiResponse,
    subscriptionId: string
) {
    try {
        const subscription = await getSubscription(subscriptionId);
        res.status(200).json(subscription);
    } catch (error: any) {
        console.error('Error retrieving subscription:', error);
        res.status(500).json({
            error: error.message || 'Error retrieving subscription',
        });
    }
}

async function handleUpdateSubscription(
    req: NextApiRequest,
    res: NextApiResponse,
    subscriptionId: string
) {
    try {
        const { priceId, quantity, metadata } = req.body;

        if (!priceId && !quantity && !metadata) {
            return res.status(400).json({
                error: 'At least one update parameter is required',
            });
        }

        const oldSubscription = await prisma.subscription.findUnique({
            where: { id: subscriptionId },
            include: { price: true, product: true },
        });

        const subscription = await updateSubscription({
            subscriptionId,
            priceId,
            quantity,
        });

        // Log activity
        const changes: string[] = [];
        if (priceId && priceId !== oldSubscription?.price.id) {
            changes.push(`Price updated to ${subscription.price.currency} ${
                subscription.price.unit_amount / 100
            }`);
        }
        if (quantity && quantity !== oldSubscription?.quantity) {
            changes.push(
                `Quantity updated from ${oldSubscription?.quantity} to ${quantity}`
            );
        }

        await logActivity({
            type: 'subscription_updated',
            userId: session.user.id,
            subscriptionId,
            metadata: { changes },
        });

        // Send update email
        const user = await prisma.user.findUnique({
            where: { id: session.user.id },
        });

        if (user?.email && changes.length > 0) {
            await sendEmail(
                user.email,
                getSubscriptionUpdatedTemplate({
                    customerName: user.name || 'Valued Customer',
                    productName: subscription.product.name,
                    changes,
                    nextBillingDate: subscription.current_period_end,
                })
            );
        }

        res.status(200).json(subscription);
    } catch (error) {
        console.error('Error updating subscription:', error);
        res.status(500).json({ error: 'Failed to update subscription' });
    }
}

async function handleCancelSubscription(
    req: NextApiRequest,
    res: NextApiResponse,
    subscriptionId: string
) {
    try {
        const subscription = await cancelSubscription(subscriptionId);

        // Log activity
        await logActivity({
            type: 'subscription_cancelled',
            userId: session.user.id,
            subscriptionId,
            metadata: {
                effectiveDate: subscription.cancel_at,
                productName: subscription.product.name,
            },
        });

        // Send cancellation email
        const user = await prisma.user.findUnique({
            where: { id: session.user.id },
        });

        if (user?.email) {
            await sendEmail(
                user.email,
                getSubscriptionCancelledTemplate({
                    customerName: user.name || 'Valued Customer',
                    productName: subscription.product.name,
                    endDate: subscription.cancel_at,
                })
            );
        }

        res.status(200).json(subscription);
    } catch (error) {
        console.error('Error cancelling subscription:', error);
        res.status(500).json({ error: 'Failed to cancel subscription' });
    }
}
