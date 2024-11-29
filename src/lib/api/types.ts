import { z } from 'zod';

// Base schemas
export const baseSchema = z.object({
  id: z.string(),
  createdAt: z.string(),
  updatedAt: z.string().optional(),
});

// Product related schemas
export const productSchema = baseSchema.extend({
  name: z.string(),
  description: z.string(),
  stripePriceId: z.string(),
  priceInCents: z.number(),
  interval: z.enum(['month', 'year']).optional(),
  features: z.array(z.string()),
  generationsPerMonth: z.number(), // -1 for unlimited
  maxSavedDesigns: z.number(), // -1 for unlimited
  includesCommercialLicense: z.boolean(),
  priority: z.boolean(),
  glCode: z.string(), // Xero GL code
  active: z.boolean(),
});

// User related schemas
export const userSchema = baseSchema.extend({
  email: z.string().email(),
  firstName: z.string().optional(),
  lastName: z.string().optional(),
  county: z.string().optional(),
  plan: z.string(),
  stripeCustomerId: z.string().optional(),
  subscriptionId: z.string().optional(),
  isAdmin: z.boolean(),
  generationsLeft: z.number(),
});

// Order related schemas
export const orderSchema = baseSchema.extend({
  userId: z.string(),
  productId: z.string(),
  stripePaymentIntentId: z.string(),
  xeroInvoiceId: z.string(),
  amount: z.number(),
  status: z.enum(['pending', 'completed', 'failed', 'refunded']),
  metadata: z.record(z.string()).optional(),
});

// Subscription related schemas
export const subscriptionSchema = baseSchema.extend({
  userId: z.string(),
  productId: z.string(),
  stripeSubscriptionId: z.string(),
  status: z.enum(['active', 'past_due', 'canceled', 'incomplete']),
  currentPeriodEnd: z.string(),
  cancelAtPeriodEnd: z.boolean(),
});

// Stripe webhook event types
export const stripeWebhookSchema = z.object({
  id: z.string(),
  type: z.string(),
  data: z.object({
    object: z.record(z.any()),
  }),
});

// Xero invoice types
export const xeroInvoiceSchema = z.object({
  invoiceId: z.string(),
  contactId: z.string(),
  status: z.enum(['DRAFT', 'SUBMITTED', 'AUTHORISED', 'PAID', 'VOIDED']),
  total: z.number(),
  currencyCode: z.string(),
  reference: z.string().optional(),
  glCodes: z.array(z.string()),
});

// Type exports
export type Product = z.infer<typeof productSchema>;
export type User = z.infer<typeof userSchema>;
export type Order = z.infer<typeof orderSchema>;
export type Subscription = z.infer<typeof subscriptionSchema>;
export type StripeWebhookEvent = z.infer<typeof stripeWebhookSchema>;
export type XeroInvoice = z.infer<typeof xeroInvoiceSchema>;
