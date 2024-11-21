export interface Product {
    id: string;
    name: string;
    description: string;
    price: number;
    currency: string;
    stripePriceId: string;
    stripeProductId: string;
    category: 'subscription' | 'service' | 'report';
    features: string[];
    active: boolean;
    metadata: {
        xeroItemCode?: string;
        taxRate?: number;
        recurringBilling?: {
            interval: 'month' | 'year';
            intervalCount: number;
        };
    };
}

export interface CartItem {
    productId: string;
    quantity: number;
    price: number;
    metadata?: Record<string, any>;
}

export interface Order {
    id: string;
    userId: string;
    items: CartItem[];
    status: 'pending' | 'paid' | 'failed' | 'refunded';
    total: number;
    currency: string;
    stripePaymentIntentId?: string;
    xeroInvoiceId?: string;
    createdAt: string;
    updatedAt: string;
    metadata?: {
        customerEmail?: string;
        billingAddress?: {
            line1: string;
            line2?: string;
            city: string;
            state: string;
            postalCode: string;
            country: string;
        };
    };
}
