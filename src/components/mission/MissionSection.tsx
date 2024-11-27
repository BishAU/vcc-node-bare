import React from 'react';
import { motion } from 'framer-motion';
import OptimizedImage from '../common/OptimizedImage';

interface MissionCard {
  id: string;
  title: string;
  description: string;
  imagePath: string;
  altText: string;
  stats: {
    label: string;
    value: string;
  };
}

const missionCards: MissionCard[] = [
  {
    id: 'remote-work',
    title: 'Remote Work Opportunities',
    description: 'Connect with progressive employers offering flexible remote positions tailored for experienced professionals.',
    imagePath: '/images/regional/mission/remote-work.jpg',
    altText: 'Professional working remotely from a home office in Regional Victoria',
    stats: {
      label: 'Remote Positions',
      value: '600+ Available'
    }
  },
  {
    id: 'skills-training',
    title: 'Skills Development',
    description: 'Access specialized training programs designed to enhance your digital skills and regional employment prospects.',
    imagePath: '/images/regional/mission/skills-training.jpg',
    altText: 'Modern training facility with mature professionals learning new skills',
    stats: {
      label: 'Training Programs',
      value: '45+ Courses'
    }
  },
  {
    id: 'community',
    title: 'Professional Community',
    description: 'Join a supportive network of experienced professionals making an impact in Regional Victoria.',
    imagePath: '/images/regional/mission/community.jpg',
    altText: 'Diverse group of professionals networking at a regional business event',
    stats: {
      label: 'Active Members',
      value: '2,500+'
    }
  }
];

const MissionSection: React.FC = () => {
  return (
    <section className="py-16 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl font-bold text-gray-900 sm:text-4xl mb-4">
            Empowering Regional Careers
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            We're dedicated to creating meaningful employment opportunities for mature 
            professionals across Regional Victoria.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 gap-12 md:grid-cols-2 lg:grid-cols-3">
          {missionCards.map((card, index) => (
            <motion.div
              key={card.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              className="relative group"
            >
              <div className="relative h-64 rounded-lg overflow-hidden mb-6">
                <OptimizedImage
                  src={card.imagePath}
                  alt={card.altText}
                  width={400}
                  height={300}
                  className="w-full h-full object-cover transition-transform duration-300 
                           group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-gray-900/60 to-transparent" />
                <div className="absolute bottom-4 left-4 right-4">
                  <p className="text-white font-semibold text-lg">{card.title}</p>
                  <div className="flex items-center mt-2">
                    <span className="text-purple-300 font-medium">
                      {card.stats.value}
                    </span>
                    <span className="text-gray-200 text-sm ml-2">
                      {card.stats.label}
                    </span>
                  </div>
                </div>
              </div>

              <div>
                <p className="text-gray-600 leading-relaxed">
                  {card.description}
                </p>
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="mt-4 inline-flex items-center text-purple-600 font-medium 
                           hover:text-purple-700"
                >
                  Learn More
                  <svg
                    className="ml-2 w-4 h-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 5l7 7-7 7"
                    />
                  </svg>
                </motion.button>
              </div>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="mt-16 text-center"
        >
          <a
            href="#get-started"
            className="inline-flex items-center justify-center px-8 py-3 
                     border border-transparent text-base font-medium rounded-md 
                     text-white bg-purple-600 hover:bg-purple-700 md:py-4 md:text-lg 
                     md:px-10 transition-colors duration-200"
          >
            Start Your Regional Career Journey
          </a>
        </motion.div>
      </div>
    </section>
  );
};

export default MissionSection;
