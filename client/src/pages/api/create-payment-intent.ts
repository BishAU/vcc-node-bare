import { NextApiRequest, NextApiResponse } from 'next';
import Stripe from 'stripe';
import { CartItem } from '../../types/product';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
    apiVersion: '2023-10-16',
});

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method !== 'POST') {
        res.setHeader('Allow', ['POST']);
        return res.status(405).end(`Method ${req.method} Not Allowed`);
    }

    try {
        const { items } = req.body;

        // Validate the cart items
        if (!items || !Array.isArray(items) || items.length === 0) {
            return res.status(400).json({ error: 'Invalid cart items' });
        }

        // Calculate total amount in cents
        const amount = items.reduce(
            (total: number, item: CartItem) => total + item.price * item.quantity * 100,
            0
        );

        // Create payment intent
        const paymentIntent = await stripe.paymentIntents.create({
            amount: Math.round(amount),
            currency: 'aud',
            automatic_payment_methods: {
                enabled: true,
            },
            metadata: {
                items: JSON.stringify(
                    items.map((item: CartItem) => ({
                        productId: item.productId,
                        quantity: item.quantity,
                        price: item.price,
                    }))
                ),
            },
        });

        res.status(200).json({
            clientSecret: paymentIntent.client_secret,
        });
    } catch (error) {
        console.error('Error creating payment intent:', error);
        res.status(500).json({ error: 'Failed to create payment intent' });
    }
}
