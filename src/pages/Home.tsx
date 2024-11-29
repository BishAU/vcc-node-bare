import React from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { Link } from 'react-router-dom';
import { HeroSection } from '../components/home/HeroSection';
import { StatisticsSection } from '../components/home/StatisticsSection';
import { ServicesSection } from '../components/home/ServicesSection';
import { SubscriptionBenefits } from '../components/home/SubscriptionBenefits';
import { PageWrapper } from '../components/layout/PageWrapper';
import { FacebookFeed } from '../components/social/FacebookFeed';

const Home = () => {
  const { scrollYProgress } = useScroll();
  const opacity = useTransform(scrollYProgress, [0, 0.3], [1, 0]);
  const scale = useTransform(scrollYProgress, [0, 0.3], [1, 0.95]);

  return (
    <PageWrapper>
      <div className="w-full">
        <motion.div style={{ opacity, scale }}>
          <HeroSection />
        </motion.div>
        
        <div className="w-full">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.6 }}
            className="bg-gradient-to-b from-gray-900 to-purple-900/50"
          >
            <StatisticsSection />
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.6 }}
            className="bg-gradient-to-b from-purple-900/50 to-gray-900"
          >
            <ServicesSection />
          </motion.div>

          <SubscriptionBenefits />

          {/* Mission Section */}
          <motion.section
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.6 }}
            className="w-full py-16 bg-gradient-to-b from-gray-900 to-purple-900/30"
          >
            <div className="container mx-auto px-4">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.2 }}
              >
                <h2 className="text-3xl font-bold text-white mb-2">Our Mission</h2>
                <h3 className="text-2xl text-purple-400 mb-8">Empowering Over-50s in Remote Work</h3>
                <p className="text-gray-300 mb-12">
                  Creating meaningful employment opportunities and combating age-based discrimination in the workplace
                </p>
              </motion.div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {[
                  {
                    title: "Experience Valued",
                    description: "Celebrating and utilizing the wealth of experience that over-50s bring"
                  },
                  {
                    title: "Remote First",
                    description: "Dedicated to creating flexible work-from-home opportunities"
                  },
                  {
                    title: "Digital Innovation",
                    description: "Leveraging technology to create meaningful connections"
                  }
                ].map((item, index) => (
                  <motion.div
                    key={item.title}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.2 + index * 0.1 }}
                    whileHover={{ y: -5, scale: 1.02 }}
                    className="glass-card p-6 backdrop-blur-lg bg-purple-900/20 border border-purple-500/20 rounded-xl hover:border-purple-500/40 transition-all duration-300"
                  >
                    <h4 className="text-xl font-semibold text-white mb-4">{item.title}</h4>
                    <p className="text-gray-300">{item.description}</p>
                  </motion.div>
                ))}
              </div>
            </div>
          </motion.section>

          {/* Social Media Section */}
          <motion.section
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.6 }}
            className="py-16 bg-gradient-to-b from-purple-900/30 to-gray-900"
          >
            <div className="container mx-auto px-4">
              <motion.h2
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.2 }}
                className="text-3xl font-bold text-white mb-8"
              >
                Connect With Us
              </motion.h2>
              <FacebookFeed />
            </div>
          </motion.section>
        </div>
      </div>
    </PageWrapper>
  );
};

export default Home;
