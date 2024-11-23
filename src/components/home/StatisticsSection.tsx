import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion, useAnimation } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import CountUp from 'react-countup';
import ReportRegistrationModal from '../modals/ReportRegistrationModal';

const StatisticsSection = () => {
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
      className="py-16 bg-gray-800 rounded-lg p-8"
    >
      <motion.div variants={itemVariants}>
        <h2 className="text-3xl font-bold mb-8">Critical Insights</h2>
        <h3 className="text-2xl mb-4">Regional Victoria's Over-50s Employment Landscape</h3>
        <p className="text-gray-400 mb-8">
          Our latest analysis reveals encouraging trends in regional Victoria's mature workforce employment landscape.
        </p>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
        <motion.div
          variants={itemVariants}
          className="bg-gray-900 p-6 rounded-lg"
        >
          <div className="text-4xl font-bold text-purple-500 mb-2">
            <CountUp
              end={7.8}
              decimals={1}
              duration={2.5}
              suffix="%"
              enableScrollSpy
              scrollSpyOnce
            />
          </div>
          <div className="text-gray-400">Current Employment Rate</div>
        </motion.div>

        <motion.div
          variants={itemVariants}
          className="bg-gray-900 p-6 rounded-lg"
        >
          <div className="text-4xl font-bold text-green-500 mb-2">
            <CountUp
              end={2.3}
              decimals={1}
              duration={2.5}
              prefix="+"
              suffix="%"
              enableScrollSpy
              scrollSpyOnce
            />
          </div>
          <div className="text-gray-400">YoY Increase</div>
        </motion.div>
      </div>

      <motion.div
        variants={itemVariants}
        className="bg-gray-900 p-6 rounded-lg"
      >
        <h4 className="font-semibold mb-4">Full Report Access</h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <ul className="text-gray-400 space-y-2">
            <li className="flex items-center">
              <span className="text-purple-500 mr-2">•</span>
              Detailed regional breakdown
            </li>
            <li className="flex items-center">
              <span className="text-purple-500 mr-2">•</span>
              Industry-specific insights
            </li>
            <li className="flex items-center">
              <span className="text-purple-500 mr-2">•</span>
              Age demographic analysis
            </li>
          </ul>
          <ul className="text-gray-400 space-y-2">
            <li className="flex items-center">
              <span className="text-purple-500 mr-2">•</span>
              Policy recommendations
            </li>
            <li className="flex items-center">
              <span className="text-purple-500 mr-2">•</span>
              Quarterly trend comparisons
            </li>
            <li className="flex items-center">
              <span className="text-purple-500 mr-2">•</span>
              Success stories
            </li>
          </ul>
        </div>
        
        <motion.div
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          <button
            onClick={() => setIsModalOpen(true)}
            className="inline-block w-full text-center px-6 py-3 bg-purple-500 text-white rounded-md hover:bg-purple-600 transition-colors duration-200"
          >
            Register for Full Report
          </button>
        </motion.div>
      </motion.div>

      <motion.p
        variants={itemVariants}
        className="text-sm text-gray-500 mt-4 text-center"
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

export default StatisticsSection;
