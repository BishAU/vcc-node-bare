import React from 'react';
import { Outlet } from 'react-router-dom';
import { TabNavigation } from '../TabNavigation';

export const DashboardLayout: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-900">
      <TabNavigation />
      <main className="container mx-auto px-4 py-8">
        <Outlet />
      </main>
    </div>
  );
};
