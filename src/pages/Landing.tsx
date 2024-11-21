import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

const stats = {
  currentRate: '7.8%',
  increase: '+2.3%',
  growth: '16%',
  target: '8%'
};

const features = [
  {
    title: 'Work From Home',
    description: 'Creating flexible remote contact centre opportunities specifically designed for regional Australians',
    link: '/services'
  },
  {
    title: 'IT Skills Development',
    description: 'Demonstrating and enhancing digital capabilities in modern work environments',
    link: '/resources'
  },
  {
    title: 'Mental Health Impact',
    description: 'Improving self-respect and mental health outcomes through meaningful employment',
    link: '/about'
  }
];

const Landing: React.FC = () => {
  return (
    <div className="bg-white">
      {/* Hero Section */}
      <div className="relative isolate px-6 pt-14 lg:px-8">
        <div className="mx-auto max-w-2xl py-32 sm:py-48 lg:py-56">
          <div className="text-center">
            <motion.h1 
              className="text-4xl font-bold tracking-tight text-gray-900 sm:text-6xl"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
            >
              Empowering your future
            </motion.h1>
            <motion.p 
              className="mt-6 text-lg leading-8 text-gray-600"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
            >
              Creating meaningful employment opportunities for over-50s professionals in Regional Victoria.
            </motion.p>
            <div className="mt-10 flex items-center justify-center gap-x-6">
              <Link
                to="/register"
                className="rounded-md bg-indigo-600 px-3.5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
              >
                Get Started
              </Link>
              <Link
                to="/about"
                className="text-sm font-semibold leading-6 text-gray-900"
              >
                Learn More <span aria-hidden="true">→</span>
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Critical Insights Section */}
      <div className="bg-gray-50 py-24 sm:py-32">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="mx-auto max-w-2xl lg:text-center">
            <h2 className="text-base font-semibold leading-7 text-indigo-600">Critical Insights</h2>
            <p className="mt-2 text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
              Regional Victoria's Over-50s Unemployment Crisis
            </p>
            <p className="mt-6 text-lg leading-8 text-gray-600">
              Our latest analysis reveals concerning trends in regional Victoria's mature workforce employment landscape.
            </p>
          </div>

          <div className="mx-auto mt-16 max-w-2xl sm:mt-20 lg:mt-24 lg:max-w-none">
            <dl className="grid max-w-xl grid-cols-1 gap-x-8 gap-y-16 lg:max-w-none lg:grid-cols-2">
              <div className="flex flex-col items-center">
                <dt className="text-4xl font-bold text-gray-900">{stats.currentRate}</dt>
                <dd className="mt-4 text-base leading-7 text-gray-600">Current Rate</dd>
              </div>
              <div className="flex flex-col items-center">
                <dt className="text-4xl font-bold text-gray-900">{stats.increase}</dt>
                <dd className="mt-4 text-base leading-7 text-gray-600">YoY Increase</dd>
              </div>
            </dl>
          </div>
        </div>
      </div>

      {/* Mission Section */}
      <div className="bg-white py-24 sm:py-32">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="mx-auto max-w-2xl lg:text-center">
            <h2 className="text-base font-semibold leading-7 text-indigo-600">Our Mission</h2>
            <p className="mt-2 text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
              Empowering Over-50s in Regional Australia
            </p>
            <p className="mt-6 text-lg leading-8 text-gray-600">
              Creating meaningful employment opportunities and combating age-based discrimination in the workplace
            </p>
          </div>

          <div className="mx-auto mt-16 max-w-2xl sm:mt-20 lg:mt-24 lg:max-w-none">
            <dl className="grid max-w-xl grid-cols-1 gap-x-8 gap-y-16 lg:max-w-none lg:grid-cols-3">
              {features.map((feature, index) => (
                <motion.div
                  key={feature.title}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.2 }}
                  className="flex flex-col items-start"
                >
                  <dt className="text-lg font-semibold text-gray-900">{feature.title}</dt>
                  <dd className="mt-4 text-base leading-7 text-gray-600">{feature.description}</dd>
                  <Link
                    to={feature.link}
                    className="mt-4 text-sm font-semibold text-indigo-600 hover:text-indigo-500"
                  >
                    Learn More →
                  </Link>
                </motion.div>
              ))}
            </dl>
          </div>
        </div>
      </div>

      {/* Employment Insights Section */}
      <div className="bg-gray-50 py-24 sm:py-32">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="mx-auto max-w-2xl lg:text-center">
            <h2 className="text-base font-semibold leading-7 text-indigo-600">Employment Insights</h2>
            <p className="mt-2 text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
              Regional Employment Recovery
            </p>
            <p className="mt-6 text-lg leading-8 text-gray-600">
              Our latest data reveals a significant upward trend in employment rates for workers aged 50+ across Regional Victoria, 
              showing a steady increase from 62% to 78% over the past year.
            </p>
          </div>

          <div className="mx-auto mt-16 max-w-2xl sm:mt-20 lg:mt-24 lg:max-w-none">
            <dl className="grid max-w-xl grid-cols-1 gap-x-8 gap-y-16 lg:max-w-none lg:grid-cols-2">
              <div className="flex flex-col items-center">
                <dt className="text-4xl font-bold text-gray-900">{stats.growth}</dt>
                <dd className="mt-4 text-base leading-7 text-gray-600">Overall Growth</dd>
              </div>
              <div className="flex flex-col items-center">
                <dt className="text-4xl font-bold text-gray-900">{stats.target}</dt>
                <dd className="mt-4 text-base leading-7 text-gray-600">Above Target</dd>
              </div>
            </dl>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="bg-white">
        <div className="px-6 py-24 sm:px-6 sm:py-32 lg:px-8">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
              Ready to make a difference?
            </h2>
            <p className="mx-auto mt-6 max-w-xl text-lg leading-8 text-gray-600">
              Join us in creating sustainable employment opportunities for regional communities.
            </p>
            <div className="mt-10 flex items-center justify-center gap-x-6">
              <Link
                to="/register"
                className="rounded-md bg-indigo-600 px-3.5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
              >
                Get Started
              </Link>
              <Link
                to="/contact"
                className="text-sm font-semibold leading-6 text-gray-900"
              >
                Contact Us <span aria-hidden="true">→</span>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Landing;
