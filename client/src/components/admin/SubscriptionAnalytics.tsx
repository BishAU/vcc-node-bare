import React from 'react';
import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    Legend,
    ResponsiveContainer,
    LineChart,
    Line,
} from 'recharts';

interface AnalyticsData {
    subscriptionStats: {
        totalActive: number;
        totalCancelled: number;
        totalRevenue: number;
        revenueByMonth: Array<{
            month: string;
            revenue: number;
        }>;
        subscriptionsByProduct: Array<{
            productName: string;
            count: number;
        }>;
        churnRate: number;
    };
}

export const SubscriptionAnalytics: React.FC<AnalyticsData> = ({
    subscriptionStats,
}) => {
    return (
        <div className="space-y-8">
            {/* Summary Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="bg-white rounded-lg shadow p-6">
                    <h3 className="text-sm font-medium text-gray-500">
                        Active Subscriptions
                    </h3>
                    <p className="mt-2 text-3xl font-semibold text-gray-900">
                        {subscriptionStats.totalActive}
                    </p>
                </div>
                <div className="bg-white rounded-lg shadow p-6">
                    <h3 className="text-sm font-medium text-gray-500">
                        Total Revenue
                    </h3>
                    <p className="mt-2 text-3xl font-semibold text-gray-900">
                        ${subscriptionStats.totalRevenue.toLocaleString()}
                    </p>
                </div>
                <div className="bg-white rounded-lg shadow p-6">
                    <h3 className="text-sm font-medium text-gray-500">
                        Churn Rate
                    </h3>
                    <p className="mt-2 text-3xl font-semibold text-gray-900">
                        {(subscriptionStats.churnRate * 100).toFixed(1)}%
                    </p>
                </div>
                <div className="bg-white rounded-lg shadow p-6">
                    <h3 className="text-sm font-medium text-gray-500">
                        Cancelled
                    </h3>
                    <p className="mt-2 text-3xl font-semibold text-gray-900">
                        {subscriptionStats.totalCancelled}
                    </p>
                </div>
            </div>

            {/* Monthly Revenue Chart */}
            <div className="bg-white rounded-lg shadow p-6">
                <h3 className="text-lg font-medium text-gray-900 mb-4">
                    Monthly Revenue
                </h3>
                <div className="h-80">
                    <ResponsiveContainer width="100%" height="100%">
                        <LineChart
                            data={subscriptionStats.revenueByMonth}
                            margin={{
                                top: 5,
                                right: 30,
                                left: 20,
                                bottom: 5,
                            }}
                        >
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="month" />
                            <YAxis />
                            <Tooltip />
                            <Legend />
                            <Line
                                type="monotone"
                                dataKey="revenue"
                                stroke="#3B82F6"
                                activeDot={{ r: 8 }}
                            />
                        </LineChart>
                    </ResponsiveContainer>
                </div>
            </div>

            {/* Subscriptions by Product */}
            <div className="bg-white rounded-lg shadow p-6">
                <h3 className="text-lg font-medium text-gray-900 mb-4">
                    Subscriptions by Product
                </h3>
                <div className="h-80">
                    <ResponsiveContainer width="100%" height="100%">
                        <BarChart
                            data={subscriptionStats.subscriptionsByProduct}
                            margin={{
                                top: 5,
                                right: 30,
                                left: 20,
                                bottom: 5,
                            }}
                        >
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="productName" />
                            <YAxis />
                            <Tooltip />
                            <Legend />
                            <Bar
                                dataKey="count"
                                fill="#3B82F6"
                                name="Subscriptions"
                            />
                        </BarChart>
                    </ResponsiveContainer>
                </div>
            </div>
        </div>
    );
};
