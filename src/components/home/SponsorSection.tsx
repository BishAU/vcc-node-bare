import React from 'react';
import { motion } from 'framer-motion';

export const SponsorSection: React.FC = () => {
  const sponsors = [
    {
      name: "Regional Development Victoria",
      logo: "/images/sponsors/rdv-logo.png",
      url: "https://www.rdv.vic.gov.au/",
      description: "Supporting regional growth and development across Victoria"
    },
    {
      name: "Victorian Government",
      logo: "/images/sponsors/vic-gov-logo.png",
      url: "https://www.vic.gov.au/",
      description: "Partnering to create employment opportunities for all Victorians"
    },
    {
      name: "Australian Bureau of Statistics",
      logo: "/images/sponsors/abs-logo.png",
      url: "https://www.abs.gov.au/",
      description: "Providing crucial employment data and insights"
    },
    {
      name: "Jobs Victoria",
      logo: "/images/sponsors/jobs-vic-logo.png",
      url: "https://jobs.vic.gov.au/",
      description: "Connecting Victorians with meaningful employment"
    }
  ];

  const containerVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        staggerChildren: 0.2
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0
    }
  };

  return (
    <motion.section
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.3 }}
      variants={containerVariants}
      className="py-16 bg-gray-900"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          variants={itemVariants}
          className="text-center mb-12"
        >
          <h2 className="text-3xl font-bold text-white mb-4">Our Partners in Regional Employment</h2>
          <p className="text-lg text-gray-300 max-w-3xl mx-auto">
            Working together with leading organizations to create meaningful employment opportunities
            and drive regional economic growth.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {sponsors.map((sponsor) => (
            <motion.div
              key={sponsor.name}
              variants={itemVariants}
              whileHover={{ scale: 1.05 }}
              className="bg-gray-800/50 p-6 rounded-xl hover:bg-gray-800/70 transition-all duration-200"
            >
              <a
                href={sponsor.url}
                target="_blank"
                rel="noopener noreferrer"
                className="block"
              >
                <div className="h-24 flex items-center justify-center mb-6">
                  <img
                    src={sponsor.logo}
                    alt={sponsor.name}
                    className="max-h-full max-w-full object-contain"
                    onError={(e) => {
                      e.currentTarget.src = `https://via.placeholder.com/200x80?text=${encodeURIComponent(sponsor.name)}`;
                    }}
                  />
                </div>
                <h3 className="text-lg font-semibold text-white mb-2">{sponsor.name}</h3>
                <p className="text-gray-300 text-sm">{sponsor.description}</p>
              </a>
            </motion.div>
          ))}
        </div>

        <motion.div
          variants={itemVariants}
          className="mt-12 text-center"
        >
          <p className="text-gray-500 text-sm">
            Interested in partnering with us? <a href="/contact" className="text-purple-600 hover:text-purple-700">Get in touch</a>
          </p>
        </motion.div>
      </div>
    </motion.section>
  );
};
