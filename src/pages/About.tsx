import React from 'react';
import { Link } from 'react-router-dom';
import { PageWrapper } from '../components/layout/PageWrapper';
import { sharedStyles } from '../styles/shared';
import { FiHeart, FiTarget, FiUsers } from 'react-icons/fi';
import { motion } from 'framer-motion';

const About = () => {
  const values = [
    {
      icon: FiHeart,
      title: 'Our Mission',
      description: 'To empower individuals through employment services and career development opportunities.',
    },
    {
      icon: FiTarget,
      title: 'Our Vision',
      description: 'Creating a world where everyone has access to meaningful employment and career growth.',
    },
    {
      icon: FiUsers,
      title: 'Our Community',
      description: 'Building strong partnerships with employers and job seekers to foster sustainable employment.',
    },
  ];

  return (
    <PageWrapper>
      <div className={sharedStyles.pageContainer}>
        <div className={sharedStyles.contentWrapper}>
          <h1 className={sharedStyles.heading}>About VCC Employment Services</h1>

          {/* Hero Section */}
          <div className={sharedStyles.card}>
            <div className="prose prose-invert max-w-none">
              <p className="text-xl text-gray-300 leading-relaxed">
                VCC Employment Services is dedicated to connecting talented individuals with meaningful employment opportunities.
                We provide comprehensive support services to both job seekers and employers, fostering successful partnerships
                that benefit our entire community.
              </p>
            </div>
          </div>

          {/* Values Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
            {values.map((value) => (
              <div key={value.title} className={sharedStyles.card}>
                <div className="flex flex-col items-center text-center">
                  <div className="bg-gradient-to-r from-purple-500 to-pink-500 p-4 rounded-xl mb-4">
                    <value.icon className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="text-xl font-bold text-white mb-2">{value.title}</h3>
                  <p className="text-gray-300">{value.description}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Statistics */}
          <div className={`${sharedStyles.card} mt-8`}>
            <h2 className={sharedStyles.cardHeader}>Our Impact</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="text-center">
                <p className="text-4xl font-bold text-white mb-2">5000+</p>
                <p className="text-gray-300">Job Placements</p>
              </div>
              <div className="text-center">
                <p className="text-4xl font-bold text-white mb-2">200+</p>
                <p className="text-gray-300">Partner Companies</p>
              </div>
              <div className="text-center">
                <p className="text-4xl font-bold text-white mb-2">95%</p>
                <p className="text-gray-300">Success Rate</p>
              </div>
            </div>
          </div>

          {/* Partners Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.6 }}
            className="mt-8 py-16 bg-gray-900 rounded-xl"
          >
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <h2 className="text-3xl font-bold text-white text-center mb-4">Our Partners in Regional Employment</h2>
              <p className="text-lg text-gray-300 text-center max-w-3xl mx-auto mb-12">
                Working together with leading organizations to create meaningful employment opportunities
                and drive regional economic growth.
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                {[
                  {
                    name: "Regional Development Victoria",
                    logo: "/images/sponsors/rdv-logo.png",
                    description: "Supporting regional growth and development across Victoria"
                  },
                  {
                    name: "Victorian Government",
                    logo: "/images/sponsors/vic-gov-logo.png",
                    description: "Partnering to create employment opportunities for all Victorians"
                  },
                  {
                    name: "Australian Bureau of Statistics",
                    logo: "/images/sponsors/abs-logo.png",
                    description: "Providing crucial employment data and insights"
                  },
                  {
                    name: "Jobs Victoria",
                    logo: "/images/sponsors/jobs-vic-logo.png",
                    description: "Connecting Victorians with meaningful employment"
                  }
                ].map((partner) => (
                  <motion.div
                    key={partner.name}
                    whileHover={{ scale: 1.05 }}
                    className="bg-gray-800/50 p-6 rounded-xl hover:bg-gray-800/70 transition-all duration-200"
                  >
                    <div className="h-24 flex items-center justify-center mb-6">
                      <img
                        src={partner.logo}
                        alt={partner.name}
                        className="max-h-full max-w-full object-contain"
                        onError={(e) => {
                          e.currentTarget.src = `https://via.placeholder.com/200x80?text=${encodeURIComponent(partner.name)}`;
                        }}
                      />
                    </div>
                    <h3 className="text-lg font-semibold text-white mb-2">{partner.name}</h3>
                    <p className="text-gray-300 text-sm">{partner.description}</p>
                  </motion.div>
                ))}
              </div>
              
              <motion.div
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                transition={{ delay: 0.4 }}
                className="text-center mt-12"
              >
                <p className="text-gray-300 text-lg mb-4">Interested in partnering with us?</p>
                <Link
                  to="/contact"
                  className="inline-flex items-center text-purple-400 hover:text-purple-300 transition-colors duration-200"
                >
                  Get in touch
                  <svg
                    className="w-5 h-5 ml-2"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M14 5l7 7m0 0l-7 7m7-7H3"
                    />
                  </svg>
                </Link>
              </motion.div>
            </div>
          </motion.div>

          {/* Team Section */}
          <div className={`${sharedStyles.card} mt-8`}>
            <h2 className={sharedStyles.cardHeader}>Our Leadership</h2>
            <div className="grid grid-cols-1 gap-8">
              {/* CEO Card */}
              <div className="flex flex-col md:flex-row items-center gap-8 p-6 bg-gray-700/50 rounded-xl">
                <div className="w-48 h-48 relative rounded-xl overflow-hidden">
                  <img 
                    src="/images/team/paul-mizzi.jpg" 
                    alt="Paul Mizzi" 
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="flex-1 text-left">
                  <h3 className="text-2xl font-bold text-white mb-1">Paul Mizzi</h3>
                  <p className="text-purple-400 text-lg mb-4">CEO, VirtualContactCentre</p>
                  <p className="text-gray-300 leading-relaxed">
                    "Our latest employment figures reveal both challenges and opportunities in Regional Australia. While we're seeing a 2.3% YoY increase in employment rates, there's still significant untapped potential in our over-50s workforce. The shift to remote work has created unprecedented opportunities for regional communities, particularly in the digital and service sectors.
                  </p>
                  <p className="text-gray-300 leading-relaxed mt-4">
                    Key challenges include digital literacy gaps and infrastructure limitations, but our data shows that with targeted support and training, regional workers are excelling in remote roles. The future of regional employment lies in embracing these changes while preserving the unique advantages of regional living."
                  </p>
                </div>
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-8">
              {/* Team member cards would go here */}
              <div className="flex flex-col items-center text-center p-4 bg-gray-700/50 rounded-xl">
                <div className="w-24 h-24 bg-gray-600 rounded-full mb-4"></div>
                <h3 className="text-lg font-bold text-white">Jane Smith</h3>
                <p className="text-gray-300">Director of Employment Services</p>
              </div>
              {/* Add more team members as needed */}
            </div>
          </div>
        </div>
      </div>
    </PageWrapper>
  );
};

export default About;
