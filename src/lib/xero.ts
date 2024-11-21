import { XeroClient } from 'xero-node';
import { Order } from '../types/product';

// Initialize Xero client
if (!process.env.XERO_CLIENT_ID || !process.env.XERO_CLIENT_SECRET || !process.env.XERO_TENANT_ID) {
    throw new Error('Missing required Xero environment variables');
}

export const xeroClient = new XeroClient({
    clientId: process.env.XERO_CLIENT_ID,
    clientSecret: process.env.XERO_CLIENT_SECRET,
    grantType: 'client_credentials'
});

// Set tenant ID for all requests
xeroClient.setTenantId(process.env.XERO_TENANT_ID);

export const createXeroInvoice = async (order: Order) => {
    try {
        const response = await fetch('/api/xero/create-invoice', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(order),
        });

        if (!response.ok) {
            throw new Error('Failed to create Xero invoice');
        }

        const data = await response.json();
        return data.invoiceId;
    } catch (error) {
        console.error('Error creating Xero invoice:', error);
        throw error;
    }
};

export const syncXeroPayment = async (orderId: string, paymentData: any) => {
    try {
        const response = await fetch('/api/xero/sync-payment', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                orderId,
                paymentData,
            }),
        });

        if (!response.ok) {
            throw new Error('Failed to sync payment with Xero');
        }

        return await response.json();
    } catch (error) {
        console.error('Error syncing payment with Xero:', error);
        throw error;
    }
};

export const getXeroInvoiceStatus = async (invoiceId: string) => {
    try {
        const response = await fetch(`/api/xero/invoice-status/${invoiceId}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
        });

        if (!response.ok) {
            throw new Error('Failed to get Xero invoice status');
        }

        return await response.json();
    } catch (error) {
        console.error('Error getting Xero invoice status:', error);
        throw error;
    }
};
