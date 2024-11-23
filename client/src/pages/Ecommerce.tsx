import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import ReactPaginate from 'react-paginate';

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

interface NewProduct {
  name: string;
  price: string;
  description: string;
  features: string[];
}

interface NewCoupon {
  code: string;
  discountType: 'percentage' | 'fixed';
  discountValue: number;
  expiryDate: string;
  maxUses: number;
}

const Ecommerce = () => {
  const [showAddModal, setShowAddModal] = useState(false);
  const [showCouponModal, setShowCouponModal] = useState(false);
  const [newProduct, setNewProduct] = useState<NewProduct>({
    name: '',
    price: '',
    description: '',
    features: ['']
  });
  
  const [newCoupon, setNewCoupon] = useState<NewCoupon>({
    code: '',
    discountType: 'percentage',
    discountValue: 0,
    expiryDate: '',
    maxUses: 0
  });

  const [currentPage, setCurrentPage] = useState(0);
  const itemsPerPage = 5;

  // Products Overview Section
  const [products, setProducts] = useState<Product[]>([
    { id: 1, name: 'Basic Plan', price: '$99/month', subscriptions: 150, revenue: '$14,850', active: true },
    { id: 2, name: 'Pro Plan', price: '$199/month', subscriptions: 75, revenue: '$14,925', active: true },
    { id: 3, name: 'Enterprise Plan', price: '$499/month', subscriptions: 25, revenue: '$12,475', active: false },
  ]);

  // Coupons Section
  const [coupons, setCoupons] = useState<Coupon[]>([
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
  ]);

  // Key Metrics Section
  const metrics = [
    {
      title: 'Total Revenue',
      value: '$42,250',
      change: '+12.5%',
      isPositive: true
    },
    {
      title: 'Active Subscriptions',
      value: '250',
      change: '+5.2%',
      isPositive: true
    },
    {
      title: 'Conversion Rate',
      value: '3.2%',
      change: '-0.4%',
      isPositive: false
    }
  ];

  const offset = currentPage * itemsPerPage;
  const currentProducts = products.slice(offset, offset + itemsPerPage);
  const pageCount = Math.ceil(products.length / itemsPerPage);

  const handlePageClick = (event: { selected: number }) => {
    setCurrentPage(event.selected);
  };

  const handleAddFeature = () => {
    setNewProduct({
      ...newProduct,
      features: [...newProduct.features, '']
    });
  };

  const handleFeatureChange = (index: number, value: string) => {
    const updatedFeatures = [...newProduct.features];
    updatedFeatures[index] = value;
    setNewProduct({
      ...newProduct,
      features: updatedFeatures
    });
  };

  const handleRemoveFeature = (index: number) => {
    const updatedFeatures = newProduct.features.filter((_, i) => i !== index);
    setNewProduct({
      ...newProduct,
      features: updatedFeatures
    });
  };

  const handleToggleActive = (productId: number) => {
    setProducts(products.map(product => 
      product.id === productId 
        ? { ...product, active: !product.active }
        : product
    ));
  };

  const handleDeleteProduct = (productId: number) => {
    if (window.confirm('Are you sure you want to delete this product? This action cannot be undone.')) {
      setProducts(products.filter(product => product.id !== productId));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const productPrice = newProduct.price.startsWith('$') ? newProduct.price : `$${newProduct.price}`;
    const newProductEntry: Product = {
      id: products.length + 1,
      name: newProduct.name,
      price: productPrice,
      subscriptions: 0,
      revenue: '$0.00',
      active: true
    };
    
    setProducts([...products, newProductEntry]);
    setShowAddModal(false);
    setNewProduct({
      name: '',
      price: '',
      description: '',
      features: ['']
    });
  };

  const handleSubmitCoupon = (e: React.FormEvent) => {
    e.preventDefault();
    const newCouponEntry: Coupon = {
      id: coupons.length + 1,
      ...newCoupon,
      currentUses: 0,
      active: true
    };
    
    setCoupons([...coupons, newCouponEntry]);
    setShowCouponModal(false);
    setNewCoupon({
      code: '',
      discountType: 'percentage',
      discountValue: 0,
      expiryDate: '',
      maxUses: 0
    });
  };

  const handleToggleCouponActive = (couponId: number) => {
    setCoupons(coupons.map(coupon => 
      coupon.id === couponId 
        ? { ...coupon, active: !coupon.active }
        : coupon
    ));
  };

  const handleDeleteCoupon = (couponId: number) => {
    if (window.confirm('Are you sure you want to delete this coupon? This action cannot be undone.')) {
      setCoupons(coupons.filter(coupon => coupon.id !== couponId));
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 pt-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">E-commerce Management</h1>
            <p className="mt-1 text-sm text-gray-500">
              Manage your products, subscriptions, and promotional campaigns
            </p>
          </div>
          <div className="space-x-4">
            <Link
              to="/dashboard"
              className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
            >
              Back to Dashboard
            </Link>
            <button
              onClick={() => setShowCouponModal(true)}
              className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700"
            >
              Add New Coupon
            </button>
            <button
              onClick={() => setShowAddModal(true)}
              className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700"
            >
              Add New Product
            </button>
          </div>
        </div>

        {/* Key Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {metrics.map((metric, index) => (
            <div key={index} className="bg-white rounded-lg shadow p-6">
              <h3 className="text-lg font-medium text-gray-900">{metric.title}</h3>
              <div className="mt-2 flex items-baseline">
                <p className="text-4xl font-semibold text-indigo-600">{metric.value}</p>
                <p className={`ml-2 text-sm font-medium ${
                  metric.isPositive ? 'text-green-600' : 'text-red-600'
                }`}>
                  {metric.change}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* Products Overview */}
        <div className="bg-white rounded-lg shadow mb-8">
          <div className="px-6 py-4 border-b border-gray-200">
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-semibold text-gray-800">Products Overview</h2>
              <button
                onClick={() => setShowAddModal(true)}
                className="px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700 transition-colors"
              >
                Add Product
              </button>
            </div>
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
                {currentProducts.map((product) => (
                  <tr key={product.id} className={!product.active ? 'bg-gray-50' : ''}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
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
                          onClick={() => handleToggleActive(product.id)}
                          className={`${
                            product.active
                              ? 'text-yellow-600 hover:text-yellow-900'
                              : 'text-green-600 hover:text-green-900'
                          }`}
                        >
                          {product.active ? 'Deactivate' : 'Activate'}
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
          <div className="px-6 py-4 border-t border-gray-200">
            <ReactPaginate
              previousLabel="Previous"
              nextLabel="Next"
              pageCount={pageCount}
              onPageChange={handlePageClick}
              containerClassName="pagination"
              previousLinkClassName="font-semibold"
              nextLinkClassName="font-semibold"
              disabledClassName="disabled"
              activeClassName="active"
              pageRangeDisplayed={3}
              marginPagesDisplayed={1}
            />
          </div>
        </div>

        {/* Coupons Overview */}
        <div className="bg-white rounded-lg shadow mb-8">
          <div className="px-6 py-4 border-b border-gray-200">
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-semibold text-gray-800">Active Promotions</h2>
              <button
                onClick={() => setShowCouponModal(true)}
                className="px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700 transition-colors"
              >
                Create Coupon
              </button>
            </div>
          </div>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Code</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Discount</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Usage</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Expiry</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {coupons.map((coupon) => (
                  <tr key={coupon.id}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{coupon.code}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {coupon.discountType === 'percentage' ? `${coupon.discountValue}%` : `$${coupon.discountValue}`}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {coupon.currentUses} / {coupon.maxUses}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {new Date(coupon.expiryDate).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                        coupon.active ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                      }`}>
                        {coupon.active ? 'Active' : 'Inactive'}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <button
                        onClick={() => handleToggleCouponActive(coupon.id)}
                        className="text-indigo-600 hover:text-indigo-900 mr-3"
                      >
                        {coupon.active ? 'Deactivate' : 'Activate'}
                      </button>
                      <button
                        onClick={() => handleDeleteCoupon(coupon.id)}
                        className="text-red-600 hover:text-red-900"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Add Product Modal */}
        <AnimatePresence>
          {showAddModal && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="bg-white rounded-lg p-6 max-w-2xl w-full mx-4"
              >
                <h2 className="text-2xl font-bold mb-4">Add New Product</h2>
                <form onSubmit={handleSubmit}>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Product Name</label>
                      <input
                        type="text"
                        required
                        value={newProduct.name}
                        onChange={(e) => setNewProduct({ ...newProduct, name: e.target.value })}
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
                          value={newProduct.price}
                          onChange={(e) => setNewProduct({ ...newProduct, price: e.target.value })}
                          className="block w-full pl-7 rounded-md border-gray-300 focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                          placeholder="0.00"
                        />
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Description</label>
                      <textarea
                        rows={3}
                        value={newProduct.description}
                        onChange={(e) => setNewProduct({ ...newProduct, description: e.target.value })}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Features</label>
                      {newProduct.features.map((feature, index) => (
                        <div key={index} className="flex gap-2 mb-2">
                          <input
                            type="text"
                            value={feature}
                            onChange={(e) => handleFeatureChange(index, e.target.value)}
                            className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                            placeholder="Feature description"
                          />
                          {index > 0 && (
                            <button
                              type="button"
                              onClick={() => handleRemoveFeature(index)}
                              className="inline-flex items-center p-2 border border-transparent rounded-md text-red-600 hover:bg-red-100"
                            >
                              <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                              </svg>
                            </button>
                          )}
                        </div>
                      ))}
                      <button
                        type="button"
                        onClick={handleAddFeature}
                        className="mt-2 inline-flex items-center px-3 py-1.5 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
                      >
                        Add Feature
                      </button>
                    </div>
                  </div>
                  <div className="mt-6 flex justify-end space-x-3">
                    <button
                      type="button"
                      onClick={() => setShowAddModal(false)}
                      className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700"
                    >
                      Add Product
                    </button>
                  </div>
                </form>
              </motion.div>
            </div>
          )}
        </AnimatePresence>

        {/* Add Coupon Modal */}
        <AnimatePresence>
          {showCouponModal && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="bg-white rounded-lg p-6 max-w-2xl w-full mx-4"
              >
                <h2 className="text-2xl font-bold mb-4">Add New Coupon</h2>
                <form onSubmit={handleSubmitCoupon}>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Coupon Code</label>
                      <input
                        type="text"
                        required
                        value={newCoupon.code}
                        onChange={(e) => setNewCoupon({ ...newCoupon, code: e.target.value.toUpperCase() })}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                        placeholder="e.g., SUMMER2024"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Discount Type</label>
                      <select
                        value={newCoupon.discountType}
                        onChange={(e) => setNewCoupon({ ...newCoupon, discountType: e.target.value as 'percentage' | 'fixed' })}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                      >
                        <option value="percentage">Percentage (%)</option>
                        <option value="fixed">Fixed Amount ($)</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">
                        Discount Value ({newCoupon.discountType === 'percentage' ? '%' : '$'})
                      </label>
                      <input
                        type="number"
                        required
                        min="0"
                        max={newCoupon.discountType === 'percentage' ? "100" : "1000"}
                        value={newCoupon.discountValue}
                        onChange={(e) => setNewCoupon({ ...newCoupon, discountValue: Number(e.target.value) })}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Expiry Date</label>
                      <input
                        type="date"
                        required
                        value={newCoupon.expiryDate}
                        min={new Date().toISOString().split('T')[0]}
                        onChange={(e) => setNewCoupon({ ...newCoupon, expiryDate: e.target.value })}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Maximum Uses</label>
                      <input
                        type="number"
                        required
                        min="1"
                        value={newCoupon.maxUses}
                        onChange={(e) => setNewCoupon({ ...newCoupon, maxUses: Number(e.target.value) })}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                      />
                    </div>
                  </div>
                  <div className="mt-6 flex justify-end space-x-3">
                    <button
                      type="button"
                      onClick={() => setShowCouponModal(false)}
                      className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700"
                    >
                      Add Coupon
                    </button>
                  </div>
                </form>
              </motion.div>
            </div>
          )}
        </AnimatePresence>

      </div>
    </div>
  );
};

export default Ecommerce;
