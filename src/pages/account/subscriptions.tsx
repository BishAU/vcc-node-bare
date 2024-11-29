import React, { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/router';
import { useQuery } from '@tanstack/react-query';
import { SubscriptionCard } from '../../components/subscription/SubscriptionCard';
import { PageHeader } from '../../components/common/PageHeader';
import { ActivityFeed } from '../../components/subscription/ActivityFeed';

export default function Subscriptions() {
    const { data: session, status } = useSession();
    const router = useRouter();

    const { data: subscriptions, isLoading: loadingSubscriptions } = useQuery(
        ['subscriptions'],
        () =>
            fetch(`/api/subscriptions?customerId=${session?.user?.stripeCustomerId}`)
                .then((res) => res.json())
                .then((data) => data.data || []),
        {
            enabled: !!session?.user,
        }
    );

    const { data: activities, isLoading: loadingActivities } = useQuery(
        ['subscription-activities'],
        () =>
            fetch('/api/activity-log?type=subscription').then((res) =>
                res.json()
            ),
        {
            enabled: !!session?.user,
        }
    );

    useEffect(() => {
        if (status === 'unauthenticated') {
            router.push('/auth/signin');
        }
    }, [status, router]);

    const handleCancelSubscription = async (subscriptionId: string) => {
        try {
            const response = await fetch(`/api/subscriptions/${subscriptionId}`, {
                method: 'DELETE',
            });
            if (!response.ok) {
                throw new Error('Failed to cancel subscription');
            }
        } catch (error) {
            console.error('Error cancelling subscription:', error);
        }
    };

    const handleUpdateQuantity = async (
        subscriptionId: string,
        quantity: number
    ) => {
        try {
            const response = await fetch(`/api/subscriptions/${subscriptionId}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ quantity }),
            });
            if (!response.ok) {
                throw new Error('Failed to update subscription');
            }
        } catch (error) {
            console.error('Error updating subscription:', error);
        }
    };

    if (status === 'loading' || loadingSubscriptions || loadingActivities) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            </div>
        );
    }

    return (
        <div className="max-w-4xl mx-auto px-4 py-8">
            <PageHeader
                title="Subscriptions"
                description="Manage your subscriptions and view subscription history"
            />

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2">
                    <h2 className="text-xl font-semibold mb-4">
                        Active Subscriptions
                    </h2>
                    <div className="space-y-4">
                        {loadingSubscriptions ? (
                            <div className="animate-pulse space-y-4">
                                {[...Array(2)].map((_, i) => (
                                    <div
                                        key={i}
                                        className="bg-gray-100 h-40 rounded-lg"
                                    />
                                ))}
                            </div>
                        ) : subscriptions?.length > 0 ? (
                            subscriptions.map((subscription: any) => (
                                <SubscriptionCard
                                    key={subscription.id}
                                    subscription={subscription}
                                    onCancel={handleCancelSubscription}
                                    onUpdateQuantity={handleUpdateQuantity}
                                />
                            ))
                        ) : (
                            <div className="text-center py-8 text-gray-500">
                                No active subscriptions
                            </div>
                        )}
                    </div>
                </div>

                <div>
                    <h2 className="text-xl font-semibold mb-4">Recent Activity</h2>
                    <ActivityFeed
                        activities={activities?.activities || []}
                        isLoading={loadingActivities}
                    />
                </div>
            </div>
        </div>
    );
}
