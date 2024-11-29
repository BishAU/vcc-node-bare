import { vi, describe, it, expect, beforeEach } from 'vitest';
import { StripeService } from '../stripe';
import Stripe from 'stripe';

vi.mock('stripe');

describe('StripeService', () => {
  let stripeService: StripeService;
  
  beforeEach(() => {
    vi.clearAllMocks();
    stripeService = new StripeService();
  });

  describe('createCustomer', () => {
    it('should create a new customer', async () => {
      const mockCustomer = {
        id: 'cus_mock',
        email: 'test@example.com',
      };

      (Stripe.prototype.customers.create as jest.Mock).mockResolvedValueOnce(mockCustomer);

      const result = await stripeService.createCustomer({
        email: 'test@example.com',
        name: 'Test User',
      });

      expect(result).toEqual(mockCustomer);
      expect(Stripe.prototype.customers.create).toHaveBeenCalledWith({
        email: 'test@example.com',
        name: 'Test User',
      });
    });
  });

  describe('createPaymentIntent', () => {
    it('should create a payment intent', async () => {
      const mockPaymentIntent = {
        id: 'pi_mock',
        client_secret: 'secret_mock',
        amount: 1000,
        currency: 'usd',
      };

      (Stripe.prototype.paymentIntents.create as jest.Mock).mockResolvedValueOnce(mockPaymentIntent);

      const result = await stripeService.createPaymentIntent({
        amount: 1000,
        currency: 'usd',
        customerId: 'cus_mock',
      });

      expect(result).toEqual(mockPaymentIntent);
      expect(Stripe.prototype.paymentIntents.create).toHaveBeenCalledWith({
        amount: 1000,
        currency: 'usd',
        customer: 'cus_mock',
      });
    });
  });

  describe('createSubscription', () => {
    it('should create a subscription', async () => {
      const mockSubscription = {
        id: 'sub_mock',
        customer: 'cus_mock',
        status: 'active',
      };

      (Stripe.prototype.subscriptions.create as jest.Mock).mockResolvedValueOnce(mockSubscription);

      const result = await stripeService.createSubscription({
        customerId: 'cus_mock',
        priceId: 'price_mock',
      });

      expect(result).toEqual(mockSubscription);
      expect(Stripe.prototype.subscriptions.create).toHaveBeenCalledWith({
        customer: 'cus_mock',
        items: [{ price: 'price_mock' }],
      });
    });
  });

  describe('handleWebhookEvent', () => {
    it('should handle subscription created event', async () => {
      const mockEvent = {
        type: 'customer.subscription.created',
        data: {
          object: {
            id: 'sub_mock',
            customer: 'cus_mock',
            status: 'active',
          },
        },
      };

      await stripeService.handleWebhookEvent(mockEvent as Stripe.Event);

      // Add assertions based on your webhook handling logic
    });

    it('should handle payment succeeded event', async () => {
      const mockEvent = {
        type: 'payment_intent.succeeded',
        data: {
          object: {
            id: 'pi_mock',
            customer: 'cus_mock',
            amount: 1000,
          },
        },
      };

      await stripeService.handleWebhookEvent(mockEvent as Stripe.Event);

      // Add assertions based on your webhook handling logic
    });
  });
});
