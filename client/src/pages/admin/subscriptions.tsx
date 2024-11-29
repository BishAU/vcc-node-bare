import React, { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/router';
import { SubscriptionAnalytics } from '../../components/admin/SubscriptionAnalytics';
import { PageHeader } from '../../components/common/PageHeader';

export default function AdminSubscriptions() {
    const { data: session, status } = useSession();
    const router = useRouter();
    const [stats, setStats] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (status === 'unauthenticated') {
            router.push('/auth/signin');
            return;
        }

        // Check if user is admin
        if (session?.user && !(session.user as any).isAdmin) {
            router.push('/');
            return;
        }
    }, [status, session, router]);

    useEffect(() => {
        if (session?.user && (session.user as any).isAdmin) {
            fetchStats();
        }
    }, [session]);

    const fetchStats = async () => {
        try {
            const response = await fetch('/api/admin/subscription-stats');
            if (!response.ok) {
                throw new Error('Failed to fetch subscription statistics');
            }
            const data = await response.json();
            setStats(data);
        } catch (error) {
            console.error('Error fetching stats:', error);
            setError('Failed to load subscription statistics');
        } finally {
            setLoading(false);
        }
    };

    if (status === 'loading' || loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="text-center">
                    <h1 className="text-2xl font-bold text-red-600 mb-4">Error</h1>
                    <p className="text-gray-600">{error}</p>
                </div>
            </div>
        );
    }

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <PageHeader
                title="Subscription Management"
                description="Monitor and analyze subscription performance"
                action={
                    <button
                        onClick={fetchStats}
                        className="ml-3 inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                    >
                        Refresh Data
                    </button>
                }
            />

            {stats && <SubscriptionAnalytics subscriptionStats={stats} />}

            <div className="mt-8">
                <h3 className="text-lg font-medium text-gray-900 mb-4">
                    Recent Activity
                </h3>
                {/* Add a table or list of recent subscription activities */}
            </div>
        </div>
    );
}
