import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  BarChart,
  Bar,
  ResponsiveContainer
} from 'recharts';

interface Product {
  id: number;
  name: string;
  price: string;
  subscriptions: number;
  revenue: string;
  active: boolean;
}

interface Coupon {
  id: number;
  code: string;
  discountType: 'percentage' | 'fixed';
  discountValue: number;
  expiryDate: string;
  maxUses: number;
  currentUses: number;
  active: boolean;
}

// Mock data for the charts
const employmentData = [
  { month: 'Feb 2023', employed: 8500, unemployed: 400 },
  { month: 'Apr 2023', employed: 8700, unemployed: 380 },
  { month: 'June 2023', employed: 8900, unemployed: 360 },
  { month: 'Aug 2023', employed: 9100, unemployed: 340 },
  { month: 'Oct 2023', employed: 9300, unemployed: 320 },
  { month: 'Dec 2023', employed: 9500, unemployed: 300 },
  { month: 'Feb 2024', employed: 9700, unemployed: 280 },
  { month: 'Apr 2024', employed: 9900, unemployed: 260 },
  { month: 'June 2024', employed: 10100, unemployed: 240 },
  { month: 'Aug 2024', employed: 10300, unemployed: 220 },
  { month: 'Nov 2024', employed: 10500, unemployed: 200 },
];

const regionalData = [
  { name: 'NSW-HN', employed: 9500, unemployed: 300 },
];

// Mock data for products and coupons
const initialProducts = [
  { id: 1, name: 'Basic Plan', price: '$99/month', subscriptions: 150, revenue: '$14,850', active: true },
  { id: 2, name: 'Pro Plan', price: '$199/month', subscriptions: 75, revenue: '$14,925', active: true },
  { id: 3, name: 'Enterprise Plan', price: '$499/month', subscriptions: 25, revenue: '$12,475', active: false },
];

const initialCoupons = [
  {
    id: 1,
    code: 'WELCOME2024',
    discountType: 'percentage',
    discountValue: 20,
    expiryDate: '2024-12-31',
    maxUses: 100,
    currentUses: 45,
    active: true
  },
  {
    id: 2,
    code: 'SAVE50',
    discountType: 'fixed',
    discountValue: 50,
    expiryDate: '2024-06-30',
    maxUses: 200,
    currentUses: 98,
    active: true
  }
];

