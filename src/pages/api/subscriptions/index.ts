import { NextApiRequest, NextApiResponse } from 'next';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '../auth/[...nextauth]';
import { createSubscription } from '@/lib/stripe-subscription';
import { logActivity } from '@/lib/activity-log';
import { sendEmail, getSubscriptionCreatedTemplate } from '@/lib/email';
import { prisma } from '@/lib/prisma';

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse
) {
    const session = await getServerSession(req, res, authOptions);
    if (!session) {
        return res.status(401).json({ error: 'Unauthorized' });
    }

    switch (req.method) {
        case 'POST':
            return handleCreateSubscription(req, res, session);
        case 'GET':
            return handleListSubscriptions(req, res);
        default:
            res.setHeader('Allow', ['POST', 'GET']);
            res.status(405).end(`Method ${req.method} Not Allowed`);
    }
}

async function handleCreateSubscription(
    req: NextApiRequest,
    res: NextApiResponse,
    session: any
) {
    try {
        const { priceId, quantity } = req.body;

        if (!priceId || !quantity) {
            return res.status(400).json({
                error: 'Missing required parameters',
            });
        }

        const subscription = await createSubscription({
            userId: session.user.id,
            priceId,
            quantity,
        });

        // Log activity
        await logActivity({
            type: 'subscription_created',
            userId: session.user.id,
            subscriptionId: subscription.id,
            metadata: {
                productName: subscription.product.name,
                priceId,
                quantity,
            },
        });

        // Send confirmation email
        const user = await prisma.user.findUnique({
            where: { id: session.user.id },
        });

        if (user?.email) {
            await sendEmail(
                user.email,
                getSubscriptionCreatedTemplate({
                    customerName: user.name || 'Valued Customer',
                    productName: subscription.product.name,
                    amount: subscription.price.unit_amount,
                    currency: subscription.price.currency,
                    interval: subscription.price.interval,
                    nextBillingDate: subscription.current_period_end,
                })
            );
        }

        res.status(200).json(subscription);
    } catch (error: any) {
        console.error('Error creating subscription:', error);
        res.status(500).json({
            error: error.message || 'Error creating subscription',
        });
    }
}

async function handleListSubscriptions(
    req: NextApiRequest,
    res: NextApiResponse
) {
    try {
        const { customerId } = req.query;

        if (!customerId || typeof customerId !== 'string') {
            return res.status(400).json({
                error: 'Customer ID is required',
            });
        }

        const subscriptions = await listCustomerSubscriptions(customerId);
        res.status(200).json(subscriptions);
    } catch (error: any) {
        console.error('Error listing subscriptions:', error);
        res.status(500).json({
            error: error.message || 'Error listing subscriptions',
        });
    }
}
