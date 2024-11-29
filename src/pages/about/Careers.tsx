import React from 'react';
import { PageWrapper } from '../../components/layout/PageWrapper';
import { sharedStyles } from '../../styles/shared';
import { motion } from 'framer-motion';
import { FiBriefcase, FiHeart, FiUsers, FiAward } from 'react-icons/fi';

const Careers = () => {
  const benefits = [
    {
      icon: FiBriefcase,
      title: 'Flexible Work',
      description: 'Work from our regional offices or remotely with flexible hours.'
    },
    {
      icon: FiHeart,
      title: 'Health & Wellness',
      description: 'Comprehensive health coverage and wellness programs.'
    },
    {
      icon: FiUsers,
      title: 'Professional Growth',
      description: 'Continuous learning and development opportunities.'
    },
    {
      icon: FiAward,
      title: 'Recognition',
      description: 'Competitive compensation and performance rewards.'
    }
  ];

  const openings = [
    {
      title: 'Regional Employment Coordinator',
      location: 'Bendigo, VIC',
      type: 'Full-time',
      description: 'Lead regional employment initiatives and build relationships with local businesses.'
    },
    {
      title: 'Career Development Specialist',
      location: 'Remote/Hybrid',
      type: 'Full-time',
      description: 'Guide job seekers through their career journey and provide professional development support.'
    },
    {
      title: 'Community Engagement Manager',
      location: 'Ballarat, VIC',
      type: 'Full-time',
      description: 'Develop and maintain relationships with regional communities and stakeholders.'
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
            <h1 className={sharedStyles.heading}>Join Our Team</h1>
            <div className={`${sharedStyles.card} mb-8`}>
              <p className="text-xl text-gray-300 leading-relaxed">
                Be part of our mission to transform regional employment. We're looking for passionate 
                individuals who want to make a difference in regional communities and help build 
                sustainable career pathways.
              </p>
            </div>

            {/* Benefits Section */}
            <h2 className="text-2xl font-bold text-white mb-6">Why Work With Us</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
              {benefits.map((benefit) => (
                <motion.div
                  key={benefit.title}
                  className={`${sharedStyles.card} flex flex-col items-center text-center`}
                  whileHover={{ scale: 1.02 }}
                  transition={{ duration: 0.2 }}
                >
                  <div className="bg-gradient-to-r from-purple-500 to-pink-500 p-4 rounded-xl mb-4">
                    <benefit.icon className="w-6 h-6 text-white" />
                  </div>
                  <h3 className="text-xl font-bold text-white mb-2">{benefit.title}</h3>
                  <p className="text-gray-300">{benefit.description}</p>
                </motion.div>
              ))}
            </div>

            {/* Current Openings */}
            <h2 className="text-2xl font-bold text-white mb-6">Current Openings</h2>
            <div className="space-y-4">
              {openings.map((job, index) => (
                <motion.div
                  key={index}
                  className={sharedStyles.card}
                  whileHover={{ scale: 1.01 }}
                  transition={{ duration: 0.2 }}
                >
                  <div className="flex flex-col md:flex-row md:items-center md:justify-between">
                    <div>
                      <h3 className="text-xl font-bold text-white mb-2">{job.title}</h3>
                      <p className="text-gray-300 mb-4">{job.description}</p>
                      <div className="flex space-x-4">
                        <span className="text-purple-400">{job.location}</span>
                        <span className="text-purple-400">{job.type}</span>
                      </div>
                    </div>
                    <button className="mt-4 md:mt-0 px-6 py-2 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-lg hover:opacity-90 transition-opacity">
                      Apply Now
                    </button>
                  </div>
                </motion.div>
              ))}
            </div>

            {/* Contact Section */}
            <div className={`${sharedStyles.card} mt-8 text-center`}>
              <h2 className="text-2xl font-bold text-white mb-4">Don't See Your Perfect Role?</h2>
              <p className="text-gray-300 mb-4">
                We're always looking for talented individuals to join our team. Send us your resume 
                and let us know how you can contribute to our mission.
              </p>
              <button className="px-8 py-3 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-lg hover:opacity-90 transition-opacity">
                Contact Us
              </button>
            </div>
          </motion.div>
        </div>
      </div>
    </PageWrapper>
  );
};

export default Careers;
