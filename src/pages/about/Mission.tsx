import React from 'react';
import { PageWrapper } from '../../components/layout/PageWrapper';
import { sharedStyles } from '../../styles/shared';
import { motion } from 'framer-motion';
import { FiTarget, FiHeart, FiUsers, FiTrendingUp } from 'react-icons/fi';

const Mission = () => {
  const goals = [
    {
      icon: FiTarget,
      title: 'Our Mission',
      description: 'To empower regional communities by connecting talented individuals with meaningful career opportunities and fostering sustainable economic growth.'
    },
    {
      icon: FiHeart,
      title: 'Our Values',
      description: 'We believe in integrity, inclusivity, innovation, and the transformative power of meaningful work to build stronger communities.'
    },
    {
      icon: FiUsers,
      title: 'Our Impact',
      description: 'Creating lasting positive change in regional communities by bridging the gap between talent and opportunity.'
    },
    {
      icon: FiTrendingUp,
      title: 'Our Goals',
      description: 'To become the leading platform for regional career development and create sustainable employment ecosystems in regional Australia.'
    }
  ];

  return (
    <PageWrapper>
      <div className={sharedStyles.pageContainer}>
        <div className={sharedStyles.contentWrapper}>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <h1 className={sharedStyles.heading}>Our Mission</h1>
            <div className={`${sharedStyles.card} mb-8`}>
              <p className="text-xl text-gray-300 leading-relaxed">
                At VCC, we're committed to transforming regional employment by creating meaningful connections 
                between talented individuals and forward-thinking organizations. Our mission drives everything we do, 
                from career development to community building.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {goals.map((goal) => (
                <motion.div
                  key={goal.title}
                  className={sharedStyles.card}
                  whileHover={{ scale: 1.02 }}
                  transition={{ duration: 0.2 }}
                >
                  <div className="flex items-start space-x-4">
                    <div className="bg-gradient-to-r from-purple-500 to-pink-500 p-4 rounded-xl">
                      <goal.icon className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-white mb-2">{goal.title}</h3>
                      <p className="text-gray-300">{goal.description}</p>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>

            {/* Statistics Section */}
            <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className={`${sharedStyles.card} text-center`}>
                <div className="text-4xl font-bold text-purple-400 mb-2">85%</div>
                <div className="text-gray-300">Placement Success Rate</div>
              </div>
              <div className={`${sharedStyles.card} text-center`}>
                <div className="text-4xl font-bold text-purple-400 mb-2">1000+</div>
                <div className="text-gray-300">Regional Jobs Created</div>
              </div>
              <div className={`${sharedStyles.card} text-center`}>
                <div className="text-4xl font-bold text-purple-400 mb-2">15+</div>
                <div className="text-gray-300">Regional Communities</div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </PageWrapper>
  );
};

export default Mission;
