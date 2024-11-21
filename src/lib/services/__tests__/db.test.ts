import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { getDb } from '../../db';
import { IDBFactory } from 'fake-indexeddb';

// Mock IndexedDB
const originalIndexedDB = global.indexedDB;
beforeEach(() => {
  global.indexedDB = new IDBFactory();
});

afterEach(() => {
  global.indexedDB = originalIndexedDB;
  vi.clearAllMocks();
});

describe('Database', () => {
  it('should create database and object stores', async () => {
    const db = await getDb();
    
    expect(db.objectStoreNames).toContain('settings');
    expect(db.objectStoreNames).toContain('products');
    expect(db.objectStoreNames).toContain('orders');
    expect(db.objectStoreNames).toContain('subscriptions');
  });

  it('should store and retrieve settings', async () => {
    const db = await getDb();
    const testValue = { key: 'test_key', value: 'test_value' };
    
    await db.put('settings', testValue.value, testValue.key);
    const result = await db.get('settings', testValue.key);
    
    expect(result).toBe(testValue.value);
  });

  it('should store and retrieve products', async () => {
    const db = await getDb();
    const testProduct = {
      id: 'test_product',
      name: 'Test Product',
      description: 'Test Description',
      price: 100,
      type: 'one_time' as const,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    
    await db.put('products', testProduct);
    const result = await db.get('products', testProduct.id);
    
    expect(result).toEqual(testProduct);
  });

  it('should store and retrieve orders', async () => {
    const db = await getDb();
    const testOrder = {
      id: 'test_order',
      customerId: 'test_customer',
      items: [
        {
          productId: 'test_product',
          quantity: 1,
          price: 100,
        },
      ],
      total: 100,
      status: 'pending' as const,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    
    await db.put('orders', testOrder);
    const result = await db.get('orders', testOrder.id);
    
    expect(result).toEqual(testOrder);
  });

  it('should store and retrieve subscriptions', async () => {
    const db = await getDb();
    const testSubscription = {
      id: 'test_subscription',
      customerId: 'test_customer',
      productId: 'test_product',
      status: 'active' as const,
      stripeSubscriptionId: 'test_stripe_sub',
      currentPeriodStart: new Date(),
      currentPeriodEnd: new Date(),
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    
    await db.put('subscriptions', testSubscription);
    const result = await db.get('subscriptions', testSubscription.id);
    
    expect(result).toEqual(testSubscription);
  });
});
