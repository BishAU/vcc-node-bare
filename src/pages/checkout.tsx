import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { loadStripe } from '@stripe/stripe-js';
import {
    Elements,
    PaymentElement,
    useStripe,
    useElements,
} from '@stripe/react-stripe-js';
import { useCartStore } from '../store/cartStore';

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!);

const CheckoutForm: React.FC<{ clientSecret: string }> = ({ clientSecret }) => {
    const stripe = useStripe();
    const elements = useElements();
    const router = useRouter();
    const [error, setError] = useState<string | null>(null);
    const [processing, setProcessing] = useState(false);
    const { items, clearCart, getTotal } = useCartStore();
    const [billingDetails, setBillingDetails] = useState({
        email: '',
        name: '',
        address: {
            line1: '',
            line2: '',
            city: '',
            state: '',
            postal_code: '',
            country: 'AU',
        },
    });

    const handleSubmit = async (event: React.FormEvent) => {
        event.preventDefault();

        if (!stripe || !elements) {
            return;
        }

        setProcessing(true);

        try {
            // Create order in our database
            const orderResponse = await fetch('/api/orders', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    items,
                    billingDetails,
                    amount: getTotal(),
                }),
            });

            if (!orderResponse.ok) {
                throw new Error('Failed to create order');
            }

            const { orderId } = await orderResponse.json();

            // Confirm payment with Stripe
            const { error: stripeError, paymentIntent } = await stripe.confirmPayment({
                elements,
                confirmParams: {
                    return_url: `${window.location.origin}/order-confirmation/${orderId}`,
                    payment_method_data: {
                        billing_details: {
                            name: billingDetails.name,
                            email: billingDetails.email,
                            address: billingDetails.address,
                        },
                    },
                },
            });

            if (stripeError) {
                setError(stripeError.message ?? 'An error occurred');
            } else {
                clearCart();
                router.push(`/order-confirmation/${orderId}`);
            }
        } catch (error) {
            setError('An error occurred during checkout');
            console.error('Checkout error:', error);
        } finally {
            setProcessing(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-4">
                <div>
                    <label className="block text-sm font-medium text-gray-700">
                        Email
                    </label>
                    <input
                        type="email"
                        required
                        value={billingDetails.email}
                        onChange={(e) =>
                            setBillingDetails((prev) => ({
                                ...prev,
                                email: e.target.value,
                            }))
                        }
                        className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700">
                        Full Name
                    </label>
                    <input
                        type="text"
                        required
                        value={billingDetails.name}
                        onChange={(e) =>
                            setBillingDetails((prev) => ({
                                ...prev,
                                name: e.target.value,
                            }))
                        }
                        className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700">
                        Address Line 1
                    </label>
                    <input
                        type="text"
                        required
                        value={billingDetails.address.line1}
                        onChange={(e) =>
                            setBillingDetails((prev) => ({
                                ...prev,
                                address: {
                                    ...prev.address,
                                    line1: e.target.value,
                                },
                            }))
                        }
                        className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700">
                        Address Line 2
                    </label>
                    <input
                        type="text"
                        value={billingDetails.address.line2}
                        onChange={(e) =>
                            setBillingDetails((prev) => ({
                                ...prev,
                                address: {
                                    ...prev.address,
                                    line2: e.target.value,
                                },
                            }))
                        }
                        className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                    />
                </div>

                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700">
                            City
                        </label>
                        <input
                            type="text"
                            required
                            value={billingDetails.address.city}
                            onChange={(e) =>
                                setBillingDetails((prev) => ({
                                    ...prev,
                                    address: {
                                        ...prev.address,
                                        city: e.target.value,
                                    },
                                }))
                            }
                            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700">
                            State
                        </label>
                        <input
                            type="text"
                            required
                            value={billingDetails.address.state}
                            onChange={(e) =>
                                setBillingDetails((prev) => ({
                                    ...prev,
                                    address: {
                                        ...prev.address,
                                        state: e.target.value,
                                    },
                                }))
                            }
                            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                        />
                    </div>
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700">
                        Postal Code
                    </label>
                    <input
                        type="text"
                        required
                        value={billingDetails.address.postal_code}
                        onChange={(e) =>
                            setBillingDetails((prev) => ({
                                ...prev,
                                address: {
                                    ...prev.address,
                                    postal_code: e.target.value,
                                },
                            }))
                        }
                        className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                    />
                </div>
            </div>

            <div className="border-t border-b py-4">
                <PaymentElement />
            </div>

            {error && (
                <div className="text-red-600 text-sm">{error}</div>
            )}

            <button
                type="submit"
                disabled={!stripe || processing}
                className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 disabled:opacity-50"
            >
                {processing ? 'Processing...' : `Pay $${getTotal().toFixed(2)}`}
            </button>
        </form>
    );
};

const CheckoutPage: React.FC = () => {
    const [clientSecret, setClientSecret] = useState<string | null>(null);
    const { items, getTotal } = useCartStore();
    const router = useRouter();

    useEffect(() => {
        if (items.length === 0) {
            router.push('/');
            return;
        }

        const createPaymentIntent = async () => {
            try {
                const response = await fetch('/api/create-payment-intent', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        items,
                        amount: getTotal(),
                    }),
                });

                if (!response.ok) {
                    throw new Error('Failed to create payment intent');
                }

                const data = await response.json();
                setClientSecret(data.clientSecret);
            } catch (error) {
                console.error('Error creating payment intent:', error);
            }
        };

        createPaymentIntent();
    }, [items, getTotal, router]);

    if (!clientSecret) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 py-12">
            <div className="max-w-3xl mx-auto px-4">
                <h1 className="text-2xl font-bold mb-8">Checkout</h1>

                <div className="bg-white shadow rounded-lg p-6">
                    <Elements
                        stripe={stripePromise}
                        options={{
                            clientSecret,
                            appearance: {
                                theme: 'stripe',
                            },
                        }}
                    >
                        <CheckoutForm clientSecret={clientSecret} />
                    </Elements>
                </div>

                <div className="mt-8 bg-white shadow rounded-lg p-6">
                    <h2 className="text-lg font-semibold mb-4">Order Summary</h2>
                    <ul className="space-y-4">
                        {items.map((item) => (
                            <li
                                key={item.productId}
                                className="flex justify-between items-center"
                            >
                                <div>
                                    <h3 className="font-medium">
                                        {item.metadata?.name}
                                    </h3>
                                    <p className="text-sm text-gray-500">
                                        Quantity: {item.quantity}
                                    </p>
                                </div>
                                <div className="text-right">
                                    <p className="font-medium">
                                        ${(item.price * item.quantity).toFixed(2)}
                                    </p>
                                    {item.metadata?.recurringBilling && (
                                        <p className="text-sm text-gray-500">
                                            per {item.metadata.recurringBilling.interval}
                                        </p>
                                    )}
                                </div>
                            </li>
                        ))}
                    </ul>
                    <div className="mt-4 pt-4 border-t">
                        <div className="flex justify-between items-center font-semibold">
                            <span>Total</span>
                            <span>${getTotal().toFixed(2)}</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CheckoutPage;
