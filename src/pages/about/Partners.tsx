import React from 'react';
import { PageWrapper } from '../../components/layout/PageWrapper';
import { sharedStyles } from '../../styles/shared';
import { motion } from 'framer-motion';

const Partners = () => {
  const partners = [
    {
      name: 'Regional Development Victoria',
      logo: '/images/partners/regional-dev-vic.png',
      description: 'Supporting regional growth and development across Victoria.'
    },
    {
      name: 'Victorian Government',
      logo: '/images/partners/vic-gov-logo.png',
      description: 'Working together to create opportunities in regional communities.'
    },
    {
      name: 'Australian Bureau of Statistics',
      logo: '/images/partners/abs-logo.png',
      description: 'Providing data-driven insights for regional employment.'
    }
  ];

  const testimonials = [
    {
      quote: "VCC has been instrumental in helping us find and retain talented professionals in our regional operations.",
      author: "Jane Smith",
      role: "HR Director, Regional Healthcare Group"
    },
    {
      quote: "The platform's focus on regional development aligns perfectly with our mission to strengthen local communities.",
      author: "Michael Brown",
      role: "Regional Development Officer"
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
            <h1 className={sharedStyles.heading}>Our Partners</h1>
            <div className={`${sharedStyles.card} mb-8`}>
              <p className="text-xl text-gray-300 leading-relaxed">
                We collaborate with leading organizations and government bodies to create 
                sustainable employment opportunities in regional Australia. Our partnerships 
                are built on shared values and a commitment to regional development.
              </p>
            </div>

            {/* Partners Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
              {partners.map((partner) => (
                <motion.div
                  key={partner.name}
                  className={`${sharedStyles.card} flex flex-col items-center text-center`}
                  whileHover={{ scale: 1.02 }}
                  transition={{ duration: 0.2 }}
                >
                  <div className="w-48 h-24 flex items-center justify-center mb-4">
                    <img
                      src={partner.logo}
                      alt={partner.name}
                      className="max-w-full max-h-full object-contain"
                      onError={(e) => {
                        e.currentTarget.src = 'https://via.placeholder.com/192x96?text=Partner';
                      }}
                    />
                  </div>
                  <h3 className="text-xl font-bold text-white mb-2">{partner.name}</h3>
                  <p className="text-gray-300">{partner.description}</p>
                </motion.div>
              ))}
            </div>

            {/* Partner Testimonials */}
            <h2 className="text-2xl font-bold text-white mb-6">Partner Testimonials</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {testimonials.map((testimonial, index) => (
                <motion.div
                  key={index}
                  className={sharedStyles.card}
                  whileHover={{ scale: 1.02 }}
                  transition={{ duration: 0.2 }}
                >
                  <div className="flex flex-col space-y-4">
                    <p className="text-gray-300 italic">"{testimonial.quote}"</p>
                    <div>
                      <p className="text-white font-semibold">{testimonial.author}</p>
                      <p className="text-purple-400">{testimonial.role}</p>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </PageWrapper>
  );
};

export default Partners;
