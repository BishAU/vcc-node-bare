import express from 'express';
import Stripe from 'stripe';
import xeroService from '../utils/xero.js';
import logger from '../utils/logger.js';

const router = express.Router();
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

// Stripe webhook handler
router.post('/stripe', express.raw({ type: 'application/json' }), async (req, res) => {
  const sig = req.headers['stripe-signature'];
  let event;

  try {
    // Verify webhook signature
    event = stripe.webhooks.constructEvent(
      req.body,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET
    );
  } catch (err) {
    logger.error('Webhook signature verification failed:', {
      error: err.message,
      timestamp: new Date().toISOString()
    });
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  try {
    switch (event.type) {
      case 'payment_intent.succeeded':
        await handlePaymentIntentSucceeded(event.data.object);
        break;
      case 'invoice.paid':
        await handleInvoicePaid(event.data.object);
        break;
      default:
        logger.info('Unhandled event type:', {
          type: event.type,
          timestamp: new Date().toISOString()
        });
    }

    res.json({ received: true });
  } catch (err) {
    logger.error('Error processing webhook:', {
      error: err.message,
      timestamp: new Date().toISOString()
    });
    res.status(500).send('Webhook processing failed');
  }
});

// Xero webhook handler
router.post('/xero', async (req, res) => {
  try {
    const payload = req.body;
    await xeroService.handleWebhook(payload);
    res.json({ received: true });
  } catch (err) {
    logger.error('Error processing Xero webhook:', {
      error: err.message,
      timestamp: new Date().toISOString()
    });
    res.status(500).send('Webhook processing failed');
  }
});

export default router;

// Helper functions
async function handlePaymentIntentSucceeded(paymentIntent) {
  logger.info('Processing successful payment:', {
    paymentIntentId: paymentIntent.id,
    amount: paymentIntent.amount,
    customer: paymentIntent.customer
  });

  // Create Xero invoice for successful payment
  const invoice = await xeroService.handleStripePayment(paymentIntent);
  
  logger.info('Successfully created Xero invoice:', {
    paymentIntentId: paymentIntent.id,
    invoiceId: invoice.invoiceID,
    contactId: invoice.contact.contactID
  });
}

async function handleInvoicePaid(invoice) {
  // Handle invoice paid event
}
