import React from 'react';
import { motion } from 'framer-motion';
import { Navbar } from '../components/Navbar';
import { Footer } from '../components/Footer';

export default function About() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:py-16 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h2 className="text-3xl font-extrabold tracking-tight text-gray-900 sm:text-4xl">
            About VirtualCC
          </h2>
          <div className="mt-6 text-gray-500 space-y-6">
            <p className="text-lg">
              VirtualCC is a cutting-edge platform that combines 
              artificial intelligence with professional design tools to help you
              create stunning racing liveries. Our mission is to make professional
              livery design accessible to everyone, from amateur racers to
              professional teams.
            </p>
            <p className="text-lg">
              With our AI-powered tools, you can generate unique designs, customize
              them to your specifications, and bring your vision to life. Our
              platform supports multiple racing categories and vehicle types,
              ensuring that you can create the perfect livery for your needs.
            </p>
            <div className="mt-10">
              <h3 className="text-2xl font-bold text-gray-900">Key Features</h3>
              <ul className="mt-4 space-y-4">
                <motion.li
                  whileHover={{ scale: 1.02 }}
                  className="flex items-start"
                >
                  <div className="flex-shrink-0">
                    <svg
                      className="h-6 w-6 text-blue-600"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M5 13l4 4L19 7"
                      />
                    </svg>
                  </div>
                  <p className="ml-3 text-lg text-gray-500">
                    AI-powered design generation
                  </p>
                </motion.li>
                <motion.li
                  whileHover={{ scale: 1.02 }}
                  className="flex items-start"
                >
                  <div className="flex-shrink-0">
                    <svg
                      className="h-6 w-6 text-blue-600"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M5 13l4 4L19 7"
                      />
                    </svg>
                  </div>
                  <p className="ml-3 text-lg text-gray-500">
                    Professional design tools
                  </p>
                </motion.li>
                <motion.li
                  whileHover={{ scale: 1.02 }}
                  className="flex items-start"
                >
                  <div className="flex-shrink-0">
                    <svg
                      className="h-6 w-6 text-blue-600"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M5 13l4 4L19 7"
                      />
                    </svg>
                  </div>
                  <p className="ml-3 text-lg text-gray-500">
                    Multiple racing categories support
                  </p>
                </motion.li>
              </ul>
            </div>
          </div>
        </motion.div>
      </div>
      <Footer />
    </div>
  );
}