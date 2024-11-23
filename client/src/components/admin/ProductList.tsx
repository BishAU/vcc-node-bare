import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Dialog } from '@headlessui/react';
import { getDb } from '../../lib/db';
import { ProductSchema } from '../../lib/api/types';
import type { Product } from '../../lib/api/types';

export function ProductList() {
  const [products, setProducts] = useState<Product[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: 0,
    type: 'one_time',
    interval: 'month',
    active: true,
  });

  useEffect(() => {
    loadProducts();
  }, []);

  async function loadProducts() {
    const db = await getDb();
    const products = await db.products.toArray();
    setProducts(products);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    try {
      const db = await getDb();
      const productData = ProductSchema.parse({
        ...formData,
        id: editingProduct?.id || crypto.randomUUID(),
        createdAt: editingProduct?.createdAt || new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      });

      if (editingProduct) {
        await db.products.update(editingProduct.id, productData);
      } else {
        await db.products.add(productData);
      }

      setIsOpen(false);
      setEditingProduct(null);
      setFormData({
        name: '',
        description: '',
        price: 0,
        type: 'one_time',
        interval: 'month',
        active: true,
      });
      loadProducts();
    } catch (error) {
      console.error('Error saving product:', error);
      alert('Error saving product. Please check the console for details.');
    }
  }

  function handleEdit(product: Product) {
    setEditingProduct(product);
    setFormData({
      name: product.name,
      description: product.description,
      price: product.price,
      type: product.type,
      interval: product.interval,
      active: product.active,
    });
    setIsOpen(true);
  }

  async function handleDelete(productId: string) {
    if (confirm('Are you sure you want to delete this product?')) {
      const db = await getDb();
      await db.products.delete(productId);
      loadProducts();
    }
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-900">Products</h2>
        <button
          onClick={() => setIsOpen(true)}
          className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
        >
          Add Product
        </button>
      </div>

      <div className="bg-white shadow overflow-hidden sm:rounded-md">
        <ul className="divide-y divide-gray-200">
          <AnimatePresence>
            {products.map((product) => (
              <motion.li
                key={product.id}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="px-6 py-4"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-lg font-medium text-gray-900">
                      {product.name}
                    </h3>
                    <p className="text-sm text-gray-500">{product.description}</p>
                    <div className="mt-2 flex items-center space-x-4">
                      <span className="text-sm font-medium text-gray-900">
                        ${(product.price / 100).toFixed(2)}
                      </span>
                      <span
                        className={`px-2 py-1 text-xs rounded-full ${
                          product.active
                            ? 'bg-green-100 text-green-800'
                            : 'bg-red-100 text-red-800'
                        }`}
                      >
                        {product.active ? 'Active' : 'Inactive'}
                      </span>
                      <span className="text-sm text-gray-500">
                        {product.type === 'subscription'
                          ? `Subscription (${product.interval}ly)`
                          : 'One-time purchase'}
                      </span>
                    </div>
                  </div>
                  <div className="flex space-x-2">
                    <button
                      onClick={() => handleEdit(product)}
                      className="px-3 py-1 text-sm text-blue-600 hover:text-blue-800"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(product.id)}
                      className="px-3 py-1 text-sm text-red-600 hover:text-red-800"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              </motion.li>
            ))}
          </AnimatePresence>
        </ul>
      </div>

      <Dialog
        open={isOpen}
        onClose={() => {
          setIsOpen(false);
          setEditingProduct(null);
          setFormData({
            name: '',
            description: '',
            price: 0,
            type: 'one_time',
            interval: 'month',
            active: true,
          });
        }}
        className="fixed inset-0 z-10 overflow-y-auto"
      >
        <div className="flex items-center justify-center min-h-screen">
          <Dialog.Overlay className="fixed inset-0 bg-black opacity-30" />

          <div className="relative bg-white rounded-lg max-w-md w-full mx-4 p-6">
            <Dialog.Title className="text-lg font-medium text-gray-900 mb-4">
              {editingProduct ? 'Edit Product' : 'Add New Product'}
            </Dialog.Title>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Name
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Description
                </label>
                <textarea
                  value={formData.description}
                  onChange={(e) =>
                    setFormData({ ...formData, description: e.target.value })
                  }
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  rows={3}
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Price (in cents)
                </label>
                <input
                  type="number"
                  value={formData.price}
                  onChange={(e) =>
                    setFormData({ ...formData, price: Number(e.target.value) })
                  }
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Type
                </label>
                <select
                  value={formData.type}
                  onChange={(e) =>
                    setFormData({ ...formData, type: e.target.value as any })
                  }
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                >
                  <option value="one_time">One-time purchase</option>
                  <option value="subscription">Subscription</option>
                </select>
              </div>

              {formData.type === 'subscription' && (
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Interval
                  </label>
                  <select
                    value={formData.interval}
                    onChange={(e) =>
                      setFormData({ ...formData, interval: e.target.value as any })
                    }
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  >
                    <option value="month">Monthly</option>
                    <option value="year">Yearly</option>
                  </select>
                </div>
              )}

              <div className="flex items-center">
                <input
                  type="checkbox"
                  checked={formData.active}
                  onChange={(e) =>
                    setFormData({ ...formData, active: e.target.checked })
                  }
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                />
                <label className="ml-2 block text-sm text-gray-900">Active</label>
              </div>

              <div className="flex justify-end space-x-2">
                <button
                  type="button"
                  onClick={() => setIsOpen(false)}
                  className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md hover:bg-blue-700"
                >
                  {editingProduct ? 'Save Changes' : 'Add Product'}
                </button>
              </div>
            </form>
          </div>
        </div>
      </Dialog>
    </div>
  );
}
