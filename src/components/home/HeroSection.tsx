import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

const HeroSection = () => {
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
      className="py-20 text-center"
      initial="hidden"
      animate="visible"
      variants={containerVariants}
    >
      <motion.div variants={itemVariants}>
        <h1 className="text-5xl font-bold mb-4">
          <motion.span
            className="block text-purple-500"
            whileHover={{ scale: 1.05 }}
            transition={{ type: "spring", stiffness: 300 }}
          >
            Regional Employment
          </motion.span>
          <motion.span
            className="block text-4xl mt-2"
            whileHover={{ scale: 1.05 }}
            transition={{ type: "spring", stiffness: 300 }}
          >
            Empowering your future
          </motion.span>
        </h1>
      </motion.div>

      <motion.p
        variants={itemVariants}
        className="text-xl text-gray-400 mb-8 max-w-2xl mx-auto"
      >
        Creating meaningful employment opportunities for over-50s professionals in Regional Victoria.
      </motion.p>

      <motion.div
        variants={itemVariants}
        className="flex justify-center space-x-4"
      >
        <motion.div
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <Link
            to="/register"
            className="px-8 py-3 bg-purple-500 text-white rounded-md hover:bg-purple-600 transition-colors duration-200"
          >
            Get Started
          </Link>
        </motion.div>

        <motion.div
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <Link
            to="/about"
            className="px-8 py-3 border border-purple-500 text-purple-500 rounded-md hover:bg-purple-500 hover:text-white transition-all duration-200"
          >
            Learn More
          </Link>
        </motion.div>
      </motion.div>
    </motion.section>
  );
};

export default HeroSection;
