import React from 'react';
import { sharedStyles, combineClasses } from '../../styles/shared';
import { FiFile, FiVideo, FiLink, FiBox } from 'react-icons/fi';

interface Resource {
  id: string;
  title: string;
  description: string;
  type: 'document' | 'video' | 'link' | 'other';
  url: string;
  category: string;
  tags: string[];
  uploadDate: string;
  lastModified: string;
  status: 'active' | 'archived' | 'draft';
  fileSize?: number;
  downloadCount: number;
  author: string;
}

const ResourceList: React.FC<{ resources: Resource[] }> = ({ resources }) => {
  const getTypeIcon = (type: Resource['type']) => {
    switch (type) {
      case 'document':
        return <FiFile className="w-5 h-5" />;
      case 'video':
        return <FiVideo className="w-5 h-5" />;
      case 'link':
        return <FiLink className="w-5 h-5" />;
      default:
        return <FiBox className="w-5 h-5" />;
    }
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {resources.map((resource) => (
        <div
          key={resource.id}
          className={combineClasses(
            sharedStyles.card.container,
            'flex flex-col p-6 hover:shadow-lg transition-shadow duration-200'
          )}
        >
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 bg-gray-800 rounded-lg">
              {getTypeIcon(resource.type)}
            </div>
            <div>
              <h3 className="font-semibold text-lg">{resource.title}</h3>
              <p className="text-sm text-gray-400">{resource.category}</p>
            </div>
          </div>
          
          <p className="text-gray-300 mb-4 flex-grow">{resource.description}</p>
          
          <div className="flex flex-wrap gap-2 mb-4">
            {resource.tags.map((tag, index) => (
              <span
                key={index}
                className="px-2 py-1 text-xs bg-gray-700 rounded-full"
              >
                {tag}
              </span>
            ))}
          </div>
          
          <div className="flex items-center justify-between text-sm text-gray-400">
            <span>By {resource.author}</span>
            <span>{new Date(resource.uploadDate).toLocaleDateString()}</span>
          </div>
          
          <a
            href={resource.url}
            target="_blank"
            rel="noopener noreferrer"
            className={combineClasses(
              sharedStyles.button.base,
              sharedStyles.button.primary,
              'mt-4'
            )}
          >
            View Resource
          </a>
        </div>
      ))}
    </div>
  );
};

export default ResourceList;
