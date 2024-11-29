import React from 'react';
import { motion } from 'framer-motion';
import { FiServer, FiUsers, FiHeadphones, FiDatabase } from 'react-icons/fi';
import { PageLayout } from '../components/layout/PageLayout';
import { sharedStyles } from '../styles/shared';

const services = [
  {
    id: 1,
    name: 'Contact Center Solutions',
    description: 'Professional contact center services with experienced staff.',
    icon: <FiHeadphones className="w-12 h-12 text-purple-400" />,
    features: [
      'Experienced staff',
      'Quality assurance',
      'Performance monitoring',
      'Custom reporting'
    ]
  },
  {
    id: 2,
    name: 'Remote Workforce Management',
    description: 'Comprehensive remote workforce solutions for regional businesses.',
    icon: <FiUsers className="w-12 h-12 text-purple-400" />,
    features: [
      'Team management',
      'Performance tracking',
      'Training programs',
      'Resource allocation'
    ]
  },
  {
    id: 3,
    name: 'Data Management',
    description: 'Secure and efficient data management services.',
    icon: <FiDatabase className="w-12 h-12 text-purple-400" />,
    features: [
      'Data security',
      'Regular backups',
      'Analytics',
      'Reporting tools'
    ]
  },
  {
    id: 4,
    name: 'Infrastructure Support',
    description: 'Reliable infrastructure support for your business needs.',
    icon: <FiServer className="w-12 h-12 text-purple-400" />,
    features: [
      '24/7 support',
      'System monitoring',
      'Regular maintenance',
      'Security updates'
    ]
  }
];

const Services: React.FC = () => {
  return (
    <PageLayout title="Our Services">
      <div className="text-center mb-12">
        <p className={`${sharedStyles.text} max-w-2xl mx-auto`}>
          We provide comprehensive solutions for regional businesses, focusing on contact center operations
          and remote workforce management.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {services.map((service, index) => (
          <motion.div
            key={service.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className={`${sharedStyles.card} hover:border-purple-600/50 transition-colors`}
          >
            <div className="flex items-center mb-4">
              <div className="bg-purple-700/30 p-3 rounded-xl mr-4">
                {service.icon}
              </div>
              <h2 className={sharedStyles.subheading}>{service.name}</h2>
            </div>
            <p className={`${sharedStyles.text} mb-6`}>{service.description}</p>
            <ul className="space-y-2">
              {service.features.map((feature, featureIndex) => (
                <li key={featureIndex} className={`flex items-center ${sharedStyles.text}`}>
                  <svg
                    className="w-4 h-4 mr-2 text-purple-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                  {feature}
                </li>
              ))}
            </ul>
            <button className={`${sharedStyles.button.base} ${sharedStyles.button.primary} mt-6 w-full`}>
              Learn More
            </button>
          </motion.div>
        ))}
      </div>
    </PageLayout>
  );
};

export default Services;