const Dashboard = () => {
  const [selectedState, setSelectedState] = useState('New South Wales');
  const [selectedRegion, setSelectedRegion] = useState('Hunter');
  const [startDate, setStartDate] = useState('2023-01-01');
  const [endDate, setEndDate] = useState('2024-11-21');
  const [products, setProducts] = useState(initialProducts);
  const [coupons, setCoupons] = useState(initialCoupons);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [editingCoupon, setEditingCoupon] = useState<Coupon | null>(null);
  const [showEditProductModal, setShowEditProductModal] = useState(false);
  const [showEditCouponModal, setShowEditCouponModal] = useState(false);

  const handleToggleProductActive = (productId: number) => {
    setProducts(products.map(product => 
      product.id === productId 
        ? { ...product, active: !product.active }
        : product
    ));
  };

  const handleToggleCouponActive = (couponId: number) => {
    setCoupons(coupons.map(coupon => 
      coupon.id === couponId 
        ? { ...coupon, active: !coupon.active }
        : coupon
    ));
  };

  const handleEditProduct = (product: Product) => {
    setEditingProduct(product);
    setShowEditProductModal(true);
  };

  const handleEditCoupon = (coupon: Coupon) => {
    setEditingCoupon(coupon);
    setShowEditCouponModal(true);
  };

  const handleDeleteProduct = (productId: number) => {
    if (window.confirm('Are you sure you want to delete this product? This action cannot be undone.')) {
      setProducts(products.filter(product => product.id !== productId));
    }
  };

  const handleDeleteCoupon = (couponId: number) => {
    if (window.confirm('Are you sure you want to delete this coupon? This action cannot be undone.')) {
      setCoupons(coupons.filter(coupon => coupon.id !== couponId));
    }
  };

  const handleSaveProduct = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingProduct) {
      setProducts(products.map(product =>
        product.id === editingProduct.id ? editingProduct : product
      ));
      setShowEditProductModal(false);
      setEditingProduct(null);
    }
  };

  const handleSaveCoupon = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingCoupon) {
      setCoupons(coupons.map(coupon =>
        coupon.id === editingCoupon.id ? editingCoupon : coupon
      ));
      setShowEditCouponModal(false);
      setEditingCoupon(null);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 pt-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Regional Employment Dashboard</h1>
            <p className="mt-1 text-sm text-gray-500">
              Analyze employment trends across Australian regions
            </p>
          </div>
          <div className="space-x-4">
            <Link
              to="/ecommerce"
              className="inline-flex items-center px-6 py-3 text-base border border-transparent rounded-md shadow-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 transition-colors duration-200 min-w-[200px] justify-center"
            >
              E-commerce Management
            </Link>
          </div>
        </div>

        {/* Data Selection */}
        <div className="bg-white rounded-lg shadow p-6 mb-8">
          <h2 className="text-xl font-semibold mb-4">Data Selection</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700">State</label>
              <select
                value={selectedState}
                onChange={(e) => setSelectedState(e.target.value)}
                className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
              >
                <option>New South Wales</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Region (Optional)</label>
              <select
                value={selectedRegion}
                onChange={(e) => setSelectedRegion(e.target.value)}
                className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
              >
                <option>Hunter</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Start Date</label>
              <input
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">End Date</label>
              <input
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
              />
            </div>
          </div>
          <div className="mt-4 text-sm text-gray-600">
            Selected Data Range: {selectedState} &gt; {selectedRegion} | {new Date(startDate).toLocaleDateString()} - {new Date(endDate).toLocaleDateString()}
          </div>
        </div>

        {/* Key Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-medium text-gray-900">Unemployment Rate</h3>
            <div className="mt-2 flex items-baseline">
              <p className="text-4xl font-semibold text-indigo-600">4.7%</p>
              <p className="ml-2 text-sm font-medium text-green-600">0.2%</p>
            </div>
          </div>
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-medium text-gray-900">Participation Rate</h3>
            <div className="mt-2 flex items-baseline">
              <p className="text-4xl font-semibold text-indigo-600">66.7%</p>
              <p className="ml-2 text-sm font-medium text-gray-600">0.0%</p>
            </div>
          </div>
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-medium text-gray-900">Employment Rate</h3>
            <div className="mt-2 flex items-baseline">
              <p className="text-4xl font-semibold text-indigo-600">95.3%</p>
              <p className="ml-2 text-sm font-medium text-green-600">0.2%</p>
            </div>
          </div>
        </div>

        {/* Products Overview */}
        <div className="bg-white rounded-lg shadow p-6 mb-8">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold">Products Overview</h2>
            <Link
              to="/ecommerce"
              className="text-sm text-indigo-600 hover:text-indigo-900"
            >
              View All Products →
            </Link>
          </div>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Price</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Subscriptions</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Revenue</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {products.map((product) => (
                  <tr key={product.id} className={!product.active ? 'bg-gray-50' : ''}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      <div className="flex items-center">
                        <span className={!product.active ? 'text-gray-500' : ''}>{product.name}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{product.price}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{product.subscriptions}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{product.revenue}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                        product.active ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                      }`}>
                        {product.active ? 'Active' : 'Inactive'}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      <div className="flex space-x-3">
                        <button
                          onClick={() => handleToggleProductActive(product.id)}
                          className={`${
                            product.active
                              ? 'text-yellow-600 hover:text-yellow-900'
                              : 'text-green-600 hover:text-green-900'
                          }`}
                        >
                          {product.active ? 'Deactivate' : 'Activate'}
                        </button>
                        <button
                          onClick={() => handleEditProduct(product)}
                          className="text-blue-600 hover:text-blue-900"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleDeleteProduct(product.id)}
                          className="text-red-600 hover:text-red-900"
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
        </div>

        {/* Coupons Overview */}
        <div className="bg-white rounded-lg shadow p-6 mb-8">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold">Active Coupons</h2>
            <Link
              to="/ecommerce"
              className="text-sm text-indigo-600 hover:text-indigo-900"
            >
              Manage Coupons →
            </Link>
          </div>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Code</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Discount</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Expiry Date</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Usage</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {coupons.map((coupon) => (
                  <tr key={coupon.id} className={!coupon.active ? 'bg-gray-50' : ''}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {coupon.code}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {coupon.discountType === 'percentage' ? `${coupon.discountValue}%` : `$${coupon.discountValue}`}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {new Date(coupon.expiryDate).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {coupon.currentUses} / {coupon.maxUses}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                        coupon.active ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                      }`}>
                        {coupon.active ? 'Active' : 'Inactive'}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      <div className="flex space-x-3">
                        <button
                          onClick={() => handleToggleCouponActive(coupon.id)}
                          className={`${
                            coupon.active
                              ? 'text-yellow-600 hover:text-yellow-900'
                              : 'text-green-600 hover:text-green-900'
                          }`}
                        >
                          {coupon.active ? 'Deactivate' : 'Activate'}
                        </button>
                        <button
                          onClick={() => handleEditCoupon(coupon)}
                          className="text-blue-600 hover:text-blue-900"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleDeleteCoupon(coupon.id)}
                          className="text-red-600 hover:text-red-900"
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
        </div>

        {/* Edit Product Modal */}
        <AnimatePresence>
          {showEditProductModal && editingProduct && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="bg-white rounded-lg p-6 max-w-2xl w-full mx-4"
              >
                <h2 className="text-2xl font-bold mb-4">Edit Product</h2>
                <form onSubmit={handleSaveProduct}>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Product Name</label>
                      <input
                        type="text"
                        required
                        value={editingProduct.name}
                        onChange={(e) => setEditingProduct({ ...editingProduct, name: e.target.value })}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Price</label>
                      <div className="mt-1 relative rounded-md shadow-sm">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                          <span className="text-gray-500 sm:text-sm">$</span>
                        </div>
                        <input
                          type="text"
                          required
                          value={editingProduct.price.replace('$', '')}
                          onChange={(e) => setEditingProduct({ ...editingProduct, price: `$${e.target.value}` })}
                          className="block w-full pl-7 rounded-md border-gray-300 focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                          placeholder="0.00"
                        />
                      </div>
                    </div>
                  </div>
                  <div className="mt-6 flex justify-end space-x-3">
                    <button
                      type="button"
                      onClick={() => {
                        setShowEditProductModal(false);
                        setEditingProduct(null);
                      }}
                      className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700"
                    >
                      Save Changes
                    </button>
                  </div>
                </form>
              </motion.div>
            </div>
          )}
        </AnimatePresence>

        {/* Edit Coupon Modal */}
        <AnimatePresence>
          {showEditCouponModal && editingCoupon && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="bg-white rounded-lg p-6 max-w-2xl w-full mx-4"
              >
                <h2 className="text-2xl font-bold mb-4">Edit Coupon</h2>
                <form onSubmit={handleSaveCoupon}>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Coupon Code</label>
                      <input
                        type="text"
                        required
                        value={editingCoupon.code}
                        onChange={(e) => setEditingCoupon({ ...editingCoupon, code: e.target.value })}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Discount Type</label>
                      <select
                        value={editingCoupon.discountType}
                        onChange={(e) => setEditingCoupon({ ...editingCoupon, discountType: e.target.value as 'percentage' | 'fixed' })}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                      >
                        <option value="percentage">Percentage</option>
                        <option value="fixed">Fixed Amount</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Discount Value</label>
                      <input
                        type="number"
                        required
                        value={editingCoupon.discountValue}
                        onChange={(e) => setEditingCoupon({ ...editingCoupon, discountValue: Number(e.target.value) })}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Expiry Date</label>
                      <input
                        type="date"
                        required
                        value={editingCoupon.expiryDate}
                        onChange={(e) => setEditingCoupon({ ...editingCoupon, expiryDate: e.target.value })}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Maximum Uses</label>
                      <input
                        type="number"
                        required
                        value={editingCoupon.maxUses}
                        onChange={(e) => setEditingCoupon({ ...editingCoupon, maxUses: Number(e.target.value) })}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                      />
                    </div>
                  </div>
                  <div className="mt-6 flex justify-end space-x-3">
                    <button
                      type="button"
                      onClick={() => {
                        setShowEditCouponModal(false);
                        setEditingCoupon(null);
                      }}
                      className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700"
                    >
                      Save Changes
                    </button>
                  </div>
                </form>
              </motion.div>
            </div>
          )}
        </AnimatePresence>

        {/* Employment Trends Chart */}
        <div className="bg-white rounded-lg shadow p-6 mb-8">
          <h2 className="text-xl font-semibold mb-4">Employment Trends Over Time</h2>
          <div className="h-96">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={employmentData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line type="monotone" dataKey="employed" stroke="#4F46E5" name="Employed" />
                <Line type="monotone" dataKey="unemployed" stroke="#EF4444" name="Unemployed" />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Regional Statistics */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold mb-4">Regional Statistics</h2>
          <div className="h-96">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={regionalData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="employed" fill="#4F46E5" name="Employed" />
                <Bar dataKey="unemployed" fill="#EF4444" name="Unemployed" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
