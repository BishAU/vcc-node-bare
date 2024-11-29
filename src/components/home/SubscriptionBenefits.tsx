import React from 'react';
import { motion } from 'framer-motion';
import { 
  FiTrendingUp, 
  FiPieChart, 
  FiUsers, 
  FiCalendar, 
  FiMessageCircle, 
  FiBriefcase,
  FiArrowRight
} from 'react-icons/fi';
import { sharedStyles } from '../../styles/shared';

interface Benefit {
  icon: React.ReactNode;
  title: string;
  description: string;
}

export const SubscriptionBenefits: React.FC = () => {
  const benefits: Benefit[] = [
    {
      icon: <FiTrendingUp className="w-6 h-6" />,
      title: "Employment Trends",
      description: "Monthly analysis of employment trends across industries"
    },
    {
      icon: <FiPieChart className="w-6 h-6" />,
      title: "Industry Growth Analysis",
      description: "Detailed insights into industry-specific growth patterns"
    },
    {
      icon: <FiUsers className="w-6 h-6" />,
      title: "Demographic Insights",
      description: "Comprehensive age demographic breakdowns and analysis"
    },
    {
      icon: <FiCalendar className="w-6 h-6" />,
      title: "Trend Forecasts",
      description: "Quarterly forecasts of employment market trends"
    },
    {
      icon: <FiMessageCircle className="w-6 h-6" />,
      title: "Expert Commentary",
      description: "In-depth analysis and insights from industry experts"
    },
    {
      icon: <FiBriefcase className="w-6 h-6" />,
      title: "Priority Access",
      description: "Early access to remote work opportunities"
    }
  ];

  return (
    <section className="py-16 bg-gradient-to-b from-gray-900 to-purple-900/30">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-3xl font-bold text-white mb-4"
          >
            Subscription Benefits
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className={`${sharedStyles.text} max-w-2xl mx-auto`}
          >
            Get access to comprehensive employment insights and opportunities
          </motion.p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          {benefits.map((benefit, index) => (
            <motion.div
              key={benefit.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              whileHover={{ 
                scale: 1.02,
                transition: { duration: 0.2 }
              }}
              className={`${sharedStyles.card} group cursor-pointer backdrop-blur-sm hover:bg-purple-800/30 transition-all duration-300`}
            >
              <div className="flex items-start space-x-4">
                <div className="p-3 rounded-xl bg-purple-500/20 text-purple-400 group-hover:bg-purple-500/30 group-hover:text-purple-300 transition-all duration-300">
                  {benefit.icon}
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-white mb-2 group-hover:text-purple-300 transition-colors">
                    {benefit.title}
                  </h3>
                  <p className={`${sharedStyles.text} text-sm`}>
                    {benefit.description}
                  </p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.6 }}
          className="text-center"
        >
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className={`${sharedStyles.button.base} ${sharedStyles.button.primary} group`}
          >
            Subscribe to Monthly Statistics
            <FiArrowRight className="inline-block ml-2 transform group-hover:translate-x-1 transition-transform" />
          </motion.button>
          <p className="text-sm text-gray-400 mt-4">
            * Data sourced from official ABS statistics and internal research
          </p>
        </motion.div>
      </div>
    </section>
  );
};
