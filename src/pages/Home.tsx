import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { HeroSection } from '../components/home/HeroSection';
import { StatisticsSection } from '../components/home/StatisticsSection';
import { ServicesSection } from '../components/home/ServicesSection';
import { SponsorSection } from '../components/home/SponsorSection';
import { PageWrapper } from '../components/layout/PageWrapper';

const Home = () => {
  return (
    <PageWrapper>
      <div className="bg-gray-900">
        <div className="container mx-auto px-4 max-w-7xl">
          <HeroSection />
          
          <SponsorSection />
          
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <StatisticsSection />
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.4 }}
          >
            <ServicesSection />
          </motion.div>

          {/* Mission Section */}
          <motion.section
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.6 }}
            className="py-16 bg-purple-500"
          >
            <h2 className="text-3xl font-bold text-white mb-2">Our Mission</h2>
            <h3 className="text-2xl text-purple-400 mb-8">Empowering Over-50s in Regional Australia</h3>
            <p className="text-gray-300 mb-12">
              Creating meaningful employment opportunities and combating age-based discrimination in the workplace
            </p>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <motion.div
                whileHover={{ y: -5 }}
                className="bg-gray-800 p-8 rounded-lg"
                style={{
                  backgroundImage: 'linear-gradient(rgba(0, 0, 0, 0.7), rgba(0, 0, 0, 0.7)), url(/images/regional/remote-work.jpg)',
                  backgroundSize: 'cover',
                  backgroundPosition: 'center'
                }}
              >
                <h4 className="text-xl font-semibold mb-4">Work From Home</h4>
                <p className="text-gray-300 mb-4">
                  Creating flexible remote contact centre opportunities specifically designed for regional Australians
                </p>
                <motion.div
                  whileHover={{ x: 5 }}
                  className="text-purple-400 hover:text-purple-300"
                >
                  <Link to="/services">Learn More →</Link>
                </motion.div>
              </motion.div>

              <motion.div
                whileHover={{ y: -5 }}
                className="bg-gray-800 p-8 rounded-lg"
                style={{
                  backgroundImage: 'linear-gradient(rgba(0, 0, 0, 0.7), rgba(0, 0, 0, 0.7)), url(/images/regional/skills-training.jpg)',
                  backgroundSize: 'cover',
                  backgroundPosition: 'center'
                }}
              >
                <h4 className="text-xl font-semibold mb-4">IT Skills Development</h4>
                <p className="text-gray-300 mb-4">
                  Demonstrating and enhancing digital capabilities in modern work environments
                </p>
                <motion.div
                  whileHover={{ x: 5 }}
                  className="text-purple-400 hover:text-purple-300"
                >
                  <Link to="/services">Learn More →</Link>
                </motion.div>
              </motion.div>

              <motion.div
                whileHover={{ y: -5 }}
                className="bg-gray-800 p-8 rounded-lg"
                style={{
                  backgroundImage: 'linear-gradient(rgba(0, 0, 0, 0.7), rgba(0, 0, 0, 0.7)), url(/images/regional/community.jpg)',
                  backgroundSize: 'cover',
                  backgroundPosition: 'center'
                }}
              >
                <h4 className="text-xl font-semibold mb-4">Mental Health Impact</h4>
                <p className="text-gray-300 mb-4">
                  Improving self-respect and mental health outcomes through meaningful employment
                </p>
                <motion.div
                  whileHover={{ x: 5 }}
                  className="text-purple-400 hover:text-purple-300"
                >
                  <Link to="/services">Learn More →</Link>
                </motion.div>
              </motion.div>
            </div>
          </motion.section>

          {/* CEO Commentary Section */}
          <motion.section
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.8 }}
            className="py-16 bg-purple-500 border-t border-gray-800"
          >
            <div className="flex flex-col md:flex-row items-center gap-8">
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5 }}
                className="w-48 h-48 relative rounded-xl overflow-hidden flex-shrink-0"
              >
                <img 
                  src="/images/team/paul-mizzi.jpg" 
                  alt="Paul Mizzi" 
                  className="w-full h-full object-cover"
                />
              </motion.div>
              
              <div className="flex-1">
                <h2 className="text-3xl font-bold text-white mb-2">CEO's Commentary</h2>
                <h3 className="text-xl text-purple-400 mb-4">Paul Mizzi, CEO of VirtualContactCentre</h3>
                <div className="prose prose-invert max-w-none">
                  <blockquote className="text-gray-300 border-l-4 border-purple-500 pl-4 italic">
                    <p className="mb-4">
                      "Our latest employment figures reveal both challenges and opportunities in Regional Australia. While we're seeing a 2.3% YoY increase in employment rates, there's still significant untapped potential in our over-50s workforce. The shift to remote work has created unprecedented opportunities for regional communities, particularly in the digital and service sectors."
                    </p>
                    <p>
                      "Key challenges include digital literacy gaps and infrastructure limitations, but our data shows that with targeted support and training, regional workers are excelling in remote roles. The future of regional employment lies in embracing these changes while preserving the unique advantages of regional living."
                    </p>
                  </blockquote>
                </div>
              </div>
            </div>
          </motion.section>
        </div>
      </div>
    </PageWrapper>
  );
};

export default Home;
