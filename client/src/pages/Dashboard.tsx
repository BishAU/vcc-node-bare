import React, { useState } from 'react';
import { PageWrapper } from '../components/layout/PageWrapper';
import { sharedStyles, combineClasses } from '../styles/shared';
import { FiUsers, FiCalendar, FiShoppingBag, FiBook } from 'react-icons/fi';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate, Outlet, useLocation } from 'react-router-dom';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';
import EventsManager from '../components/admin/EventsManager';
import ResourcesManager from '../components/admin/ResourcesManager';

// Mock data for the dashboard
const chartData = [
  { name: 'Jan', value: 400 },
  { name: 'Feb', value: 300 },
  { name: 'Mar', value: 600 },
  { name: 'Apr', value: 800 },
  { name: 'May', value: 700 },
  { name: 'Jun', value: 900 },
];

const stats = [
  { title: 'Total Subscribers', value: '1,200', change: '+12%', changeType: 'positive' },
  { title: 'Active Users', value: '850', change: '+18%', changeType: 'positive' },
  { title: 'Revenue', value: '$48,500', change: '+8%', changeType: 'positive' },
  { title: 'Churn Rate', value: '3.2%', change: '-2%', changeType: 'positive' },
];

const recentActivity = [
  { id: 1, type: 'New Subscription', user: 'John Doe', date: '2 hours ago' },
  { id: 2, type: 'Upgrade', user: 'Jane Smith', date: '4 hours ago' },
  { id: 3, type: 'Cancellation', user: 'Mike Johnson', date: '1 day ago' },
];

const subscriptionPlans = [
  { id: 1, name: 'Basic Plan', subscriptions: 150, revenue: '$7,500', growth: '+5%' },
  { id: 2, name: 'Pro Plan', subscriptions: 75, revenue: '$14,925', growth: '+8%' },
  { id: 3, name: 'Enterprise', subscriptions: 25, revenue: '$12,475', growth: '+15%' },
];

const revenueData = [
  { month: 'Feb 2023', revenue: 85000, orders: 400 },
  { month: 'Apr 2023', revenue: 87000, orders: 380 },
  { month: 'June 2023', revenue: 89000, orders: 360 },
  { month: 'Aug 2023', revenue: 91000, orders: 340 },
  { month: 'Oct 2023', revenue: 93000, orders: 320 },
  { month: 'Dec 2023', revenue: 95000, orders: 300 },
  { month: 'Feb 2024', revenue: 97000, orders: 280 },
];

const productPerformanceData = [
  { name: 'Basic Plan', revenue: 45000, subscriptions: 150 },
  { name: 'Pro Plan', revenue: 75000, subscriptions: 75 },
  { name: 'Enterprise', revenue: 125000, subscriptions: 25 },
];

const recentOrders = [
  { id: 1, customer: 'John Doe', product: 'Basic Plan', date: '2024-02-15', amount: '$99.00', status: 'completed' },
  { id: 2, customer: 'Jane Smith', product: 'Pro Plan', date: '2024-02-14', amount: '$199.00', status: 'pending' },
  { id: 3, customer: 'Bob Johnson', product: 'Enterprise', date: '2024-02-13', amount: '$499.00', status: 'completed' },
];

const topProducts = [
  { id: 1, name: 'Basic Plan', subscriptions: 150, revenue: '$14,850', growth: '+12%' },
  { id: 2, name: 'Pro Plan', subscriptions: 75, revenue: '$14,925', growth: '+8%' },
  { id: 3, name: 'Enterprise', subscriptions: 25, revenue: '$12,475', growth: '+15%' },
];

const detailedOrders = [
  { id: 1, customer: 'John Doe', product: 'Basic Plan', date: '2024-02-15', amount: '$99.00', status: 'completed', email: 'john@example.com', location: 'Melbourne, VIC' },
  { id: 2, customer: 'Jane Smith', product: 'Pro Plan', date: '2024-02-14', amount: '$199.00', status: 'pending', email: 'jane@example.com', location: 'Sydney, NSW' },
  { id: 3, customer: 'Bob Johnson', product: 'Enterprise', date: '2024-02-13', amount: '$499.00', status: 'completed', email: 'bob@example.com', location: 'Brisbane, QLD' },
  { id: 4, customer: 'Alice Brown', product: 'Basic Plan', date: '2024-02-12', amount: '$99.00', status: 'completed', email: 'alice@example.com', location: 'Perth, WA' },
  { id: 5, customer: 'Charlie Wilson', product: 'Pro Plan', date: '2024-02-11', amount: '$199.00', status: 'pending', email: 'charlie@example.com', location: 'Adelaide, SA' },
  { id: 6, customer: 'Diana Miller', product: 'Enterprise', date: '2024-02-10', amount: '$499.00', status: 'completed', email: 'diana@example.com', location: 'Hobart, TAS' },
  { id: 7, customer: 'Edward Davis', product: 'Basic Plan', date: '2024-02-09', amount: '$99.00', status: 'pending', email: 'edward@example.com', location: 'Darwin, NT' },
  { id: 8, customer: 'Frank White', product: 'Pro Plan', date: '2024-02-08', amount: '$199.00', status: 'completed', email: 'frank@example.com', location: 'Canberra, ACT' },
];

