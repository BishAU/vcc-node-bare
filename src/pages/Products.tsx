import React from 'react';
import { motion } from 'framer-motion';
import { FiPackage, FiDollarSign, FiTrendingUp, FiShoppingCart } from 'react-icons/fi';
import { PageLayout } from '../components/layout/PageLayout';
import { sharedStyles } from '../styles/shared';

const products = [
  { id: 1, name: 'Basic Plan', price: '$99.00', status: 'active', sales: '150', inventory: 'Unlimited', category: 'Subscription' },
  { id: 2, name: 'Pro Plan', price: '$199.00', status: 'active', sales: '89', inventory: 'Unlimited', category: 'Subscription' },
  { id: 3, name: 'Enterprise Plan', price: '$499.00', status: 'active', sales: '34', inventory: 'Unlimited', category: 'Subscription' },
  { id: 4, name: 'Training Course A', price: '$149.00', status: 'active', sales: '67', inventory: '100', category: 'Course' },
  { id: 5, name: 'Training Course B', price: '$199.00', status: 'active', sales: '45', inventory: '100', category: 'Course' },
];

const stats = [
  {
    title: 'Total Products',
    value: '24',
    change: '+4',
    icon: <FiPackage className="w-6 h-6 text-purple-400" />,
  },
  {
    title: 'Total Revenue',
    value: '$48,500',
    change: '+12%',
    icon: <FiDollarSign className="w-6 h-6 text-purple-400" />,
  },
  {
    title: 'Sales Growth',
    value: '+24%',
    change: '+5%',
    icon: <FiTrendingUp className="w-6 h-6 text-purple-400" />,
  },
  {
    title: 'Active Sales',
    value: '385',
    change: '+8%',
    icon: <FiShoppingCart className="w-6 h-6 text-purple-400" />,
  },
];

const Products: React.FC = () => {
  return (
    <PageLayout title="Products">
      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
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

      {/* Products Table */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className={sharedStyles.card}
      >
        <div className="px-6 py-4 border-b border-gray-700 flex justify-between items-center">
          <h2 className={sharedStyles.cardHeader}>Products</h2>
          <button className={`${sharedStyles.button.base} ${sharedStyles.button.primary}`}>
            Add Product
          </button>
        </div>
        <div className={sharedStyles.table.wrapper}>
          <table className={sharedStyles.table.base}>
            <thead className={sharedStyles.table.header}>
              <tr>
                <th className={sharedStyles.table.headerCell}>Name</th>
                <th className={sharedStyles.table.headerCell}>Category</th>
                <th className={sharedStyles.table.headerCell}>Price</th>
                <th className={sharedStyles.table.headerCell}>Status</th>
                <th className={sharedStyles.table.headerCell}>Sales</th>
                <th className={sharedStyles.table.headerCell}>Inventory</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-700">
              {products.map((product) => (
                <tr key={product.id} className={sharedStyles.table.row}>
                  <td className={sharedStyles.table.cell}>
                    <div className="font-medium text-white">{product.name}</div>
                  </td>
                  <td className={sharedStyles.table.cell}>
                    {product.category}
                  </td>
                  <td className={sharedStyles.table.cell}>
                    {product.price}
                  </td>
                  <td className={sharedStyles.table.cell}>
                    <span className={sharedStyles.badge.success}>
                      {product.status}
                    </span>
                  </td>
                  <td className={sharedStyles.table.cell}>
                    {product.sales}
                  </td>
                  <td className={sharedStyles.table.cell}>
                    {product.inventory}
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

export default Products;
