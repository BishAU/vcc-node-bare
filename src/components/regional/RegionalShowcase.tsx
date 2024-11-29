import React from 'react';
import { motion } from 'framer-motion';
import OptimizedImage from '../common/OptimizedImage';

interface RegionData {
  id: string;
  name: string;
  description: string;
  imagePath: string;
  altText: string;
  stats: {
    jobs: number;
    employers: number;
    opportunities: number;
  };
}

const regions: RegionData[] = [
  {
    id: 'gippsland',
    name: 'Gippsland',
    description: 'From coastal communities to alpine regions, Gippsland offers diverse employment opportunities in tourism, agriculture, and renewable energy.',
    imagePath: '/images/regional/gippsland.jpg',
    altText: 'Scenic view of Lakes Entrance, Gippsland, showing coastal business district',
    stats: {
      jobs: 1200,
      employers: 450,
      opportunities: 85
    }
  },
  {
    id: 'loddon-mallee',
    name: 'Loddon Mallee',
    description: 'A hub for innovation in agriculture and technology, centered around the historic city of Bendigo and the Murray River region.',
    imagePath: '/images/regional/loddon-mallee.jpg',
    altText: 'Historic Bendigo CBD showcasing modern business development',
    stats: {
      jobs: 950,
      employers: 380,
      opportunities: 72
    }
  },
  {
    id: 'grampians',
    name: 'Grampians',
    description: 'Combining natural wonders with thriving regional centers, offering careers in tourism, education, and healthcare.',
    imagePath: '/images/regional/grampians.jpg',
    altText: 'Ballarat CBD with modern office buildings and historic architecture',
    stats: {
      jobs: 850,
      employers: 320,
      opportunities: 64
    }
  },
  {
    id: 'hume',
    name: 'Hume',
    description: 'A dynamic region spanning the Victorian Alps to the Murray River, with opportunities in agriculture, tourism, and manufacturing.',
    imagePath: '/images/regional/hume.jpg',
    altText: 'Albury-Wodonga business district with Murray River in background',
    stats: {
      jobs: 780,
      employers: 290,
      opportunities: 58
    }
  },
  {
    id: 'barwon',
    name: 'Barwon',
    description: 'Home to Geelong and the Great Ocean Road, offering diverse careers in education, healthcare, and tourism.',
    imagePath: '/images/regional/barwon.jpg',
    altText: 'Geelong Waterfront business precinct and bay view',
    stats: {
      jobs: 1100,
      employers: 420,
      opportunities: 92
    }
  }
];

const RegionalShowcase: React.FC = () => {
  return (
    <section className="py-16 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl font-bold text-gray-900 sm:text-4xl mb-4">
            Discover Regional Victoria's Opportunities
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Explore thriving professional communities across Victoria's diverse regions, 
            each offering unique career opportunities for experienced professionals.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
          {regions.map((region, index) => (
            <motion.div
              key={region.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              className="bg-white rounded-lg shadow-lg overflow-hidden"
            >
              <div className="relative h-48">
                <OptimizedImage
                  src={region.imagePath}
                  alt={region.altText}
                  width={400}
                  height={200}
                  className="w-full h-full object-cover"
                />
              </div>

              <div className="p-6">
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  {region.name}
                </h3>
                <p className="text-gray-600 mb-4">
                  {region.description}
                </p>

                <div className="grid grid-cols-3 gap-4 text-center">
                  <div>
                    <p className="text-2xl font-bold text-purple-600">
                      {region.stats.jobs}+
                    </p>
                    <p className="text-sm text-gray-500">Jobs</p>
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-purple-600">
                      {region.stats.employers}+
                    </p>
                    <p className="text-sm text-gray-500">Employers</p>
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-purple-600">
                      {region.stats.opportunities}+
                    </p>
                    <p className="text-sm text-gray-500">Opportunities</p>
                  </div>
                </div>

                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="mt-6 w-full bg-purple-600 text-white py-2 px-4 rounded-md 
                           hover:bg-purple-700 transition-colors duration-200"
                >
                  Explore {region.name} Opportunities
                </motion.button>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default RegionalShowcase;
