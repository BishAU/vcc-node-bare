import React, { useState } from 'react';
import { PageWrapper } from '../components/layout/PageWrapper';
import { AddOrderModal } from '../components/orders/AddOrderModal';
import { sharedStyles, combineClasses } from '../styles/shared';

interface Order {
  id: string;
  orderNumber: string;
  customerName: string;
  customerEmail: string;
  products: Array<{
    productId: string;
    quantity: number;
    price: number;
  }>;
  totalAmount: number;
  status: 'pending' | 'processing' | 'completed' | 'cancelled';
  orderDate: string;
  shippingAddress: string;
  paymentMethod: string;
  notes?: string;
}

const mockProducts = [
  { id: '1', name: 'Product 1', price: 99.99 },
  { id: '2', name: 'Product 2', price: 149.99 },
  { id: '3', name: 'Product 3', price: 199.99 },
];

export const Orders = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  const handleAddOrder = (newOrder: Omit<Order, 'id' | 'orderNumber' | 'orderDate'>) => {
    const order: Order = {
      ...newOrder,
      id: crypto.randomUUID(),
      orderNumber: `ORD-${Date.now()}`,
      orderDate: new Date().toISOString(),
    };
    setOrders(prev => [...prev, order]);
  };

  const getStatusBadgeClass = (status: Order['status']) => {
    switch (status) {
      case 'pending':
        return sharedStyles.badge.yellow;
      case 'processing':
        return sharedStyles.badge.blue;
      case 'completed':
        return sharedStyles.badge.green;
      case 'cancelled':
        return sharedStyles.badge.red;
      default:
        return sharedStyles.badge.default;
    }
  };

  return (
    <PageWrapper title="Orders">
      <div className="mb-6 flex justify-between items-center">
        <h1 className={sharedStyles.text.h1}>Orders</h1>
        <button
          onClick={() => setIsAddModalOpen(true)}
          className={combineClasses(sharedStyles.button.base, sharedStyles.button.primary)}
        >
          Add Order
        </button>
      </div>

      <div className={sharedStyles.card.container}>
        <table className={sharedStyles.table.base}>
          <thead>
            <tr>
              <th className={sharedStyles.table.th}>Order Number</th>
              <th className={sharedStyles.table.th}>Customer</th>
              <th className={sharedStyles.table.th}>Products</th>
              <th className={sharedStyles.table.th}>Total</th>
              <th className={sharedStyles.table.th}>Status</th>
              <th className={sharedStyles.table.th}>Order Date</th>
              <th className={sharedStyles.table.th}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {orders.map((order) => (
              <tr key={order.id} className={sharedStyles.table.tr}>
                <td className={sharedStyles.table.td}>
                  <div className="font-medium">{order.orderNumber}</div>
                </td>
                <td className={sharedStyles.table.td}>
                  <div>
                    <div className="font-medium">{order.customerName}</div>
                    <div className="text-sm text-gray-400">{order.customerEmail}</div>
                  </div>
                </td>
                <td className={sharedStyles.table.td}>
                  <div className="space-y-1">
                    {order.products.map((product, index) => {
                      const productInfo = mockProducts.find(p => p.id === product.productId);
                      return (
                        <div key={index} className="text-sm">
                          {productInfo?.name} x {product.quantity}
                        </div>
                      );
                    })}
                  </div>
                </td>
                <td className={sharedStyles.table.td}>
                  <div className="font-medium">${order.totalAmount.toFixed(2)}</div>
                </td>
                <td className={sharedStyles.table.td}>
                  <span className={getStatusBadgeClass(order.status)}>
                    {order.status}
                  </span>
                </td>
                <td className={sharedStyles.table.td}>
                  <div>
                    <div>{new Date(order.orderDate).toLocaleDateString()}</div>
                    <div className="text-sm text-gray-400">
                      {new Date(order.orderDate).toLocaleTimeString()}
                    </div>
                  </div>
                </td>
                <td className={sharedStyles.table.td}>
                  <div className="flex space-x-2">
                    <button
                      className={combineClasses(sharedStyles.button.base, sharedStyles.button.ghost)}
                      onClick={() => {/* TODO: Implement edit */}}
                    >
                      Edit
                    </button>
                    <button
                      className={combineClasses(sharedStyles.button.base, sharedStyles.button.danger)}
                      onClick={() => {/* TODO: Implement delete */}}
                    >
                      Delete
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <AddOrderModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onAdd={handleAddOrder}
        availableProducts={mockProducts}
      />
    </PageWrapper>
  );
};

export default Orders;
