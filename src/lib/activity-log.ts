import { prisma } from './prisma';

export type ActivityType =
    | 'subscription_created'
    | 'subscription_updated'
    | 'subscription_cancelled'
    | 'payment_succeeded'
    | 'payment_failed'
    | 'quantity_updated'
    | 'price_updated';

export interface ActivityLogEntry {
    type: ActivityType;
    userId: string;
    subscriptionId?: string;
    metadata?: Record<string, any>;
    timestamp: Date;
}

export async function logActivity(entry: Omit<ActivityLogEntry, 'timestamp'>) {
    try {
        return await prisma.activityLog.create({
            data: {
                type: entry.type,
                userId: entry.userId,
                subscriptionId: entry.subscriptionId,
                metadata: entry.metadata,
                timestamp: new Date(),
            },
        });
    } catch (error) {
        console.error('Error logging activity:', error);
        throw error;
    }
}

export async function getActivityLog(params: {
    userId?: string;
    subscriptionId?: string;
    type?: ActivityType;
    startDate?: Date;
    endDate?: Date;
    limit?: number;
    offset?: number;
}) {
    try {
        const where: any = {};

        if (params.userId) {
            where.userId = params.userId;
        }

        if (params.subscriptionId) {
            where.subscriptionId = params.subscriptionId;
        }

        if (params.type) {
            where.type = params.type;
        }

        if (params.startDate || params.endDate) {
            where.timestamp = {};
            if (params.startDate) {
                where.timestamp.gte = params.startDate;
            }
            if (params.endDate) {
                where.timestamp.lte = params.endDate;
            }
        }

        const [total, activities] = await Promise.all([
            prisma.activityLog.count({ where }),
            prisma.activityLog.findMany({
                where,
                orderBy: {
                    timestamp: 'desc',
                },
                take: params.limit || 50,
                skip: params.offset || 0,
                include: {
                    user: {
                        select: {
                            name: true,
                            email: true,
                        },
                    },
                },
            }),
        ]);

        return {
            total,
            activities,
        };
    } catch (error) {
        console.error('Error fetching activity log:', error);
        throw error;
    }
}

export async function getRecentActivity(limit = 10) {
    try {
        return await prisma.activityLog.findMany({
            orderBy: {
                timestamp: 'desc',
            },
            take: limit,
            include: {
                user: {
                    select: {
                        name: true,
                        email: true,
                    },
                },
            },
        });
    } catch (error) {
        console.error('Error fetching recent activity:', error);
        throw error;
    }
}

export function formatActivityMessage(activity: ActivityLogEntry): string {
    const metadata = activity.metadata || {};
    
    switch (activity.type) {
        case 'subscription_created':
            return `Subscription created for ${metadata.productName}`;
            
        case 'subscription_updated':
            return `Subscription updated: ${metadata.changes?.join(', ')}`;
            
        case 'subscription_cancelled':
            return `Subscription cancelled. Effective: ${new Date(
                metadata.effectiveDate
            ).toLocaleDateString()}`;
            
        case 'payment_succeeded':
            return `Payment of ${metadata.currency} ${(
                metadata.amount / 100
            ).toFixed(2)} succeeded`;
            
        case 'payment_failed':
            return `Payment of ${metadata.currency} ${(
                metadata.amount / 100
            ).toFixed(2)} failed`;
            
        case 'quantity_updated':
            return `Quantity updated from ${metadata.oldQuantity} to ${metadata.newQuantity}`;
            
        case 'price_updated':
            return `Price updated to ${metadata.currency} ${(
                metadata.newAmount / 100
            ).toFixed(2)}`;
            
        default:
            return 'Activity logged';
    }
}
