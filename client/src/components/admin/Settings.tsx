import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { getDb } from '../../lib/db';
import { XeroService } from '../../lib/services/xero';

export function Settings() {
  const [xeroStatus, setXeroStatus] = useState<{
    connected: boolean;
    expiresAt?: string;
  }>({
    connected: false,
  });

  useEffect(() => {
    checkXeroConnection();
  }, []);

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
    <div className="space-y-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
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

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="bg-white shadow sm:rounded-lg"
      >
        <div className="px-4 py-5 sm:p-6">
          <h3 className="text-lg font-medium leading-6 text-gray-900">
            Stripe Configuration
          </h3>
          <div className="mt-2 max-w-xl text-sm text-gray-500">
            <p>
              Your Stripe integration is configured through environment variables.
              Make sure these are set:
            </p>
          </div>
          <div className="mt-5 space-y-2">
            <div className="flex items-center space-x-2">
              <span
                className={`flex h-2 w-2 ${
                  process.env.VITE_STRIPE_SECRET_KEY
                    ? 'bg-green-500'
                    : 'bg-red-500'
                } rounded-full`}
              ></span>
              <span className="text-sm text-gray-700">
                VITE_STRIPE_SECRET_KEY
              </span>
            </div>
            <div className="flex items-center space-x-2">
              <span
                className={`flex h-2 w-2 ${
                  process.env.VITE_STRIPE_PUBLIC_KEY
                    ? 'bg-green-500'
                    : 'bg-red-500'
                } rounded-full`}
              ></span>
              <span className="text-sm text-gray-700">
                VITE_STRIPE_PUBLIC_KEY
              </span>
            </div>
            <div className="flex items-center space-x-2">
              <span
                className={`flex h-2 w-2 ${
                  process.env.VITE_STRIPE_WEBHOOK_SECRET
                    ? 'bg-green-500'
                    : 'bg-red-500'
                } rounded-full`}
              ></span>
              <span className="text-sm text-gray-700">
                VITE_STRIPE_WEBHOOK_SECRET
              </span>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
