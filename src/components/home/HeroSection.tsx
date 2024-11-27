import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { FiArrowRight, FiPlay } from 'react-icons/fi';

export const HeroSection: React.FC = () => {
  const containerVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        staggerChildren: 0.2
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0
    }
  };

  return (
    <motion.section
      className="relative min-h-[80vh] flex items-center py-20 overflow-hidden"
      initial="hidden"
      animate="visible"
      variants={containerVariants}
    >
      {/* Background Image with Overlay */}
      <div className="absolute inset-0 z-0">
        <img
          src="/images/hero-bg.jpg"
          alt="Regional Australia Workers"
          className="w-full h-full object-cover"
          onError={(e) => {
            e.currentTarget.src = 'https://images.unsplash.com/photo-1557804506-669a67965ba0?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2074&q=80';
          }}
        />
        <div className="absolute inset-0 bg-gray-900/95" />
      </div>

      {/* Content */}
      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-3xl">
          <motion.div variants={itemVariants}>
            <span className="inline-block px-4 py-2 rounded-full bg-gray-800/50 text-purple-400 text-sm font-medium mb-6">
              Empowering Regional Australia's Workforce
            </span>
            <h1 className="text-5xl md:text-6xl font-bold text-white mb-6 leading-tight">
              Your Experience is
              <span className="block text-purple-400">Our Strength</span>
            </h1>
            <p className="text-xl text-gray-300 leading-relaxed mb-8 max-w-2xl">
              Join a community of experienced professionals making an impact in Regional Victoria. 
              Discover remote work opportunities that value your expertise.
            </p>
          </motion.div>

          <motion.div
            variants={itemVariants}
            className="flex flex-wrap gap-4 mb-12"
          >
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Link
                to="/register"
                className="inline-flex items-center px-8 py-4 bg-purple-500 text-white rounded-lg hover:bg-purple-600 transition-colors duration-200 text-lg font-medium"
              >
                Get Started
                <FiArrowRight className="ml-2" />
              </Link>
            </motion.div>
          </motion.div>

          {/* Statistics */}
          <motion.div
            variants={itemVariants}
            className="grid grid-cols-1 md:grid-cols-3 gap-8 pt-8 border-t border-gray-800/50"
          >
            <div>
              <div className="text-3xl font-bold text-purple-500 mb-2">2,500+</div>
              <div className="text-gray-400">Regional Professionals</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-purple-500 mb-2">85%</div>
              <div className="text-gray-400">Success Rate</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-purple-500 mb-2">15+</div>
              <div className="text-gray-400">Regional Areas</div>
            </div>
          </motion.div>

          {/* Trust Indicators */}
          <motion.div
            variants={itemVariants}
            className="mt-12"
          >
            <p className="text-sm text-gray-500 mb-4">Trusted by leading organizations</p>
            <div className="flex flex-wrap gap-8 items-center opacity-70 grayscale hover:grayscale-0 transition-all duration-300">
              <img src="/images/partners/abs-logo.png" alt="ABS" className="h-8" onError={(e) => { e.currentTarget.style.display = 'none' }} />
              <img src="/images/partners/vic-gov-logo.png" alt="Victorian Government" className="h-8" onError={(e) => { e.currentTarget.style.display = 'none' }} />
              <img src="/images/partners/regional-dev-vic.png" alt="Regional Development Victoria" className="h-8" onError={(e) => { e.currentTarget.style.display = 'none' }} />
            </div>
          </motion.div>
        </div>
      </div>

      {/* Video Feature */}
      <motion.div
        variants={itemVariants}
        className="absolute bottom-8 right-8 z-20 hidden lg:block"
      >
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="group relative inline-flex items-center gap-2 rounded-lg bg-white/10 px-4 py-2 text-white backdrop-blur-sm hover:bg-white/20 transition-all duration-200"
          onClick={() => {/* Implement video modal */}}
        >
          <span className="relative flex h-10 w-10 items-center justify-center rounded-full bg-purple-500">
            <FiPlay className="w-4 h-4" />
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-purple-500 opacity-75"></span>
          </span>
          <span className="pr-2">Watch Success Stories</span>
        </motion.button>
      </motion.div>
    </motion.section>
  );
};
