import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Dialog } from '@headlessui/react';
import { getDb } from '../../lib/db';
import { StripeService } from '../../lib/services/stripe';
import type { Subscription } from '../../lib/api/types';

export function SubscriptionList() {
  const [subscriptions, setSubscriptions] = useState<Subscription[]>([]);
  const [selectedSubscription, setSelectedSubscription] = useState<Subscription | null>(null);
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);
  const [isCancelModalOpen, setIsCancelModalOpen] = useState(false);
  const [cancelAtPeriodEnd, setCancelAtPeriodEnd] = useState(true);

  useEffect(() => {
    loadSubscriptions();
  }, []);

  async function loadSubscriptions() {
    const db = await getDb();
    const subscriptions = await db.subscriptions
      .orderBy('createdAt')
      .reverse()
      .toArray();
    setSubscriptions(subscriptions);
  }

  function handleViewDetails(subscription: Subscription) {
    setSelectedSubscription(subscription);
    setIsDetailsOpen(true);
  }

  async function handleCancelSubscription() {
    if (!selectedSubscription) return;

    try {
      const stripeService = StripeService.getInstance();
      await stripeService.cancelSubscription(
        selectedSubscription.stripeSubscriptionId,
        cancelAtPeriodEnd
      );

      const db = await getDb();
      await db.subscriptions.update(selectedSubscription.id, {
        status: cancelAtPeriodEnd ? 'active' : 'canceled',
        cancelAtPeriodEnd,
      });

      // Update user's subscription status if immediate cancellation
      if (!cancelAtPeriodEnd) {
        await db.users.update(selectedSubscription.userId, {
          subscriptionId: null,
          plan: 'free',
        });
      }

      setIsCancelModalOpen(false);
      loadSubscriptions();
    } catch (error) {
      console.error('Error canceling subscription:', error);
      alert('Error canceling subscription. Please check the console for details.');
    }
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-900">Subscriptions</h2>
      </div>

      <div className="bg-white shadow overflow-hidden sm:rounded-lg">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th
                scope="col"
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                User
              </th>
              <th
                scope="col"
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                Product
              </th>
              <th
                scope="col"
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                Status
              </th>
              <th
                scope="col"
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                Period End
              </th>
              <th scope="col" className="relative px-6 py-3">
                <span className="sr-only">Actions</span>
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {subscriptions.map((subscription) => (
              <motion.tr
                key={subscription.id}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
              >
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {subscription.userId}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {subscription.productId}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span
                    className={`px-2 py-1 text-xs rounded-full ${
                      subscription.status === 'active'
                        ? 'bg-green-100 text-green-800'
                        : subscription.status === 'past_due'
                        ? 'bg-yellow-100 text-yellow-800'
                        : 'bg-red-100 text-red-800'
                    }`}
                  >
                    {subscription.status}
                    {subscription.cancelAtPeriodEnd && ' (Canceling)'}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {new Date(subscription.currentPeriodEnd).toLocaleDateString()}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <button
                    onClick={() => handleViewDetails(subscription)}
                    className="text-blue-600 hover:text-blue-900 mr-4"
                  >
                    View Details
                  </button>
                  {subscription.status === 'active' && !subscription.cancelAtPeriodEnd && (
                    <button
                      onClick={() => {
                        setSelectedSubscription(subscription);
                        setIsCancelModalOpen(true);
                      }}
                      className="text-red-600 hover:text-red-900"
                    >
                      Cancel
                    </button>
                  )}
                </td>
              </motion.tr>
            ))}
          </tbody>
        </table>
      </div>

      {isDetailsOpen && selectedSubscription && (
        <div className="fixed inset-0 z-10 overflow-y-auto">
          <div className="flex items-center justify-center min-h-screen">
            <div
              className="fixed inset-0 bg-black opacity-30"
              onClick={() => setIsDetailsOpen(false)}
            ></div>

            <div className="relative bg-white rounded-lg max-w-lg w-full mx-4 p-6">
              <h3 className="text-lg font-medium text-gray-900 mb-4">
                Subscription Details
              </h3>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Subscription ID
                  </label>
                  <p className="mt-1 text-sm text-gray-900">
                    {selectedSubscription.id}
                  </p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    User ID
                  </label>
                  <p className="mt-1 text-sm text-gray-900">
                    {selectedSubscription.userId}
                  </p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Product ID
                  </label>
                  <p className="mt-1 text-sm text-gray-900">
                    {selectedSubscription.productId}
                  </p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Status
                  </label>
                  <p className="mt-1 text-sm text-gray-900">
                    {selectedSubscription.status}
                    {selectedSubscription.cancelAtPeriodEnd && ' (Canceling)'}
                  </p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Current Period End
                  </label>
                  <p className="mt-1 text-sm text-gray-900">
                    {new Date(
                      selectedSubscription.currentPeriodEnd
                    ).toLocaleString()}
                  </p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Created At
                  </label>
                  <p className="mt-1 text-sm text-gray-900">
                    {new Date(selectedSubscription.createdAt).toLocaleString()}
                  </p>
                </div>

                <div className="flex justify-end">
                  <button
                    onClick={() => setIsDetailsOpen(false)}
                    className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
                  >
                    Close
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      <Dialog
        open={isCancelModalOpen}
        onClose={() => setIsCancelModalOpen(false)}
        className="fixed inset-0 z-10 overflow-y-auto"
      >
        <div className="flex items-center justify-center min-h-screen">
          <Dialog.Overlay className="fixed inset-0 bg-black opacity-30" />

          <div className="relative bg-white rounded-lg max-w-md w-full mx-4 p-6">
            <Dialog.Title className="text-lg font-medium text-gray-900 mb-4">
              Cancel Subscription
            </Dialog.Title>

            <div className="space-y-4">
              <div className="flex items-center">
                <input
                  type="checkbox"
                  checked={cancelAtPeriodEnd}
                  onChange={(e) => setCancelAtPeriodEnd(e.target.checked)}
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                />
                <label className="ml-2 block text-sm text-gray-900">
                  Cancel at period end
                </label>
              </div>

              <p className="text-sm text-gray-500">
                {cancelAtPeriodEnd
                  ? "The subscription will remain active until the end of the current billing period."
                  : "The subscription will be canceled immediately and no further charges will be made."}
              </p>

              <div className="flex justify-end space-x-2">
                <button
                  onClick={() => setIsCancelModalOpen(false)}
                  className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  onClick={handleCancelSubscription}
                  className="px-4 py-2 text-sm font-medium text-white bg-red-600 border border-transparent rounded-md hover:bg-red-700"
                >
                  Confirm Cancellation
                </button>
              </div>
            </div>
          </div>
        </div>
      </Dialog>
    </div>
  );
}
