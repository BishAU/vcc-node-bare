import React from 'react';
import { Link } from 'react-router-dom';
import { FiPhone, FiMail, FiMapPin, FiArrowRight } from 'react-icons/fi';
import { sharedStyles, combineClasses } from '../styles/shared';

const Footer: React.FC = () => {
  return (
    <footer className="bg-gray-900 border-t border-gray-800">      
      <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Company Info */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">
              VirtualCC
            </h3>
            <p className="text-gray-400 text-sm">
              Empowering mature professionals in Regional Victoria with innovative workforce solutions.
            </p>
            <div className="space-y-2">
              <p className="text-gray-400 text-sm flex items-center">
                <FiPhone className="mr-2 text-purple-400" /> (03) 8456 9900
              </p>
              <p className="text-gray-400 text-sm flex items-center">
                <FiMail className="mr-2 text-purple-400" /> info@virtualcc.org.au
              </p>
              <p className="text-gray-400 text-sm flex items-center">
                <FiMapPin className="mr-2 text-purple-400" /> 123 Main Street, Melbourne VIC 3000
              </p>
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-white">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <Link 
                  to="/services" 
                  className="text-gray-400 hover:text-white flex items-center group text-sm transition-colors duration-200"
                >
                  <FiArrowRight className="mr-2 text-purple-400 transform translate-x-0 group-hover:translate-x-1 transition-transform" />
                  Our Services
                </Link>
              </li>
              <li>
                <Link 
                  to="/resources" 
                  className="text-gray-400 hover:text-white flex items-center group text-sm transition-colors duration-200"
                >
                  <FiArrowRight className="mr-2 text-purple-400 transform translate-x-0 group-hover:translate-x-1 transition-transform" />
                  Resources
                </Link>
              </li>
              <li>
                <Link 
                  to="/events" 
                  className="text-gray-400 hover:text-white flex items-center group text-sm transition-colors duration-200"
                >
                  <FiArrowRight className="mr-2 text-purple-400 transform translate-x-0 group-hover:translate-x-1 transition-transform" />
                  Events
                </Link>
              </li>
              <li>
                <Link 
                  to="/about" 
                  className="text-gray-400 hover:text-white flex items-center group text-sm transition-colors duration-200"
                >
                  <FiArrowRight className="mr-2 text-purple-400 transform translate-x-0 group-hover:translate-x-1 transition-transform" />
                  About Us
                </Link>
              </li>
              <li>
                <Link 
                  to="/contact" 
                  className="text-gray-400 hover:text-white flex items-center group text-sm transition-colors duration-200"
                >
                  <FiArrowRight className="mr-2 text-purple-400 transform translate-x-0 group-hover:translate-x-1 transition-transform" />
                  Contact
                </Link>
              </li>
            </ul>
          </div>

          {/* Newsletter */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-white">Stay Updated</h3>
            <p className="text-gray-400 text-sm">
              Subscribe to our newsletter for the latest updates and opportunities.
            </p>
            <div className="mt-4">
              <div className="flex max-w-md">
                <input
                  type="email"
                  placeholder="Enter your email"
                  className={combineClasses(
                    "flex-1 min-w-0 px-4 py-2 text-sm text-white placeholder-gray-400 bg-gray-800 border border-gray-700 rounded-l-md",
                    "focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  )}
                />
                <button
                  type="button"
                  className={combineClasses(
                    sharedStyles.button.base,
                    sharedStyles.button.primary,
                    "rounded-l-none"
                  )}
                >
                  Subscribe
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Copyright */}
        <div className="mt-8 pt-8 border-t border-gray-800">
          <p className="text-center text-gray-500 text-sm">
            &copy; {new Date().getFullYear()} VirtualCC. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
