import React from 'react';
import { motion } from 'framer-motion';
import { FiBook, FiVideo, FiFileText, FiDownload } from 'react-icons/fi';
import { PageLayout } from '../components/layout/PageLayout';
import { sharedStyles } from '../styles/shared';

const resources = [
  {
    id: 1,
    title: 'Getting Started Guide',
    type: 'Document',
    category: 'Guide',
    description: 'A comprehensive guide to get you started with our services.',
    icon: <FiBook className="w-8 h-8" />,
    downloadUrl: '#',
    lastUpdated: '2024-02-15'
  },
  {
    id: 2,
    title: 'Training Videos',
    type: 'Video',
    category: 'Training',
    description: 'Video tutorials covering various aspects of our platform.',
    icon: <FiVideo className="w-8 h-8" />,
    downloadUrl: '#',
    lastUpdated: '2024-02-14'
  },
  {
    id: 3,
    title: 'Best Practices Documentation',
    type: 'Document',
    category: 'Guide',
    description: 'Learn about the best practices for remote work and contact center operations.',
    icon: <FiFileText className="w-8 h-8" />,
    downloadUrl: '#',
    lastUpdated: '2024-02-13'
  },
  {
    id: 4,
    title: 'Software Tools Package',
    type: 'Download',
    category: 'Tools',
    description: 'Essential software tools for remote work setup.',
    icon: <FiDownload className="w-8 h-8" />,
    downloadUrl: '#',
    lastUpdated: '2024-02-12'
  }
];

const categories = ['All', 'Guide', 'Training', 'Tools'];

const Resources: React.FC = () => {
  const [selectedCategory, setSelectedCategory] = React.useState('All');

  const filteredResources = resources.filter(
    resource => selectedCategory === 'All' || resource.category === selectedCategory
  );

  return (
    <PageLayout title="Resources">
      <div className="text-center mb-12">
        <p className={`${sharedStyles.text} max-w-2xl mx-auto`}>
          Access our comprehensive collection of resources to help you succeed with remote work
          and contact center operations.
        </p>
      </div>

      {/* Category Filter */}
      <div className="flex justify-center mb-8 space-x-4">
        {categories.map((category) => (
          <button
            key={category}
            onClick={() => setSelectedCategory(category)}
            className={`${sharedStyles.button.base} ${
              selectedCategory === category
                ? sharedStyles.button.primary
                : sharedStyles.button.ghost
            }`}
          >
            {category}
          </button>
        ))}
      </div>

      {/* Resources Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {filteredResources.map((resource, index) => (
          <motion.div
            key={resource.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className={`${sharedStyles.card} hover:border-purple-600/50 transition-colors`}
          >
            <div className="flex items-center mb-4">
              <div className="bg-purple-700/30 p-3 rounded-xl mr-4 text-purple-400">
                {resource.icon}
              </div>
              <div>
                <h3 className={sharedStyles.subheading}>{resource.title}</h3>
                <span className={`text-sm ${sharedStyles.text}`}>{resource.type}</span>
              </div>
            </div>
            <p className={`${sharedStyles.text} mb-4`}>{resource.description}</p>
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-500">
                Updated: {resource.lastUpdated}
              </span>
              <a
                href={resource.downloadUrl}
                className={`${sharedStyles.button.base} ${sharedStyles.button.ghost} inline-flex items-center`}
              >
                <FiDownload className="w-4 h-4 mr-2" />
                Download
              </a>
            </div>
          </motion.div>
        ))}
      </div>
    </PageLayout>
  );
};

export default Resources;
