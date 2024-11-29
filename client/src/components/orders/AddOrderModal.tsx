import React, { useState } from 'react';
import { sharedStyles, combineClasses } from '../../styles/shared';
import Modal from '../Modal';

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

interface AddOrderModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAdd: (order: Omit<Order, 'id' | 'orderNumber' | 'orderDate'>) => void;
  availableProducts: Array<{ id: string; name: string; price: number }>;
}

export const AddOrderModal: React.FC<AddOrderModalProps> = ({
  isOpen,
  onClose,
  onAdd,
  availableProducts,
}) => {
  const [formData, setFormData] = useState<Omit<Order, 'id' | 'orderNumber' | 'orderDate'>>({
    customerName: '',
    customerEmail: '',
    products: [],
    totalAmount: 0,
    status: 'pending',
    shippingAddress: '',
    paymentMethod: '',
    notes: '',
  });

  const [selectedProduct, setSelectedProduct] = useState({
    productId: '',
    quantity: 1,
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onAdd(formData);
    onClose();
    setFormData({
      customerName: '',
      customerEmail: '',
      products: [],
      totalAmount: 0,
      status: 'pending',
      shippingAddress: '',
      paymentMethod: '',
      notes: '',
    });
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  const addProduct = () => {
    if (!selectedProduct.productId) return;

    const product = availableProducts.find(p => p.id === selectedProduct.productId);
    if (!product) return;

    const newProduct = {
      productId: selectedProduct.productId,
      quantity: selectedProduct.quantity,
      price: product.price,
    };

    setFormData(prev => ({
      ...prev,
      products: [...prev.products, newProduct],
      totalAmount: prev.totalAmount + (newProduct.price * newProduct.quantity),
    }));

    setSelectedProduct({
      productId: '',
      quantity: 1,
    });
  };

  const removeProduct = (index: number) => {
    setFormData(prev => {
      const removedProduct = prev.products[index];
      return {
        ...prev,
        products: prev.products.filter((_, i) => i !== index),
        totalAmount: prev.totalAmount - (removedProduct.price * removedProduct.quantity),
      };
    });
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Add New Order">
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-2 gap-4">
          <div className={sharedStyles.form.group}>
            <label htmlFor="customerName" className={sharedStyles.form.label}>
              Customer Name
            </label>
            <input
              type="text"
              id="customerName"
              name="customerName"
              value={formData.customerName}
              onChange={handleChange}
              className={sharedStyles.form.input}
              required
            />
          </div>

          <div className={sharedStyles.form.group}>
            <label htmlFor="customerEmail" className={sharedStyles.form.label}>
              Customer Email
            </label>
            <input
              type="email"
              id="customerEmail"
              name="customerEmail"
              value={formData.customerEmail}
              onChange={handleChange}
              className={sharedStyles.form.input}
              required
            />
          </div>
        </div>

        <div className={sharedStyles.form.group}>
          <label className={sharedStyles.form.label}>Products</label>
          <div className="flex space-x-4 mb-2">
            <select
              value={selectedProduct.productId}
              onChange={(e) => setSelectedProduct(prev => ({ ...prev, productId: e.target.value }))}
              className={sharedStyles.form.select}
            >
              <option value="">Select a product</option>
              {availableProducts.map(product => (
                <option key={product.id} value={product.id}>
                  {product.name} (${product.price})
                </option>
              ))}
            </select>
            <input
              type="number"
              min="1"
              value={selectedProduct.quantity}
              onChange={(e) => setSelectedProduct(prev => ({ ...prev, quantity: parseInt(e.target.value) || 1 }))}
              className={sharedStyles.form.input}
              style={{ width: '100px' }}
            />
            <button
              type="button"
              onClick={addProduct}
              className={combineClasses(sharedStyles.button.base, sharedStyles.button.secondary)}
            >
              Add
            </button>
          </div>
          <div className="space-y-2">
            {formData.products.map((product, index) => {
              const productInfo = availableProducts.find(p => p.id === product.productId);
              return (
                <div key={index} className="flex justify-between items-center p-2 bg-gray-800 rounded">
                  <span>{productInfo?.name} x {product.quantity}</span>
                  <div className="flex items-center space-x-2">
                    <span>${product.price * product.quantity}</span>
                    <button
                      type="button"
                      onClick={() => removeProduct(index)}
                      className="text-red-500 hover:text-red-400"
                    >
                      Remove
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <div className={sharedStyles.form.group}>
          <label htmlFor="shippingAddress" className={sharedStyles.form.label}>
            Shipping Address
          </label>
          <textarea
            id="shippingAddress"
            name="shippingAddress"
            value={formData.shippingAddress}
            onChange={handleChange}
            className={sharedStyles.form.textarea}
            rows={3}
            required
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className={sharedStyles.form.group}>
            <label htmlFor="paymentMethod" className={sharedStyles.form.label}>
              Payment Method
            </label>
            <select
              id="paymentMethod"
              name="paymentMethod"
              value={formData.paymentMethod}
              onChange={handleChange}
              className={sharedStyles.form.select}
              required
            >
              <option value="">Select payment method</option>
              <option value="credit_card">Credit Card</option>
              <option value="debit_card">Debit Card</option>
              <option value="bank_transfer">Bank Transfer</option>
              <option value="cash">Cash</option>
            </select>
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
              <option value="pending">Pending</option>
              <option value="processing">Processing</option>
              <option value="completed">Completed</option>
              <option value="cancelled">Cancelled</option>
            </select>
          </div>
        </div>

        <div className={sharedStyles.form.group}>
          <label htmlFor="notes" className={sharedStyles.form.label}>
            Notes
          </label>
          <textarea
            id="notes"
            name="notes"
            value={formData.notes}
            onChange={handleChange}
            className={sharedStyles.form.textarea}
            rows={3}
          />
        </div>

        <div className="flex justify-between items-center">
          <div className="text-xl font-semibold">
            Total: ${formData.totalAmount}
          </div>
          <div className="flex space-x-4">
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
              Add Order
            </button>
          </div>
        </div>
      </form>
    </Modal>
  );
};
