import React from 'react';
import { motion } from 'framer-motion';
import { useForm } from 'react-hook-form';
import { useMutation } from '@tanstack/react-query';
import axios from 'axios';
import { toast } from 'react-hot-toast';

interface RegistrationFormData {
  email: string;
  company: string;
  state: string;
  firstName: string;
  lastName: string;
  marketingOptIn: boolean;
}

const ReportRegistration = ({ onSuccess }: { onSuccess?: () => void }) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset
  } = useForm<RegistrationFormData>();

  const mutation = useMutation({
    mutationFn: async (data: RegistrationFormData) => {
      const response = await axios.post('/api/report-registrations', data);
      return response.data;
    },
    onSuccess: () => {
      toast.success('Registration successful! Check your email for the report.');
      reset();
      onSuccess?.();
    },
    onError: (error) => {
      toast.error('Registration failed. Please try again.');
      console.error('Registration error:', error);
    }
  });

  const states = [
    'Victoria',
    'New South Wales',
    'Queensland',
    'Western Australia',
    'South Australia',
    'Tasmania',
    'Northern Territory',
    'Australian Capital Territory'
  ];

  const formVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 10 },
    visible: { opacity: 1, y: 0 }
  };

  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={formVariants}
      className="max-w-md mx-auto bg-gray-800 p-8 rounded-lg shadow-lg"
    >
      <h2 className="text-2xl font-bold mb-6 text-center">Register for Full Report</h2>
      <form onSubmit={handleSubmit((data) => mutation.mutate(data))}>
        <motion.div variants={itemVariants} className="mb-4">
          <label className="block text-sm font-medium mb-2" htmlFor="email">
            Email Address *
          </label>
          <input
            {...register('email', {
              required: 'Email is required',
              pattern: {
                value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                message: 'Invalid email address'
              }
            })}
            type="email"
            id="email"
            className="w-full px-3 py-2 bg-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
            placeholder="your@email.com"
          />
          {errors.email && (
            <p className="mt-1 text-sm text-red-500">{errors.email.message}</p>
          )}
        </motion.div>

        <div className="grid grid-cols-2 gap-4">
          <motion.div variants={itemVariants} className="mb-4">
            <label className="block text-sm font-medium mb-2" htmlFor="firstName">
              First Name *
            </label>
            <input
              {...register('firstName', { required: 'First name is required' })}
              type="text"
              id="firstName"
              className="w-full px-3 py-2 bg-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
              placeholder="John"
            />
            {errors.firstName && (
              <p className="mt-1 text-sm text-red-500">{errors.firstName.message}</p>
            )}
          </motion.div>

          <motion.div variants={itemVariants} className="mb-4">
            <label className="block text-sm font-medium mb-2" htmlFor="lastName">
              Last Name *
            </label>
            <input
              {...register('lastName', { required: 'Last name is required' })}
              type="text"
              id="lastName"
              className="w-full px-3 py-2 bg-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
              placeholder="Doe"
            />
            {errors.lastName && (
              <p className="mt-1 text-sm text-red-500">{errors.lastName.message}</p>
            )}
          </motion.div>
        </div>

        <motion.div variants={itemVariants} className="mb-4">
          <label className="block text-sm font-medium mb-2" htmlFor="company">
            Company Name *
          </label>
          <input
            {...register('company', { required: 'Company name is required' })}
            type="text"
            id="company"
            className="w-full px-3 py-2 bg-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
            placeholder="Company Pty Ltd"
          />
          {errors.company && (
            <p className="mt-1 text-sm text-red-500">{errors.company.message}</p>
          )}
        </motion.div>

        <motion.div variants={itemVariants} className="mb-6">
          <label className="block text-sm font-medium mb-2" htmlFor="state">
            State *
          </label>
          <select
            {...register('state', { required: 'State is required' })}
            id="state"
            className="w-full px-3 py-2 bg-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
          >
            <option value="">Select a state</option>
            {states.map((state) => (
              <option key={state} value={state}>
                {state}
              </option>
            ))}
          </select>
          {errors.state && (
            <p className="mt-1 text-sm text-red-500">{errors.state.message}</p>
          )}
        </motion.div>

        <motion.div variants={itemVariants} className="mb-6">
          <label className="flex items-center space-x-3">
            <input
              {...register('marketingOptIn')}
              type="checkbox"
              className="form-checkbox h-5 w-5 text-purple-500 rounded focus:ring-purple-500"
            />
            <span className="text-sm text-gray-300">
              I agree to receive marketing communications about VCC products, services, and events.
              You can unsubscribe at any time.
            </span>
          </label>
        </motion.div>

        <motion.button
          variants={itemVariants}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          type="submit"
          disabled={mutation.isPending}
          className="w-full px-6 py-3 bg-purple-500 text-white rounded-md hover:bg-purple-600 
                   transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {mutation.isPending ? 'Registering...' : 'Register Now'}
        </motion.button>
      </form>
    </motion.div>
  );
};

export default ReportRegistration;
