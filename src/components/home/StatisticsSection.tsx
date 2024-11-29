import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion, useAnimation } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import CountUp from 'react-countup';
import ReportRegistrationModal from '../modals/ReportRegistrationModal';

export const StatisticsSection: React.FC = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const controls = useAnimation();
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.2,
  });

  React.useEffect(() => {
    if (inView) {
      controls.start('visible');
    }
  }, [controls, inView]);

  const containerVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        staggerChildren: 0.2
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0
    }
  };

  return (
    <motion.section
      ref={ref}
      initial="hidden"
      animate={controls}
      variants={containerVariants}
      className="py-16 bg-purple-900/50 rounded-xl my-16"
    >
      <motion.div variants={itemVariants} className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-3xl font-bold text-white mb-8">ABS Monthly Statistics Subscription</h2>
        <h3 className="text-2xl text-purple-400 mb-4">Comprehensive Regional Employment Insights</h3>
        <p className="text-gray-300 mb-8">
          Stay ahead with detailed monthly employment statistics and expert analysis for Regional Australia.
        </p>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
        <motion.div
          variants={itemVariants}
          className="bg-purple-800/50 p-6 rounded-lg text-center"
        >
          <div className="text-4xl font-bold text-purple-400 mb-4">
            <CountUp
              end={15}
              duration={2.5}
              suffix="+"
              enableScrollSpy
              scrollSpyOnce
            />
          </div>
          <div className="text-gray-300">Regional Areas</div>
        </motion.div>

        <motion.div
          variants={itemVariants}
          className="bg-purple-800/50 p-6 rounded-lg text-center"
        >
          <div className="text-4xl font-bold text-purple-400 mb-4">
            <CountUp
              end={12}
              duration={2.5}
              suffix=" mo"
              enableScrollSpy
              scrollSpyOnce
            />
          </div>
          <div className="text-gray-300">Historical Data</div>
        </motion.div>

        <motion.div
          variants={itemVariants}
          className="bg-purple-800/50 p-6 rounded-lg text-center"
        >
          <div className="text-4xl font-bold text-purple-400 mb-4">
            <CountUp
              end={20}
              duration={2.5}
              suffix="+"
              enableScrollSpy
              scrollSpyOnce
            />
          </div>
          <div className="text-gray-300">Key Metrics</div>
        </motion.div>
      </div>

      <motion.div
        variants={itemVariants}
        className="bg-purple-800/50 p-8 rounded-lg mb-12"
      >
        <h4 className="text-2xl font-semibold mb-6">CEO's Commentary - Paul Mizzi</h4>
        <div className="flex flex-col md:flex-row gap-8">
          <div className="md:w-1/4">
            <div className="w-48 h-48 rounded-full overflow-hidden mx-auto mb-4">
              <img 
                src="/images/team/paul-mizzi.jpg" 
                alt="Paul Mizzi"
                className="w-full h-full object-cover"
                onError={(e) => {
                  e.currentTarget.src = 'https://via.placeholder.com/200x200.png?text=PM';
                }}
              />
            </div>
            <div className="text-center">
              <div className="font-semibold">Paul Mizzi</div>
              <div className="text-purple-400">CEO, VirtualCC</div>
            </div>
          </div>
          <div className="md:w-3/4">
            <blockquote className="text-gray-300 text-lg leading-relaxed">
              "Our latest employment figures reveal both challenges and opportunities in Regional Australia. While we're seeing a 2.3% YoY increase in employment rates, there's still significant untapped potential in our over-50s workforce. The shift to remote work has created unprecedented opportunities for regional communities, particularly in the digital and service sectors.
              <br/><br/>
              Key challenges include digital literacy gaps and infrastructure limitations, but our data shows that with targeted support and training, regional workers are excelling in remote roles. The future of regional employment lies in embracing these changes while preserving the unique advantages of regional living."
            </blockquote>
          </div>
        </div>
      </motion.div>

      <motion.div
        variants={itemVariants}
        className="bg-purple-800/50 p-6 rounded-lg"
      >
        <h4 className="font-semibold mb-4">Subscription Benefits</h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <ul className="text-gray-300 space-y-3">
            <li className="flex items-center">
              <span className="text-purple-400 mr-2">•</span>
              Monthly employment trends by region
            </li>
            <li className="flex items-center">
              <span className="text-purple-400 mr-2">•</span>
              Industry-specific growth analysis
            </li>
            <li className="flex items-center">
              <span className="text-purple-400 mr-2">•</span>
              Age demographic breakdowns
            </li>
          </ul>
          <ul className="text-gray-300 space-y-3">
            <li className="flex items-center">
              <span className="text-purple-400 mr-2">•</span>
              Quarterly trend forecasts
            </li>
            <li className="flex items-center">
              <span className="text-purple-400 mr-2">•</span>
              Expert commentary and insights
            </li>
            <li className="flex items-center">
              <span className="text-purple-400 mr-2">•</span>
              Priority access to regional job opportunities
            </li>
          </ul>
        </div>
        
        <motion.div
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          <button
            onClick={() => setIsModalOpen(true)}
            className="inline-block w-full text-center px-6 py-3 bg-purple-400 text-white rounded-md hover:bg-purple-500 transition-colors duration-200"
          >
            Subscribe to Monthly Statistics
          </button>
        </motion.div>
      </motion.div>

      <motion.p
        variants={itemVariants}
        className="text-sm text-gray-300 mt-4 text-center"
      >
        * Data sourced from official ABS statistics and internal research
      </motion.p>

      <ReportRegistrationModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </motion.section>
  );
};
