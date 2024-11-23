import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FiBriefcase, FiBook, FiUsers } from 'react-icons/fi';

interface ServiceCardProps {
  title: string;
  description: string;
  icon: React.ReactNode;
  delay: number;
}

const ServiceCard: React.FC<ServiceCardProps> = ({ title, description, icon, delay }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, duration: 0.5 }}
      whileHover={{ y: -5, transition: { duration: 0.2 } }}
      className="bg-gray-800 p-8 rounded-lg transform transition-all duration-200 hover:shadow-xl"
    >
      <motion.div
        whileHover={{ scale: 1.1 }}
        className="text-purple-500 text-2xl mb-4"
      >
        {icon}
      </motion.div>
      <h3 className="text-xl font-semibold mb-4">{title}</h3>
      <p className="text-gray-400 mb-4">{description}</p>
      <motion.div
        whileHover={{ x: 5 }}
        className="text-purple-500 hover:text-purple-400 inline-flex items-center"
      >
        <Link to="/services">Learn More</Link>
        <motion.span
          className="ml-1"
          initial={{ x: 0 }}
          whileHover={{ x: 5 }}
        >
          →
        </motion.span>
      </motion.div>
    </motion.div>
  );
};

const ServicesSection = () => {
  const services = [
    {
      icon: <FiBriefcase />,
      title: "Professional Career Transition",
      description: "Expert guidance for your next professional move",
      delay: 0.2
    },
    {
      icon: <FiBook />,
      title: "Professional Skill Development",
      description: "Stay current with modern workplace technologies",
      delay: 0.4
    },
    {
      icon: <FiUsers />,
      title: "Professional Community Support",
      description: "Connect with peers and mentors in your region",
      delay: 0.6
    }
  ];

  return (
    <section className="py-16">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="text-center mb-12"
      >
        <h2 className="text-3xl font-bold mb-4">Our Services</h2>
        <p className="text-gray-400 max-w-2xl mx-auto">
          Comprehensive support for your professional journey in Regional Victoria
        </p>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {services.map((service, index) => (
          <ServiceCard key={index} {...service} />
        ))}
      </div>
    </section>
  );
};

export default ServicesSection;
