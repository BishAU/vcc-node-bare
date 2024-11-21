import { openDB, DBSchema, IDBPDatabase } from 'idb';

interface VCCDatabase extends DBSchema {
  settings: {
    key: string;
    value: any;
  };
  products: {
    key: string;
    value: {
      id: string;
      name: string;
      description: string;
      price: number;
      type: 'one_time' | 'subscription';
      stripePriceId?: string;
      createdAt: Date;
      updatedAt: Date;
    };
  };
  orders: {
    key: string;
    value: {
      id: string;
      customerId: string;
      items: Array<{
        productId: string;
        quantity: number;
        price: number;
      }>;
      total: number;
      status: 'pending' | 'paid' | 'failed';
      stripePaymentIntentId?: string;
      xeroInvoiceId?: string;
      createdAt: Date;
      updatedAt: Date;
    };
  };
  subscriptions: {
    key: string;
    value: {
      id: string;
      customerId: string;
      productId: string;
      status: 'active' | 'canceled' | 'past_due';
      stripeSubscriptionId: string;
      currentPeriodStart: Date;
      currentPeriodEnd: Date;
      createdAt: Date;
      updatedAt: Date;
    };
  };
}

let db: IDBPDatabase<VCCDatabase>;

export async function getDb() {
  if (!db) {
    db = await openDB<VCCDatabase>('vcc-db', 1, {
      upgrade(db) {
        // Create stores if they don't exist
        if (!db.objectStoreNames.contains('settings')) {
          db.createObjectStore('settings');
        }
        if (!db.objectStoreNames.contains('products')) {
          db.createObjectStore('products', { keyPath: 'id' });
        }
        if (!db.objectStoreNames.contains('orders')) {
          db.createObjectStore('orders', { keyPath: 'id' });
        }
        if (!db.objectStoreNames.contains('subscriptions')) {
          db.createObjectStore('subscriptions', { keyPath: 'id' });
        }
      },
    });
  }
  return db;
}
