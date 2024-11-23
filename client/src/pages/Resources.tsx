import React, { useState, useEffect } from 'react';
import { PageWrapper } from '../components/layout/PageWrapper';
import ResourceList from '../components/resources/ResourceList';
import { sharedStyles, combineClasses } from '../styles/shared';
import { useQuery } from '@tanstack/react-query';
import { resourcesApi } from '../services/api';
import { FiBookOpen, FiVideo, FiDownload } from 'react-icons/fi';
import { motion } from 'framer-motion';

interface Resource {
  id: string;
  title: string;
  description: string;
  type: 'document' | 'video' | 'link' | 'other';
  url: string;
  category: string;
  tags: string[];
  uploadDate: string;
  lastModified: string;
  status: 'active' | 'archived' | 'draft';
  fileSize?: number;
  downloadCount: number;
  author: string;
}

const fadeInUp = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.5 }
};

const staggerContainer = {
  animate: {
    transition: {
      staggerChildren: 0.1
    }
  }
};

const Resources = () => {
  const [email, setEmail] = useState('');
  const { data: resources = [], isLoading } = useQuery({
    queryKey: ['resources'],
    queryFn: resourcesApi.getAll,
  });

  const handleNewsletterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: Implement newsletter subscription
    console.log('Newsletter subscription:', email);
    setEmail('');
  };

  const stats = [
    { icon: <FiBookOpen className="w-8 h-8" />, value: '200+', label: 'Learning Resources' },
    { icon: <FiVideo className="w-8 h-8" />, value: '50+', label: 'Video Tutorials' },
    { icon: <FiDownload className="w-8 h-8" />, value: '5000+', label: 'Downloads' },
  ];

  return (
    <PageWrapper>
      {/* Hero Section */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="text-center py-12 px-4 sm:px-6 lg:px-8 bg-gradient-to-r from-gray-900 to-gray-800 rounded-2xl mb-12"
      >
        <motion.h1
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.6 }}
          className={combineClasses(sharedStyles.text.h1, "mb-4")}
        >
          Career Development Resources
        </motion.h1>
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4, duration: 0.6 }}
          className={combineClasses(sharedStyles.text.subtitle, "max-w-2xl mx-auto mb-8")}
        >
          Access our comprehensive collection of career resources, tools, and guides designed to help you succeed in your professional journey. From resume templates to industry insights, we've got everything you need to advance your career.
        </motion.p>
        
        {/* Stats */}
        <motion.div
          variants={staggerContainer}
          initial="initial"
          animate="animate"
          className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto mt-12"
        >
          {stats.map((stat, index) => (
            <motion.div
              key={index}
              variants={fadeInUp}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="bg-gray-800 rounded-xl p-6"
            >
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.2 * index, duration: 0.4 }}
                className="text-purple-400 mb-3 flex justify-center"
              >
                {stat.icon}
              </motion.div>
              <motion.div className="text-2xl font-bold text-white mb-1">{stat.value}</motion.div>
              <motion.div className="text-gray-400">{stat.label}</motion.div>
            </motion.div>
          ))}
        </motion.div>
      </motion.div>

      {/* Categories Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6, duration: 0.6 }}
        className="mb-12"
      >
        <motion.h2
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.7, duration: 0.6 }}
          className={sharedStyles.text.h2}
        >
          Browse by Category
        </motion.h2>
        <motion.div
          variants={staggerContainer}
          initial="initial"
          animate="animate"
          className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6"
        >
          {['Career Development', 'Job Search', 'Interview Prep', 'Industry Insights'].map((category, index) => (
            <motion.button
              key={category}
              variants={fadeInUp}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="bg-gray-800 hover:bg-gray-700 text-white rounded-lg py-3 px-4 text-sm font-medium transition-colors duration-200"
            >
              {category}
            </motion.button>
          ))}
        </motion.div>
      </motion.div>

      {/* Resources List */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.8, duration: 0.6 }}
      >
        {isLoading ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex justify-center items-center py-12"
          >
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
              className="rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-500"
            />
          </motion.div>
        ) : (
          <ResourceList resources={resources} />
        )}
      </motion.div>

      {/* Newsletter Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
        className="mt-16 bg-gradient-to-r from-purple-900 to-indigo-900 rounded-2xl p-8 text-center"
      >
        <motion.h2
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.2, duration: 0.6 }}
          className={combineClasses(sharedStyles.text.h2, "mb-4")}
        >
          Stay Updated with Latest Resources
        </motion.h2>
        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.4, duration: 0.6 }}
          className={combineClasses(sharedStyles.text.subtitle, "max-w-2xl mx-auto mb-8")}
        >
          Subscribe to our newsletter and get weekly updates on new resources, career tips, and industry insights delivered straight to your inbox.
        </motion.p>
        <motion.form
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.6, duration: 0.6 }}
          onSubmit={handleNewsletterSubmit}
          className="max-w-md mx-auto flex gap-4"
        >
          <motion.input
            whileFocus={{ scale: 1.02 }}
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Enter your email"
            className="flex-1 px-4 py-2 rounded-lg bg-gray-800 border border-gray-700 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500"
            required
          />
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            type="submit"
            className={combineClasses(
              sharedStyles.button.base,
              sharedStyles.button.primary,
              "whitespace-nowrap"
            )}
          >
            Subscribe Now
          </motion.button>
        </motion.form>
      </motion.div>
    </PageWrapper>
  );
};

export default Resources;
