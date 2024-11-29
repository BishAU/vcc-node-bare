import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { FiMenu, FiX } from 'react-icons/fi';
import { useAuth } from '../../contexts/AuthContext';

interface NavItem {
  name: string;
  href: string;
  children?: NavItem[];
}

const navigationItems: NavItem[] = [
  { name: 'Home', href: '/' },
  { name: 'Services', href: '/services' },
  { name: 'Resources', href: '/resources' },
  { name: 'Events', href: '/events' },
  {
    name: 'About',
    href: '/about',
    children: [
      { name: 'Team', href: '/about/team' },
      { name: 'Mission', href: '/about/mission' },
      { name: 'Partners', href: '/about/partners' },
      { name: 'Careers', href: '/about/careers' },
    ],
  },
  { name: 'Contact', href: '/contact' },
];

export const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  const toggleDropdown = (href: string) => {
    setActiveDropdown(activeDropdown === href ? null : href);
  };

  return (
    <nav className="bg-purple-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex">
            <div className="flex-shrink-0 flex items-center">
              <Link to="/" className="text-white text-xl font-bold">
                VCC Platform
              </Link>
            </div>
            <div className="hidden sm:ml-6 sm:flex sm:space-x-8">
              {navigationItems.map((item) => (
                <div key={item.href} className="relative">
                  {item.children ? (
                    <button
                      onClick={() => toggleDropdown(item.href)}
                      className={`text-gray-300 hover:text-white px-3 py-2 rounded-md text-sm font-medium ${
                        location.pathname.startsWith(item.href) ? 'text-white' : ''
                      }`}
                    >
                      {item.name}
                    </button>
                  ) : (
                    <Link
                      to={item.href}
                      className={`text-gray-300 hover:text-white px-3 py-2 rounded-md text-sm font-medium ${
                        location.pathname === item.href ? 'text-white' : ''
                      }`}
                    >
                      {item.name}
                    </Link>
                  )}
                  {item.children && activeDropdown === item.href && (
                    <div className="absolute z-10 -ml-4 mt-3 transform px-2 w-screen max-w-md sm:px-0 lg:ml-0 lg:left-1/2 lg:-translate-x-1/2">
                      <div className="rounded-lg shadow-lg ring-1 ring-black ring-opacity-5 overflow-hidden">
                        <div className="relative grid gap-6 bg-white px-5 py-6 sm:gap-8 sm:p-8">
                          {item.children.map((child) => (
                            <Link
                              key={child.href}
                              to={child.href}
                              className="-m-3 p-3 flex items-start rounded-lg hover:bg-gray-50"
                              onClick={() => setActiveDropdown(null)}
                            >
                              <div className="ml-4">
                                <p className="text-base font-medium text-gray-900">
                                  {child.name}
                                </p>
                              </div>
                            </Link>
                          ))}
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
          <div className="hidden sm:ml-6 sm:flex sm:items-center">
            {user ? (
              <>
                <Link
                  to="/dashboard"
                  className={`text-gray-300 hover:text-white px-3 py-2 rounded-md text-sm font-medium ${
                    location.pathname.startsWith('/dashboard') ? 'text-white' : ''
                  }`}
                >
                  Dashboard
                </Link>
                <button
                  onClick={handleLogout}
                  className="text-gray-300 hover:text-white px-3 py-2 rounded-md text-sm font-medium"
                >
                  Logout
                </button>
              </>
            ) : (
              <Link
                to="/login"
                className={`text-gray-300 hover:text-white px-3 py-2 rounded-md text-sm font-medium ${
                  location.pathname === '/login' ? 'text-white' : ''
                }`}
              >
                Login
              </Link>
            )}
          </div>
          <div className="-mr-2 flex items-center sm:hidden">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-white hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white"
            >
              <span className="sr-only">Open main menu</span>
              {isOpen ? (
                <FiX className="block h-6 w-6" aria-hidden="true" />
              ) : (
                <FiMenu className="block h-6 w-6" aria-hidden="true" />
              )}
            </button>
          </div>
        </div>
      </div>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="sm:hidden"
          >
            <div className="px-2 pt-2 pb-3 space-y-1">
              {navigationItems.map((item) => (
                <React.Fragment key={item.href}>
                  {item.children ? (
                    <>
                      <button
                        onClick={() => toggleDropdown(item.href)}
                        className="w-full text-left text-gray-300 hover:text-white block px-3 py-2 rounded-md text-base font-medium"
                      >
                        {item.name}
                      </button>
                      {activeDropdown === item.href && (
                        <div className="pl-4">
                          {item.children.map((child) => (
                            <Link
                              key={child.href}
                              to={child.href}
                              className="text-gray-300 hover:text-white block px-3 py-2 rounded-md text-base font-medium"
                              onClick={() => {
                                setIsOpen(false);
                                setActiveDropdown(null);
                              }}
                            >
                              {child.name}
                            </Link>
                          ))}
                        </div>
                      )}
                    </>
                  ) : (
                    <Link
                      to={item.href}
                      className={`text-gray-300 hover:text-white block px-3 py-2 rounded-md text-base font-medium ${
                        location.pathname === item.href ? 'text-white bg-purple-700' : ''
                      }`}
                      onClick={() => setIsOpen(false)}
                    >
                      {item.name}
                    </Link>
                  )}
                </React.Fragment>
              ))}
              {user ? (
                <>
                  <Link
                    to="/dashboard"
                    className={`text-gray-300 hover:text-white block px-3 py-2 rounded-md text-base font-medium ${
                      location.pathname.startsWith('/dashboard') ? 'text-white bg-purple-700' : ''
                    }`}
                    onClick={() => setIsOpen(false)}
                  >
                    Dashboard
                  </Link>
                  <button
                    onClick={() => {
                      handleLogout();
                      setIsOpen(false);
                    }}
                    className="text-gray-300 hover:text-white block px-3 py-2 rounded-md text-base font-medium"
                  >
                    Logout
                  </button>
                </>
              ) : (
                <Link
                  to="/login"
                  className={`text-gray-300 hover:text-white block px-3 py-2 rounded-md text-base font-medium ${
                    location.pathname === '/login' ? 'text-white bg-purple-700' : ''
                  }`}
                  onClick={() => setIsOpen(false)}
                >
                  Login
                </Link>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};
