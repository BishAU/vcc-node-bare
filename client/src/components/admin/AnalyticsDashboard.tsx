import React from 'react';
import { useQuery } from '@tanstack/react-query';
import {
    LineChart,
    Line,
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    Legend,
} from 'recharts';
import { SubscriptionMetrics } from '@/lib/analytics';

export function AnalyticsDashboard() {
    const { data: metrics, isLoading } = useQuery<SubscriptionMetrics>(
        ['subscription-metrics'],
        () => fetch('/api/admin/analytics').then((res) => res.json())
    );

    if (isLoading) {
        return (
            <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    {[...Array(4)].map((_, i) => (
                        <div
                            key={i}
                            className="bg-white p-6 rounded-lg shadow-sm animate-pulse"
                        >
                            <div className="h-4 bg-gray-200 rounded w-1/2 mb-2"></div>
                            <div className="h-6 bg-gray-200 rounded w-3/4"></div>
                        </div>
                    ))}
                </div>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {[...Array(2)].map((_, i) => (
                        <div
                            key={i}
                            className="bg-white p-6 rounded-lg shadow-sm h-80 animate-pulse"
                        >
                            <div className="h-4 bg-gray-200 rounded w-1/3 mb-4"></div>
                            <div className="h-64 bg-gray-100 rounded"></div>
                        </div>
                    ))}
                </div>
            </div>
        );
    }

    if (!metrics) {
        return (
            <div className="text-center py-12">
                <p className="text-gray-500">No data available</p>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {/* Summary Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <MetricCard
                    title="Active Subscriptions"
                    value={metrics.totalActiveSubscriptions}
                    type="number"
                />
                <MetricCard
                    title="Total Revenue"
                    value={metrics.totalRevenue / 100}
                    type="currency"
                />
                <MetricCard
                    title="Churn Rate"
                    value={metrics.churnRate}
                    type="percentage"
                />
                <MetricCard
                    title="Avg. Revenue Per User"
                    value={metrics.averageRevenuePerUser / 100}
                    type="currency"
                />
            </div>

            {/* Charts */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Monthly Revenue Chart */}
                <div className="bg-white p-6 rounded-lg shadow-sm">
                    <h3 className="text-lg font-semibold mb-4">
                        Monthly Revenue
                    </h3>
                    <div className="h-64">
                        <ResponsiveContainer width="100%" height="100%">
                            <LineChart data={metrics.monthlyRevenue}>
                                <CartesianGrid strokeDasharray="3 3" />
                                <XAxis dataKey="month" />
                                <YAxis
                                    tickFormatter={(value) =>
                                        `$${(value / 100).toFixed(0)}`
                                    }
                                />
                                <Tooltip
                                    formatter={(value: number) =>
                                        `$${(value / 100).toFixed(2)}`
                                    }
                                />
                                <Legend />
                                <Line
                                    type="monotone"
                                    dataKey="revenue"
                                    stroke="#3b82f6"
                                    name="Revenue"
                                />
                            </LineChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* Subscriptions by Product Chart */}
                <div className="bg-white p-6 rounded-lg shadow-sm">
                    <h3 className="text-lg font-semibold mb-4">
                        Subscriptions by Product
                    </h3>
                    <div className="h-64">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={metrics.subscriptionsByProduct}>
                                <CartesianGrid strokeDasharray="3 3" />
                                <XAxis dataKey="productName" />
                                <YAxis />
                                <Tooltip />
                                <Legend />
                                <Bar
                                    dataKey="subscriptionCount"
                                    fill="#3b82f6"
                                    name="Subscriptions"
                                />
                                <Bar
                                    dataKey="revenue"
                                    fill="#10b981"
                                    name="Revenue"
                                />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>
            </div>

            {/* Customer Metrics */}
            <div className="bg-white p-6 rounded-lg shadow-sm">
                <h3 className="text-lg font-semibold mb-4">Customer Metrics</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                        <p className="text-sm text-gray-500">
                            Customer Lifetime Value
                        </p>
                        <p className="text-2xl font-semibold">
                            ${(metrics.customerLifetimeValue / 100).toFixed(2)}
                        </p>
                    </div>
                    <div>
                        <p className="text-sm text-gray-500">Active Rate</p>
                        <p className="text-2xl font-semibold">
                            {(
                                (metrics.totalActiveSubscriptions /
                                    (metrics.totalActiveSubscriptions +
                                        metrics.totalCancelledSubscriptions)) *
                                100
                            ).toFixed(1)}
                            %
                        </p>
                    </div>
                    <div>
                        <p className="text-sm text-gray-500">
                            Avg. Subscription Duration
                        </p>
                        <p className="text-2xl font-semibold">
                            {(12 / (metrics.churnRate / 100)).toFixed(1)} months
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}

interface MetricCardProps {
    title: string;
    value: number;
    type: 'number' | 'currency' | 'percentage';
}

function MetricCard({ title, value, type }: MetricCardProps) {
    const formattedValue = React.useMemo(() => {
        switch (type) {
            case 'currency':
                return `$${value.toFixed(2)}`;
            case 'percentage':
                return `${value.toFixed(1)}%`;
            default:
                return value.toLocaleString();
        }
    }, [value, type]);

    return (
        <div className="bg-white p-6 rounded-lg shadow-sm">
            <p className="text-sm text-gray-500">{title}</p>
            <p className="text-2xl font-semibold">{formattedValue}</p>
        </div>
    );
}
