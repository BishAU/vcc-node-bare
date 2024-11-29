import React, { useState } from 'react';
import { PageWrapper } from '../components/layout/PageWrapper';
import { sharedStyles, combineClasses } from '../styles/shared';
import { AddProductModal } from '../components/products/AddProductModal';
import DataTable from '../components/DataTable';
import Modal from '../components/Modal';

interface Product {
  id: number;
  name: string;
  subscriptions: number;
  activeUsers: number;
  revenue: string;
  growth: string;
  churnRate: string;
  avgUserAge: number;
  status: 'active' | 'inactive';
  sku: string;
  gflCode: string;
}

const mockProducts: Product[] = [
  { 
    id: 1, 
    name: 'Basic Plan', 
    subscriptions: 150, 
    activeUsers: 120, 
    revenue: '$14,500', 
    growth: '+15%', 
    churnRate: '2.5%', 
    avgUserAge: 35, 
    status: 'active',
    sku: 'BP-001',
    gflCode: 'GFL-1001'
  },
  { 
    id: 2, 
    name: 'Pro Plan', 
    subscriptions: 280, 
    activeUsers: 250, 
    revenue: '$42,000', 
    growth: '+25%', 
    churnRate: '1.8%', 
    avgUserAge: 42, 
    status: 'active',
    sku: 'PP-001',
    gflCode: 'GFL-1002'
  },
  { 
    id: 3, 
    name: 'Enterprise', 
    subscriptions: 50, 
    activeUsers: 48, 
    revenue: '$96,000', 
    growth: '+10%', 
    churnRate: '0.5%', 
    avgUserAge: 45, 
    status: 'active',
    sku: 'EP-001',
    gflCode: 'GFL-1003'
  },
];

