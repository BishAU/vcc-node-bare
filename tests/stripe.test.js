const Stripe = require('stripe');
require('dotenv').config();

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
  apiVersion: '2023-10-16'
});

describe('Stripe Integration Tests', () => {
  const testCustomer = {
    email: 'test@vccaustralia.com',
    name: 'Test Customer',
    description: 'Test customer for VCC Australia',
    address: {
      line1: '123 Test Street',
      city: 'Sydney',
      state: 'NSW',
      postal_code: '2000',
      country: 'AU'
    },
    metadata: {
      testKey: 'testValue',
      source: 'automated_test'
    }
  };

  const testProduct = {
    name: 'Premium Membership',
    description: 'VCC Australia Premium Membership',
    default_price_data: {
      currency: 'aud',
      unit_amount: 19900, // $199.00 AUD
      recurring: {
        interval: 'month'
      }
    },
    metadata: {
      category: 'membership',
      features: 'premium_access,support,analytics'
    }
  };

  let connectedAccountId;
  let testCustomerId;
  let testProductId;
  let testPriceId;

  beforeAll(async () => {
    // Create a test Connected Account
    const account = await stripe.accounts.create({
      type: 'standard',
      country: 'AU',
      email: 'test-connect@vccaustralia.com',
      capabilities: {
        card_payments: {requested: true},
        transfers: {requested: true}
      }
    });
    connectedAccountId = account.id;
    console.log('Created test connected account:', connectedAccountId);
  });

  afterAll(async () => {
    // Clean up all test resources
    if (testCustomerId) {
      await stripe.customers.del(testCustomerId);
      console.log('Deleted test customer:', testCustomerId);
    }
    if (testProductId) {
      try {
        // First archive the product
        await stripe.products.update(testProductId, {
          active: false,
          default_price: null
        });
        
        // Then list and archive all prices
        const prices = await stripe.prices.list({
          product: testProductId,
          active: true,
          limit: 100
        });
        
        for (const price of prices.data) {
          await stripe.prices.update(price.id, { active: false });
        }
        
        // Now we can delete the product
        await stripe.products.del(testProductId);
        console.log('Deleted test product:', testProductId);
      } catch (error) {
        console.error('Error cleaning up product:', error.message);
      }
    }
    if (connectedAccountId) {
      await stripe.accounts.del(connectedAccountId);
      console.log('Deleted test connected account:', connectedAccountId);
    }
  });

  describe('Customer Management', () => {
    test('should create and retrieve a customer', async () => {
      // Create a customer
      const customer = await stripe.customers.create(testCustomer);
      testCustomerId = customer.id;

      expect(customer.email).toBe(testCustomer.email);
      expect(customer.name).toBe(testCustomer.name);
      expect(customer.address.line1).toBe(testCustomer.address.line1);
      expect(customer.metadata.testKey).toBe(testCustomer.metadata.testKey);

      // Retrieve and verify customer
      const retrievedCustomer = await stripe.customers.retrieve(customer.id);
      expect(retrievedCustomer.id).toBe(customer.id);
      expect(retrievedCustomer.email).toBe(testCustomer.email);
    });

    test('should update customer information', async () => {
      const updatedData = {
        name: 'Updated Test Customer',
        metadata: {
          update_test: 'success'
        }
      };

      const updatedCustomer = await stripe.customers.update(testCustomerId, updatedData);
      
      expect(updatedCustomer.name).toBe(updatedData.name);
      expect(updatedCustomer.metadata.update_test).toBe(updatedData.metadata.update_test);
      // Original data should still be present
      expect(updatedCustomer.email).toBe(testCustomer.email);
    });

    test('should list customers with filters', async () => {
      const customers = await stripe.customers.list({
        limit: 3,
        email: testCustomer.email
      });

      expect(customers.data.length).toBeGreaterThan(0);
      const foundCustomer = customers.data.find(c => c.id === testCustomerId);
      expect(foundCustomer).toBeDefined();
    });
  });

  describe('Product and Price Management', () => {
    test('should create and retrieve a product with price', async () => {
      // Create a product with a default price
      const product = await stripe.products.create(testProduct);
      testProductId = product.id;
      testPriceId = product.default_price;

      expect(product.name).toBe(testProduct.name);
      expect(product.description).toBe(testProduct.description);
      expect(product.metadata.category).toBe(testProduct.metadata.category);

      // Retrieve and verify the default price
      const price = await stripe.prices.retrieve(product.default_price);
      expect(price.unit_amount).toBe(testProduct.default_price_data.unit_amount);
      expect(price.currency).toBe(testProduct.default_price_data.currency);
      expect(price.recurring.interval).toBe(testProduct.default_price_data.recurring.interval);
    });

    test('should create additional price for existing product', async () => {
      const newPrice = await stripe.prices.create({
        product: testProductId,
        currency: 'aud',
        unit_amount: 29900, // $299.00 AUD
        recurring: {
          interval: 'year'
        },
        metadata: {
          type: 'annual_subscription'
        }
      });

      expect(newPrice.product).toBe(testProductId);
      expect(newPrice.unit_amount).toBe(29900);
      expect(newPrice.recurring.interval).toBe('year');
    });

    test('should update product information', async () => {
      const updatedData = {
        name: 'Elite Membership',
        metadata: {
          category: 'elite_membership',
          features: 'premium_access,priority_support,advanced_analytics'
        }
      };

      const updatedProduct = await stripe.products.update(testProductId, updatedData);
      
      expect(updatedProduct.name).toBe(updatedData.name);
      expect(updatedProduct.metadata.category).toBe(updatedData.metadata.category);
      expect(updatedProduct.metadata.features).toBe(updatedData.metadata.features);
    });

    test('should list active products', async () => {
      const products = await stripe.products.list({
        limit: 3,
        active: true
      });

      expect(products.data.length).toBeGreaterThan(0);
      const foundProduct = products.data.find(p => p.id === testProductId);
      expect(foundProduct).toBeDefined();
    });

    test('should list prices for a product', async () => {
      const prices = await stripe.prices.list({
        product: testProductId
      });

      expect(prices.data.length).toBeGreaterThan(0);
      // Should find both monthly and yearly prices
      const monthlyPrice = prices.data.find(p => p.recurring.interval === 'month');
      const yearlyPrice = prices.data.find(p => p.recurring.interval === 'year');
      
      expect(monthlyPrice).toBeDefined();
      expect(yearlyPrice).toBeDefined();
    });
  });

  describe('Connected Account Payments', () => {
    test('should process a successful payment on connected account', async () => {
      // Create a payment method
      const paymentMethod = await stripe.paymentMethods.create({
        type: 'card',
        card: {
          token: 'tok_visa'
        }
      });

      // Attach payment method to customer
      await stripe.paymentMethods.attach(paymentMethod.id, {
        customer: testCustomerId,
      });

      // Create a payment intent
      const paymentIntent = await stripe.paymentIntents.create({
        amount: 2000, // $20.00 AUD
        currency: 'aud',
        customer: testCustomerId,
        payment_method: paymentMethod.id,
        confirm: true,
        return_url: 'https://vccaustralia.com/payment/complete',
        automatic_payment_methods: {
          enabled: true,
          allow_redirects: 'never'
        },
        application_fee_amount: 200, // $2.00 AUD fee
        transfer_data: {
          destination: connectedAccountId,
        },
        description: 'Test payment for VCC Australia Connected Account',
        metadata: {
          order_id: 'TEST-ORDER-' + Date.now(),
          customer_name: testCustomer.name
        }
      });

      expect(paymentIntent.status).toBe('succeeded');
      expect(paymentIntent.amount).toBe(2000);
      expect(paymentIntent.currency).toBe('aud');
      expect(paymentIntent.transfer_data.destination).toBe(connectedAccountId);
    });
  });
});
