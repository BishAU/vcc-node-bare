import React from 'react';
import { usePayment } from '../../contexts/PaymentContext';
import { Product } from '../../lib/api/types';
import { motion } from 'framer-motion';
import { Check } from 'lucide-react';

interface PricingPlanProps {
  product: Product;
  isPopular?: boolean;
}

const PricingPlan: React.FC<PricingPlanProps> = ({ product, isPopular }) => {
  const { initiateSubscription, isLoading } = usePayment();

  const handleSubscribe = async () => {
    try {
      await initiateSubscription(product.id);
    } catch (error) {
      console.error('Error initiating subscription:', error);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className={`relative p-8 bg-white rounded-2xl shadow-lg ${
        isPopular ? 'ring-2 ring-blue-500' : ''
      }`}
    >
      {isPopular && (
        <div className="absolute -top-4 left-1/2 -translate-x-1/2">
          <span className="bg-blue-500 text-white px-3 py-1 rounded-full text-sm font-medium">
            Most Popular
          </span>
        </div>
      )}

      <div className="text-center">
        <h3 className="text-xl font-semibold text-gray-900">{product.name}</h3>
        <p className="mt-2 text-gray-500">{product.description}</p>
        <div className="mt-4">
          <span className="text-4xl font-bold text-gray-900">
            £{(product.priceInCents / 100).toFixed(2)}
          </span>
          {product.interval && (
            <span className="text-gray-500">/{product.interval}</span>
          )}
        </div>
      </div>

      <ul className="mt-8 space-y-4">
        {product.features.map((feature, index) => (
          <li key={index} className="flex items-center">
            <Check className="h-5 w-5 text-blue-500 mr-2" />
            <span className="text-gray-600">{feature}</span>
          </li>
        ))}
      </ul>

      <button
        onClick={handleSubscribe}
        disabled={isLoading}
        className={`mt-8 w-full py-3 px-4 rounded-lg font-medium text-white 
          ${isPopular ? 'bg-blue-500 hover:bg-blue-600' : 'bg-gray-800 hover:bg-gray-900'}
          disabled:opacity-50 disabled:cursor-not-allowed transition-colors`}
      >
        {isLoading ? 'Processing...' : 'Subscribe Now'}
      </button>
    </motion.div>
  );
};

export const PricingPlans: React.FC = () => {
  const { products } = usePayment();

  // Sort products by price
  const sortedProducts = [...products].sort((a, b) => a.priceInCents - b.priceInCents);

  return (
    <div className="py-12 px-4 sm:px-6 lg:px-8">
      <div className="text-center">
        <h2 className="text-3xl font-bold text-gray-900 sm:text-4xl">
          Choose Your Plan
        </h2>
        <p className="mt-4 text-lg text-gray-600">
          Select the perfect plan for your design needs
        </p>
      </div>

      <div className="mt-16 grid gap-8 md:grid-cols-2 lg:grid-cols-3 lg:gap-12 max-w-7xl mx-auto">
        {sortedProducts.map((product, index) => (
          <PricingPlan
            key={product.id}
            product={product}
            isPopular={index === 1} // Middle plan is popular
          />
        ))}
      </div>

      <div className="mt-12 text-center text-gray-600">
        <p>All plans include access to our design tools and community</p>
        <p className="mt-2">
          Need a custom plan?{' '}
          <a href="/contact" className="text-blue-500 hover:text-blue-600">
            Contact us
          </a>
        </p>
      </div>
    </div>
  );
};
