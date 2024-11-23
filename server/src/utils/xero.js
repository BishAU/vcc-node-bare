import { XeroClient } from 'xero-node';
import logger from './logger.js';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

class XeroService {
  constructor(config = {}) {
    const clientId = config.clientId || process.env.XERO_CLIENT_ID;
    const clientSecret = config.clientSecret || process.env.XERO_CLIENT_SECRET;
    const tenantId = config.tenantId || process.env.XERO_TENANT_ID;

    logger.debug('Initializing Xero service with:', {
      clientId,
      hasSecret: !!clientSecret,
      tenantId
    });

    if (!clientId || !clientSecret) {
      const missing = [];
      if (!clientId) missing.push('XERO_CLIENT_ID');
      if (!clientSecret) missing.push('XERO_CLIENT_SECRET');
      throw new Error(`Xero credentials missing: ${missing.join(', ')}. Please check your .env file.`);
    }

    const xeroConfig = {
      clientId,
      clientSecret,
      grantType: 'client_credentials',
      scopes: 'accounting.transactions accounting.contacts.read accounting.contacts.create offline_access'
    };

    try {
      this.client = new XeroClient(xeroConfig);
      this.tenantId = tenantId;
      logger.info('Successfully created Xero client');
    } catch (error) {
      logger.error('Failed to create Xero client:', {
        error: error.message,
        stack: error.stack,
        config: { ...xeroConfig, clientSecret: '***' }
      });
      throw error;
    }
  }

  async initialize() {
    if (!this.client) {
      throw new Error('Xero client not initialized');
    }

    try {
      await this.client.initialize();
      await this.client.getClientCredentialsToken();
      
      // If tenant ID is not in env, try to get it from Xero
      if (!this.tenantId) {
        const tenants = await this.client.updateTenants();
        if (!tenants || tenants.length === 0) {
          throw new Error('No Xero tenants found');
        }
        this.tenantId = tenants[0].tenantId;
        logger.info('Retrieved tenant ID from Xero:', {
          tenantId: this.tenantId,
          tenantName: tenants[0].tenantName
        });
      }
      
      logger.info('Initialized Xero client:', {
        tenantId: this.tenantId
      });
    } catch (error) {
      logger.error('Failed to initialize Xero client:', {
        error: error.message,
        stack: error.stack
      });
      throw error;
    }
  }

  async findOrCreateContact(customerData) {
    await this.initialize();

    try {
      // First try to find existing contact
      const where = `EmailAddress="${customerData.email}" AND ContactStatus=="ACTIVE"`;
      const existingContacts = await this.client.accountingApi.getContacts(
        this.tenantId,
        null,
        where,
        'Name ASC',
        null,
        'email,addresses,phones'
      );

      if (existingContacts.body.contacts && existingContacts.body.contacts.length > 0) {
        const contact = existingContacts.body.contacts[0];
        logger.info('Found existing Xero contact:', {
          contactId: contact.contactID,
          email: contact.emailAddress
        });
        return contact;
      }

      // Create new contact if not found
      const contact = {
        name: customerData.name,
        emailAddress: customerData.email,
        firstName: customerData.name.split(' ')[0],
        lastName: customerData.name.split(' ')[1] || '',
        addresses: [{
          addressType: 'STREET',
          addressLine1: customerData.address.line1,
          city: customerData.address.city,
          region: customerData.address.state,
          postalCode: customerData.address.postal_code,
          country: customerData.address.country
        }],
        phones: [{
          phoneType: 'DEFAULT',
          phoneNumber: customerData.phone || ''
        }],
        isCustomer: true,
        taxNumber: customerData.abn || '', // ABN if available
        contactStatus: 'ACTIVE'
      };

      const response = await this.client.accountingApi.createContact(
        this.tenantId,
        { contacts: [contact] }
      );

      const newContact = response.body.contacts[0];
      logger.info('Created new Xero contact:', {
        contactId: newContact.contactID,
        email: newContact.emailAddress
      });

      return newContact;
    } catch (error) {
      logger.error('Error managing Xero contact:', {
        error: error.message,
        stack: error.stack,
        customerEmail: customerData.email
      });
      throw error;
    }
  }

  async createInvoice(contactId, paymentIntent, productDetails) {
    await this.initialize();

    try {
      // Get default branding theme
      const brandingTheme = await this.getDefaultBrandingTheme();

      const lineItem = {
        description: productDetails.description,
        quantity: 1.0,
        unitAmount: productDetails.amount / 100, // Convert cents to dollars
        accountCode: '200', // Sales account code
        taxType: 'OUTPUT2', // GST on Income
        taxAmount: (productDetails.amount / 100) * 0.1, // 10% GST
        lineAmount: (productDetails.amount / 100) * 1.1 // Amount including GST
      };

      const invoice = {
        type: 'ACCREC',
        contact: { contactID: contactId },
        lineItems: [lineItem],
        date: new Date().toISOString().split('T')[0],
        dueDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        reference: paymentIntent.id,
        status: 'AUTHORISED',
        lineAmountTypes: 'Inclusive', // Amount includes tax
        currencyCode: 'AUD',
        brandingThemeID: brandingTheme ? brandingTheme.brandingThemeID : null
      };

      const response = await this.client.accountingApi.createInvoices(
        this.tenantId,
        { invoices: [invoice] }
      );

      const newInvoice = response.body.invoices[0];
      logger.info('Created Xero invoice:', {
        invoiceId: newInvoice.invoiceID,
        contactId: contactId,
        amount: productDetails.amount,
        reference: paymentIntent.id
      });

      return newInvoice;
    } catch (error) {
      logger.error('Error creating Xero invoice:', {
        error: error.message,
        stack: error.stack,
        contactId: contactId,
        paymentIntentId: paymentIntent.id
      });
      throw error;
    }
  }

  async getDefaultBrandingTheme() {
    try {
      const response = await this.client.accountingApi.getBrandingThemes(this.tenantId);
      const defaultTheme = response.body.brandingThemes.find(theme => theme.sortOrder === 1);
      
      if (defaultTheme) {
        logger.debug('Found default branding theme:', {
          themeId: defaultTheme.brandingThemeID
        });
      } else {
        logger.warn('No default branding theme found');
      }
      
      return defaultTheme;
    } catch (error) {
      logger.error('Error getting branding theme:', {
        error: error.message,
        stack: error.stack
      });
      throw error;
    }
  }

  async handleStripePayment(stripeEvent) {
    const paymentIntent = stripeEvent.data.object;
    
    try {
      logger.info('Processing Stripe payment for Xero invoice:', {
        paymentIntentId: paymentIntent.id,
        amount: paymentIntent.amount,
        customerName: paymentIntent.metadata.customer_name
      });

      // Find or create contact
      const contact = await this.findOrCreateContact({
        name: paymentIntent.metadata.customer_name,
        email: paymentIntent.receipt_email,
        address: paymentIntent.shipping || {},
        phone: paymentIntent.metadata.phone,
        abn: paymentIntent.metadata.abn
      });

      // Create invoice
      const invoice = await this.createInvoice(
        contact.contactID,
        paymentIntent,
        {
          description: paymentIntent.description,
          amount: paymentIntent.amount
        }
      );

      return invoice;
    } catch (error) {
      logger.error('Error handling Stripe payment:', {
        error: error.message,
        stack: error.stack,
        paymentIntentId: paymentIntent.id
      });
      throw error;
    }
  }
}

export default new XeroService();
