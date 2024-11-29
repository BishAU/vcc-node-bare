import React from 'react';
import { useCartStore } from '../../store/cartStore';
import { useRouter } from 'next/router';

export const CartSidebar: React.FC<{ isOpen: boolean; onClose: () => void }> = ({
    isOpen,
    onClose,
}) => {
    const router = useRouter();
    const { items, removeItem, updateQuantity, getTotal, getItemCount } = useCartStore();

    const handleCheckout = () => {
        router.push('/checkout');
        onClose();
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 overflow-hidden">
            <div className="absolute inset-0 bg-black bg-opacity-50" onClick={onClose} />
            
            <div className="absolute right-0 top-0 bottom-0 w-96 bg-white shadow-xl">
                <div className="flex flex-col h-full">
                    {/* Header */}
                    <div className="p-4 border-b">
                        <div className="flex justify-between items-center">
                            <h2 className="text-lg font-semibold">Shopping Cart</h2>
                            <button
                                onClick={onClose}
                                className="text-gray-500 hover:text-gray-700"
                            >
                                <span className="sr-only">Close</span>
                                <svg
                                    className="h-6 w-6"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    stroke="currentColor"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M6 18L18 6M6 6l12 12"
                                    />
                                </svg>
                            </button>
                        </div>
                    </div>

                    {/* Cart Items */}
                    <div className="flex-1 overflow-y-auto p-4">
                        {items.length === 0 ? (
                            <p className="text-center text-gray-500">Your cart is empty</p>
                        ) : (
                            <ul className="space-y-4">
                                {items.map((item) => (
                                    <li
                                        key={item.productId}
                                        className="flex items-center space-x-4"
                                    >
                                        <div className="flex-1">
                                            <h3 className="font-medium">
                                                {item.metadata?.name}
                                            </h3>
                                            <p className="text-sm text-gray-500">
                                                ${item.price.toFixed(2)}
                                                {item.metadata?.recurringBilling &&
                                                    ` / ${item.metadata.recurringBilling.interval}`}
                                            </p>
                                        </div>

                                        <div className="flex items-center space-x-2">
                                            <button
                                                onClick={() =>
                                                    updateQuantity(
                                                        item.productId,
                                                        item.quantity - 1
                                                    )
                                                }
                                                className="p-1 text-gray-500 hover:text-gray-700"
                                            >
                                                -
                                            </button>
                                            <span className="w-8 text-center">
                                                {item.quantity}
                                            </span>
                                            <button
                                                onClick={() =>
                                                    updateQuantity(
                                                        item.productId,
                                                        item.quantity + 1
                                                    )
                                                }
                                                className="p-1 text-gray-500 hover:text-gray-700"
                                            >
                                                +
                                            </button>
                                        </div>

                                        <button
                                            onClick={() => removeItem(item.productId)}
                                            className="text-red-500 hover:text-red-700"
                                        >
                                            <span className="sr-only">Remove</span>
                                            <svg
                                                className="h-5 w-5"
                                                fill="none"
                                                viewBox="0 0 24 24"
                                                stroke="currentColor"
                                            >
                                                <path
                                                    strokeLinecap="round"
                                                    strokeLinejoin="round"
                                                    strokeWidth={2}
                                                    d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                                                />
                                            </svg>
                                        </button>
                                    </li>
                                ))}
                            </ul>
                        )}
                    </div>

                    {/* Footer */}
                    {items.length > 0 && (
                        <div className="p-4 border-t">
                            <div className="mb-4">
                                <div className="flex justify-between mb-2">
                                    <span>Subtotal</span>
                                    <span>${getTotal().toFixed(2)}</span>
                                </div>
                                <div className="text-sm text-gray-500">
                                    {getItemCount()} item{getItemCount() !== 1 && 's'}
                                </div>
                            </div>

                            <button
                                onClick={handleCheckout}
                                className="w-full py-2 px-4 bg-blue-600 text-white rounded hover:bg-blue-700"
                            >
                                Proceed to Checkout
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};
