import { TokenSet } from 'openid-client';
import { XeroClient } from 'xero-node';
import { User, Product, Order } from '../api/types';
import { getDb } from '../db';

export class XeroService {
  private static instance: XeroService;
  private xero: XeroClient;
  private tenantId: string;

  private constructor() {
    const clientId = import.meta.env.VITE_XERO_CLIENT_ID;
    const clientSecret = import.meta.env.VITE_XERO_CLIENT_SECRET;
    this.tenantId = import.meta.env.VITE_XERO_TENANT_ID;

    if (!clientId || !clientSecret || !this.tenantId) {
      throw new Error('Xero credentials not configured');
    }

    this.xero = new XeroClient({
      clientId,
      clientSecret,
      grantType: 'client_credentials',
    });
  }

  public static getInstance(): XeroService {
    if (!XeroService.instance) {
      XeroService.instance = new XeroService();
    }
    return XeroService.instance;
  }

  // Token Management
  private async refreshToken(): Promise<void> {
    try {
      const tokenSet = await this.xero.refreshToken();
      await this.xero.updateTenants();
      await this.saveTokenSet(tokenSet);
    } catch (error) {
      console.error('Error refreshing Xero token:', error);
      throw error;
    }
  }

  private async saveTokenSet(tokenSet: TokenSet): Promise<void> {
    // In a production environment, store these securely
    localStorage.setItem('xero_access_token', tokenSet.access_token!);
    localStorage.setItem('xero_refresh_token', tokenSet.refresh_token!);
    localStorage.setItem('xero_expires_at', tokenSet.expires_at!.toString());
  }

  private async loadTokenSet(): Promise<void> {
    const accessToken = localStorage.getItem('xero_access_token');
    const refreshToken = localStorage.getItem('xero_refresh_token');
    const expiresAt = localStorage.getItem('xero_expires_at');

    if (!accessToken || !refreshToken || !expiresAt) {
      throw new Error('No stored Xero tokens found');
    }

    await this.xero.setTokenSet({
      access_token: accessToken,
      refresh_token: refreshToken,
      expires_at: parseInt(expiresAt),
    });
  }

  // Contact Management
  async getOrCreateContact(user: User): Promise<string> {
    try {
      await this.loadTokenSet();

      // Search for existing contact
      const response = await this.xero.accountingApi.getContacts(this.tenantId, undefined, `EmailAddress=="${user.email}"`);
      
      if (response.body.contacts && response.body.contacts.length > 0) {
        return response.body.contacts[0].contactID!;
      }

      // Create new contact if not found
      const contact = await this.xero.accountingApi.createContacts(this.tenantId, {
        contacts: [{
          name: user.firstName && user.lastName ? `${user.firstName} ${user.lastName}` : user.email,
          firstName: user.firstName,
          lastName: user.lastName,
          emailAddress: user.email,
          contactStatus: 'ACTIVE',
        }],
      });

      return contact.body.contacts[0].contactID!;
    } catch (error) {
      console.error('Error in getOrCreateContact:', error);
      throw error;
    }
  }

  // Invoice Management
  async createInvoice(order: Order, user: User, product: Product): Promise<string> {
    try {
      await this.loadTokenSet();
      const contactId = await this.getOrCreateContact(user);

      const invoice = await this.xero.accountingApi.createInvoices(this.tenantId, {
        invoices: [{
          type: 'ACCREC',
          contact: {
            contactID: contactId,
          },
          lineItems: [{
            description: product.name,
            quantity: 1.0,
            unitAmount: product.priceInCents / 100,
            accountCode: product.glCode,
            taxType: 'OUTPUT2', // 20% VAT
          }],
          date: new Date().toISOString().split('T')[0],
          dueDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
          reference: order.stripePaymentIntentId,
          status: 'AUTHORISED',
        }],
      });

      return invoice.body.invoices[0].invoiceID!;
    } catch (error) {
      console.error('Error creating Xero invoice:', error);
      throw error;
    }
  }

  // Payment Recording
  async recordPayment(invoiceId: string, amount: number): Promise<void> {
    try {
      await this.loadTokenSet();

      await this.xero.accountingApi.createPayments(this.tenantId, {
        payments: [{
          invoice: {
            invoiceID: invoiceId,
          },
          account: {
            code: '090', // Bank account code
          },
          amount: amount / 100,
          date: new Date().toISOString().split('T')[0],
          reference: 'Stripe Payment',
        }],
      });
    } catch (error) {
      console.error('Error recording payment in Xero:', error);
      throw error;
    }
  }

  // Subscription Invoice Management
  async createSubscriptionInvoice(subscription: any, user: User, product: Product): Promise<string> {
    try {
      await this.loadTokenSet();
      const contactId = await this.getOrCreateContact(user);

      const invoice = await this.xero.accountingApi.createInvoices(this.tenantId, {
        invoices: [{
          type: 'ACCREC',
          contact: {
            contactID: contactId,
          },
          lineItems: [{
            description: `${product.name} - ${product.interval}ly Subscription`,
            quantity: 1.0,
            unitAmount: product.priceInCents / 100,
            accountCode: product.glCode,
            taxType: 'OUTPUT2', // 20% VAT
          }],
          date: new Date().toISOString().split('T')[0],
          dueDate: new Date(subscription.current_period_end * 1000).toISOString().split('T')[0],
          reference: subscription.id,
          status: 'AUTHORISED',
        }],
      });

      return invoice.body.invoices[0].invoiceID!;
    } catch (error) {
      console.error('Error creating subscription invoice in Xero:', error);
      throw error;
    }
  }

  // Utility Methods
  async getInvoiceStatus(invoiceId: string): Promise<string> {
    try {
      await this.loadTokenSet();

      const response = await this.xero.accountingApi.getInvoice(this.tenantId, invoiceId);
      return response.body.invoices[0].status!;
    } catch (error) {
      console.error('Error getting invoice status:', error);
      throw error;
    }
  }
}