const detailedProducts = [
  { id: 1, name: 'Basic Plan', subscriptions: 150, revenue: '$14,850', growth: '+12%', activeUsers: 142, churnRate: '2.1%', avgUserAge: 35 },
  { id: 2, name: 'Pro Plan', subscriptions: 75, revenue: '$14,925', growth: '+8%', activeUsers: 70, churnRate: '1.8%', avgUserAge: 42 },
  { id: 3, name: 'Enterprise', subscriptions: 25, revenue: '$12,475', growth: '+15%', activeUsers: 24, churnRate: '0.9%', avgUserAge: 45 },
  { id: 4, name: 'Student Plan', subscriptions: 200, revenue: '$9,800', growth: '+20%', activeUsers: 185, churnRate: '3.2%', avgUserAge: 22 },
  { id: 5, name: 'Family Plan', subscriptions: 90, revenue: '$13,500', growth: '+10%', activeUsers: 85, churnRate: '2.0%', avgUserAge: 38 },
  { id: 6, name: 'Senior Plan', subscriptions: 45, revenue: '$6,750', growth: '+5%', activeUsers: 42, churnRate: '1.5%', avgUserAge: 65 },
  { id: 7, name: 'Nonprofit Plan', subscriptions: 30, revenue: '$4,500', growth: '+7%', activeUsers: 28, churnRate: '1.2%', avgUserAge: 40 },
  { id: 8, name: 'Government Plan', subscriptions: 15, revenue: '$7,500', growth: '+3%', activeUsers: 15, churnRate: '0.5%', avgUserAge: 47 },
];

