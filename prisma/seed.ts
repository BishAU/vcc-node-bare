import { PrismaClient, UserRole, ProductType, PaymentStatus } from '@prisma/client';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  // Clear existing data
  await prisma.invoice.deleteMany();
  await prisma.orderItem.deleteMany();
  await prisma.transaction.deleteMany();
  await prisma.order.deleteMany();
  await prisma.subscription.deleteMany();
  await prisma.subscriptionPlan.deleteMany();
  await prisma.product.deleteMany();
  await prisma.user.deleteMany();
  await prisma.glCode.deleteMany();

  // Create GL Codes
  const glCodes = await Promise.all([
    prisma.glCode.create({
      data: {
        code: '4000',
        name: 'Sales Revenue',
        description: 'Revenue from product sales',
        xeroAccountId: 'sales_revenue_id'
      }
    }),
    prisma.glCode.create({
      data: {
        code: '4100',
        name: 'Subscription Revenue',
        description: 'Revenue from subscriptions',
        xeroAccountId: 'subscription_revenue_id'
      }
    }),
  ]);

  // Create test users
  const hashedPassword = await bcrypt.hash('password123', 10);
  
  const users = await Promise.all([
    prisma.user.create({
      data: {
        email: 'admin@vcc.com',
        name: 'Admin User',
        password: hashedPassword,
        role: UserRole.ADMIN,
        phone: '+61412345678',
        companyName: 'VCC Admin',
        abn: '12345678901',
        address1: '123 Admin Street',
        city: 'Melbourne',
        state: 'VIC',
        postcode: '3000',
        country: 'Australia'
      }
    }),
    prisma.user.create({
      data: {
        email: 'user@example.com',
        name: 'Test User',
        password: hashedPassword,
        role: UserRole.USER,
        phone: '+61487654321',
        companyName: 'Test Company',
        abn: '98765432109',
        address1: '456 User Lane',
        city: 'Sydney',
        state: 'NSW',
        postcode: '2000',
        country: 'Australia'
      }
    })
  ]);

  // Create products
  const products = await Promise.all([
    prisma.product.create({
      data: {
        sku: 'COURSE-001',
        name: 'Digital Skills Masterclass',
        description: 'Comprehensive digital skills training for professionals',
        unitPrice: 299.99,
        type: ProductType.ONE_TIME,
        taxRate: 0.1,
        glCodeId: glCodes[0].id,
        stripeProductId: 'prod_test1',
        stripePriceId: 'price_test1'
      }
    }),
    prisma.product.create({
      data: {
        sku: 'SUB-001',
        name: 'Professional Development Subscription',
        description: 'Monthly access to all training resources',
        unitPrice: 49.99,
        type: ProductType.SUBSCRIPTION,
        taxRate: 0.1,
        glCodeId: glCodes[1].id,
        stripeProductId: 'prod_test2',
        stripePriceId: 'price_test2'
      }
    })
  ]);

  // Create subscription plans
  const subscriptionPlans = await Promise.all([
    prisma.subscriptionPlan.create({
      data: {
        productId: products[1].id,
        name: 'Monthly Professional',
        interval: 'MONTHLY',
        unitPrice: 49.99,
        taxAmount: 5.00
      }
    }),
    prisma.subscriptionPlan.create({
      data: {
        productId: products[1].id,
        name: 'Annual Professional',
        interval: 'ANNUAL',
        unitPrice: 499.99,
        taxAmount: 50.00
      }
    })
  ]);

  // Create a test order
  const order = await prisma.order.create({
    data: {
      userId: users[1].id,
      status: 'COMPLETED',
      subtotal: 299.99,
      taxAmount: 30.00,
      total: 329.99,
      paymentMethod: 'CREDIT_CARD',
      paymentStatus: PaymentStatus.COMPLETED,
      stripePaymentIntentId: 'pi_test1',
      items: {
        create: {
          productId: products[0].id,
          sku: products[0].sku,
          quantity: 1,
          unitPrice: 299.99,
          taxAmount: 30.00,
          total: 329.99
        }
      }
    }
  });

  // Create transaction record for the order
  await prisma.transaction.create({
    data: {
      orderId: order.id,
      customerName: users[1].name,
      customerEmail: users[1].email,
      customerPhone: users[1].phone!,
      companyName: users[1].companyName!,
      abn: users[1].abn!,
      billingAddress1: users[1].address1,
      billingCity: users[1].city,
      billingState: users[1].state,
      billingPostcode: users[1].postcode,
      billingCountry: users[1].country,
      paymentMethod: 'CREDIT_CARD',
      paymentStatus: PaymentStatus.COMPLETED,
      stripeMetadata: {
        paymentIntentId: 'pi_test1'
      }
    }
  });

  console.log('Seed data created successfully');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
