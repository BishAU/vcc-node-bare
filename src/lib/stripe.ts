import { loadStripe } from '@stripe/stripe-js';
import { Product, Order } from '../types/product';
import Stripe from 'stripe';

// Initialize Stripe
const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!);

// Server-side Stripe instance
if (!process.env.STRIPE_SECRET_KEY) {
    throw new Error('STRIPE_SECRET_KEY is not set in environment variables');
}

export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
    apiVersion: '2023-10-16', // Use the latest stable API version
});

export const createPaymentIntent = async (order: Order) => {
    try {
        const response = await fetch('/api/create-payment-intent', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(order),
        });

        if (!response.ok) {
            throw new Error('Failed to create payment intent');
        }

        const data = await response.json();
        return data.clientSecret;
    } catch (error) {
        console.error('Error creating payment intent:', error);
        throw error;
    }
};

export const handlePayment = async (
    clientSecret: string,
    order: Order,
    onSuccess: () => void,
    onError: (error: Error) => void
) => {
    try {
        const stripe = await stripePromise;
        if (!stripe) throw new Error('Stripe failed to initialize');

        const { error: stripeError } = await stripe.confirmPayment({
            elements: {
                clientSecret,
            },
            confirmParams: {
                return_url: `${window.location.origin}/payment/success`,
                payment_method_data: {
                    billing_details: {
                        email: order.metadata?.customerEmail,
                        address: order.metadata?.billingAddress,
                    },
                },
            },
        });

        if (stripeError) {
            throw new Error(stripeError.message);
        }

        onSuccess();
    } catch (error) {
        console.error('Payment failed:', error);
        onError(error instanceof Error ? error : new Error('Payment failed'));
    }
};

export const createSubscription = async (
    priceId: string,
    customerId: string,
    paymentMethodId: string
) => {
    try {
        const response = await fetch('/api/create-subscription', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                priceId,
                customerId,
                paymentMethodId,
            }),
        });

        if (!response.ok) {
            throw new Error('Failed to create subscription');
        }

        return await response.json();
    } catch (error) {
        console.error('Error creating subscription:', error);
        throw error;
    }
};

export const cancelSubscription = async (subscriptionId: string) => {
    try {
        const response = await fetch('/api/cancel-subscription', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ subscriptionId }),
        });

        if (!response.ok) {
            throw new Error('Failed to cancel subscription');
        }

        return await response.json();
    } catch (error) {
        console.error('Error canceling subscription:', error);
        throw error;
    }
};

export const updateSubscription = async (
    subscriptionId: string,
    newPriceId: string
) => {
    try {
        const response = await fetch('/api/update-subscription', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                subscriptionId,
                newPriceId,
            }),
        });

        if (!response.ok) {
            throw new Error('Failed to update subscription');
        }

        return await response.json();
    } catch (error) {
        console.error('Error updating subscription:', error);
        throw error;
    }
};
