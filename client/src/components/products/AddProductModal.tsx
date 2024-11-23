import React, { useState } from 'react';
import { sharedStyles, combineClasses } from '../../styles/shared';
import Modal from '../Modal';

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

interface AddProductModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAdd: (product: Omit<Product, 'id'>) => void;
}

export const AddProductModal: React.FC<AddProductModalProps> = ({
  isOpen,
  onClose,
  onAdd,
}) => {
  const [formData, setFormData] = useState<Omit<Product, 'id'>>({
    name: '',
    subscriptions: 0,
    activeUsers: 0,
    revenue: '$0',
    growth: '0%',
    churnRate: '0%',
    avgUserAge: 0,
    status: 'active',
    sku: '',
    gflCode: '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onAdd(formData);
    onClose();
    setFormData({
      name: '',
      subscriptions: 0,
      activeUsers: 0,
      revenue: '$0',
      growth: '0%',
      churnRate: '0%',
      avgUserAge: 0,
      status: 'active',
      sku: '',
      gflCode: '',
    });
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'subscriptions' || name === 'activeUsers' || name === 'avgUserAge'
        ? parseInt(value) || 0
        : value,
    }));
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Add New Product">
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className={sharedStyles.form.group}>
          <label htmlFor="name" className={sharedStyles.form.label}>
            Product Name
          </label>
          <input
            type="text"
            id="name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            className={sharedStyles.form.input}
            required
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className={sharedStyles.form.group}>
            <label htmlFor="sku" className={sharedStyles.form.label}>
              SKU
            </label>
            <input
              type="text"
              id="sku"
              name="sku"
              value={formData.sku}
              onChange={handleChange}
              className={sharedStyles.form.input}
              required
            />
          </div>

          <div className={sharedStyles.form.group}>
            <label htmlFor="gflCode" className={sharedStyles.form.label}>
              GFL Code
            </label>
            <input
              type="text"
              id="gflCode"
              name="gflCode"
              value={formData.gflCode}
              onChange={handleChange}
              className={sharedStyles.form.input}
              required
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className={sharedStyles.form.group}>
            <label htmlFor="subscriptions" className={sharedStyles.form.label}>
              Subscriptions
            </label>
            <input
              type="number"
              id="subscriptions"
              name="subscriptions"
              value={formData.subscriptions}
              onChange={handleChange}
              className={sharedStyles.form.input}
              min="0"
              required
            />
          </div>

          <div className={sharedStyles.form.group}>
            <label htmlFor="activeUsers" className={sharedStyles.form.label}>
              Active Users
            </label>
            <input
              type="number"
              id="activeUsers"
              name="activeUsers"
              value={formData.activeUsers}
              onChange={handleChange}
              className={sharedStyles.form.input}
              min="0"
              required
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className={sharedStyles.form.group}>
            <label htmlFor="revenue" className={sharedStyles.form.label}>
              Revenue
            </label>
            <input
              type="text"
              id="revenue"
              name="revenue"
              value={formData.revenue}
              onChange={handleChange}
              className={sharedStyles.form.input}
              placeholder="$0"
              required
            />
          </div>

          <div className={sharedStyles.form.group}>
            <label htmlFor="growth" className={sharedStyles.form.label}>
              Growth
            </label>
            <input
              type="text"
              id="growth"
              name="growth"
              value={formData.growth}
              onChange={handleChange}
              className={sharedStyles.form.input}
              placeholder="0%"
              required
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className={sharedStyles.form.group}>
            <label htmlFor="churnRate" className={sharedStyles.form.label}>
              Churn Rate
            </label>
            <input
              type="text"
              id="churnRate"
              name="churnRate"
              value={formData.churnRate}
              onChange={handleChange}
              className={sharedStyles.form.input}
              placeholder="0%"
              required
            />
          </div>

          <div className={sharedStyles.form.group}>
            <label htmlFor="avgUserAge" className={sharedStyles.form.label}>
              Average User Age
            </label>
            <input
              type="number"
              id="avgUserAge"
              name="avgUserAge"
              value={formData.avgUserAge}
              onChange={handleChange}
              className={sharedStyles.form.input}
              min="0"
              required
            />
          </div>
        </div>

        <div className={sharedStyles.form.group}>
          <label htmlFor="status" className={sharedStyles.form.label}>
            Status
          </label>
          <select
            id="status"
            name="status"
            value={formData.status}
            onChange={handleChange}
            className={sharedStyles.form.select}
            required
          >
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
          </select>
        </div>

        <div className="flex justify-end space-x-4">
          <button
            type="button"
            onClick={onClose}
            className={combineClasses(sharedStyles.button.base, sharedStyles.button.ghost)}
          >
            Cancel
          </button>
          <button
            type="submit"
            className={combineClasses(sharedStyles.button.base, sharedStyles.button.primary)}
          >
            Add Product
          </button>
        </div>
      </form>
    </Modal>
  );
};
