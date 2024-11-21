import React, { useEffect } from 'react';
import { loadStripe } from '@stripe/stripe-js';
import {
  PaymentElement,
  Elements,
  useStripe,
  useElements,
} from '@stripe/react-stripe-js';
import { usePayment } from '../../contexts/PaymentContext';
import { useAuth } from '../../contexts/AuthContext';

// Initialize Stripe
const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLIC_KEY);

interface CheckoutFormProps {
  clientSecret: string;
  onSuccess?: () => void;
  onError?: (error: Error) => void;
}

const CheckoutForm: React.FC<CheckoutFormProps> = ({
  clientSecret,
  onSuccess,
  onError,
}) => {
  const stripe = useStripe();
  const elements = useElements();
  const [error, setError] = React.useState<string | null>(null);
  const [isProcessing, setIsProcessing] = React.useState(false);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    if (!stripe || !elements) {
      return;
    }

    setIsProcessing(true);

    try {
      const { error: submitError } = await elements.submit();
      if (submitError) {
        setError(submitError.message || 'An error occurred');
        onError?.(submitError);
        return;
      }

      const { error: confirmError } = await stripe.confirmPayment({
        elements,
        clientSecret,
        confirmParams: {
          return_url: `${window.location.origin}/payment-success`,
        },
      });

      if (confirmError) {
        setError(confirmError.message || 'An error occurred');
        onError?.(confirmError);
      } else {
        onSuccess?.();
      }
    } catch (error) {
      setError('An unexpected error occurred');
      onError?.(error as Error);
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="w-full max-w-md mx-auto">
      <div className="mb-8">
        <PaymentElement />
      </div>

      {error && (
        <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg text-red-600">
          {error}
        </div>
      )}

      <button
        type="submit"
        disabled={!stripe || isProcessing}
        className="w-full bg-blue-500 hover:bg-blue-600 text-white font-medium py-3 px-4 rounded-lg
          disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
      >
        {isProcessing ? 'Processing...' : 'Pay Now'}
      </button>
    </form>
  );
};

interface CheckoutProps {
  productId: string;
  onSuccess?: () => void;
  onError?: (error: Error) => void;
}

export const Checkout: React.FC<CheckoutProps> = ({
  productId,
  onSuccess,
  onError,
}) => {
  const { user } = useAuth();
  const { initiateCheckout, currentProduct } = usePayment();
  const [clientSecret, setClientSecret] = React.useState<string | null>(null);

  useEffect(() => {
    const getClientSecret = async () => {
      if (!user || !productId) return;

      try {
        const paymentIntent = await initiateCheckout(productId);
        setClientSecret(paymentIntent.client_secret!);
      } catch (error) {
        console.error('Error initiating checkout:', error);
        onError?.(error as Error);
      }
    };

    getClientSecret();
  }, [user, productId]);

  if (!clientSecret || !currentProduct) {
    return (
      <div className="w-full h-64 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500" />
      </div>
    );
  }

  const options = {
    clientSecret,
    appearance: {
      theme: 'stripe',
      variables: {
        colorPrimary: '#3B82F6',
        colorBackground: '#ffffff',
        colorText: '#1f2937',
      },
    },
  };

  return (
    <div className="w-full max-w-4xl mx-auto p-6">
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-gray-900">
          Complete Your Purchase
        </h2>
        <p className="mt-2 text-gray-600">
          You're purchasing {currentProduct.name} for £
          {(currentProduct.priceInCents / 100).toFixed(2)}
        </p>
      </div>

      <Elements stripe={stripePromise} options={options}>
        <CheckoutForm
          clientSecret={clientSecret}
          onSuccess={onSuccess}
          onError={onError}
        />
      </Elements>

      <div className="mt-8 text-center text-sm text-gray-500">
        <p>Your payment is processed securely through Stripe</p>
        <p className="mt-2">
          By completing this purchase you agree to our{' '}
          <a href="/terms" className="text-blue-500 hover:text-blue-600">
            Terms of Service
          </a>
        </p>
      </div>
    </div>
  );
};
