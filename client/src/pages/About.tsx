import React from 'react';
import { PageWrapper } from '../components/layout/PageWrapper';
import { sharedStyles } from '../styles/shared';
import { FiHeart, FiTarget, FiUsers } from 'react-icons/fi';

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

          {/* Team Section */}
          <div className={`${sharedStyles.card} mt-8`}>
            <h2 className={sharedStyles.cardHeader}>Our Team</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
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