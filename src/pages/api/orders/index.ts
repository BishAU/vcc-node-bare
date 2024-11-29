import { NextApiRequest, NextApiResponse } from 'next';
import { prisma } from '../../../lib/prisma';
import { createXeroInvoice } from '../../../lib/xero';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    switch (req.method) {
        case 'GET':
            return getOrders(req, res);
        case 'POST':
            return createOrder(req, res);
        default:
            res.setHeader('Allow', ['GET', 'POST']);
            res.status(405).end(`Method ${req.method} Not Allowed`);
    }
}

async function getOrders(req: NextApiRequest, res: NextApiResponse) {
    try {
        const orders = await prisma.order.findMany({
            orderBy: { createdAt: 'desc' },
            include: {
                items: true,
            },
        });
        res.status(200).json(orders);
    } catch (error) {
        console.error('Error fetching orders:', error);
        res.status(500).json({ error: 'Failed to fetch orders' });
    }
}

async function createOrder(req: NextApiRequest, res: NextApiResponse) {
    try {
        const { items, billingDetails, amount } = req.body;

        // Create order in database
        const order = await prisma.order.create({
            data: {
                userId: req.session?.user?.id, // If using authentication
                status: 'pending',
                total: amount,
                currency: 'AUD',
                items: {
                    create: items.map((item: any) => ({
                        productId: item.productId,
                        quantity: item.quantity,
                        price: item.price,
                        metadata: item.metadata,
                    })),
                },
                metadata: {
                    billingDetails,
                },
            },
            include: {
                items: true,
            },
        });

        // Create Xero invoice
        try {
            const xeroInvoiceId = await createXeroInvoice(order);
            
            // Update order with Xero invoice ID
            await prisma.order.update({
                where: { id: order.id },
                data: {
                    xeroInvoiceId,
                },
            });
        } catch (error) {
            console.error('Error creating Xero invoice:', error);
            // Don't fail the order creation if Xero integration fails
            // We can retry later or handle it manually
        }

        res.status(201).json({
            orderId: order.id,
            status: order.status,
        });
    } catch (error) {
        console.error('Error creating order:', error);
        res.status(500).json({ error: 'Failed to create order' });
    }
}
