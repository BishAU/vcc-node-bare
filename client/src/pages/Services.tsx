import React from 'react';
import { PageWrapper } from '../components/layout/PageWrapper';
import { sharedStyles, combineClasses } from '../styles/shared';
import { FiUsers, FiBriefcase, FiBook, FiAward, FiTrendingUp, FiMonitor } from 'react-icons/fi';

const Services = () => {
  const services = [
    {
      icon: FiUsers,
      title: 'Career Counseling',
      description: 'One-on-one guidance sessions with experienced career counselors to help you plan your career path.',
      features: ['Personal Assessment', 'Career Planning', 'Goal Setting', 'Industry Insights'],
    },
    {
      icon: FiBriefcase,
      title: 'Job Placement',
      description: 'Direct job placement services connecting you with employers looking for your skills and experience.',
      features: ['Job Matching', 'Interview Preparation', 'Salary Negotiation', 'Onboarding Support'],
    },
    {
      icon: FiBook,
      title: 'Skills Training',
      description: 'Comprehensive training programs to enhance your professional skills and market value.',
      features: ['Technical Skills', 'Soft Skills', 'Industry Certifications', 'Workshops'],
    },
    {
      icon: FiAward,
      title: 'Professional Certification',
      description: 'Get certified in your field with our industry-recognized certification programs.',
      features: ['Accredited Programs', 'Exam Preparation', 'Practice Tests', 'Certification Support'],
    },
    {
      icon: FiTrendingUp,
      title: 'Career Development',
      description: 'Ongoing support for your professional growth and career advancement.',
      features: ['Leadership Training', 'Mentorship Programs', 'Networking Events', 'Career Workshops'],
    },
    {
      icon: FiMonitor,
      title: 'Remote Work Training',
      description: 'Learn essential skills for successful remote work and virtual collaboration.',
      features: ['Digital Tools', 'Virtual Communication', 'Time Management', 'Remote Best Practices'],
    },
  ];

  return (
    <PageWrapper>
      <div className={sharedStyles.pageContainer}>
        <div className={sharedStyles.contentWrapper}>
          <h1 className={sharedStyles.heading}>Our Services</h1>

          {/* Hero Section */}
          <div className={sharedStyles.card}>
            <div className="prose prose-invert max-w-none">
              <p className="text-xl text-gray-300 leading-relaxed">
                Discover our comprehensive range of employment services designed to help you achieve your career goals.
                From career counseling to job placement, we're here to support your professional journey.
              </p>
            </div>
          </div>

          {/* Services Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-8">
            {services.map((service) => (
              <div key={service.title} className={combineClasses(
                sharedStyles.card,
                'transform hover:scale-105 transition-transform duration-200'
              )}>
                <div className="flex flex-col h-full">
                  <div className="flex items-center gap-4 mb-4">
                    <div className="bg-gradient-to-r from-purple-500 to-pink-500 p-3 rounded-xl">
                      <service.icon className="w-6 h-6 text-white" />
                    </div>
                    <h3 className="text-xl font-bold text-white">{service.title}</h3>
                  </div>
                  <p className="text-gray-300 mb-6">{service.description}</p>
                  <div className="mt-auto">
                    <h4 className="text-sm font-semibold text-white mb-2">Key Features:</h4>
                    <ul className="space-y-2">
                      {service.features.map((feature, index) => (
                        <li key={index} className="text-gray-300 flex items-center gap-2">
                          <span className="w-1.5 h-1.5 bg-purple-500 rounded-full"></span>
                          {feature}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Call to Action */}
          <div className={`${sharedStyles.card} mt-8 text-center`}>
            <h2 className="text-2xl font-bold text-white mb-4">Ready to Get Started?</h2>
            <p className="text-gray-300 mb-6">
              Contact us today to learn more about how our services can help you achieve your career goals.
            </p>
            <button className={combineClasses(
              sharedStyles.button.base,
              sharedStyles.button.primary,
              'mx-auto'
            )}>
              Schedule a Consultation
            </button>
          </div>
        </div>
      </div>
    </PageWrapper>
  );
};

export default Services;
