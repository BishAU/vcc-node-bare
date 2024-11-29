import { StripeService } from '../../../lib/services/stripe';
import { XeroService } from '../../../lib/services/xero';
import { getDb } from '../../../lib/db';

export async function POST(request: Request) {
  const signature = request.headers.get('stripe-signature');
  if (!signature) {
    return new Response('No signature', { status: 400 });
  }

  try {
    const stripeService = StripeService.getInstance();
    const xeroService = XeroService.getInstance();
    const db = await getDb();

    // Verify webhook signature
    const payload = await request.text();
    const isValid = await stripeService.validateWebhookSignature(payload, signature);
    if (!isValid) {
      return new Response('Invalid signature', { status: 400 });
    }

    const event = JSON.parse(payload);

    // Handle the event
    switch (event.type) {
      case 'payment_intent.succeeded':
        const paymentIntent = event.data.object;
        
        // Create order in database
        const order = await db.orders.add({
          id: crypto.randomUUID(),
          userId: paymentIntent.metadata.userId,
          productId: paymentIntent.metadata.productId,
          stripePaymentIntentId: paymentIntent.id,
          amount: paymentIntent.amount,
          status: 'completed',
          createdAt: new Date().toISOString(),
        });

        // Get user and product details
        const user = await db.users.get(paymentIntent.metadata.userId);
        const product = await db.products.get(paymentIntent.metadata.productId);

        if (user && product) {
          // Create invoice in Xero
          const invoiceId = await xeroService.createInvoice(order, user, product);
          
          // Record payment in Xero
          await xeroService.recordPayment(invoiceId, paymentIntent.amount);

          // Update order with Xero invoice ID
          await db.orders.update(order.id, { xeroInvoiceId: invoiceId });
        }
        break;

      case 'customer.subscription.created':
      case 'customer.subscription.updated':
        const subscription = event.data.object;
        
        // Update user subscription status
        if (subscription.metadata.userId) {
          const subUser = await db.users.get(subscription.metadata.userId);
          const subProduct = await db.products.get(subscription.metadata.productId);

          if (subUser && subProduct) {
            // Update user subscription
            await db.users.update(subUser.id, {
              subscriptionId: subscription.id,
              plan: subProduct.id,
            });

            // Create subscription invoice in Xero
            const subInvoiceId = await xeroService.createSubscriptionInvoice(
              subscription,
              subUser,
              subProduct
            );

            // Update subscription record
            await db.subscriptions.put({
              id: subscription.id,
              userId: subUser.id,
              productId: subProduct.id,
              stripeSubscriptionId: subscription.id,
              status: subscription.status,
              currentPeriodEnd: new Date(subscription.current_period_end * 1000).toISOString(),
              cancelAtPeriodEnd: subscription.cancel_at_period_end,
              createdAt: new Date().toISOString(),
            });
          }
        }
        break;

      case 'customer.subscription.deleted':
        const deletedSubscription = event.data.object;
        
        // Update user subscription status
        if (deletedSubscription.metadata.userId) {
          const delUser = await db.users.get(deletedSubscription.metadata.userId);
          if (delUser) {
            await db.users.update(delUser.id, {
              subscriptionId: null,
              plan: 'free',
            });

            // Update subscription record
            await db.subscriptions.update(deletedSubscription.id, {
              status: 'canceled',
              cancelAtPeriodEnd: false,
            });
          }
        }
        break;

      // Add more event types as needed
    }

    return new Response('Webhook processed', { status: 200 });
  } catch (error) {
    console.error('Error processing webhook:', error);
    return new Response('Webhook error: ' + (error as Error).message, {
      status: 400,
    });
  }
}
