import { NextApiRequest, NextApiResponse } from 'next';
import { prisma } from '../../../lib/prisma';
import { stripe } from '../../../lib/stripe';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method !== 'GET') {
        res.setHeader('Allow', ['GET']);
        return res.status(405).end(`Method ${req.method} Not Allowed`);
    }

    try {
        // Get all subscriptions
        const subscriptions = await stripe.subscriptions.list({
            limit: 100,
            expand: ['data.customer', 'data.items.data.price.product'],
        });

        // Calculate total active and cancelled subscriptions
        const totalActive = subscriptions.data.filter(
            (sub) => sub.status === 'active'
        ).length;
        const totalCancelled = subscriptions.data.filter(
            (sub) => sub.status === 'canceled'
        ).length;

        // Calculate total revenue
        const totalRevenue = subscriptions.data.reduce((acc, sub) => {
            if (sub.status === 'active') {
                return (
                    acc +
                    (sub.items.data[0].price.unit_amount || 0) *
                        (sub.items.data[0].quantity || 1) *
                        (sub.items.data[0].price.recurring?.interval === 'year'
                            ? 12
                            : 1)
                );
            }
            return acc;
        }, 0) / 100; // Convert from cents to dollars

        // Calculate revenue by month
        const revenueByMonth = await calculateRevenueByMonth();

        // Calculate subscriptions by product
        const subscriptionsByProduct = calculateSubscriptionsByProduct(
            subscriptions.data
        );

        // Calculate churn rate
        const churnRate =
            totalActive > 0
                ? totalCancelled / (totalActive + totalCancelled)
                : 0;

        res.status(200).json({
            totalActive,
            totalCancelled,
            totalRevenue,
            revenueByMonth,
            subscriptionsByProduct,
            churnRate,
        });
    } catch (error) {
        console.error('Error fetching subscription stats:', error);
        res.status(500).json({
            error: 'Failed to fetch subscription statistics',
        });
    }
}

async function calculateRevenueByMonth() {
    const sixMonthsAgo = new Date();
    sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);

    const invoices = await stripe.invoices.list({
        created: { gte: Math.floor(sixMonthsAgo.getTime() / 1000) },
        limit: 100,
    });

    const revenueByMonth: { [key: string]: number } = {};

    invoices.data.forEach((invoice) => {
        if (invoice.status === 'paid') {
            const date = new Date(invoice.created * 1000);
            const monthKey = date.toLocaleString('default', {
                month: 'short',
                year: '2-digit',
            });
            revenueByMonth[monthKey] =
                (revenueByMonth[monthKey] || 0) + invoice.amount_paid / 100;
        }
    });

    // Convert to array format for charts
    return Object.entries(revenueByMonth)
        .map(([month, revenue]) => ({
            month,
            revenue,
        }))
        .sort((a, b) => {
            const [aMonth, aYear] = a.month.split(' ');
            const [bMonth, bYear] = b.month.split(' ');
            return (
                new Date(`${aMonth} 20${aYear}`).getTime() -
                new Date(`${bMonth} 20${bYear}`).getTime()
            );
        });
}

function calculateSubscriptionsByProduct(subscriptions: any[]) {
    const productCounts: { [key: string]: number } = {};

    subscriptions.forEach((sub) => {
        if (sub.status === 'active') {
            const productName = (
                sub.items.data[0].price.product as any
            ).name;
            productCounts[productName] = (productCounts[productName] || 0) + 1;
        }
    });

    return Object.entries(productCounts).map(([productName, count]) => ({
        productName,
        count,
    }));
}
