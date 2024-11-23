import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { getDb } from '../../lib/db';
import type { Order } from '../../lib/api/types';

export function OrderList() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);

  useEffect(() => {
    loadOrders();
  }, []);

  async function loadOrders() {
    const db = await getDb();
    const orders = await db.orders
      .orderBy('createdAt')
      .reverse()
      .toArray();
    setOrders(orders);
  }

  function handleViewDetails(order: Order) {
    setSelectedOrder(order);
    setIsDetailsOpen(true);
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-900">Orders</h2>
      </div>

      <div className="bg-white shadow overflow-hidden sm:rounded-lg">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th
                scope="col"
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                Order ID
              </th>
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
                Amount
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
                Date
              </th>
              <th scope="col" className="relative px-6 py-3">
                <span className="sr-only">Actions</span>
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {orders.map((order) => (
              <motion.tr
                key={order.id}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
              >
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                  {order.id.slice(0, 8)}...
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {order.userId}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  ${(order.amount / 100).toFixed(2)}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span
                    className={`px-2 py-1 text-xs rounded-full ${
                      order.status === 'completed'
                        ? 'bg-green-100 text-green-800'
                        : order.status === 'pending'
                        ? 'bg-yellow-100 text-yellow-800'
                        : 'bg-red-100 text-red-800'
                    }`}
                  >
                    {order.status}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {new Date(order.createdAt).toLocaleDateString()}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <button
                    onClick={() => handleViewDetails(order)}
                    className="text-blue-600 hover:text-blue-900"
                  >
                    View Details
                  </button>
                </td>
              </motion.tr>
            ))}
          </tbody>
        </table>
      </div>

      {isDetailsOpen && selectedOrder && (
        <div className="fixed inset-0 z-10 overflow-y-auto">
          <div className="flex items-center justify-center min-h-screen">
            <div
              className="fixed inset-0 bg-black opacity-30"
              onClick={() => setIsDetailsOpen(false)}
            ></div>

            <div className="relative bg-white rounded-lg max-w-lg w-full mx-4 p-6">
              <h3 className="text-lg font-medium text-gray-900 mb-4">
                Order Details
              </h3>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Order ID
                  </label>
                  <p className="mt-1 text-sm text-gray-900">{selectedOrder.id}</p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    User ID
                  </label>
                  <p className="mt-1 text-sm text-gray-900">
                    {selectedOrder.userId}
                  </p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Product ID
                  </label>
                  <p className="mt-1 text-sm text-gray-900">
                    {selectedOrder.productId}
                  </p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Amount
                  </label>
                  <p className="mt-1 text-sm text-gray-900">
                    ${(selectedOrder.amount / 100).toFixed(2)}
                  </p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Status
                  </label>
                  <p className="mt-1 text-sm text-gray-900">
                    {selectedOrder.status}
                  </p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Created At
                  </label>
                  <p className="mt-1 text-sm text-gray-900">
                    {new Date(selectedOrder.createdAt).toLocaleString()}
                  </p>
                </div>

                {selectedOrder.xeroInvoiceId && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Xero Invoice ID
                    </label>
                    <p className="mt-1 text-sm text-gray-900">
                      {selectedOrder.xeroInvoiceId}
                    </p>
                  </div>
                )}

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
    </div>
  );
}
