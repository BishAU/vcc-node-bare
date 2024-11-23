import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { PageWrapper } from '../components/layout/PageWrapper';
import { sharedStyles, combineClasses } from '../styles/shared';
import { FiUser, FiMail, FiLock, FiPhone } from 'react-icons/fi';

const Register = () => {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
    agreeToTerms: false,
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle registration submission
    console.log('Registration submitted:', formData);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  return (
    <PageWrapper>
      <div className={sharedStyles.pageContainer}>
        <div className="max-w-lg mx-auto">
          <h1 className={sharedStyles.heading}>Create an Account</h1>
          
          <div className={sharedStyles.card}>
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Name Fields */}
              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                <div className={sharedStyles.form.group}>
                  <label htmlFor="firstName" className={sharedStyles.form.label}>
                    First Name
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <FiUser className="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                      id="firstName"
                      name="firstName"
                      type="text"
                      required
                      value={formData.firstName}
                      onChange={handleChange}
                      className={combineClasses(sharedStyles.form.input, 'pl-10')}
                      placeholder="First name"
                    />
                  </div>
                </div>

                <div className={sharedStyles.form.group}>
                  <label htmlFor="lastName" className={sharedStyles.form.label}>
                    Last Name
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <FiUser className="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                      id="lastName"
                      name="lastName"
                      type="text"
                      required
                      value={formData.lastName}
                      onChange={handleChange}
                      className={combineClasses(sharedStyles.form.input, 'pl-10')}
                      placeholder="Last name"
                    />
                  </div>
                </div>
              </div>

              {/* Email Field */}
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
                    required
                    value={formData.email}
                    onChange={handleChange}
                    className={combineClasses(sharedStyles.form.input, 'pl-10')}
                    placeholder="Enter your email"
                  />
                </div>
              </div>

              {/* Phone Field */}
              <div className={sharedStyles.form.group}>
                <label htmlFor="phone" className={sharedStyles.form.label}>
                  Phone Number
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <FiPhone className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    id="phone"
                    name="phone"
                    type="tel"
                    value={formData.phone}
                    onChange={handleChange}
                    className={combineClasses(sharedStyles.form.input, 'pl-10')}
                    placeholder="Enter your phone number"
                  />
                </div>
              </div>

              {/* Password Fields */}
              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                <div className={sharedStyles.form.group}>
                  <label htmlFor="password" className={sharedStyles.form.label}>
                    Password
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <FiLock className="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                      id="password"
                      name="password"
                      type="password"
                      required
                      value={formData.password}
                      onChange={handleChange}
                      className={combineClasses(sharedStyles.form.input, 'pl-10')}
                      placeholder="Create a password"
                    />
                  </div>
                </div>

                <div className={sharedStyles.form.group}>
                  <label htmlFor="confirmPassword" className={sharedStyles.form.label}>
                    Confirm Password
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <FiLock className="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                      id="confirmPassword"
                      name="confirmPassword"
                      type="password"
                      required
                      value={formData.confirmPassword}
                      onChange={handleChange}
                      className={combineClasses(sharedStyles.form.input, 'pl-10')}
                      placeholder="Confirm your password"
                    />
                  </div>
                </div>
              </div>

              {/* Terms Agreement */}
              <div className="flex items-center">
                <input
                  id="agreeToTerms"
                  name="agreeToTerms"
                  type="checkbox"
                  required
                  checked={formData.agreeToTerms}
                  onChange={handleChange}
                  className="h-4 w-4 rounded border-gray-600 bg-gray-700 text-purple-500 focus:ring-purple-500"
                />
                <label htmlFor="agreeToTerms" className="ml-2 block text-sm text-gray-300">
                  I agree to the{' '}
                  <Link to="/terms" className="text-purple-400 hover:text-purple-300">
                    Terms and Conditions
                  </Link>
                </label>
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
                Create Account
              </button>

              {/* Login Link */}
              <div className="text-center text-sm text-gray-300">
                Already have an account?{' '}
                <Link
                  to="/login"
                  className="font-medium text-purple-400 hover:text-purple-300"
                >
                  Sign in
                </Link>
              </div>
            </form>
          </div>
        </div>
      </div>
    </PageWrapper>
  );
};

export default Register;
