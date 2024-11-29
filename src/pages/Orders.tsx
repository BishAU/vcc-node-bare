import React from 'react';
import { motion } from 'framer-motion';
import { FiShoppingBag, FiDollarSign, FiTrendingUp, FiUsers } from 'react-icons/fi';
import { PageLayout } from '../components/layout/PageLayout';
import { sharedStyles } from '../styles/shared';

const recentOrders = [
  { id: 1, customer: 'John Doe', product: 'Basic Plan', date: '2024-02-15', amount: '$99.00', status: 'completed', email: 'john@example.com', location: 'Melbourne, VIC' },
  { id: 2, customer: 'Jane Smith', product: 'Pro Plan', date: '2024-02-14', amount: '$199.00', status: 'pending', email: 'jane@example.com', location: 'Sydney, NSW' },
  { id: 3, customer: 'Bob Johnson', product: 'Enterprise', date: '2024-02-13', amount: '$499.00', status: 'completed', email: 'bob@example.com', location: 'Brisbane, QLD' },
  { id: 4, customer: 'Alice Brown', product: 'Basic Plan', date: '2024-02-12', amount: '$99.00', status: 'completed', email: 'alice@example.com', location: 'Perth, WA' },
  { id: 5, customer: 'Charlie Wilson', product: 'Pro Plan', date: '2024-02-11', amount: '$199.00', status: 'pending', email: 'charlie@example.com', location: 'Adelaide, SA' },
];

const stats = [
  {
    title: 'Total Orders',
    value: '845',
    change: '+18%',
    icon: <FiShoppingBag className="w-6 h-6 text-purple-400" />,
  },
  {
    title: 'Revenue',
    value: '$48,500',
    change: '+12%',
    icon: <FiDollarSign className="w-6 h-6 text-purple-400" />,
  },
  {
    title: 'Growth',
    value: '+24%',
    change: '+5%',
    icon: <FiTrendingUp className="w-6 h-6 text-purple-400" />,
  },
  {
    title: 'Active Customers',
    value: '420',
    change: '+8%',
    icon: <FiUsers className="w-6 h-6 text-purple-400" />,
  },
];

const Orders: React.FC = () => {
  return (
    <PageLayout title="Orders">
      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
        {stats.map((stat, index) => (
          <motion.div
            key={stat.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className={`${sharedStyles.card} hover:border-purple-600/50 transition-colors`}
          >
            <div className="flex items-center justify-between">
              <div>
                <p className={`${sharedStyles.text} text-sm`}>{stat.title}</p>
                <p className={sharedStyles.value.revenue}>{stat.value}</p>
                <span className={sharedStyles.value.growth.positive}>
                  {stat.change} from last month
                </span>
              </div>
              <div className="bg-purple-700/30 p-3 rounded-xl">
                {stat.icon}
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Orders Table */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className={sharedStyles.card}
      >
        <div className="px-6 py-4 border-b border-gray-700">
          <h2 className={sharedStyles.cardHeader}>Recent Orders</h2>
        </div>
        <div className={sharedStyles.table.wrapper}>
          <table className={sharedStyles.table.base}>
            <thead className={sharedStyles.table.header}>
              <tr>
                <th className={sharedStyles.table.headerCell}>Customer</th>
                <th className={sharedStyles.table.headerCell}>Product</th>
                <th className={sharedStyles.table.headerCell}>Amount</th>
                <th className={sharedStyles.table.headerCell}>Date</th>
                <th className={sharedStyles.table.headerCell}>Status</th>
                <th className={sharedStyles.table.headerCell}>Location</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-700">
              {recentOrders.map((order) => (
                <tr key={order.id} className={sharedStyles.table.row}>
                  <td className={sharedStyles.table.cell}>
                    <div>
                      <div className="font-medium text-white">{order.customer}</div>
                      <div className="text-sm text-gray-400">{order.email}</div>
                    </div>
                  </td>
                  <td className={sharedStyles.table.cell}>
                    {order.product}
                  </td>
                  <td className={sharedStyles.table.cell}>
                    {order.amount}
                  </td>
                  <td className={sharedStyles.table.cell}>
                    {order.date}
                  </td>
                  <td className={sharedStyles.table.cell}>
                    <span className={
                      order.status === 'completed'
                        ? sharedStyles.badge.success
                        : sharedStyles.badge.secondary
                    }>
                      {order.status}
                    </span>
                  </td>
                  <td className={sharedStyles.table.cell}>
                    {order.location}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </motion.div>
    </PageLayout>
  );
};

export default Orders;
