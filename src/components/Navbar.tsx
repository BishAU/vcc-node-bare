import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { FiMenu, FiX } from 'react-icons/fi';

export const Navbar: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleMenu = () => setIsOpen(!isOpen);

  return (
    <nav className="fixed w-full z-50 bg-gray-900/95 backdrop-blur-sm border-b border-gray-800/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link to="/" className="flex items-center">
              <img
                src="/images/logo.png"
                alt="VCC Logo"
                className="h-8 w-auto"
              />
              <span className="ml-2 text-xl font-bold text-white">VCC</span>
            </Link>
          </div>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center space-x-4">
            <Link to="/about" className="text-gray-400 hover:text-gray-200 px-3 py-2 rounded-md text-sm font-medium">
              About
            </Link>
            <Link to="/services" className="text-gray-400 hover:text-gray-200 px-3 py-2 rounded-md text-sm font-medium">
              Services
            </Link>
            <Link to="/contact" className="text-gray-400 hover:text-gray-200 px-3 py-2 rounded-md text-sm font-medium">
              Contact
            </Link>
            <Link
              to="/register"
              className="bg-purple-500 text-white px-4 py-2 rounded-lg hover:bg-purple-600 transition-colors duration-200"
            >
              Get Started
            </Link>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center">
            <button
              onClick={toggleMenu}
              className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-white hover:bg-gray-800/50 focus:outline-none"
            >
              {isOpen ? <FiX className="h-6 w-6" /> : <FiMenu className="h-6 w-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="md:hidden bg-gray-900/95 backdrop-blur-sm"
          >
            <div className="px-2 pt-2 pb-3 space-y-1">
              <Link
                to="/about"
                className="block text-gray-400 hover:text-gray-200 px-3 py-2 rounded-md text-base font-medium"
                onClick={toggleMenu}
              >
                About
              </Link>
              <Link
                to="/services"
                className="block text-gray-400 hover:text-gray-200 px-3 py-2 rounded-md text-base font-medium"
                onClick={toggleMenu}
              >
                Services
              </Link>
              <Link
                to="/contact"
                className="block text-gray-400 hover:text-gray-200 px-3 py-2 rounded-md text-base font-medium"
                onClick={toggleMenu}
              >
                Contact
              </Link>
              <Link
                to="/register"
                className="block bg-purple-500 text-white px-4 py-2 rounded-lg hover:bg-purple-600 transition-colors duration-200"
                onClick={toggleMenu}
              >
                Get Started
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};
