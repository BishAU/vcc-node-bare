import { prisma } from './prisma';
import { startOfMonth, endOfMonth, subMonths, format } from 'date-fns';

export interface SubscriptionMetrics {
    totalActiveSubscriptions: number;
    totalCancelledSubscriptions: number;
    totalRevenue: number;
    monthlyRevenue: MonthlyRevenue[];
    subscriptionsByProduct: ProductSubscriptions[];
    churnRate: number;
    averageRevenuePerUser: number;
    customerLifetimeValue: number;
}

interface MonthlyRevenue {
    month: string;
    revenue: number;
}

interface ProductSubscriptions {
    productId: string;
    productName: string;
    subscriptionCount: number;
    revenue: number;
}

export async function getSubscriptionMetrics(
    startDate?: Date,
    endDate?: Date
): Promise<SubscriptionMetrics> {
    const end = endDate || new Date();
    const start = startDate || subMonths(end, 12);

    // Get all subscriptions within date range
    const subscriptions = await prisma.subscription.findMany({
        where: {
            createdAt: {
                gte: start,
                lte: end,
            },
        },
        include: {
            price: true,
            product: true,
        },
    });

    // Calculate total active and cancelled subscriptions
    const activeSubscriptions = subscriptions.filter(
        (sub) => !sub.cancelledAt && !sub.endedAt
    );
    const cancelledSubscriptions = subscriptions.filter(
        (sub) => sub.cancelledAt || sub.endedAt
    );

    // Calculate total revenue
    const totalRevenue = subscriptions.reduce((sum, sub) => {
        const monthlyRevenue = (sub.price.unitAmount || 0) * (sub.quantity || 1);
        const months = getSubscriptionMonths(sub.createdAt, sub.cancelledAt || end);
        return sum + monthlyRevenue * months;
    }, 0);

    // Calculate monthly revenue
    const monthlyRevenue = await calculateMonthlyRevenue(start, end);

    // Calculate subscriptions by product
    const subscriptionsByProduct = await calculateSubscriptionsByProduct();

    // Calculate churn rate
    const churnRate = calculateChurnRate(
        activeSubscriptions.length,
        cancelledSubscriptions.length
    );

    // Calculate average revenue per user
    const totalUsers = await prisma.user.count();
    const averageRevenuePerUser = totalUsers > 0 ? totalRevenue / totalUsers : 0;

    // Calculate customer lifetime value
    const customerLifetimeValue = calculateCustomerLifetimeValue(
        averageRevenuePerUser,
        churnRate
    );

    return {
        totalActiveSubscriptions: activeSubscriptions.length,
        totalCancelledSubscriptions: cancelledSubscriptions.length,
        totalRevenue,
        monthlyRevenue,
        subscriptionsByProduct,
        churnRate,
        averageRevenuePerUser,
        customerLifetimeValue,
    };
}

async function calculateMonthlyRevenue(
    startDate: Date,
    endDate: Date
): Promise<MonthlyRevenue[]> {
    const months: MonthlyRevenue[] = [];
    let currentDate = startDate;

    while (currentDate <= endDate) {
        const start = startOfMonth(currentDate);
        const end = endOfMonth(currentDate);

        const monthlySubscriptions = await prisma.subscription.findMany({
            where: {
                OR: [
                    {
                        createdAt: {
                            lte: end,
                        },
                        cancelledAt: {
                            gte: start,
                        },
                    },
                    {
                        createdAt: {
                            lte: end,
                        },
                        cancelledAt: null,
                    },
                ],
            },
            include: {
                price: true,
            },
        });

        const revenue = monthlySubscriptions.reduce(
            (sum, sub) =>
                sum + (sub.price.unitAmount || 0) * (sub.quantity || 1),
            0
        );

        months.push({
            month: format(currentDate, 'MMM yyyy'),
            revenue,
        });

        currentDate = endOfMonth(addMonths(currentDate, 1));
    }

    return months;
}

async function calculateSubscriptionsByProduct(): Promise<ProductSubscriptions[]> {
    const products = await prisma.product.findMany({
        include: {
            subscriptions: {
                include: {
                    price: true,
                },
            },
        },
    });

    return products.map((product) => {
        const activeSubscriptions = product.subscriptions.filter(
            (sub) => !sub.cancelledAt && !sub.endedAt
        );

        const revenue = activeSubscriptions.reduce(
            (sum, sub) =>
                sum + (sub.price.unitAmount || 0) * (sub.quantity || 1),
            0
        );

        return {
            productId: product.id,
            productName: product.name,
            subscriptionCount: activeSubscriptions.length,
            revenue,
        };
    });
}

function calculateChurnRate(
    activeSubscriptions: number,
    cancelledSubscriptions: number
): number {
    const totalSubscriptions = activeSubscriptions + cancelledSubscriptions;
    return totalSubscriptions > 0
        ? (cancelledSubscriptions / totalSubscriptions) * 100
        : 0;
}

function calculateCustomerLifetimeValue(
    averageRevenuePerUser: number,
    churnRate: number
): number {
    // CLV = ARPU / Churn Rate
    return churnRate > 0 ? averageRevenuePerUser / (churnRate / 100) : 0;
}

function getSubscriptionMonths(startDate: Date, endDate: Date): number {
    const diffTime = Math.abs(endDate.getTime() - startDate.getTime());
    const diffMonths = Math.ceil(diffTime / (1000 * 60 * 60 * 24 * 30.44));
    return Math.max(diffMonths, 1);
}

function addMonths(date: Date, months: number): Date {
    const newDate = new Date(date);
    newDate.setMonth(newDate.getMonth() + months);
    return newDate;
}

export async function generateSubscriptionReport(
    startDate: Date,
    endDate: Date,
    format: 'csv' | 'json' = 'csv'
) {
    const subscriptions = await prisma.subscription.findMany({
        where: {
            createdAt: {
                gte: startDate,
                lte: endDate,
            },
        },
        include: {
            user: {
                select: {
                    email: true,
                    name: true,
                },
            },
            product: true,
            price: true,
        },
        orderBy: {
            createdAt: 'asc',
        },
    });

    if (format === 'json') {
        return subscriptions;
    }

    // Generate CSV
    const headers = [
        'Subscription ID',
        'Customer Name',
        'Customer Email',
        'Product',
        'Price',
        'Quantity',
        'Total Amount',
        'Status',
        'Created At',
        'Cancelled At',
    ].join(',');

    const rows = subscriptions.map((sub) => {
        return [
            sub.id,
            sub.user.name,
            sub.user.email,
            sub.product.name,
            (sub.price.unitAmount || 0) / 100,
            sub.quantity,
            ((sub.price.unitAmount || 0) * (sub.quantity || 1)) / 100,
            sub.cancelledAt ? 'Cancelled' : 'Active',
            sub.createdAt.toISOString(),
            sub.cancelledAt?.toISOString() || '',
        ].join(',');
    });

    return [headers, ...rows].join('\n');
}
