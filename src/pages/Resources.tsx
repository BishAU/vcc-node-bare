import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

const resources = [
  {
    category: 'Career Development',
    items: [
      {
        title: 'Resume Writing Guide',
        description: 'Expert tips for crafting an impactful resume',
        icon: '📝',
        link: '/guides/resume-writing'
      },
      {
        title: 'Interview Preparation',
        description: 'Comprehensive interview strategies and tips',
        icon: '🎯',
        link: '/guides/interview-prep'
      },
      {
        title: 'Career Transition Toolkit',
        description: 'Essential resources for changing careers',
        icon: '🔄',
        link: '/guides/career-transition'
      }
    ]
  },
  {
    category: 'Digital Skills',
    items: [
      {
        title: 'Technology Basics',
        description: 'Fundamental digital skills for the modern workplace',
        icon: '💻',
        link: '/guides/tech-basics'
      },
      {
        title: 'Remote Work Guide',
        description: 'Tips for successful remote work',
        icon: '🏠',
        link: '/guides/remote-work'
      },
      {
        title: 'Digital Communication',
        description: 'Effective online communication strategies',
        icon: '📱',
        link: '/guides/digital-comm'
      }
    ]
  },
  {
    category: 'Regional Insights',
    items: [
      {
        title: 'Market Reports',
        description: 'Latest employment trends in Regional Victoria',
        icon: '📊',
        link: '/reports/market'
      },
      {
        title: 'Industry Analysis',
        description: 'Deep dives into growing regional industries',
        icon: '📈',
        link: '/reports/industry'
      },
      {
        title: 'Success Stories',
        description: 'Inspiring stories from our community',
        icon: '🌟',
        link: '/stories'
      }
    ]
  }
];

const Resources: React.FC = () => {
  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      <div className="relative isolate px-6 pt-14 lg:px-8">
        <div className="mx-auto max-w-7xl py-24 sm:py-32">
          {/* Header */}
          <div className="mx-auto max-w-2xl text-center">
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-4xl font-bold tracking-tight text-gray-900 sm:text-6xl"
            >
              Resources
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="mt-6 text-lg leading-8 text-gray-600"
            >
              Comprehensive tools and guides to support your professional journey
            </motion.p>
          </div>

          {/* Resources Grid */}
          <div className="mx-auto mt-16 max-w-7xl">
            {resources.map((category, categoryIndex) => (
              <motion.div
                key={category.category}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: categoryIndex * 0.1 }}
                className="mb-16"
              >
                <h2 className="text-2xl font-bold text-gray-900 mb-8">{category.category}</h2>
                <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
                  {category.items.map((item, itemIndex) => (
                    <motion.div
                      key={item.title}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: (categoryIndex * 0.1) + (itemIndex * 0.05) }}
                      className="relative rounded-2xl border border-gray-200 p-8 shadow-sm hover:shadow-lg transition-shadow"
                    >
                      <div className="text-4xl mb-4">{item.icon}</div>
                      <h3 className="text-lg font-semibold text-gray-900">{item.title}</h3>
                      <p className="mt-2 text-gray-600">{item.description}</p>
                      <div className="mt-4">
                        <Link
                          to={item.link}
                          className="text-sm font-semibold text-indigo-600 hover:text-indigo-500"
                        >
                          Learn more <span aria-hidden="true">→</span>
                        </Link>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            ))}
          </div>

          {/* Newsletter Section */}
          <div className="mx-auto mt-32 max-w-7xl px-6 sm:mt-40 lg:px-8">
            <div className="relative isolate overflow-hidden bg-gray-900 px-6 py-24 text-center shadow-2xl sm:rounded-3xl sm:px-16">
              <h2 className="mx-auto max-w-2xl text-3xl font-bold tracking-tight text-white sm:text-4xl">
                Stay Updated
              </h2>
              <p className="mx-auto mt-6 max-w-xl text-lg leading-8 text-gray-300">
                Subscribe to our newsletter for the latest resources, events, and opportunities.
              </p>
              <div className="mt-10 flex items-center justify-center gap-x-6">
                <div className="flex max-w-md gap-x-4">
                  <input
                    type="email"
                    required
                    className="min-w-0 flex-auto rounded-md border-0 bg-white/5 px-3.5 py-2 text-white shadow-sm ring-1 ring-inset ring-white/10 focus:ring-2 focus:ring-inset focus:ring-white sm:text-sm sm:leading-6"
                    placeholder="Enter your email"
                  />
                  <button
                    type="submit"
                    className="flex-none rounded-md bg-white px-3.5 py-2.5 text-sm font-semibold text-gray-900 shadow-sm hover:bg-gray-100 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
                  >
                    Subscribe
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default Resources;
