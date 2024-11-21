import React, { useState } from 'react';

const Donate = () => {
  const [amount, setAmount] = useState('');
  const [customAmount, setCustomAmount] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('card');

  const predefinedAmounts = ['10', '25', '50', '100'];

  const handleAmountClick = (value: string) => {
    setAmount(value);
    setCustomAmount('');
  };

  const handleCustomAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    if (/^\d*\.?\d*$/.test(value)) {
      setCustomAmount(value);
      setAmount('custom');
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle donation submission
    console.log('Donation submitted:', {
      amount: amount === 'custom' ? customAmount : amount,
      paymentMethod,
    });
  };

  return (
    <div className="min-h-screen bg-gray-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        <div className="text-center">
          <h2 className="text-3xl font-extrabold text-gray-900 sm:text-4xl">
            Support Our Mission
          </h2>
          <p className="mt-4 text-lg text-gray-500">
            Your donation helps us continue developing and improving our platform for everyone.
          </p>
        </div>

        <div className="mt-12 bg-white shadow rounded-lg">
          <form onSubmit={handleSubmit} className="p-6 space-y-8">
            <div>
              <label className="text-lg font-medium text-gray-900">Choose Amount</label>
              <div className="mt-4 grid grid-cols-2 gap-4 sm:grid-cols-4">
                {predefinedAmounts.map((value) => (
                  <button
                    key={value}
                    type="button"
                    className={`${
                      amount === value
                        ? 'bg-indigo-600 text-white'
                        : 'bg-white text-gray-900 border-gray-300'
                    } border rounded-md py-3 px-4 text-sm font-medium hover:bg-indigo-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500`}
                    onClick={() => handleAmountClick(value)}
                  >
                    ${value}
                  </button>
                ))}
              </div>
              <div className="mt-4">
                <label htmlFor="custom-amount" className="sr-only">
                  Custom Amount
                </label>
                <div className="relative rounded-md shadow-sm">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <span className="text-gray-500 sm:text-sm">$</span>
                  </div>
                  <input
                    type="text"
                    id="custom-amount"
                    className="focus:ring-indigo-500 focus:border-indigo-500 block w-full pl-7 pr-12 sm:text-sm border-gray-300 rounded-md"
                    placeholder="Custom Amount"
                    value={customAmount}
                    onChange={handleCustomAmountChange}
                    onClick={() => setAmount('custom')}
                  />
                </div>
              </div>
            </div>

            <div>
              <label className="text-lg font-medium text-gray-900">Payment Method</label>
              <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
                <button
                  type="button"
                  className={`${
                    paymentMethod === 'card'
                      ? 'bg-indigo-600 text-white'
                      : 'bg-white text-gray-900 border-gray-300'
                  } border rounded-md py-3 px-4 text-sm font-medium hover:bg-indigo-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 flex items-center justify-center`}
                  onClick={() => setPaymentMethod('card')}
                >
                  Credit/Debit Card
                </button>
                <button
                  type="button"
                  className={`${
                    paymentMethod === 'paypal'
                      ? 'bg-indigo-600 text-white'
                      : 'bg-white text-gray-900 border-gray-300'
                  } border rounded-md py-3 px-4 text-sm font-medium hover:bg-indigo-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 flex items-center justify-center`}
                  onClick={() => setPaymentMethod('paypal')}
                >
                  PayPal
                </button>
              </div>
            </div>

            <div>
              <button
                type="submit"
                className="w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                Donate Now
              </button>
            </div>
          </form>
        </div>

        <div className="mt-8 bg-white shadow rounded-lg overflow-hidden">
          <div className="px-4 py-5 sm:p-6">
            <h3 className="text-lg font-medium text-gray-900">
              Other Ways to Support
            </h3>
            <div className="mt-2 text-sm text-gray-500">
              <p>
                Interested in corporate sponsorship or other ways to support our mission?
                Contact our partnership team to learn more.
              </p>
            </div>
            <div className="mt-5">
              <button
                type="button"
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                Contact Us
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Donate;
