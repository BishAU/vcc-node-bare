import { useState } from 'react';
import { motion } from 'framer-motion';
import { Navbar } from '../../components/Navbar';
import { UserManagement } from '@/components/admin/UserManagement';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
} from 'chart.js';
import { Line, Doughnut } from 'react-chartjs-2';

// Register ChartJS components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
);

interface Stats {
  totalUsers: number;
  activeProjects: number;
  completedProjects: number;
  revenue: number;
}

interface RevenueData {
  date: string;
  amount: number;
}

export function AdminDashboard() {
  const [stats] = useState<Stats>({
    totalUsers: 156,
    activeProjects: 42,
    completedProjects: 89,
    revenue: 15780,
  });

  const [revenueData] = useState<RevenueData[]>([
    { date: '2024-01-01', amount: 1200 },
    { date: '2024-01-02', amount: 1500 },
    { date: '2024-01-03', amount: 1800 },
    { date: '2024-01-04', amount: 1600 },
    { date: '2024-01-05', amount: 2000 },
    { date: '2024-01-06', amount: 2200 },
    { date: '2024-01-07', amount: 1900 },
  ]);

  const lineChartData = {
    labels: revenueData.map((data) =>
      new Date(data.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
    ),
    datasets: [
      {
        label: 'Revenue',
        data: revenueData.map((data) => data.amount),
        borderColor: 'rgb(59, 130, 246)',
        backgroundColor: 'rgba(59, 130, 246, 0.5)',
        tension: 0.4,
      },
    ],
  };

  const doughnutData = {
    labels: ['Active Projects', 'Completed Projects'],
    datasets: [
      {
        data: [stats.activeProjects, stats.completedProjects],
        backgroundColor: ['rgba(59, 130, 246, 0.8)', 'rgba(34, 197, 94, 0.8)'],
        borderColor: ['rgb(59, 130, 246)', 'rgb(34, 197, 94)'],
        borderWidth: 1,
      },
    ],
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
          <p className="mt-1 text-sm text-gray-500">
            Overview of platform statistics and performance
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4 mb-8">
          <motion.div
            whileHover={{ scale: 1.02 }}
            className="bg-white rounded-lg shadow p-6"
          >
            <h3 className="text-sm font-medium text-gray-500">Total Users</h3>
            <p className="mt-2 text-3xl font-bold text-gray-900">
              {stats.totalUsers}
            </p>
          </motion.div>

          <motion.div
            whileHover={{ scale: 1.02 }}
            className="bg-white rounded-lg shadow p-6"
          >
            <h3 className="text-sm font-medium text-gray-500">Active Projects</h3>
            <p className="mt-2 text-3xl font-bold text-gray-900">
              {stats.activeProjects}
            </p>
          </motion.div>

          <motion.div
            whileHover={{ scale: 1.02 }}
            className="bg-white rounded-lg shadow p-6"
          >
            <h3 className="text-sm font-medium text-gray-500">
              Completed Projects
            </h3>
            <p className="mt-2 text-3xl font-bold text-gray-900">
              {stats.completedProjects}
            </p>
          </motion.div>

          <motion.div
            whileHover={{ scale: 1.02 }}
            className="bg-white rounded-lg shadow p-6"
          >
            <h3 className="text-sm font-medium text-gray-500">Total Revenue</h3>
            <p className="mt-2 text-3xl font-bold text-gray-900">
              ${stats.revenue.toLocaleString()}
            </p>
          </motion.div>
        </div>

        {/* Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <motion.div
            whileHover={{ scale: 1.01 }}
            className="bg-white rounded-lg shadow p-6"
          >
            <h3 className="text-lg font-medium text-gray-900 mb-4">
              Revenue Over Time
            </h3>
            <Line
              data={lineChartData}
              options={{
                responsive: true,
                plugins: {
                  legend: {
                    display: false,
                  },
                },
                scales: {
                  y: {
                    beginAtZero: true,
                    ticks: {
                      callback: (value) => `$${value}`,
                    },
                  },
                },
              }}
            />
          </motion.div>

          <motion.div
            whileHover={{ scale: 1.01 }}
            className="bg-white rounded-lg shadow p-6"
          >
            <h3 className="text-lg font-medium text-gray-900 mb-4">
              Project Status Distribution
            </h3>
            <div className="h-[300px] flex items-center justify-center">
              <Doughnut
                data={doughnutData}
                options={{
                  responsive: true,
                  maintainAspectRatio: false,
                  plugins: {
                    legend: {
                      position: 'bottom',
                    },
                  },
                }}
              />
            </div>
          </motion.div>
        </div>

        {/* User Management */}
        <div className="grid grid-cols-1 gap-8">
          <UserManagement />
        </div>

        {/* Action Buttons */}
        <div className="mt-8 flex space-x-4">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            Generate Report
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="px-4 py-2 bg-white text-blue-600 border border-blue-600 rounded-md hover:bg-blue-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            Export Data
          </motion.button>
        </div>
      </div>
    </div>
  );
}
