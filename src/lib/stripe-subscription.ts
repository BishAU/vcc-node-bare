import Stripe from 'stripe';
import { stripe } from './stripe';
import { prisma } from './prisma';

export async function createSubscription(
    customerId: string,
    priceId: string,
    billingDetails: any,
    metadata: any = {}
) {
    try {
        // Create subscription
        const subscription = await stripe.subscriptions.create({
            customer: customerId,
            items: [{ price: priceId }],
            payment_behavior: 'default_incomplete',
            payment_settings: { save_default_payment_method: 'on_subscription' },
            expand: ['latest_invoice.payment_intent'],
            metadata: {
                ...metadata,
                billingEmail: billingDetails.email,
            },
        });

        // Create order record in database
        const order = await prisma.order.create({
            data: {
                userId: metadata.userId,
                status: 'pending',
                total: subscription.items.data[0].price.unit_amount! / 100,
                currency: subscription.currency,
                stripeSubscriptionId: subscription.id,
                metadata: {
                    billingDetails,
                    subscriptionStatus: subscription.status,
                    interval: subscription.items.data[0].price.recurring?.interval,
                },
            },
        });

        return {
            subscriptionId: subscription.id,
            clientSecret: (subscription.latest_invoice as Stripe.Invoice)
                .payment_intent?.client_secret,
            orderId: order.id,
        };
    } catch (error) {
        console.error('Error creating subscription:', error);
        throw error;
    }
}

export async function updateSubscription(
    subscriptionId: string,
    updates: {
        priceId?: string;
        quantity?: number;
        metadata?: Record<string, string>;
    }
) {
    try {
        const subscription = await stripe.subscriptions.retrieve(subscriptionId);
        const updateParams: Stripe.SubscriptionUpdateParams = {};

        if (updates.priceId) {
            updateParams.items = [
                {
                    id: subscription.items.data[0].id,
                    price: updates.priceId,
                },
            ];
        }

        if (updates.quantity) {
            updateParams.items = [
                {
                    id: subscription.items.data[0].id,
                    quantity: updates.quantity,
                },
            ];
        }

        if (updates.metadata) {
            updateParams.metadata = {
                ...subscription.metadata,
                ...updates.metadata,
            };
        }

        const updatedSubscription = await stripe.subscriptions.update(
            subscriptionId,
            updateParams
        );

        // Update order record
        await prisma.order.updateMany({
            where: { stripeSubscriptionId: subscriptionId },
            data: {
                total:
                    (updatedSubscription.items.data[0].price.unit_amount! *
                        (updates.quantity || 1)) /
                    100,
                metadata: {
                    subscriptionStatus: updatedSubscription.status,
                },
            },
        });

        return updatedSubscription;
    } catch (error) {
        console.error('Error updating subscription:', error);
        throw error;
    }
}

export async function cancelSubscription(subscriptionId: string) {
    try {
        const subscription = await stripe.subscriptions.cancel(subscriptionId);

        // Update order record
        await prisma.order.updateMany({
            where: { stripeSubscriptionId: subscriptionId },
            data: {
                status: 'cancelled',
                metadata: {
                    subscriptionStatus: subscription.status,
                },
            },
        });

        return subscription;
    } catch (error) {
        console.error('Error cancelling subscription:', error);
        throw error;
    }
}

export async function getSubscription(subscriptionId: string) {
    try {
        return await stripe.subscriptions.retrieve(subscriptionId, {
            expand: ['customer', 'default_payment_method', 'items.data.price'],
        });
    } catch (error) {
        console.error('Error retrieving subscription:', error);
        throw error;
    }
}

export async function listCustomerSubscriptions(customerId: string) {
    try {
        return await stripe.subscriptions.list({
            customer: customerId,
            status: 'all',
            expand: ['data.default_payment_method', 'data.items.data.price'],
        });
    } catch (error) {
        console.error('Error listing customer subscriptions:', error);
        throw error;
    }
}
