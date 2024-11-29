import { NextApiRequest, NextApiResponse } from 'next';
import { prisma } from '../../../lib/prisma';
import { getXeroInvoiceStatus } from '../../../lib/xero';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    const { id } = req.query;

    if (!id || typeof id !== 'string') {
        return res.status(400).json({ error: 'Invalid order ID' });
    }

    switch (req.method) {
        case 'GET':
            return getOrder(req, res, id);
        case 'PUT':
            return updateOrder(req, res, id);
        default:
            res.setHeader('Allow', ['GET', 'PUT']);
            res.status(405).end(`Method ${req.method} Not Allowed`);
    }
}

async function getOrder(req: NextApiRequest, res: NextApiResponse, id: string) {
    try {
        const order = await prisma.order.findUnique({
            where: { id },
            include: {
                items: true,
            },
        });

        if (!order) {
            return res.status(404).json({ error: 'Order not found' });
        }

        // Get Xero invoice status if available
        if (order.xeroInvoiceId) {
            try {
                const xeroStatus = await getXeroInvoiceStatus(order.xeroInvoiceId);
                order.xeroStatus = xeroStatus;
            } catch (error) {
                console.error('Error fetching Xero invoice status:', error);
                // Don't fail the request if Xero status check fails
            }
        }

        res.status(200).json(order);
    } catch (error) {
        console.error('Error fetching order:', error);
        res.status(500).json({ error: 'Failed to fetch order' });
    }
}

async function updateOrder(req: NextApiRequest, res: NextApiResponse, id: string) {
    try {
        const { status, stripePaymentIntentId } = req.body;

        const order = await prisma.order.update({
            where: { id },
            data: {
                status,
                stripePaymentIntentId,
                updatedAt: new Date(),
            },
            include: {
                items: true,
            },
        });

        res.status(200).json(order);
    } catch (error) {
        console.error('Error updating order:', error);
        res.status(500).json({ error: 'Failed to update order' });
    }
}
