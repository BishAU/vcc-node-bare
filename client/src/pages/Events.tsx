import React, { useState } from 'react';
import { PageWrapper } from '../components/layout/PageWrapper';
import EventList from '../components/events/EventList';
import { sharedStyles, combineClasses } from '../styles/shared';
import { useQuery } from '@tanstack/react-query';
import { eventsApi } from '../services/api';
import { FiCalendar, FiUsers, FiMapPin, FiBriefcase } from 'react-icons/fi';
import { motion } from 'framer-motion';

interface Event {
  id: string;
  title: string;
  description: string;
  date: string;
  time: string;
  location: string;
  capacity: number;
  registeredCount: number;
  imageUrl?: string;
  category: string;
  status: 'upcoming' | 'ongoing' | 'completed';
  registrationDeadline: string;
}

const fadeInUp = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.5 }
};

const staggerContainer = {
  animate: {
    transition: {
      staggerChildren: 0.1
    }
  }
};

const Events = () => {
  const [email, setEmail] = useState('');
  const { data: events = [], isLoading } = useQuery({
    queryKey: ['events'],
    queryFn: eventsApi.getAll,
  });

  const handleNewsletterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: Implement newsletter subscription
    console.log('Newsletter subscription:', email);
    setEmail('');
  };

  const featuredEvent = events.find(event => event.status === 'upcoming');

  const stats = [
    { icon: <FiCalendar className="w-8 h-8" />, value: '50+', label: 'Events per Year' },
    { icon: <FiUsers className="w-8 h-8" />, value: '1000+', label: 'Attendees' },
    { icon: <FiBriefcase className="w-8 h-8" />, value: '100+', label: 'Career Opportunities' },
  ];

  return (
    <PageWrapper>
      {/* Hero Section */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="text-center py-12 px-4 sm:px-6 lg:px-8 bg-gradient-to-r from-gray-900 to-gray-800 rounded-2xl mb-12"
      >
        <motion.h1
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.6 }}
          className={combineClasses(sharedStyles.text.h1, "mb-4")}
        >
          Career Events & Workshops
        </motion.h1>
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4, duration: 0.6 }}
          className={combineClasses(sharedStyles.text.subtitle, "max-w-2xl mx-auto mb-8")}
        >
          Join our industry-leading events and workshops designed to boost your career prospects. Network with professionals, learn new skills, and discover exciting opportunities in your field.
        </motion.p>

        {/* Stats */}
        <motion.div
          variants={staggerContainer}
          initial="initial"
          animate="animate"
          className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto mt-12"
        >
          {stats.map((stat, index) => (
            <motion.div
              key={index}
              variants={fadeInUp}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="bg-gray-800 rounded-xl p-6"
            >
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.2 * index, duration: 0.4 }}
                className="text-purple-400 mb-3 flex justify-center"
              >
                {stat.icon}
              </motion.div>
              <motion.div className="text-2xl font-bold text-white mb-1">{stat.value}</motion.div>
              <motion.div className="text-gray-400">{stat.label}</motion.div>
            </motion.div>
          ))}
        </motion.div>
      </motion.div>

      {/* Featured Event */}
      {featuredEvent && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6, duration: 0.6 }}
          className="mb-12 bg-gradient-to-r from-purple-900 to-indigo-900 rounded-2xl p-8"
        >
          <div className="flex flex-col md:flex-row gap-8 items-center">
            {featuredEvent.imageUrl && (
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.8, duration: 0.6 }}
                className="w-full md:w-1/3"
              >
                <motion.img
                  whileHover={{ scale: 1.05 }}
                  src={featuredEvent.imageUrl}
                  alt={featuredEvent.title}
                  className="w-full h-64 object-cover rounded-xl"
                />
              </motion.div>
            )}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.8, duration: 0.6 }}
              className="flex-1"
            >
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1, duration: 0.6 }}
                className="text-purple-400 text-sm font-medium mb-2"
              >
                Featured Event
              </motion.div>
              <motion.h2
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1.1, duration: 0.6 }}
                className={combineClasses(sharedStyles.text.h2, "mb-4")}
              >
                {featuredEvent.title}
              </motion.h2>
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1.2, duration: 0.6 }}
                className="text-gray-300 mb-6"
              >
                {featuredEvent.description}
              </motion.p>
              <motion.div
                variants={staggerContainer}
                initial="initial"
                animate="animate"
                className="flex flex-wrap gap-6 mb-6"
              >
                <motion.div
                  variants={fadeInUp}
                  className="flex items-center gap-2 text-gray-300"
                >
                  <FiCalendar className="w-5 h-5" />
                  <span>{new Date(featuredEvent.date).toLocaleDateString()} at {featuredEvent.time}</span>
                </motion.div>
                <motion.div
                  variants={fadeInUp}
                  className="flex items-center gap-2 text-gray-300"
                >
                  <FiMapPin className="w-5 h-5" />
                  <span>{featuredEvent.location}</span>
                </motion.div>
                <motion.div
                  variants={fadeInUp}
                  className="flex items-center gap-2 text-gray-300"
                >
                  <FiUsers className="w-5 h-5" />
                  <span>{featuredEvent.registeredCount} / {featuredEvent.capacity} registered</span>
                </motion.div>
              </motion.div>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className={combineClasses(sharedStyles.button.base, sharedStyles.button.primary)}
                disabled={featuredEvent.registeredCount >= featuredEvent.capacity}
              >
                {featuredEvent.registeredCount >= featuredEvent.capacity ? 'Event Full' : 'Register Now'}
              </motion.button>
            </motion.div>
          </div>
        </motion.div>
      )}

      {/* Event Categories */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1.2, duration: 0.6 }}
        className="mb-12"
      >
        <motion.h2
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.3, duration: 0.6 }}
          className={sharedStyles.text.h2}
        >
          Browse by Category
        </motion.h2>
        <motion.div
          variants={staggerContainer}
          initial="initial"
          animate="animate"
          className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6"
        >
          {['Workshops', 'Networking', 'Career Fairs', 'Industry Panels'].map((category, index) => (
            <motion.button
              key={category}
              variants={fadeInUp}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="bg-gray-800 hover:bg-gray-700 text-white rounded-lg py-3 px-4 text-sm font-medium transition-colors duration-200"
            >
              {category}
            </motion.button>
          ))}
        </motion.div>
      </motion.div>

      {/* Events List */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.4, duration: 0.6 }}
      >
        {isLoading ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex justify-center items-center py-12"
          >
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
              className="rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-500"
            />
          </motion.div>
        ) : (
          <EventList events={events.filter(event => event !== featuredEvent)} />
        )}
      </motion.div>

      {/* Newsletter Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
        className="mt-16 bg-gradient-to-r from-purple-900 to-indigo-900 rounded-2xl p-8 text-center"
      >
        <motion.h2
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.2, duration: 0.6 }}
          className={combineClasses(sharedStyles.text.h2, "mb-4")}
        >
          Never Miss an Event
        </motion.h2>
        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.4, duration: 0.6 }}
          className={combineClasses(sharedStyles.text.subtitle, "max-w-2xl mx-auto mb-8")}
        >
          Subscribe to our newsletter and stay informed about upcoming events, workshops, and career opportunities. Be the first to know when new events are announced!
        </motion.p>
        <motion.form
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.6, duration: 0.6 }}
          onSubmit={handleNewsletterSubmit}
          className="max-w-md mx-auto flex gap-4"
        >
          <motion.input
            whileFocus={{ scale: 1.02 }}
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Enter your email"
            className="flex-1 px-4 py-2 rounded-lg bg-gray-800 border border-gray-700 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500"
            required
          />
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            type="submit"
            className={combineClasses(
              sharedStyles.button.base,
              sharedStyles.button.primary,
              "whitespace-nowrap"
            )}
          >
            Subscribe Now
          </motion.button>
        </motion.form>
      </motion.div>
    </PageWrapper>
  );
};

export default Events;
