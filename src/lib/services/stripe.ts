import Stripe from 'stripe';
import { User, Product } from '../api/types';
import { getDb } from '../db';

export class StripeService {
  private static instance: StripeService;
  private stripe: Stripe;
  private stripeSecretKey: string;

  private constructor() {
    this.stripeSecretKey = import.meta.env.VITE_STRIPE_SECRET_KEY;
    if (!this.stripeSecretKey) {
      throw new Error('Stripe secret key not configured');
    }
    this.stripe = new Stripe(this.stripeSecretKey, {
      apiVersion: '2023-10-16',
    });
  }

  public static getInstance(): StripeService {
    if (!StripeService.instance) {
      StripeService.instance = new StripeService();
    }
    return StripeService.instance;
  }

  // Customer Management
  async getOrCreateCustomer(user: User): Promise<string> {
    if (user.stripeCustomerId) {
      return user.stripeCustomerId;
    }

    const customer = await this.stripe.customers.create({
      email: user.email,
      name: user.firstName && user.lastName ? `${user.firstName} ${user.lastName}` : undefined,
      metadata: {
        userId: user.id,
      },
    });

    // Update user with Stripe customer ID
    const db = await getDb();
    await db.users.update(user.id, { stripeCustomerId: customer.id });

    return customer.id;
  }

  // Payment Intent Creation
  async createPaymentIntent(user: User, product: Product): Promise<Stripe.PaymentIntent> {
    const customerId = await this.getOrCreateCustomer(user);

    return await this.stripe.paymentIntents.create({
      amount: product.priceInCents,
      currency: 'gbp',
      customer: customerId,
      metadata: {
        userId: user.id,
        productId: product.id,
      },
      automatic_payment_methods: {
        enabled: true,
      },
    });
  }

  // Subscription Management
  async createSubscription(user: User, product: Product): Promise<Stripe.Subscription> {
    const customerId = await this.getOrCreateCustomer(user);

    return await this.stripe.subscriptions.create({
      customer: customerId,
      items: [{ price: product.stripePriceId }],
      metadata: {
        userId: user.id,
        productId: product.id,
      },
      payment_behavior: 'default_incomplete',
      payment_settings: {
        save_default_payment_method: 'on_subscription',
      },
      expand: ['latest_invoice.payment_intent'],
    });
  }

  async cancelSubscription(subscriptionId: string, immediate: boolean = false): Promise<Stripe.Subscription> {
    if (immediate) {
      return await this.stripe.subscriptions.cancel(subscriptionId);
    } else {
      return await this.stripe.subscriptions.update(subscriptionId, {
        cancel_at_period_end: true,
      });
    }
  }

  async updateSubscription(subscriptionId: string, newPriceId: string): Promise<Stripe.Subscription> {
    const subscription = await this.stripe.subscriptions.retrieve(subscriptionId);
    
    if (!subscription.items.data[0]?.id) {
      throw new Error('No subscription items found');
    }

    return await this.stripe.subscriptions.update(subscriptionId, {
      items: [{
        id: subscription.items.data[0].id,
        price: newPriceId,
      }],
      proration_behavior: 'create_prorations',
    });
  }

  // Webhook Event Processing
  async handleWebhookEvent(event: Stripe.Event): Promise<void> {
    const db = await getDb();

    switch (event.type) {
      case 'payment_intent.succeeded':
        const paymentIntent = event.data.object as Stripe.PaymentIntent;
        if (paymentIntent.metadata.userId && paymentIntent.metadata.productId) {
          await db.orders.add({
            id: crypto.randomUUID(),
            userId: paymentIntent.metadata.userId,
            productId: paymentIntent.metadata.productId,
            stripePaymentIntentId: paymentIntent.id,
            amount: paymentIntent.amount,
            status: 'completed',
            createdAt: new Date().toISOString(),
          });
        }
        break;

      case 'customer.subscription.created':
      case 'customer.subscription.updated':
        const subscription = event.data.object as Stripe.Subscription;
        if (subscription.metadata.userId) {
          const user = await db.users.get(subscription.metadata.userId);
          if (user) {
            await db.users.update(user.id, {
              subscriptionId: subscription.id,
              plan: subscription.metadata.productId || 'pro',
            });
          }
        }
        break;

      case 'customer.subscription.deleted':
        const deletedSubscription = event.data.object as Stripe.Subscription;
        if (deletedSubscription.metadata.userId) {
          const user = await db.users.get(deletedSubscription.metadata.userId);
          if (user) {
            await db.users.update(user.id, {
              subscriptionId: null,
              plan: 'free',
            });
          }
        }
        break;
    }
  }

  // Utility Methods
  async validateWebhookSignature(payload: string, signature: string): Promise<boolean> {
    const webhookSecret = import.meta.env.VITE_STRIPE_WEBHOOK_SECRET;
    if (!webhookSecret) {
      throw new Error('Stripe webhook secret not configured');
    }

    try {
      this.stripe.webhooks.constructEvent(payload, signature, webhookSecret);
      return true;
    } catch (err) {
      console.error('Webhook signature verification failed:', err);
      return false;
    }
  }
}
