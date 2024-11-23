const Stripe = require('stripe');
const dotenv = require('dotenv');

dotenv.config();

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || '', {
  apiVersion: '2023-10-16',
});

describe('Stripe Payment Integration Tests', () => {
  const testCard = {
    valid: {
      number: '4242424242424242', // Test card that always succeeds
      exp_month: 12,
      exp_year: 2024,
      cvc: '123',
    },
    invalid: {
      number: '4000000000000002', // Test card that always gets declined
      exp_month: 12,
      exp_year: 2024,
      cvc: '123',
    },
  };

  const testCustomer = {
    email: 'test@vccaustralia.com',
    name: 'Test Customer',
    address: {
      line1: '123 Test Street',
      city: 'Sydney',
      state: 'NSW',
      postal_code: '2000',
      country: 'AU',
    },
  };

  // Helper function to create a payment method
  const createPaymentMethod = async (card) => {
    return await stripe.paymentMethods.create({
      type: 'card',
      card: {
        number: card.number,
        exp_month: card.exp_month,
        exp_year: card.exp_year,
        cvc: card.cvc,
      },
    });
  };

  // Helper function to create a customer
  const createCustomer = async (paymentMethodId) => {
    return await stripe.customers.create({
      ...testCustomer,
      payment_method: paymentMethodId,
    });
  };

  test('should successfully process a valid payment', async () => {
    try {
      // Create a payment method with valid card
      const paymentMethod = await createPaymentMethod(testCard.valid);
      
      // Create a customer
      const customer = await createCustomer(paymentMethod.id);

      // Create a payment intent
      const paymentIntent = await stripe.paymentIntents.create({
        amount: 2000, // $20.00 AUD
        currency: 'aud',
        customer: customer.id,
        payment_method: paymentMethod.id,
        off_session: true,
        confirm: true,
        description: 'Test payment for VCC Australia',
        metadata: {
          order_id: 'TEST-ORDER-' + Date.now(),
          customer_name: testCustomer.name,
        },
      });

      expect(paymentIntent.status).toBe('succeeded');
      expect(paymentIntent.amount).toBe(2000);
      expect(paymentIntent.currency).toBe('aud');

      // Clean up - delete customer
      await stripe.customers.del(customer.id);
    } catch (error) {
      console.error('Error in successful payment test:', error);
      throw error;
    }
  }, 30000);

  test('should handle declined payment appropriately', async () => {
    try {
      // Create a payment method with invalid card
      const paymentMethod = await createPaymentMethod(testCard.invalid);
      
      // Create a customer
      const customer = await createCustomer(paymentMethod.id);

      // Attempt to create a payment intent (should fail)
      await expect(stripe.paymentIntents.create({
        amount: 2000,
        currency: 'aud',
        customer: customer.id,
        payment_method: paymentMethod.id,
        off_session: true,
        confirm: true,
        description: 'Test declined payment for VCC Australia',
        metadata: {
          order_id: 'TEST-DECLINED-' + Date.now(),
          customer_name: testCustomer.name,
        },
      })).rejects.toThrow();

      // Clean up - delete customer
      await stripe.customers.del(customer.id);
    } catch (error) {
      // We expect an error here, but we want to make sure it's the right kind
      expect(error.type).toBe('StripeCardError');
    }
  }, 30000);

  test('should create and retrieve customer details', async () => {
    try {
      // Create a payment method
      const paymentMethod = await createPaymentMethod(testCard.valid);
      
      // Create a customer
      const customer = await createCustomer(paymentMethod.id);

      // Retrieve and verify customer details
      const retrievedCustomer = await stripe.customers.retrieve(customer.id);
      
      expect(retrievedCustomer.email).toBe(testCustomer.email);
      expect(retrievedCustomer.name).toBe(testCustomer.name);
      
      // Clean up
      await stripe.customers.del(customer.id);
    } catch (error) {
      console.error('Error in customer details test:', error);
      throw error;
    }
  }, 30000);
});
