import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { PageWrapper } from '../components/layout/PageWrapper';
import { sharedStyles, combineClasses } from '../styles/shared';
import { FiMail, FiArrowLeft } from 'react-icons/fi';

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: Implement password reset logic
    console.log('Reset password for:', email);
    setSubmitted(true);
  };

  if (submitted) {
    return (
      <PageWrapper>
        <div className={sharedStyles.pageContainer}>
          <div className="max-w-md mx-auto text-center">
            <div className={sharedStyles.card}>
              <div className="space-y-6">
                <h1 className={sharedStyles.heading}>Check Your Email</h1>
                <div className="text-gray-300">
                  We've sent password reset instructions to <span className="font-medium text-purple-400">{email}</span>
                </div>
                <Link
                  to="/login"
                  className={combineClasses(
                    sharedStyles.button.base,
                    sharedStyles.button.secondary,
                    'inline-flex items-center'
                  )}
                >
                  <FiArrowLeft className="mr-2" />
                  Return to login
                </Link>
              </div>
            </div>
          </div>
        </div>
      </PageWrapper>
    );
  }

  return (
    <PageWrapper>
      <div className={sharedStyles.pageContainer}>
        <div className="max-w-md mx-auto">
          <h1 className={sharedStyles.heading}>Reset Your Password</h1>
          
          <div className={sharedStyles.card}>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className={sharedStyles.form.group}>
                <label htmlFor="email" className={sharedStyles.form.label}>
                  Email Address
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <FiMail className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    id="email"
                    name="email"
                    type="email"
                    autoComplete="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className={combineClasses(sharedStyles.form.input, 'pl-10')}
                    placeholder="Enter your email address"
                  />
                </div>
                <p className="mt-2 text-sm text-gray-400">
                  We'll send you instructions to reset your password.
                </p>
              </div>

              <button
                type="submit"
                className={combineClasses(
                  sharedStyles.button.base,
                  sharedStyles.button.primary,
                  'w-full'
                )}
              >
                Send Reset Instructions
              </button>

              <div className="text-center">
                <Link
                  to="/login"
                  className="inline-flex items-center text-sm font-medium text-purple-400 hover:text-purple-300"
                >
                  <FiArrowLeft className="mr-2" />
                  Return to login
                </Link>
              </div>
            </form>
          </div>
        </div>
      </div>
    </PageWrapper>
  );
};

export default ForgotPassword;
