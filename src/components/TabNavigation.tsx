import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { UserRole } from '../types/user';

interface Tab {
  name: string;
  href: string;
  roles?: UserRole[];
}

const tabs: Tab[] = [
  { name: 'Dashboard', href: '/dashboard' },
  { name: 'Orders', href: '/orders' },
  { name: 'Settings', href: '/settings' },
  { name: 'Users', href: '/admin/users', roles: [UserRole.ADMIN] }
];

export const TabNavigation: React.FC = () => {
  const location = useLocation();
  const { user } = useAuth();

  // Filter tabs based on user role
  const filteredTabs = tabs.filter(tab => {
    if (!tab.roles) return true;
    return user && tab.roles.includes(user.role);
  });

  return (
    <nav className="border-b border-gray-800">
      <div className="container mx-auto">
        <div className="flex space-x-8">
          {filteredTabs.map((tab) => {
            const isActive = location.pathname === tab.href;
            return (
              <Link
                key={tab.name}
                to={tab.href}
                className={`
                  inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium
                  ${
                    isActive
                      ? 'border-purple-500 text-white'
                      : 'border-transparent text-gray-300 hover:text-white hover:border-gray-300'
                  }
                `}
              >
                {tab.name}
              </Link>
            );
          })}
        </div>
      </div>
    </nav>
  );
};