const Dashboard: React.FC = () => {
  const [activeTab, setActiveTab] = useState('overview');
  const [isAdmin] = useState(true); // TODO: Replace with actual auth check
  const [currentOrdersPage, setCurrentOrdersPage] = useState(0);
  const [currentProductsPage, setCurrentProductsPage] = useState(0);
  const itemsPerPage = 5;
  const navigate = useNavigate();
  const location = useLocation();
  const isDashboardIndex = location.pathname === '/dashboard';

  const handleTabClick = (tabId: string) => {
    switch (tabId) {
      case 'orders':
        navigate('/dashboard/orders');
        break;
      case 'products':
        navigate('/dashboard/products');
        break;
      default:
        setActiveTab(tabId);
    }
  };

  const renderTabContent = () => {
    switch (activeTab) {
      case 'overview':
        return (
          <div className="space-y-6">
            {/* Overview Stats */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              {stats.map((stat) => (
                <div key={stat.title} className={combineClasses(
                  sharedStyles.card,
                  'transform hover:scale-105 transition-transform duration-200'
                )}>
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-gray-400 text-sm">{stat.title}</p>
                      <p className="text-2xl font-bold text-white mt-2">{stat.value}</p>
                      <span className={combineClasses(
                        'text-sm mt-2 inline-block',
                        stat.changeType === 'positive' ? 'text-green-400' : 'text-red-400'
                      )}>
                        {stat.change} from last month
                      </span>
                    </div>
                    <div className="bg-gray-700 p-3 rounded-xl">
                      {/* Icon can be added here */}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Recent Orders Summary */}
            <div className={sharedStyles.card}>
              <h2 className={sharedStyles.cardHeader}>Recent Orders</h2>
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead>
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Customer
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Product
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Amount
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Status
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {recentOrders.map((order) => (
                      <tr key={order.id} className="hover:bg-gray-50 cursor-pointer" onClick={() => navigate('/dashboard/orders')}>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                          {order.customer}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {order.product}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {order.amount}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm">
                          <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                            order.status === 'completed' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                          }`}>
                            {order.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Top Products Summary */}
            <div className={sharedStyles.card}>
              <h2 className={sharedStyles.cardHeader}>Top Products</h2>
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead>
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Product
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Subscriptions
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Revenue
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Growth
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {topProducts.map((product) => (
                      <tr key={product.id} className="hover:bg-gray-50 cursor-pointer" onClick={() => navigate('/dashboard/products')}>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                          {product.name}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {product.subscriptions}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {product.revenue}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-green-600">
                          {product.growth}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Chart */}
            <div className={sharedStyles.card}>
              <h2 className={sharedStyles.cardHeader}>Revenue Overview</h2>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={chartData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Line
                      type="monotone"
                      dataKey="value"
                      stroke="#4F46E5"
                      strokeWidth={2}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Recent Activity */}
            <div className={sharedStyles.card}>
              <h2 className={sharedStyles.cardHeader}>Recent Activity</h2>
              <div className="space-y-4">
                {recentActivity.map((activity, activityIdx) => (
                  <div key={activity.id} className="flex items-center justify-between p-4 bg-gray-700/50 rounded-xl">
                    <div className="flex items-center gap-4">
                      <div className="bg-blue-500/20 p-2 rounded-lg">
                        {/* Icon can be added here */}
                      </div>
                      <div>
                        <p className="text-white font-medium">{activity.type} by {activity.user}</p>
                        <p className="text-sm text-gray-400">{activity.date}</p>
                      </div>
                    </div>
                    <span className="text-sm text-gray-400">{activity.date}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Subscription Plans */}
            <div className={sharedStyles.card}>
              <h2 className={sharedStyles.cardHeader}>Subscription Plans</h2>
              <div className="mt-4">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead>
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Plan
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Subscriptions
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Revenue
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Growth
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {subscriptionPlans.map((plan) => (
                      <tr key={plan.id}>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                          {plan.name}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {plan.subscriptions}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {plan.revenue}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-green-600">
                          {plan.growth}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        );
      case 'orders':
        const orderStart = currentOrdersPage * itemsPerPage;
        const currentOrders = detailedOrders.slice(orderStart, orderStart + itemsPerPage);
        
        return (
          <div className="space-y-6">
            <div className={sharedStyles.card}>
              <h2 className={sharedStyles.cardHeader}>Detailed Orders Summary</h2>
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead>
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Customer
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Email
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Location
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Product
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Amount
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Date
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Status
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {currentOrders.map((order) => (
                      <tr key={order.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                          {order.customer}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {order.email}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {order.location}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {order.product}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {order.amount}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {order.date}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm">
                          <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                            order.status === 'completed' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                          }`}>
                            {order.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <div className="mt-4 flex justify-center">
                <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px">
                  {Array.from({ length: Math.ceil(detailedOrders.length / itemsPerPage) }).map((_, index) => (
                    <button
                      key={index}
                      onClick={() => setCurrentOrdersPage(index)}
                      className={`relative inline-flex items-center px-4 py-2 border text-sm font-medium ${
                        currentOrdersPage === index
                          ? 'z-10 bg-[#1e3a8a] border-[#1e3a8a] text-white'
                          : 'bg-white border-gray-300 text-gray-500 hover:bg-gray-50'
                      }`}
                    >
                      {index + 1}
                    </button>
                  ))}
                </nav>
              </div>
            </div>
          </div>
        );
      
      case 'products':
        const productStart = currentProductsPage * itemsPerPage;
        const currentProducts = detailedProducts.slice(productStart, productStart + itemsPerPage);
        
        return (
          <div className="space-y-6">
            <div className={sharedStyles.card}>
              <h2 className={sharedStyles.cardHeader}>Detailed Products Summary</h2>
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead>
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Product
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Subscriptions
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Active Users
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Revenue
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Growth
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Churn Rate
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Avg User Age
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {currentProducts.map((product) => (
                      <tr key={product.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                          {product.name}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {product.subscriptions}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {product.activeUsers}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {product.revenue}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-green-600">
                          {product.growth}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {product.churnRate}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {product.avgUserAge}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <div className="mt-4 flex justify-center">
                <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px">
                  {Array.from({ length: Math.ceil(detailedProducts.length / itemsPerPage) }).map((_, index) => (
                    <button
                      key={index}
                      onClick={() => setCurrentProductsPage(index)}
                      className={`relative inline-flex items-center px-4 py-2 border text-sm font-medium ${
                        currentProductsPage === index
                          ? 'z-10 bg-[#1e3a8a] border-[#1e3a8a] text-white'
                          : 'bg-white border-gray-300 text-gray-500 hover:bg-gray-50'
                      }`}
                    >
                      {index + 1}
                    </button>
                  ))}
                </nav>
              </div>
            </div>
          </div>
        );
      
      case 'events':
        return <EventsManager />;
      case 'resources':
        return <ResourcesManager />;
      case 'analytics':
        return (
          <div className="space-y-6">
            {/* Analytics content */}
            <div className={sharedStyles.card}>
              <h2 className={sharedStyles.cardHeader}>Analytics Overview</h2>
              <p className="text-gray-500">Detailed analytics coming soon...</p>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  const tabs = [
    { id: 'overview', label: 'Overview' },
    { id: 'orders', label: 'Orders' },
    { id: 'products', label: 'Products' },
    { id: 'analytics', label: 'Analytics' },
    ...(isAdmin ? [
      { id: 'events', label: 'Events' },
      { id: 'resources', label: 'Resources' },
    ] : []),
  ];

  if (!isDashboardIndex) {
    return <Outlet />;
  }

  return (
    <PageWrapper>
      <div className={sharedStyles.pageContainer}>
        <div className={sharedStyles.contentWrapper}>
          <h1 className={sharedStyles.heading}>Dashboard</h1>
          <div className="border-b border-gray-200">
            <nav className="-mb-px flex space-x-8">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => handleTabClick(tab.id)}
                  className={`
                    whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm
                    ${activeTab === tab.id
                      ? 'border-[#1e3a8a] text-[#1e3a8a]'
                      : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700'
                    }
                  `}
                >
                  {tab.label}
                </button>
              ))}
            </nav>
          </div>
          <div className="py-4">
            {renderTabContent()}
          </div>
        </div>
      </div>
    </PageWrapper>
  );
};

export default Dashboard;
