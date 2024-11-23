import React from 'react';
import { formatDate } from '../../lib/utils';

interface SubscriptionCardProps {
    subscription: {
        id: string;
        status: string;
        currentPeriodEnd: string;
        cancelAtPeriodEnd: boolean;
        items: {
            data: Array<{
                price: {
                    unit_amount: number;
                    currency: string;
                    recurring: {
                        interval: string;
                    };
                    product: {
                        name: string;
                        description?: string;
                    };
                };
                quantity: number;
            }>;
        };
    };
    onCancel: (id: string) => Promise<void>;
    onUpdateQuantity: (id: string, quantity: number) => Promise<void>;
}

export const SubscriptionCard: React.FC<SubscriptionCardProps> = ({
    subscription,
    onCancel,
    onUpdateQuantity,
}) => {
    const item = subscription.items.data[0];
    const { price } = item;
    const amount = (price.unit_amount / 100).toFixed(2);
    const currency = price.currency.toUpperCase();
    const interval = price.recurring.interval;

    const handleQuantityChange = async (e: React.ChangeEvent<HTMLSelectElement>) => {
        const newQuantity = parseInt(e.target.value);
        await onUpdateQuantity(subscription.id, newQuantity);
    };

    return (
        <div className="bg-white rounded-lg shadow-md p-6 mb-4">
            <div className="flex justify-between items-start mb-4">
                <div>
                    <h3 className="text-xl font-semibold text-gray-900">
                        {price.product.name}
                    </h3>
                    {price.product.description && (
                        <p className="text-gray-600 mt-1">
                            {price.product.description}
                        </p>
                    )}
                </div>
                <span
                    className={`px-3 py-1 rounded-full text-sm font-medium ${
                        subscription.status === 'active'
                            ? 'bg-green-100 text-green-800'
                            : subscription.status === 'past_due'
                            ? 'bg-yellow-100 text-yellow-800'
                            : 'bg-gray-100 text-gray-800'
                    }`}
                >
                    {subscription.status.replace('_', ' ')}
                </span>
            </div>

            <div className="grid grid-cols-2 gap-4 mb-4">
                <div>
                    <p className="text-sm text-gray-600">Amount</p>
                    <p className="text-lg font-medium">
                        {currency} {amount} / {interval}
                    </p>
                </div>
                <div>
                    <p className="text-sm text-gray-600">Next Payment</p>
                    <p className="text-lg font-medium">
                        {formatDate(subscription.currentPeriodEnd)}
                    </p>
                </div>
            </div>

            <div className="flex items-center justify-between mt-6">
                <div className="flex items-center space-x-2">
                    <label htmlFor="quantity" className="text-sm text-gray-600">
                        Quantity:
                    </label>
                    <select
                        id="quantity"
                        value={item.quantity}
                        onChange={handleQuantityChange}
                        className="border rounded px-2 py-1 text-sm"
                        disabled={subscription.status !== 'active'}
                    >
                        {[1, 2, 3, 4, 5].map((num) => (
                            <option key={num} value={num}>
                                {num}
                            </option>
                        ))}
                    </select>
                </div>

                {subscription.status === 'active' && !subscription.cancelAtPeriodEnd && (
                    <button
                        onClick={() => onCancel(subscription.id)}
                        className="px-4 py-2 text-sm font-medium text-red-600 hover:text-red-700 focus:outline-none"
                    >
                        Cancel at Period End
                    </button>
                )}
                {subscription.cancelAtPeriodEnd && (
                    <p className="text-sm text-gray-600">
                        Cancels on {formatDate(subscription.currentPeriodEnd)}
                    </p>
                )}
            </div>
        </div>
    );
};
