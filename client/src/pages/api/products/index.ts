import { NextApiRequest, NextApiResponse } from 'next';
import Stripe from 'stripe';
import { prisma } from '../../../lib/prisma';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
    apiVersion: '2023-10-16',
});

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    switch (req.method) {
        case 'GET':
            return getProducts(req, res);
        case 'POST':
            return createProduct(req, res);
        default:
            res.setHeader('Allow', ['GET', 'POST']);
            res.status(405).end(`Method ${req.method} Not Allowed`);
    }
}

async function getProducts(req: NextApiRequest, res: NextApiResponse) {
    try {
        const products = await prisma.product.findMany({
            where: { active: true },
            orderBy: { createdAt: 'desc' },
        });
        res.status(200).json(products);
    } catch (error) {
        console.error('Error fetching products:', error);
        res.status(500).json({ error: 'Failed to fetch products' });
    }
}

async function createProduct(req: NextApiRequest, res: NextApiResponse) {
    try {
        const {
            name,
            description,
            price,
            category,
            features,
            xeroItemCode,
            taxRate,
            recurringBilling,
        } = req.body;

        // Create Stripe product
        const stripeProduct = await stripe.products.create({
            name,
            description,
            metadata: {
                category,
                xeroItemCode,
                taxRate: taxRate?.toString(),
            },
        });

        // Create Stripe price
        const stripePrice = await stripe.prices.create({
            product: stripeProduct.id,
            unit_amount: Math.round(price * 100), // Convert to cents
            currency: 'aud',
            ...(category === 'subscription' && recurringBilling
                ? {
                      recurring: {
                          interval: recurringBilling.interval,
                          interval_count: recurringBilling.intervalCount,
                      },
                  }
                : {}),
        });

        // Create product in database
        const product = await prisma.product.create({
            data: {
                name,
                description,
                price,
                currency: 'AUD',
                category,
                features,
                stripeProductId: stripeProduct.id,
                stripePriceId: stripePrice.id,
                active: true,
                metadata: {
                    xeroItemCode,
                    taxRate,
                    recurringBilling,
                },
            },
        });

        res.status(201).json(product);
    } catch (error) {
        console.error('Error creating product:', error);
        res.status(500).json({ error: 'Failed to create product' });
    }
}
