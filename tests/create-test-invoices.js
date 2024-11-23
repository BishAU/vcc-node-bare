import { fileURLToPath } from 'url';
import path from 'path';
import { XeroClient } from 'xero-node';
import logger from '../src/utils/logger.js';
import { xeroConfig } from './config.js';

// Get the directory path
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Create a new instance of XeroService with our test config
const xeroService = new XeroClient({
  clientId: xeroConfig.clientId,
  clientSecret: xeroConfig.clientSecret,
  redirectUris: ['http://localhost:8080/callback'],
  scopes: ['openid', 'profile', 'email', 'accounting.transactions', 'accounting.contacts', 'accounting.settings']
});

// Verify configuration
logger.debug('Xero configuration:', {
  clientId: xeroConfig.clientId,
  hasSecret: !!xeroConfig.clientSecret,
  tenantId: xeroConfig.tenantId
});

async function createTestInvoices() {
  try {
    // Initialize Xero client
    await xeroService.initialize();

    // Check if we have a valid token set
    const tokenSet = await xeroService.readTokenSet();
    
    if (!tokenSet || !tokenSet.access_token) {
      logger.info('No valid token found. Please authenticate with Xero first by running the auth server.');
      return;
    }

    // Set the access token
    xeroService.setTokenSet(tokenSet);

    logger.debug('Got access token:', {
      accessToken: tokenSet.access_token ? 'present' : 'missing',
      expiresIn: tokenSet.expires_in
    });

    // Set up tenant ID
    const tenantId = xeroConfig.tenantId;
    if (!tenantId) {
      throw new Error('Tenant ID is required');
    }

    // Test customer data
    const testCustomers = [
      {
        name: 'Test Customer 1',
        email: 'test1@example.com',
        address: {
          line1: '123 Test Street',
          city: 'Sydney',
          state: 'NSW',
          postal_code: '2000',
          country: 'Australia'
        },
        phone: '0400000001',
        abn: '12345678901'
      },
      {
        name: 'Test Customer 2',
        email: 'test2@example.com',
        address: {
          line1: '456 Test Avenue',
          city: 'Melbourne',
          state: 'VIC',
          postal_code: '3000',
          country: 'Australia'
        },
        phone: '0400000002',
        abn: '98765432109'
      }
    ];

    // Test payment intents
    const testPaymentIntents = [
      {
        id: 'test_pi_1',
        amount: 15000, // $150.00
        description: 'Test Service Package - Basic',
        metadata: {
          customer_name: 'Test Customer 1'
        },
        receipt_email: 'test1@example.com'
      },
      {
        id: 'test_pi_2',
        amount: 25000, // $250.00
        description: 'Test Service Package - Premium',
        metadata: {
          customer_name: 'Test Customer 2'
        },
        receipt_email: 'test2@example.com'
      }
    ];

    // Create test invoices
    for (let i = 0; i < testCustomers.length; i++) {
      const customer = testCustomers[i];
      const paymentIntent = testPaymentIntents[i];

      logger.info('Creating test invoice for customer:', {
        customerName: customer.name,
        amount: paymentIntent.amount
      });

      // Create or find contact
      const where = `EmailAddress="${customer.email}" AND ContactStatus=="ACTIVE"`;
      const existingContacts = await xeroService.accountingApi.getContacts(
        tenantId,
        null,
        where,
        'Name ASC',
        null,
        'email,addresses,phones'
      );

      let contact;
      if (existingContacts.body.contacts && existingContacts.body.contacts.length > 0) {
        contact = existingContacts.body.contacts[0];
        logger.info('Found existing contact:', {
          contactId: contact.contactID,
          email: contact.emailAddress
        });
      } else {
        // Create new contact
        const newContact = {
          name: customer.name,
          emailAddress: customer.email,
          firstName: customer.name.split(' ')[0],
          lastName: customer.name.split(' ')[1] || '',
          addresses: [{
            addressType: 'STREET',
            addressLine1: customer.address.line1,
            city: customer.address.city,
            region: customer.address.state,
            postalCode: customer.address.postal_code,
            country: customer.address.country
          }],
          phones: [{
            phoneType: 'DEFAULT',
            phoneNumber: customer.phone || ''
          }],
          isCustomer: true,
          taxNumber: customer.abn || '',
          contactStatus: 'ACTIVE'
        };

        const response = await xeroService.accountingApi.createContact(
          tenantId,
          { contacts: [newContact] }
        );

        contact = response.body.contacts[0];
        logger.info('Created new contact:', {
          contactId: contact.contactID,
          email: contact.emailAddress
        });
      }

      // Create invoice
      const lineItem = {
        description: paymentIntent.description,
        quantity: 1.0,
        unitAmount: paymentIntent.amount / 100, // Convert cents to dollars
        accountCode: '200', // Sales account code
        taxType: 'OUTPUT2', // GST on Income
        taxAmount: (paymentIntent.amount / 100) * 0.1, // 10% GST
        lineAmount: (paymentIntent.amount / 100) * 1.1 // Amount including GST
      };

      const invoice = {
        type: 'ACCREC',
        contact: { contactID: contact.contactID },
        lineItems: [lineItem],
        date: new Date().toISOString().split('T')[0],
        dueDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        reference: paymentIntent.id,
        status: 'AUTHORISED',
        lineAmountTypes: 'Inclusive', // Amount includes tax
        currencyCode: 'AUD'
      };

      const response = await xeroService.accountingApi.createInvoices(
        tenantId,
        { invoices: [invoice] }
      );

      const newInvoice = response.body.invoices[0];
      logger.info('Created invoice:', {
        invoiceId: newInvoice.invoiceID,
        contactId: contact.contactID,
        amount: paymentIntent.amount,
        reference: paymentIntent.id
      });
    }

    logger.info('All test invoices created successfully');
  } catch (error) {
    logger.error('Error creating test invoices:', {
      error: error.message,
      stack: error.stack
    });
    throw error;
  }
}

// Run the test
createTestInvoices()
  .then(() => {
    logger.info('Test completed successfully');
    process.exit(0);
  })
  .catch((error) => {
    logger.error('Test failed:', error);
    process.exit(1);
  });
