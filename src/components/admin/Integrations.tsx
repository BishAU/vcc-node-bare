import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { getDb } from '../../lib/db';

export function Integrations() {
  const [stripeKeys, setStripeKeys] = useState({
    testPublicKey: '',
    testSecretKey: '',
    livePublicKey: '',
    liveSecretKey: '',
  });

  const [xeroStatus, setXeroStatus] = useState<{
    connected: boolean;
    expiresAt?: string;
  }>({
    connected: false,
  });

  useEffect(() => {
    loadStripeKeys();
    checkXeroConnection();
  }, []);

  async function loadStripeKeys() {
    const db = await getDb();
    const keys = await db.settings.get('stripe_keys');
    if (keys) {
      setStripeKeys(keys);
    }
  }

  async function saveStripeKeys() {
    const db = await getDb();
    await db.settings.put(stripeKeys, 'stripe_keys');
    alert('Stripe keys saved successfully!');
  }

  async function checkXeroConnection() {
    const db = await getDb();
    const tokens = await db.settings.get('xero_tokens');

    if (tokens) {
      setXeroStatus({
        connected: true,
        expiresAt: tokens.expiresAt,
      });
    }
  }

  async function handleConnectXero() {
    try {
      const response = await fetch('/api/auth/xero', {
        method: 'POST',
      });

      if (!response.ok) {
        throw new Error('Failed to initiate Xero authentication');
      }

      const { url } = await response.json();
      window.location.href = url;
    } catch (error) {
      console.error('Error connecting to Xero:', error);
      alert('Error connecting to Xero. Please try again.');
    }
  }

  async function handleDisconnectXero() {
    if (!confirm('Are you sure you want to disconnect Xero?')) {
      return;
    }

    try {
      const db = await getDb();
      await db.settings.delete('xero_tokens');
      setXeroStatus({ connected: false });
    } catch (error) {
      console.error('Error disconnecting Xero:', error);
      alert('Error disconnecting Xero. Please try again.');
    }
  }

  return (
    <div className="space-y-8">
      {/* Stripe Integration */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white shadow sm:rounded-lg"
      >
        <div className="px-4 py-5 sm:p-6">
          <h3 className="text-lg font-medium leading-6 text-gray-900">
            Stripe Configuration
          </h3>
          <div className="mt-2 max-w-xl text-sm text-gray-500">
            <p>
              Configure your Stripe API keys for test and live environments.
              These keys are required for processing payments.
            </p>
          </div>
          <div className="mt-5 space-y-4">
            <h4 className="font-medium text-gray-700">Test Environment</h4>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div>
                <label htmlFor="testPublicKey" className="block text-sm font-medium text-gray-700">
                  Test Public Key
                </label>
                <input
                  type="text"
                  id="testPublicKey"
                  value={stripeKeys.testPublicKey}
                  onChange={(e) => setStripeKeys({ ...stripeKeys, testPublicKey: e.target.value })}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                />
              </div>
              <div>
                <label htmlFor="testSecretKey" className="block text-sm font-medium text-gray-700">
                  Test Secret Key
                </label>
                <input
                  type="password"
                  id="testSecretKey"
                  value={stripeKeys.testSecretKey}
                  onChange={(e) => setStripeKeys({ ...stripeKeys, testSecretKey: e.target.value })}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                />
              </div>
            </div>

            <h4 className="font-medium text-gray-700">Live Environment</h4>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div>
                <label htmlFor="livePublicKey" className="block text-sm font-medium text-gray-700">
                  Live Public Key
                </label>
                <input
                  type="text"
                  id="livePublicKey"
                  value={stripeKeys.livePublicKey}
                  onChange={(e) => setStripeKeys({ ...stripeKeys, livePublicKey: e.target.value })}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                />
              </div>
              <div>
                <label htmlFor="liveSecretKey" className="block text-sm font-medium text-gray-700">
                  Live Secret Key
                </label>
                <input
                  type="password"
                  id="liveSecretKey"
                  value={stripeKeys.liveSecretKey}
                  onChange={(e) => setStripeKeys({ ...stripeKeys, liveSecretKey: e.target.value })}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                />
              </div>
            </div>

            <div className="pt-4">
              <button
                type="button"
                onClick={saveStripeKeys}
                className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                Save Stripe Keys
              </button>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Xero Integration */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="bg-white shadow sm:rounded-lg"
      >
        <div className="px-4 py-5 sm:p-6">
          <h3 className="text-lg font-medium leading-6 text-gray-900">
            Xero Integration
          </h3>
          <div className="mt-2 max-w-xl text-sm text-gray-500">
            <p>
              Connect your Xero account to automatically sync invoices and
              payments.
            </p>
          </div>
          <div className="mt-5">
            {xeroStatus.connected ? (
              <div className="space-y-4">
                <div className="flex items-center space-x-2">
                  <span className="flex h-2 w-2">
                    <span className="animate-ping absolute inline-flex h-2 w-2 rounded-full bg-green-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
                  </span>
                  <span className="text-sm text-gray-700">Connected to Xero</span>
                </div>
                {xeroStatus.expiresAt && (
                  <p className="text-sm text-gray-500">
                    Token expires at:{' '}
                    {new Date(xeroStatus.expiresAt).toLocaleString()}
                  </p>
                )}
                <button
                  type="button"
                  onClick={handleDisconnectXero}
                  className="inline-flex items-center px-4 py-2 border border-red-300 shadow-sm text-sm font-medium rounded-md text-red-700 bg-white hover:bg-red-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                >
                  Disconnect Xero
                </button>
              </div>
            ) : (
              <button
                type="button"
                onClick={handleConnectXero}
                className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                Connect Xero
              </button>
            )}
          </div>
        </div>
      </motion.div>
    </div>
  );
}
