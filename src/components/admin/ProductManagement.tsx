import React, { useState, useEffect } from 'react';
import { Product } from '../../types/product';

interface ProductFormData {
    name: string;
    description: string;
    price: number;
    category: 'subscription' | 'service' | 'report';
    features: string[];
    xeroItemCode?: string;
    taxRate?: number;
    recurringBilling?: {
        interval: 'month' | 'year';
        intervalCount: number;
    };
}

export const ProductManagement: React.FC = () => {
    const [products, setProducts] = useState<Product[]>([]);
    const [formData, setFormData] = useState<ProductFormData>({
        name: '',
        description: '',
        price: 0,
        category: 'service',
        features: [],
    });
    const [isEditing, setIsEditing] = useState<string | null>(null);

    useEffect(() => {
        fetchProducts();
    }, []);

    const fetchProducts = async () => {
        try {
            const response = await fetch('/api/products');
            if (!response.ok) throw new Error('Failed to fetch products');
            const data = await response.json();
            setProducts(data);
        } catch (error) {
            console.error('Error fetching products:', error);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const endpoint = isEditing ? `/api/products/${isEditing}` : '/api/products';
            const method = isEditing ? 'PUT' : 'POST';

            const response = await fetch(endpoint, {
                method,
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData),
            });

            if (!response.ok) throw new Error('Failed to save product');

            fetchProducts();
            resetForm();
        } catch (error) {
            console.error('Error saving product:', error);
        }
    };

    const handleDelete = async (productId: string) => {
        if (!confirm('Are you sure you want to delete this product?')) return;

        try {
            const response = await fetch(`/api/products/${productId}`, {
                method: 'DELETE',
            });

            if (!response.ok) throw new Error('Failed to delete product');

            fetchProducts();
        } catch (error) {
            console.error('Error deleting product:', error);
        }
    };

    const resetForm = () => {
        setFormData({
            name: '',
            description: '',
            price: 0,
            category: 'service',
            features: [],
        });
        setIsEditing(null);
    };

    return (
        <div className="container mx-auto p-4">
            <h1 className="text-2xl font-bold mb-4">Product Management</h1>
            
            <form onSubmit={handleSubmit} className="mb-8 space-y-4">
                <div>
                    <label className="block mb-1">Name</label>
                    <input
                        type="text"
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        className="w-full p-2 border rounded"
                        required
                    />
                </div>

                <div>
                    <label className="block mb-1">Description</label>
                    <textarea
                        value={formData.description}
                        onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                        className="w-full p-2 border rounded"
                        required
                    />
                </div>

                <div>
                    <label className="block mb-1">Price</label>
                    <input
                        type="number"
                        value={formData.price}
                        onChange={(e) => setFormData({ ...formData, price: Number(e.target.value) })}
                        className="w-full p-2 border rounded"
                        required
                    />
                </div>

                <div>
                    <label className="block mb-1">Category</label>
                    <select
                        value={formData.category}
                        onChange={(e) => setFormData({ ...formData, category: e.target.value as any })}
                        className="w-full p-2 border rounded"
                    >
                        <option value="subscription">Subscription</option>
                        <option value="service">Service</option>
                        <option value="report">Report</option>
                    </select>
                </div>

                {formData.category === 'subscription' && (
                    <div>
                        <label className="block mb-1">Billing Interval</label>
                        <select
                            value={formData.recurringBilling?.interval || 'month'}
                            onChange={(e) => setFormData({
                                ...formData,
                                recurringBilling: {
                                    interval: e.target.value as 'month' | 'year',
                                    intervalCount: formData.recurringBilling?.intervalCount || 1,
                                },
                            })}
                            className="w-full p-2 border rounded"
                        >
                            <option value="month">Monthly</option>
                            <option value="year">Yearly</option>
                        </select>
                    </div>
                )}

                <div>
                    <label className="block mb-1">Xero Item Code</label>
                    <input
                        type="text"
                        value={formData.xeroItemCode || ''}
                        onChange={(e) => setFormData({ ...formData, xeroItemCode: e.target.value })}
                        className="w-full p-2 border rounded"
                    />
                </div>

                <div>
                    <label className="block mb-1">Tax Rate (%)</label>
                    <input
                        type="number"
                        value={formData.taxRate || ''}
                        onChange={(e) => setFormData({ ...formData, taxRate: Number(e.target.value) })}
                        className="w-full p-2 border rounded"
                    />
                </div>

                <div className="flex gap-2">
                    <button
                        type="submit"
                        className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                    >
                        {isEditing ? 'Update Product' : 'Add Product'}
                    </button>
                    {isEditing && (
                        <button
                            type="button"
                            onClick={resetForm}
                            className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600"
                        >
                            Cancel
                        </button>
                    )}
                </div>
            </form>

            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {products.map((product) => (
                    <div key={product.id} className="border rounded p-4">
                        <h3 className="text-lg font-semibold">{product.name}</h3>
                        <p className="text-gray-600">{product.description}</p>
                        <p className="text-lg font-bold mt-2">
                            ${product.price.toFixed(2)} {product.currency}
                        </p>
                        <div className="mt-4 flex gap-2">
                            <button
                                onClick={() => {
                                    setIsEditing(product.id);
                                    setFormData({
                                        name: product.name,
                                        description: product.description,
                                        price: product.price,
                                        category: product.category,
                                        features: product.features,
                                        xeroItemCode: product.metadata.xeroItemCode,
                                        taxRate: product.metadata.taxRate,
                                        recurringBilling: product.metadata.recurringBilling,
                                    });
                                }}
                                className="px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600"
                            >
                                Edit
                            </button>
                            <button
                                onClick={() => handleDelete(product.id)}
                                className="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600"
                            >
                                Delete
                            </button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};