const Products: React.FC = () => {
  const [products, setProducts] = useState<Product[]>(mockProducts);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);

  const handleAddProduct = (newProduct: Omit<Product, 'id'>) => {
    const newId = Math.max(...products.map(p => p.id)) + 1;
    setProducts([...products, { ...newProduct, id: newId }]);
  };

  const handleEdit = (product: Product) => {
    setEditingProduct(product);
    setIsEditModalOpen(true);
  };

  const handleSaveEdit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingProduct) return;

    setProducts(products.map((product) => 
      product.id === editingProduct.id ? editingProduct : product
    ));
    setIsEditModalOpen(false);
    setEditingProduct(null);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    if (!editingProduct) return;

    const value = e.target.name === 'avgUserAge' ? parseInt(e.target.value) : e.target.value;
    setEditingProduct({
      ...editingProduct,
      [e.target.name]: value,
    });
  };

  const columns = [
    { 
      key: 'name' as keyof Product, 
      header: 'Name',
      render: (value: string) => (
        <div className="text-xl font-bold text-white">{value}</div>
      )
    },
    { 
      key: 'sku' as keyof Product, 
      header: 'SKU',
      render: (value: string) => (
        <span className={combineClasses(sharedStyles.badge.base, sharedStyles.badge.primary)}>
          {value}
        </span>
      )
    },
    { 
      key: 'gflCode' as keyof Product, 
      header: 'GFL Code',
      render: (value: string) => (
        <span className={combineClasses(sharedStyles.badge.base, sharedStyles.badge.secondary)}>
          {value}
        </span>
      )
    },
    { 
      key: 'revenue' as keyof Product, 
      header: 'Revenue',
      render: (value: string) => (
        <span className={sharedStyles.value.revenue}>{value}</span>
      )
    },
    {
      key: 'growth' as keyof Product,
      header: 'Growth',
      render: (value: string) => {
        const isPositive = value.startsWith('+');
        return (
          <span className={combineClasses(
            sharedStyles.value.growth[isPositive ? 'positive' : 'negative']
          )}>
            {isPositive ? '↑' : '↓'} {value}
          </span>
        );
      },
    },
    {
      key: 'status' as keyof Product,
      header: 'Status',
      render: (value: Product['status']) => (
        <div className={combineClasses(
          sharedStyles.statusIndicator.base,
          value === 'active' ? sharedStyles.statusIndicator.active : sharedStyles.statusIndicator.inactive
        )}>
          <span className={combineClasses(
            sharedStyles.statusIndicator.dot.base,
            value === 'active' ? sharedStyles.statusIndicator.dot.active : sharedStyles.statusIndicator.dot.inactive
          )}></span>
          {value.toUpperCase()}
        </div>
      ),
    },
    {
      key: 'actions' as keyof Product,
      header: 'Actions',
      render: (value: string, product: Product) => (
        <div className="flex gap-2">
          <button 
            onClick={() => handleEdit(product)}
            className={combineClasses(sharedStyles.button.base, sharedStyles.button.primary)}
          >
            Edit
          </button>
        </div>
      )
    },
  ];

  return (
    <PageWrapper title="Products">
      <div className={sharedStyles.card}>
        <div className="mb-6 flex justify-between items-center">
          <h2 className={sharedStyles.cardHeader}>Product Management</h2>
          <button 
            onClick={() => setIsAddModalOpen(true)}
            className={combineClasses(sharedStyles.button.base, sharedStyles.button.primary)}
          >
            Add Product
          </button>
        </div>

        <DataTable
          data={products}
          columns={columns}
          onEdit={(product) => handleEdit(product)}
        />

        <Modal
          isOpen={isEditModalOpen}
          onClose={() => {
            setIsEditModalOpen(false);
            setEditingProduct(null);
          }}
          title={
            <div className="text-3xl font-black bg-gradient-to-r from-indigo-400 to-purple-400 text-transparent bg-clip-text">
              Edit Product
            </div>
          }
        >
          {editingProduct && (
            <form onSubmit={handleSaveEdit} className="space-y-8">
              <div className="grid grid-cols-1 gap-8 sm:grid-cols-2">
                <div className="relative group">
                  <label className="block text-base font-bold text-gray-700 mb-2 group-hover:text-indigo-600 transition-colors duration-200">
                    Product Name
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={editingProduct.name}
                    onChange={handleInputChange}
                    className="block w-full h-14 px-5 rounded-xl border-2 border-gray-200 text-lg
                             focus:border-indigo-500 focus:ring focus:ring-indigo-200 
                             transition-all duration-200"
                  />
                </div>

                <div className="relative group">
                  <label className="block text-base font-bold text-gray-700 mb-2 group-hover:text-indigo-600 transition-colors duration-200">
                    SKU
                  </label>
                  <input
                    type="text"
                    name="sku"
                    value={editingProduct.sku}
                    onChange={handleInputChange}
                    className="block w-full h-14 px-5 rounded-xl border-2 border-gray-200 text-lg uppercase
                             focus:border-indigo-500 focus:ring focus:ring-indigo-200 
                             transition-all duration-200"
                  />
                </div>

                <div className="relative group">
                  <label className="block text-base font-bold text-gray-700 mb-2 group-hover:text-indigo-600 transition-colors duration-200">
                    GFL Code
                  </label>
                  <input
                    type="text"
                    name="gflCode"
                    value={editingProduct.gflCode}
                    onChange={handleInputChange}
                    className="block w-full h-14 px-5 rounded-xl border-2 border-gray-200 text-lg uppercase
                             focus:border-indigo-500 focus:ring focus:ring-indigo-200 
                             transition-all duration-200"
                  />
                </div>

                <div className="relative group">
                  <label className="block text-base font-bold text-gray-700 mb-2 group-hover:text-indigo-600 transition-colors duration-200">
                    Subscriptions
                  </label>
                  <input
                    type="number"
                    name="subscriptions"
                    value={editingProduct.subscriptions}
                    onChange={handleInputChange}
                    className="block w-full h-14 px-5 rounded-xl border-2 border-gray-200 text-lg
                             focus:border-indigo-500 focus:ring focus:ring-indigo-200 
                             transition-all duration-200"
                  />
                </div>

                <div className="relative group">
                  <label className="block text-base font-bold text-gray-700 mb-2 group-hover:text-indigo-600 transition-colors duration-200">
                    Active Users
                  </label>
                  <input
                    type="number"
                    name="activeUsers"
                    value={editingProduct.activeUsers}
                    onChange={handleInputChange}
                    className="block w-full h-14 px-5 rounded-xl border-2 border-gray-200 text-lg
                             focus:border-indigo-500 focus:ring focus:ring-indigo-200 
                             transition-all duration-200"
                  />
                </div>

                <div className="relative group">
                  <label className="block text-base font-bold text-gray-700 mb-2 group-hover:text-indigo-600 transition-colors duration-200">
                    Revenue
                  </label>
                  <input
                    type="text"
                    name="revenue"
                    value={editingProduct.revenue}
                    onChange={handleInputChange}
                    className="block w-full h-14 px-5 rounded-xl border-2 border-gray-200 text-lg
                             focus:border-indigo-500 focus:ring focus:ring-indigo-200 
                             transition-all duration-200"
                  />
                </div>

                <div className="relative group">
                  <label className="block text-base font-bold text-gray-700 mb-2 group-hover:text-indigo-600 transition-colors duration-200">
                    Growth
                  </label>
                  <input
                    type="text"
                    name="growth"
                    value={editingProduct.growth}
                    onChange={handleInputChange}
                    className="block w-full h-14 px-5 rounded-xl border-2 border-gray-200 text-lg
                             focus:border-indigo-500 focus:ring focus:ring-indigo-200 
                             transition-all duration-200"
                  />
                </div>

                <div className="relative group">
                  <label className="block text-base font-bold text-gray-700 mb-2 group-hover:text-indigo-600 transition-colors duration-200">
                    Churn Rate
                  </label>
                  <input
                    type="text"
                    name="churnRate"
                    value={editingProduct.churnRate}
                    onChange={handleInputChange}
                    className="block w-full h-14 px-5 rounded-xl border-2 border-gray-200 text-lg
                             focus:border-indigo-500 focus:ring focus:ring-indigo-200 
                             transition-all duration-200"
                  />
                </div>

                <div className="relative group">
                  <label className="block text-base font-bold text-gray-700 mb-2 group-hover:text-indigo-600 transition-colors duration-200">
                    Avg. User Age
                  </label>
                  <input
                    type="number"
                    name="avgUserAge"
                    value={editingProduct.avgUserAge}
                    onChange={handleInputChange}
                    className="block w-full h-14 px-5 rounded-xl border-2 border-gray-200 text-lg
                             focus:border-indigo-500 focus:ring focus:ring-indigo-200 
                             transition-all duration-200"
                  />
                </div>

                <div className="relative group">
                  <label className="block text-base font-bold text-gray-700 mb-2 group-hover:text-indigo-600 transition-colors duration-200">
                    Status
                  </label>
                  <select
                    name="status"
                    value={editingProduct.status}
                    onChange={handleInputChange}
                    className="block w-full h-14 px-5 rounded-xl border-2 border-gray-200 text-lg
                             focus:border-indigo-500 focus:ring focus:ring-indigo-200 
                             transition-all duration-200"
                  >
                    <option value="active">Active</option>
                    <option value="inactive">Inactive</option>
                  </select>
                </div>
              </div>

              <div className="flex gap-4 pt-8">
                <button
                  type="submit"
                  className="flex-1 h-14 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 
                           text-white font-bold text-lg hover:from-indigo-700 hover:to-purple-700 
                           focus:ring-4 focus:ring-indigo-300 transition-all duration-300 
                           shadow-lg hover:shadow-xl transform hover:scale-105 active:scale-95"
                >
                  Save Changes
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setIsEditModalOpen(false);
                    setEditingProduct(null);
                  }}
                  className="flex-1 h-14 rounded-xl bg-gray-100 text-gray-700 font-bold text-lg 
                           hover:bg-gray-200 focus:ring-4 focus:ring-gray-200 transition-all duration-300
                           transform hover:scale-105 active:scale-95"
                >
                  Cancel
                </button>
              </div>
            </form>
          )}
        </Modal>

        <AddProductModal
          isOpen={isAddModalOpen}
          onClose={() => setIsAddModalOpen(false)}
          onAdd={handleAddProduct}
        />
      </div>
    </PageWrapper>
  );
};

export default Products;
