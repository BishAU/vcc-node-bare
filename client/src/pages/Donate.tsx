import React, { useState } from 'react';
import { PageWrapper } from '../components/layout/PageWrapper';
import { sharedStyles, combineClasses } from '../styles/shared';
import { FiHeart, FiDollarSign, FiClock, FiGift } from 'react-icons/fi';

const Donate = () => {
  const [donationAmount, setDonationAmount] = useState('');
  const [donationType, setDonationType] = useState('one-time');
  const [customAmount, setCustomAmount] = useState('');

  const predefinedAmounts = ['25', '50', '100', '250'];

  const impactMetrics = [
    {
      icon: FiHeart,
      amount: '$25',
      description: 'Provides career counseling session for one job seeker',
    },
    {
      icon: FiDollarSign,
      amount: '$50',
      description: 'Sponsors a professional skills workshop',
    },
    {
      icon: FiClock,
      amount: '$100',
      description: 'Funds a month of job search support services',
    },
    {
      icon: FiGift,
      amount: '$250',
      description: 'Enables comprehensive career transition program',
    },
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle donation submission
    console.log('Donation submitted:', {
      amount: customAmount || donationAmount,
      type: donationType,
    });
  };

  return (
    <PageWrapper>
      <div className={sharedStyles.pageContainer}>
        <div className={sharedStyles.contentWrapper}>
          <h1 className={sharedStyles.heading}>Support Our Mission</h1>

          {/* Hero Section */}
          <div className={sharedStyles.card}>
            <div className="prose prose-invert max-w-none">
              <p className="text-xl text-gray-300 leading-relaxed">
                Your donation helps us provide essential employment services and career development
                opportunities to those who need them most. Every contribution makes a difference
                in someone's career journey.
              </p>
            </div>
          </div>

          {/* Impact Metrics */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mt-8">
            {impactMetrics.map((metric) => (
              <div key={metric.amount} className={combineClasses(
                sharedStyles.card,
                'transform hover:scale-105 transition-transform duration-200'
              )}>
                <div className="flex flex-col items-center text-center">
                  <div className="bg-gradient-to-r from-purple-500 to-pink-500 p-3 rounded-xl mb-4">
                    <metric.icon className="w-6 h-6 text-white" />
                  </div>
                  <p className="text-2xl font-bold text-white mb-2">{metric.amount}</p>
                  <p className="text-gray-300">{metric.description}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Donation Form */}
          <div className={`${sharedStyles.card} mt-8`}>
            <h2 className={sharedStyles.cardHeader}>Make a Donation</h2>
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Donation Type */}
              <div className="grid grid-cols-2 gap-4">
                <button
                  type="button"
                  onClick={() => setDonationType('one-time')}
                  className={combineClasses(
                    'py-3 px-4 rounded-xl font-medium transition-colors duration-200',
                    donationType === 'one-time'
                      ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white'
                      : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                  )}
                >
                  One-time Donation
                </button>
                <button
                  type="button"
                  onClick={() => setDonationType('monthly')}
                  className={combineClasses(
                    'py-3 px-4 rounded-xl font-medium transition-colors duration-200',
                    donationType === 'monthly'
                      ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white'
                      : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                  )}
                >
                  Monthly Donation
                </button>
              </div>

              {/* Predefined Amounts */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {predefinedAmounts.map((amount) => (
                  <button
                    key={amount}
                    type="button"
                    onClick={() => {
                      setDonationAmount(amount);
                      setCustomAmount('');
                    }}
                    className={combineClasses(
                      'py-3 px-4 rounded-xl font-medium transition-colors duration-200',
                      donationAmount === amount
                        ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white'
                        : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                    )}
                  >
                    ${amount}
                  </button>
                ))}
              </div>

              {/* Custom Amount */}
              <div className={sharedStyles.form.group}>
                <label htmlFor="customAmount" className={sharedStyles.form.label}>
                  Custom Amount
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">$</span>
                  <input
                    type="number"
                    id="customAmount"
                    value={customAmount}
                    onChange={(e) => {
                      setCustomAmount(e.target.value);
                      setDonationAmount('');
                    }}
                    className={combineClasses(sharedStyles.form.input, 'pl-8')}
                    placeholder="Enter amount"
                    min="1"
                  />
                </div>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                className={combineClasses(
                  sharedStyles.button.base,
                  sharedStyles.button.primary,
                  'w-full'
                )}
              >
                Donate Now
              </button>
            </form>
          </div>

          {/* Additional Information */}
          <div className={`${sharedStyles.card} mt-8`}>
            <h2 className={sharedStyles.cardHeader}>Other Ways to Support</h2>
            <div className="prose prose-invert max-w-none">
              <p className="text-gray-300">
                In addition to monetary donations, we welcome support through volunteering,
                partnerships, and in-kind donations. Contact us to learn more about how
                you can contribute to our mission.
              </p>
            </div>
          </div>
        </div>
      </div>
    </PageWrapper>
  );
};

export default Donate;
