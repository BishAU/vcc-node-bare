import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FiUsers, FiCalendar, FiShoppingBag, FiBook } from 'react-icons/fi';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';
import { PageLayout } from '../components/layout/PageLayout';
import { sharedStyles } from '../styles/shared';

// Mock data
const chartData = [
  { name: 'Jan', value: 400 },
  { name: 'Feb', value: 300 },
  { name: 'Mar', value: 600 },
  { name: 'Apr', value: 800 },
  { name: 'May', value: 700 },
  { name: 'Jun', value: 900 },
];

const stats = [
  {
    title: 'Total Users',
    value: '1,234',
    change: '+12%',
    changeType: 'positive',
    icon: <FiUsers className="w-6 h-6 text-purple-400" />,
  },
  {
    title: 'Active Events',
    value: '23',
    change: '+5%',
    changeType: 'positive',
    icon: <FiCalendar className="w-6 h-6 text-purple-400" />,
  },
  {
    title: 'Total Orders',
    value: '845',
    change: '+18%',
    changeType: 'positive',
    icon: <FiShoppingBag className="w-6 h-6 text-purple-400" />,
  },
  {
    title: 'Resources',
    value: '156',
    change: '+8%',
    changeType: 'positive',
    icon: <FiBook className="w-6 h-6 text-purple-400" />,
  },
];

const Dashboard: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();

  return (
    <PageLayout title="Dashboard">
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

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className={sharedStyles.card}
        >
          <h2 className={sharedStyles.cardHeader}>User Growth</h2>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                <XAxis
                  dataKey="name"
                  stroke="#9CA3AF"
                  tick={{ fill: '#9CA3AF' }}
                />
                <YAxis stroke="#9CA3AF" tick={{ fill: '#9CA3AF' }} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#1F2937',
                    border: '1px solid #374151',
                  }}
                  labelStyle={{ color: '#9CA3AF' }}
                />
                <Line
                  type="monotone"
                  dataKey="value"
                  stroke="#8B5CF6"
                  strokeWidth={2}
                  dot={{ fill: '#8B5CF6', strokeWidth: 2 }}
                  activeDot={{ r: 8 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className={sharedStyles.card}
        >
          <h2 className={sharedStyles.cardHeader}>Quick Actions</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <button
              onClick={() => navigate('/dashboard/orders')}
              className={`${sharedStyles.card} hover:bg-purple-700/50 transition-colors text-left`}
            >
              <FiShoppingBag className="w-6 h-6 text-purple-400 mb-2" />
              <h3 className={sharedStyles.subheading}>View Orders</h3>
              <p className={`${sharedStyles.text} text-sm`}>Manage your recent orders</p>
            </button>
            <button
              onClick={() => navigate('/dashboard/products')}
              className={`${sharedStyles.card} hover:bg-purple-700/50 transition-colors text-left`}
            >
              <FiBook className="w-6 h-6 text-purple-400 mb-2" />
              <h3 className={sharedStyles.subheading}>Products</h3>
              <p className={`${sharedStyles.text} text-sm`}>View and manage products</p>
            </button>
            <button
              onClick={() => navigate('/dashboard/events')}
              className={`${sharedStyles.card} hover:bg-purple-700/50 transition-colors text-left`}
            >
              <FiCalendar className="w-6 h-6 text-purple-400 mb-2" />
              <h3 className={sharedStyles.subheading}>Schedule Event</h3>
              <p className={`${sharedStyles.text} text-sm`}>Create a new event</p>
            </button>
            <button
              onClick={() => navigate('/dashboard/settings')}
              className={`${sharedStyles.card} hover:bg-purple-700/50 transition-colors text-left`}
            >
              <FiUsers className="w-6 h-6 text-purple-400 mb-2" />
              <h3 className={sharedStyles.subheading}>User Management</h3>
              <p className={`${sharedStyles.text} text-sm`}>Manage user accounts</p>
            </button>
          </div>
        </motion.div>
      </div>
    </PageLayout>
  );
};

export default Dashboard;
