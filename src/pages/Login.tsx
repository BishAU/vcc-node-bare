import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { PageWrapper } from '../components/layout/PageWrapper';
import { sharedStyles, combineClasses } from '../styles/shared';
import { FiMail, FiLock } from 'react-icons/fi';
import { useAuth } from '../contexts/AuthContext';

const Login = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    rememberMe: false,
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setError('');
      setLoading(true);
      await login(formData.email, formData.password);
      navigate('/dashboard');
    } catch (err) {
      setError('Failed to sign in');
      console.error('Login error:', err);
    } finally {
      setLoading(false);
    }
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
        <div className="max-w-md mx-auto">
          <h1 className={sharedStyles.heading}>Welcome Back</h1>

          <div className={sharedStyles.card}>
            {error && (
              <div className="mb-4 p-3 rounded bg-red-500/10 border border-red-500/20 text-red-400 text-sm">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Email Input */}
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

              {/* Password Input */}
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
                    placeholder="Enter your password"
                  />
                </div>
              </div>

              {/* Remember Me & Forgot Password */}
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <input
                    id="rememberMe"
                    name="rememberMe"
                    type="checkbox"
                    checked={formData.rememberMe}
                    onChange={handleChange}
                    className="h-4 w-4 rounded border-gray-600 bg-gray-700 text-purple-500 focus:ring-purple-500"
                  />
                  <label htmlFor="rememberMe" className="ml-2 block text-sm text-gray-300">
                    Remember me
                  </label>
                </div>
                <Link
                  to="/forgot-password"
                  className="text-sm font-medium text-purple-400 hover:text-purple-300"
                >
                  Forgot password?
                </Link>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={loading}
                className={combineClasses(
                  sharedStyles.button.base,
                  sharedStyles.button.primary,
                  'w-full',
                  loading && 'opacity-50 cursor-not-allowed'
                )}
              >
                {loading ? 'Signing in...' : 'Sign In'}
              </button>

              {/* Register Link */}
              <div className="text-center text-sm text-gray-300">
                Don't have an account?{' '}
                <Link
                  to="/register"
                  className="font-medium text-purple-400 hover:text-purple-300"
                >
                  Sign up
                </Link>
              </div>
            </form>
          </div>
        </div>
      </div>
    </PageWrapper>
  );
};

export default Login;