import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuth } from '../contexts/AuthContext';
import { PageWrapper } from '../components/layout/PageWrapper';
import { sharedStyles, combineClasses } from '../styles/shared';
import { FiBriefcase, FiBook, FiCalendar, FiInfo, FiMessageSquare, FiGrid, FiArrowRight } from 'react-icons/fi';

const Home = () => {
  const { user } = useAuth();

  return (
    <PageWrapper>
      <div className={sharedStyles.pageContainer}>
        {/* Hero Section */}
        <div className="text-center mb-16">
          <h1 className={combineClasses(
            sharedStyles.heading,
            'text-4xl sm:text-5xl md:text-6xl leading-tight'
          )}>
            <span className="block">Welcome to</span>
            <span className="block bg-gradient-to-r from-purple-400 to-blue-400 text-transparent bg-clip-text">
              VCC Australia
            </span>
          </h1>
          <p className="mt-6 text-xl text-gray-400 max-w-3xl mx-auto">
            Your trusted partner for comprehensive employment services and workforce solutions.
          </p>
        </div>

        {/* Feature Sections */}
        <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3 mb-16">
          <div className={combineClasses(sharedStyles.card.container, 'hover:border-purple-500/50 transition-colors')}>
            <div className="p-6 space-y-4">
              <div className="w-12 h-12 rounded-lg bg-purple-500/10 flex items-center justify-center">
                <FiBriefcase className="w-6 h-6 text-purple-400" />
              </div>
              <h3 className="text-xl font-semibold text-white">Employment Services</h3>
              <p className="text-gray-400">
                Comprehensive employment solutions tailored to your business needs.
              </p>
              <Link
                to="/services"
                className="inline-flex items-center text-purple-400 hover:text-purple-300 transition-colors"
              >
                Learn more <FiArrowRight className="ml-2" />
              </Link>
            </div>
          </div>

          <div className={combineClasses(sharedStyles.card.container, 'hover:border-blue-500/50 transition-colors')}>
            <div className="p-6 space-y-4">
              <div className="w-12 h-12 rounded-lg bg-blue-500/10 flex items-center justify-center">
                <FiBook className="w-6 h-6 text-blue-400" />
              </div>
              <h3 className="text-xl font-semibold text-white">Resources</h3>
              <p className="text-gray-400">
                Access valuable resources and insights for workforce management.
              </p>
              <Link
                to="/resources"
                className="inline-flex items-center text-blue-400 hover:text-blue-300 transition-colors"
              >
                View resources <FiArrowRight className="ml-2" />
              </Link>
            </div>
          </div>

          <div className={combineClasses(sharedStyles.card.container, 'hover:border-cyan-500/50 transition-colors')}>
            <div className="p-6 space-y-4">
              <div className="w-12 h-12 rounded-lg bg-cyan-500/10 flex items-center justify-center">
                <FiCalendar className="w-6 h-6 text-cyan-400" />
              </div>
              <h3 className="text-xl font-semibold text-white">Events</h3>
              <p className="text-gray-400">
                Stay updated with our latest events and workshops.
              </p>
              <Link
                to="/events"
                className="inline-flex items-center text-cyan-400 hover:text-cyan-300 transition-colors"
              >
                See events <FiArrowRight className="ml-2" />
              </Link>
            </div>
          </div>
        </div>

        {/* Quick Links */}
        <div className="mb-16">
          <h2 className={combineClasses(sharedStyles.heading, 'mb-8')}>Quick Links</h2>
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3">
            <motion.div
              whileHover={{ scale: 1.02, y: -2 }}
              whileTap={{ scale: 0.98 }}
              transition={{ duration: 0.2 }}
            >
              <Link
                to="/services"
                className={combineClasses(
                  sharedStyles.button.base,
                  sharedStyles.button.secondary,
                  'w-full inline-flex items-center justify-center'
                )}
              >
                <FiBriefcase className="w-5 h-5 mr-2" /> Our Services
              </Link>
            </motion.div>
            
            <motion.div
              whileHover={{ scale: 1.02, y: -2 }}
              whileTap={{ scale: 0.98 }}
              transition={{ duration: 0.2 }}
            >
              <Link
                to="/resources"
                className={combineClasses(
                  sharedStyles.button.base,
                  sharedStyles.button.secondary,
                  'w-full inline-flex items-center justify-center'
                )}
              >
                <FiBook className="w-5 h-5 mr-2" /> Resources
              </Link>
            </motion.div>
            
            <motion.div
              whileHover={{ scale: 1.02, y: -2 }}
              whileTap={{ scale: 0.98 }}
              transition={{ duration: 0.2 }}
            >
              <Link
                to="/events"
                className={combineClasses(
                  sharedStyles.button.base,
                  sharedStyles.button.secondary,
                  'w-full inline-flex items-center justify-center'
                )}
              >
                <FiCalendar className="w-5 h-5 mr-2" /> Events
              </Link>
            </motion.div>
            
            <motion.div
              whileHover={{ scale: 1.02, y: -2 }}
              whileTap={{ scale: 0.98 }}
              transition={{ duration: 0.2 }}
            >
              <Link
                to="/about"
                className={combineClasses(
                  sharedStyles.button.base,
                  sharedStyles.button.secondary,
                  'w-full inline-flex items-center justify-center'
                )}
              >
                <FiInfo className="w-5 h-5 mr-2" /> About Us
              </Link>
            </motion.div>
            
            <motion.div
              whileHover={{ scale: 1.02, y: -2 }}
              whileTap={{ scale: 0.98 }}
              transition={{ duration: 0.2 }}
            >
              <Link
                to="/contact"
                className={combineClasses(
                  sharedStyles.button.base,
                  sharedStyles.button.secondary,
                  'w-full inline-flex items-center justify-center'
                )}
              >
                <FiMessageSquare className="w-5 h-5 mr-2" /> Contact
              </Link>
            </motion.div>
            
            {user?.role === 'admin' && (
              <motion.div
                whileHover={{ scale: 1.02, y: -2 }}
                whileTap={{ scale: 0.98 }}
                transition={{ duration: 0.2 }}
              >
                <Link
                  to="/dashboard"
                  className={combineClasses(
                    sharedStyles.button.base,
                    sharedStyles.button.secondary,
                    'w-full inline-flex items-center justify-center'
                  )}
                >
                  <FiGrid className="w-5 h-5 mr-2" /> Admin Dashboard
                </Link>
              </motion.div>
            )}
          </div>
        </div>

        {/* Contact Section */}
        <div className={sharedStyles.card.container}>
          <div className="p-8 text-center">
            <h3 className="text-2xl font-semibold text-white mb-4">Get in Touch</h3>
            <p className="text-gray-400 mb-6 max-w-2xl mx-auto">
              Have questions about our services? We're here to help. Contact us today to learn more about how we can support your business.
            </p>
            <Link
              to="/contact"
              className={combineClasses(
                sharedStyles.button.base,
                sharedStyles.button.primary,
                'inline-flex items-center'
              )}
            >
              <FiMessageSquare className="mr-2" /> Contact Us
            </Link>
          </div>
        </div>
      </div>
    </PageWrapper>
  );
};

export default Home;
