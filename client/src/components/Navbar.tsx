import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { FiMenu, FiX } from 'react-icons/fi';
import { sharedStyles, combineClasses } from '../styles/shared';

const Navbar: React.FC = () => {
  const { user, logout } = useAuth();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const toggleMobileMenu = () => setIsMobileMenuOpen(!isMobileMenuOpen);

  const navLinkClasses = "text-gray-300 hover:text-white inline-flex items-center px-1 pt-1 text-sm font-medium border-b-2 border-transparent hover:border-purple-500 transition-colors duration-200";
  const mobileNavLinkClasses = "text-gray-300 hover:text-white block px-3 py-2 text-base font-medium transition-colors duration-200";

  return (
    <nav className="bg-gray-900 border-b border-gray-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex">
            <div className="flex-shrink-0 flex items-center">
              <Link 
                to="/" 
                className="text-xl font-bold bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent"
              >
                VirtualCC
              </Link>
            </div>
            <div className="hidden sm:ml-6 sm:flex sm:space-x-8">
              <Link to="/" className={navLinkClasses}>Home</Link>
              <Link to="/services" className={navLinkClasses}>Services</Link>
              <Link to="/resources" className={navLinkClasses}>Resources</Link>
              <Link to="/events" className={navLinkClasses}>Events</Link>
              <Link to="/about" className={navLinkClasses}>About</Link>
              <Link to="/contact" className={navLinkClasses}>Contact</Link>
            </div>
          </div>

          {/* Mobile menu button */}
          <div className="flex items-center sm:hidden">
            <button
              onClick={toggleMobileMenu}
              className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-white hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-purple-500"
            >
              {isMobileMenuOpen ? (
                <FiX className="block h-6 w-6" />
              ) : (
                <FiMenu className="block h-6 w-6" />
              )}
            </button>
          </div>

          <div className="hidden sm:ml-6 sm:flex sm:items-center">
            {user ? (
              <div className="flex items-center space-x-4">
                {user.role === 'admin' && (
                  <Link
                    to="/dashboard"
                    className={combineClasses(
                      sharedStyles.button.base,
                      sharedStyles.button.primary
                    )}
                  >
                    Dashboard
                  </Link>
                )}
                <button
                  onClick={logout}
                  className={combineClasses(
                    sharedStyles.button.base,
                    sharedStyles.button.secondary
                  )}
                >
                  Logout
                </button>
              </div>
            ) : (
              <Link
                to="/login"
                className={combineClasses(
                  sharedStyles.button.base,
                  sharedStyles.button.primary
                )}
              >
                Login
              </Link>
            )}
          </div>
        </div>
      </div>

      {/* Mobile menu, show/hide based on menu state */}
      {isMobileMenuOpen && (
        <div className="sm:hidden bg-gray-900 border-t border-gray-800">
          <div className="pt-2 pb-3 space-y-1">
            <Link to="/" className={mobileNavLinkClasses}>Home</Link>
            <Link to="/services" className={mobileNavLinkClasses}>Services</Link>
            <Link to="/resources" className={mobileNavLinkClasses}>Resources</Link>
            <Link to="/events" className={mobileNavLinkClasses}>Events</Link>
            <Link to="/about" className={mobileNavLinkClasses}>About</Link>
            <Link to="/contact" className={mobileNavLinkClasses}>Contact</Link>
            {user ? (
              <>
                {user.role === 'admin' && (
                  <Link
                    to="/dashboard"
                    className="block px-3 py-2 text-base font-medium text-white bg-purple-600 hover:bg-purple-700 transition-colors duration-200"
                  >
                    Dashboard
                  </Link>
                )}
                <button
                  onClick={logout}
                  className="text-gray-300 hover:text-white block w-full text-left px-3 py-2 text-base font-medium transition-colors duration-200"
                >
                  Logout
                </button>
              </>
            ) : (
              <Link
                to="/login"
                className="block px-3 py-2 text-base font-medium text-white bg-purple-600 hover:bg-purple-700 transition-colors duration-200"
              >
                Login
              </Link>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
