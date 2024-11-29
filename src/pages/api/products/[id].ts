import { NextApiRequest, NextApiResponse } from 'next';
import Stripe from 'stripe';
import { prisma } from '../../../lib/prisma';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
    apiVersion: '2023-10-16',
});

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    const { id } = req.query;

    if (!id || typeof id !== 'string') {
        return res.status(400).json({ error: 'Invalid product ID' });
    }

    switch (req.method) {
        case 'GET':
            return getProduct(req, res, id);
        case 'PUT':
            return updateProduct(req, res, id);
        case 'DELETE':
            return deleteProduct(req, res, id);
        default:
            res.setHeader('Allow', ['GET', 'PUT', 'DELETE']);
            res.status(405).end(`Method ${req.method} Not Allowed`);
    }
}

async function getProduct(req: NextApiRequest, res: NextApiResponse, id: string) {
    try {
        const product = await prisma.product.findUnique({
            where: { id },
        });

        if (!product) {
            return res.status(404).json({ error: 'Product not found' });
        }

        res.status(200).json(product);
    } catch (error) {
        console.error('Error fetching product:', error);
        res.status(500).json({ error: 'Failed to fetch product' });
    }
}

async function updateProduct(req: NextApiRequest, res: NextApiResponse, id: string) {
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

        const product = await prisma.product.findUnique({
            where: { id },
        });

        if (!product) {
            return res.status(404).json({ error: 'Product not found' });
        }

        // Update Stripe product
        await stripe.products.update(product.stripeProductId, {
            name,
            description,
            metadata: {
                category,
                xeroItemCode,
                taxRate: taxRate?.toString(),
            },
        });

        // Create new Stripe price if price changed
        if (price !== product.price || 
            JSON.stringify(recurringBilling) !== JSON.stringify(product.metadata.recurringBilling)) {
            const newPrice = await stripe.prices.create({
                product: product.stripeProductId,
                unit_amount: Math.round(price * 100),
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

            // Deactivate old price
            await stripe.prices.update(product.stripePriceId, {
                active: false,
            });

            // Update product with new price ID
            await prisma.product.update({
                where: { id },
                data: {
                    stripePriceId: newPrice.id,
                },
            });
        }

        // Update product in database
        const updatedProduct = await prisma.product.update({
            where: { id },
            data: {
                name,
                description,
                price,
                category,
                features,
                metadata: {
                    xeroItemCode,
                    taxRate,
                    recurringBilling,
                },
            },
        });

        res.status(200).json(updatedProduct);
    } catch (error) {
        console.error('Error updating product:', error);
        res.status(500).json({ error: 'Failed to update product' });
    }
}

async function deleteProduct(req: NextApiRequest, res: NextApiResponse, id: string) {
    try {
        const product = await prisma.product.findUnique({
            where: { id },
        });

        if (!product) {
            return res.status(404).json({ error: 'Product not found' });
        }

        // Archive Stripe product
        await stripe.products.update(product.stripeProductId, {
            active: false,
        });

        // Soft delete product in database
        await prisma.product.update({
            where: { id },
            data: {
                active: false,
            },
        });

        res.status(204).end();
    } catch (error) {
        console.error('Error deleting product:', error);
        res.status(500).json({ error: 'Failed to delete product' });
    }
}
