import { useState } from 'react';
import { motion } from 'framer-motion';
import { Navbar } from '../components/Navbar';
import { useAuth } from '../components/auth/AuthProvider';

interface Project {
  id: string;
  name: string;
  description: string;
  status: 'draft' | 'in_progress' | 'completed';
  thumbnail: string;
  lastModified: Date;
}

export function Dashboard() {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState<'projects' | 'designs'>('projects');
  const [projects] = useState<Project[]>([
    {
      id: '1',
      name: 'GT3 Race Livery',
      description: 'Custom livery design for GT3 racing series',
      status: 'in_progress',
      thumbnail: '/mockImages/gt3-thumb.jpg',
      lastModified: new Date('2024-01-15'),
    },
    {
      id: '2',
      name: 'Rally Car Design',
      description: 'WRC-inspired livery concept',
      status: 'completed',
      thumbnail: '/mockImages/rally-thumb.jpg',
      lastModified: new Date('2024-01-10'),
    },
    {
      id: '3',
      name: 'Drift Car Project',
      description: 'Aggressive design for drift competition',
      status: 'draft',
      thumbnail: '/mockImages/drift-thumb.jpg',
      lastModified: new Date('2024-01-05'),
    },
  ]);

  const getStatusColor = (status: Project['status']) => {
    switch (status) {
      case 'draft':
        return 'bg-gray-500';
      case 'in_progress':
        return 'bg-blue-500';
      case 'completed':
        return 'bg-green-500';
      default:
        return 'bg-gray-500';
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
            <p className="mt-1 text-sm text-gray-500">
              Welcome back, {user?.email}
            </p>
          </div>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            New Project
          </motion.button>
        </div>

        <div className="mb-6">
          <nav className="flex space-x-4">
            <button
              onClick={() => setActiveTab('projects')}
              className={`px-3 py-2 font-medium text-sm rounded-md ${
                activeTab === 'projects'
                  ? 'bg-blue-100 text-blue-700'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              Projects
            </button>
            <button
              onClick={() => setActiveTab('designs')}
              className={`px-3 py-2 font-medium text-sm rounded-md ${
                activeTab === 'designs'
                  ? 'bg-blue-100 text-blue-700'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              Saved Designs
            </button>
          </nav>
        </div>

        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {projects.map((project) => (
            <motion.div
              key={project.id}
              whileHover={{ scale: 1.02 }}
              className="bg-white rounded-lg shadow overflow-hidden"
            >
              <div className="h-48 bg-gray-200">
                {/* Replace with actual image */}
                <div className="h-full w-full flex items-center justify-center text-gray-400">
                  [Preview Image]
                </div>
              </div>
              <div className="p-6">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-lg font-medium text-gray-900">
                    {project.name}
                  </h3>
                  <span
                    className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium text-white ${getStatusColor(
                      project.status
                    )}`}
                  >
                    {project.status.replace('_', ' ')}
                  </span>
                </div>
                <p className="text-sm text-gray-500 mb-4">{project.description}</p>
                <div className="flex justify-between items-center">
                  <span className="text-xs text-gray-400">
                    Last modified:{' '}
                    {project.lastModified.toLocaleDateString('en-US', {
                      month: 'short',
                      day: 'numeric',
                      year: 'numeric',
                    })}
                  </span>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="text-blue-600 hover:text-blue-700 text-sm font-medium"
                  >
                    Edit
                  </motion.button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}
