import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { PageWrapper } from '../components/layout/PageWrapper';
import HeroSection from '../components/home/HeroSection';
import ServicesSection from '../components/home/ServicesSection';
import StatisticsSection from '../components/home/StatisticsSection';

const Home = () => {
  return (
    <PageWrapper>
      <div className="container mx-auto px-4 max-w-7xl">
        <HeroSection />
        
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <ServicesSection />
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.4 }}
        >
          <StatisticsSection />
        </motion.div>

        {/* Mission Section */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.6 }}
          className="py-16"
        >
          <h2 className="text-3xl font-bold mb-2">Our Mission</h2>
          <h3 className="text-2xl text-purple-500 mb-8">Empowering Over-50s in Regional Australia</h3>
          <p className="text-gray-400 mb-12">
            Creating meaningful employment opportunities and combating age-based discrimination in the workplace
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <motion.div
              whileHover={{ y: -5 }}
              className="bg-gray-800 p-8 rounded-lg"
            >
              <h4 className="text-xl font-semibold mb-4">Work From Home</h4>
              <p className="text-gray-400 mb-4">
                Creating flexible remote contact centre opportunities specifically designed for regional Australians
              </p>
              <motion.div
                whileHover={{ x: 5 }}
                className="text-purple-500 hover:text-purple-400"
              >
                <Link to="/services">Learn More →</Link>
              </motion.div>
            </motion.div>

            <motion.div
              whileHover={{ y: -5 }}
              className="bg-gray-800 p-8 rounded-lg"
            >
              <h4 className="text-xl font-semibold mb-4">IT Skills Development</h4>
              <p className="text-gray-400 mb-4">
                Demonstrating and enhancing digital capabilities in modern work environments
              </p>
              <motion.div
                whileHover={{ x: 5 }}
                className="text-purple-500 hover:text-purple-400"
              >
                <Link to="/services">Learn More →</Link>
              </motion.div>
            </motion.div>

            <motion.div
              whileHover={{ y: -5 }}
              className="bg-gray-800 p-8 rounded-lg"
            >
              <h4 className="text-xl font-semibold mb-4">Mental Health Impact</h4>
              <p className="text-gray-400 mb-4">
                Improving self-respect and mental health outcomes through meaningful employment
              </p>
              <motion.div
                whileHover={{ x: 5 }}
                className="text-purple-500 hover:text-purple-400"
              >
                <Link to="/services">Learn More →</Link>
              </motion.div>
            </motion.div>
          </div>
        </motion.section>

        {/* Footer */}
        <footer className="py-16 border-t border-gray-800">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-12">
            <div>
              <h3 className="text-2xl font-bold text-purple-500 mb-4">VirtualContactCentre</h3>
              <p className="text-gray-400 mb-6">
                Empowering regional employment through data-driven insights and opportunities.
              </p>
              <div className="flex">
                <input
                  type="email"
                  placeholder="Enter your email"
                  className="px-4 py-2 bg-gray-800 rounded-l-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                />
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="px-4 py-2 bg-purple-500 text-white rounded-r-md hover:bg-purple-600"
                >
                  →
                </motion.button>
              </div>
            </div>

            <div>
              <h4 className="font-semibold mb-4">Company</h4>
              <ul className="space-y-2 text-gray-400">
                <li><Link to="/about" className="hover:text-white">About Us</Link></li>
                <li><Link to="/careers" className="hover:text-white">Careers</Link></li>
                <li><Link to="/contact" className="hover:text-white">Contact</Link></li>
                <li><Link to="/donate" className="hover:text-white">Donate</Link></li>
              </ul>
            </div>

            <div>
              <h4 className="font-semibold mb-4">Resources</h4>
              <ul className="space-y-2 text-gray-400">
                <li><Link to="/blog" className="hover:text-white">Blog</Link></li>
                <li><Link to="/events" className="hover:text-white">Events</Link></li>
                <li><Link to="/guides" className="hover:text-white">Guides</Link></li>
                <li><Link to="/help" className="hover:text-white">Help Center</Link></li>
              </ul>
            </div>

            <div>
              <h4 className="font-semibold mb-4">Legal</h4>
              <ul className="space-y-2 text-gray-400">
                <li><Link to="/terms" className="hover:text-white">Terms</Link></li>
                <li><Link to="/privacy" className="hover:text-white">Privacy</Link></li>
                <li><Link to="/cookies" className="hover:text-white">Cookies</Link></li>
              </ul>
            </div>
          </div>

          <div className="mt-12 pt-8 border-t border-gray-800">
            <div className="text-gray-400 mb-4">Our Supporters</div>
            <div className="flex space-x-6">
              <div className="text-sm text-gray-500">Social Traders Certified</div>
              <div className="text-sm text-gray-500">ACNC Registered Charity</div>
              <div className="text-sm text-gray-500">AMP Foundation</div>
            </div>
            <div className="mt-8 text-sm text-gray-500"> 2024 Virtual Contact Centre. All rights reserved.</div>
          </div>
        </footer>
      </div>
    </PageWrapper>
  );
};

export default Home;
