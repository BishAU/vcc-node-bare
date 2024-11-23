const { XeroClient } = require('xero-node');
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
require('dotenv').config();

// Initialize Xero client
const xeroClient = new XeroClient({
  clientId: process.env.XERO_CLIENT_ID,
  clientSecret: process.env.XERO_CLIENT_SECRET,
  grantType: 'client_credentials',
  scopes: 'accounting.transactions accounting.contacts.read accounting.contacts.create offline_access'
});

// Test data
const testCustomer = {
  name: 'Test Customer',
  email: 'test@vccaustralia.com',
  address: {
    line1: '123 Test Street',
    city: 'Sydney',
    state: 'NSW',
    postal_code: '2000',
    country: 'AU'
  }
};

const testProduct = {
  name: 'Premium Membership',
  description: 'VCC Australia Premium Membership',
  amount: 19900 // $199.00 AUD
};

describe('Xero Integration Tests', () => {
  let stripeCustomerId;
  let xeroContactId;
  let tenantId;

  beforeAll(async () => {
    try {
      // Authenticate with Xero
      await xeroClient.initialize();
      const tokenSet = await xeroClient.getClientCredentialsToken();
      
      // Get the first tenant
      const tenants = await xeroClient.updateTenants();
      if (!tenants || tenants.length === 0) {
        throw new Error('No Xero tenants found');
      }
      tenantId = tenants[0].tenantId;
      console.log('Connected to Xero tenant:', tenants[0].tenantName);
      
      // Create test customer in Stripe
      const stripeCustomer = await stripe.customers.create(testCustomer);
      stripeCustomerId = stripeCustomer.id;
      console.log('Created test Stripe customer:', stripeCustomerId);
    } catch (error) {
      console.error('Setup failed:', error.message);
      throw error;
    }
  });

  afterAll(async () => {
    try {
      // Clean up Stripe customer
      if (stripeCustomerId) {
        await stripe.customers.del(stripeCustomerId);
        console.log('Deleted test Stripe customer:', stripeCustomerId);
      }
    } catch (error) {
      console.error('Cleanup failed:', error.message);
    }
  });

  describe('Contact Management', () => {
    test('should create a new contact in Xero', async () => {
      const contact = {
        name: testCustomer.name,
        emailAddress: testCustomer.email,
        firstName: testCustomer.name.split(' ')[0],
        lastName: testCustomer.name.split(' ')[1] || '',
        addresses: [{
          addressType: 'STREET',
          addressLine1: testCustomer.address.line1,
          city: testCustomer.address.city,
          region: testCustomer.address.state,
          postalCode: testCustomer.address.postal_code,
          country: testCustomer.address.country
        }],
        phones: [{
          phoneType: 'DEFAULT',
          phoneNumber: '+61 2 1234 5678'
        }],
        isCustomer: true,
        taxNumber: '', // ABN if available
        contactStatus: 'ACTIVE'
      };

      const response = await xeroClient.accountingApi.createContact(
        tenantId,
        { contacts: [contact] }
      );

      expect(response.body.contacts).toHaveLength(1);
      expect(response.body.contacts[0].name).toBe(testCustomer.name);
      expect(response.body.contacts[0].emailAddress).toBe(testCustomer.email);
      expect(response.body.contacts[0].contactStatus).toBe('ACTIVE');
      
      xeroContactId = response.body.contacts[0].contactID;
      console.log('Created Xero contact:', xeroContactId);
    });

    test('should find existing contact in Xero', async () => {
      const where = `EmailAddress="${testCustomer.email}" AND ContactStatus=="ACTIVE"`;
      const response = await xeroClient.accountingApi.getContacts(
        tenantId,
        null,
        where,
        'Name ASC',
        null,
        'email,addresses,phones'
      );

      expect(response.body.contacts).toHaveLength(1);
      expect(response.body.contacts[0].contactID).toBe(xeroContactId);
      console.log('Found existing Xero contact:', xeroContactId);
    });
  });

  describe('Invoice Creation', () => {
    test('should create invoice for successful Stripe payment', async () => {
      // First create a successful payment in Stripe
      const paymentMethod = await stripe.paymentMethods.create({
        type: 'card',
        card: { token: 'tok_visa' }
      });

      await stripe.paymentMethods.attach(paymentMethod.id, {
        customer: stripeCustomerId
      });

      const paymentIntent = await stripe.paymentIntents.create({
        amount: testProduct.amount,
        currency: 'aud',
        customer: stripeCustomerId,
        payment_method: paymentMethod.id,
        confirm: true,
        description: testProduct.description,
        metadata: {
          customer_name: testCustomer.name
        }
      });

      expect(paymentIntent.status).toBe('succeeded');
      console.log('Created Stripe payment:', paymentIntent.id);

      // Now create invoice in Xero
      const lineItem = {
        description: testProduct.description,
        quantity: 1.0,
        unitAmount: testProduct.amount / 100, // Convert cents to dollars
        accountCode: '200', // Sales account code
        taxType: 'OUTPUT2', // GST on Income
        taxAmount: (testProduct.amount / 100) * 0.1, // 10% GST
        lineAmount: (testProduct.amount / 100) * 1.1 // Amount including GST
      };

      const invoice = {
        type: 'ACCREC',
        contact: { contactID: xeroContactId },
        lineItems: [lineItem],
        date: new Date().toISOString().split('T')[0],
        dueDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], // Due in 30 days
        reference: paymentIntent.id,
        status: 'AUTHORISED',
        lineAmountTypes: 'Inclusive', // Amount includes tax
        currencyCode: 'AUD',
        brandingThemeID: await getDefaultBrandingThemeId(tenantId)
      };

      const response = await xeroClient.accountingApi.createInvoices(
        tenantId,
        { invoices: [invoice] }
      );

      expect(response.body.invoices).toHaveLength(1);
      expect(response.body.invoices[0].reference).toBe(paymentIntent.id);
      expect(response.body.invoices[0].status).toBe('AUTHORISED');
      expect(response.body.invoices[0].currencyCode).toBe('AUD');
      
      // Verify line item details
      expect(response.body.invoices[0].lineItems).toHaveLength(1);
      expect(response.body.invoices[0].lineItems[0].description).toBe(testProduct.description);
      expect(parseFloat(response.body.invoices[0].lineItems[0].unitAmount)).toBe(testProduct.amount / 100);
      
      console.log('Created Xero invoice:', response.body.invoices[0].invoiceID);
    });
  });
});

// Helper function to get default branding theme
async function getDefaultBrandingThemeId(tenantId) {
  const response = await xeroClient.accountingApi.getBrandingThemes(tenantId);
  const defaultTheme = response.body.brandingThemes.find(theme => theme.sortOrder === 1);
  return defaultTheme ? defaultTheme.brandingThemeID : null;
}
