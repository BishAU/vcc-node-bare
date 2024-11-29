import React from 'react';
import { motion } from 'framer-motion';

export const RegionalSection: React.FC = () => {
  const regions = [
    {
      name: 'Gippsland',
      image: '/images/regional/gippsland.jpg',
      description: 'Serving communities across Gippsland region'
    },
    {
      name: 'Loddon Mallee',
      image: '/images/regional/loddon-mallee.jpg',
      description: 'Supporting the Loddon Mallee region'
    },
    {
      name: 'Grampians',
      image: '/images/regional/grampians.jpg',
      description: 'Connecting the Grampians region'
    },
    {
      name: 'Hume',
      image: '/images/regional/hume.jpg',
      description: 'Empowering the Hume region'
    },
    {
      name: 'Barwon South West',
      image: '/images/regional/barwon.jpg',
      description: 'Supporting Barwon South West communities'
    }
  ];

  return (
    <motion.section
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6 }}
      className="py-16 bg-gradient-to-b from-gray-900 to-purple-900/30"
    >
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.2 }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl font-bold text-white mb-4">Serving Regional Victoria</h2>
          <p className="text-lg text-gray-300 max-w-3xl mx-auto">
            Supporting employment and growth across Victoria's diverse regions
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-6">
          {regions.map((region, index) => (
            <motion.div
              key={region.name}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 + index * 0.1 }}
              whileHover={{ y: -5, scale: 1.02 }}
              className="relative group"
            >
              <div className="aspect-square rounded-xl overflow-hidden">
                <img
                  src={region.image}
                  alt={region.name}
                  className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
                  onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    target.src = '/images/services/placeholder.jpg';
                  }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-purple-900/90 to-transparent" />
                <div className="absolute bottom-0 left-0 right-0 p-4 text-center">
                  <h3 className="text-lg font-semibold text-white mb-1">{region.name}</h3>
                  <p className="text-sm text-gray-300 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    {region.description}
                  </p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </motion.section>
  );
};
