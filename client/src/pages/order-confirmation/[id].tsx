import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import { Order } from '../../types/product';

const OrderConfirmation: React.FC = () => {
    const router = useRouter();
    const { id } = router.query;
    const [order, setOrder] = useState<Order | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (!id) return;

        const fetchOrder = async () => {
            try {
                const response = await fetch(`/api/orders/${id}`);
                if (!response.ok) {
                    throw new Error('Failed to fetch order');
                }
                const data = await response.json();
                setOrder(data);
            } catch (error) {
                console.error('Error fetching order:', error);
                setError('Failed to load order details');
            } finally {
                setLoading(false);
            }
        };

        fetchOrder();
    }, [id]);

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            </div>
        );
    }

    if (error || !order) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="text-center">
                    <h1 className="text-2xl font-bold text-red-600 mb-4">Error</h1>
                    <p className="text-gray-600 mb-4">{error || 'Order not found'}</p>
                    <Link href="/">
                        <a className="text-blue-600 hover:text-blue-800">Return to Home</a>
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 py-12">
            <div className="max-w-3xl mx-auto px-4">
                <div className="text-center mb-8">
                    <div className="mb-4">
                        <svg
                            className="h-16 w-16 text-green-500 mx-auto"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                            />
                        </svg>
                    </div>
                    <h1 className="text-3xl font-bold text-gray-900">
                        Order Confirmed!
                    </h1>
                    <p className="text-gray-600 mt-2">
                        Thank you for your order. We've sent a confirmation email to{' '}
                        {order.metadata?.billingDetails?.email}.
                    </p>
                </div>

                <div className="bg-white shadow rounded-lg overflow-hidden">
                    <div className="px-6 py-4 border-b">
                        <h2 className="text-lg font-semibold">Order Details</h2>
                        <p className="text-sm text-gray-600">
                            Order ID: {order.id}
                        </p>
                    </div>

                    <div className="px-6 py-4">
                        <h3 className="font-medium mb-4">Items</h3>
                        <ul className="space-y-4">
                            {order.items.map((item) => (
                                <li
                                    key={item.productId}
                                    className="flex justify-between"
                                >
                                    <div>
                                        <p className="font-medium">
                                            {item.metadata?.name}
                                        </p>
                                        <p className="text-sm text-gray-600">
                                            Quantity: {item.quantity}
                                        </p>
                                    </div>
                                    <div className="text-right">
                                        <p className="font-medium">
                                            ${(item.price * item.quantity).toFixed(2)}
                                        </p>
                                        {item.metadata?.recurringBilling && (
                                            <p className="text-sm text-gray-600">
                                                per {item.metadata.recurringBilling.interval}
                                            </p>
                                        )}
                                    </div>
                                </li>
                            ))}
                        </ul>

                        <div className="mt-6 pt-6 border-t">
                            <div className="flex justify-between items-center font-semibold">
                                <span>Total</span>
                                <span>${order.total.toFixed(2)}</span>
                            </div>
                        </div>
                    </div>

                    <div className="px-6 py-4 bg-gray-50">
                        <h3 className="font-medium mb-4">Billing Details</h3>
                        <div className="text-sm text-gray-600">
                            <p>{order.metadata?.billingDetails?.name}</p>
                            <p>{order.metadata?.billingDetails?.email}</p>
                            <p>{order.metadata?.billingDetails?.address?.line1}</p>
                            {order.metadata?.billingDetails?.address?.line2 && (
                                <p>{order.metadata?.billingDetails?.address?.line2}</p>
                            )}
                            <p>
                                {order.metadata?.billingDetails?.address?.city},{' '}
                                {order.metadata?.billingDetails?.address?.state}{' '}
                                {order.metadata?.billingDetails?.address?.postal_code}
                            </p>
                            <p>{order.metadata?.billingDetails?.address?.country}</p>
                        </div>
                    </div>
                </div>

                <div className="mt-8 text-center">
                    <Link href="/">
                        <a className="text-blue-600 hover:text-blue-800">
                            Continue Shopping
                        </a>
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default OrderConfirmation;
