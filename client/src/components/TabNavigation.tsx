import React from 'react';
import { NavLink } from 'react-router-dom';
import { sharedStyles, combineClasses } from '../styles/shared';

interface TabItem {
  name: string;
  path: string;
}

const TabNavigation: React.FC = () => {
  const tabs: TabItem[] = [
    { name: 'Dashboard', path: '/dashboard' },
    { name: 'Orders', path: '/dashboard/orders' },
    { name: 'Products', path: '/dashboard/products' },
  ];

  return (
    <div className="bg-gray-900 border-b border-gray-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <nav className="-mb-px flex space-x-8">
          {tabs.map((tab) => (
            <NavLink
              key={tab.name}
              to={tab.path}
              className={({ isActive }) =>
                combineClasses(
                  'whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm transition-colors duration-200',
                  isActive
                    ? 'border-purple-500 text-white'
                    : 'border-transparent text-gray-400 hover:text-gray-300 hover:border-gray-700'
                )
              }
            >
              {tab.name}
            </NavLink>
          ))}
        </nav>
      </div>
    </div>
  );
};

export default TabNavigation;
