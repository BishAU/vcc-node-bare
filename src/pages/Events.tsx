import React from 'react';
import { motion } from 'framer-motion';
import { FiCalendar, FiMapPin, FiClock, FiUsers } from 'react-icons/fi';
import { PageLayout } from '../components/layout/PageLayout';
import { sharedStyles } from '../styles/shared';

const events = [
  {
    id: 1,
    title: 'Remote Work Best Practices Workshop',
    date: '2024-03-15',
    time: '10:00 AM - 12:00 PM',
    location: 'Virtual Event',
    category: 'Workshop',
    description: 'Learn essential best practices for effective remote work management.',
    attendees: 45,
    maxAttendees: 100,
    status: 'Upcoming'
  },
  {
    id: 2,
    title: 'Contact Center Technology Summit',
    date: '2024-03-20',
    time: '9:00 AM - 5:00 PM',
    location: 'Melbourne Convention Center',
    category: 'Conference',
    description: 'Explore the latest trends and technologies in contact center operations.',
    attendees: 120,
    maxAttendees: 200,
    status: 'Upcoming'
  },
  {
    id: 3,
    title: 'Regional Business Networking',
    date: '2024-03-25',
    time: '6:00 PM - 8:00 PM',
    location: 'Various Regional Locations',
    category: 'Networking',
    description: 'Connect with other regional businesses and share experiences.',
    attendees: 30,
    maxAttendees: 50,
    status: 'Upcoming'
  },
  {
    id: 4,
    title: 'Customer Service Excellence Training',
    date: '2024-04-01',
    time: '1:00 PM - 4:00 PM',
    location: 'Virtual Event',
    category: 'Training',
    description: 'Comprehensive training on delivering exceptional customer service.',
    attendees: 25,
    maxAttendees: 50,
    status: 'Upcoming'
  }
];

const categories = ['All', 'Workshop', 'Conference', 'Networking', 'Training'];

const Events: React.FC = () => {
  const [selectedCategory, setSelectedCategory] = React.useState('All');

  const filteredEvents = events.filter(
    event => selectedCategory === 'All' || event.category === selectedCategory
  );

  return (
    <PageLayout title="Events">
      <div className="text-center mb-12">
        <p className={`${sharedStyles.text} max-w-2xl mx-auto`}>
          Join our events to learn, connect, and grow with other regional businesses.
        </p>
      </div>

      {/* Category Filter */}
      <div className="flex justify-center mb-8 space-x-4 overflow-x-auto">
        {categories.map((category) => (
          <button
            key={category}
            onClick={() => setSelectedCategory(category)}
            className={`${sharedStyles.button.base} ${
              selectedCategory === category
                ? sharedStyles.button.primary
                : sharedStyles.button.ghost
            } whitespace-nowrap`}
          >
            {category}
          </button>
        ))}
      </div>

      {/* Events Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {filteredEvents.map((event, index) => (
          <motion.div
            key={event.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className={`${sharedStyles.card} hover:border-purple-600/50 transition-colors`}
          >
            <div className="flex justify-between items-start mb-4">
              <h3 className={sharedStyles.subheading}>{event.title}</h3>
              <span className={sharedStyles.badge.primary}>
                {event.category}
              </span>
            </div>
            <p className={`${sharedStyles.text} mb-4`}>{event.description}</p>
            <div className="grid grid-cols-2 gap-4 mb-4">
              <div className={`flex items-center ${sharedStyles.text}`}>
                <FiCalendar className="w-5 h-5 mr-2 text-purple-400" />
                {event.date}
              </div>
              <div className={`flex items-center ${sharedStyles.text}`}>
                <FiClock className="w-5 h-5 mr-2 text-purple-400" />
                {event.time}
              </div>
              <div className={`flex items-center ${sharedStyles.text}`}>
                <FiMapPin className="w-5 h-5 mr-2 text-purple-400" />
                {event.location}
              </div>
              <div className={`flex items-center ${sharedStyles.text}`}>
                <FiUsers className="w-5 h-5 mr-2 text-purple-400" />
                {event.attendees}/{event.maxAttendees} Attendees
              </div>
            </div>
            <div className="flex justify-between items-center">
              <div className="flex-1 bg-purple-900/50 rounded-full h-2 mr-4">
                <div
                  className="bg-purple-500 rounded-full h-2"
                  style={{
                    width: `${(event.attendees / event.maxAttendees) * 100}%`
                  }}
                />
              </div>
              <button className={`${sharedStyles.button.base} ${sharedStyles.button.primary}`}>
                Register
              </button>
            </div>
          </motion.div>
        ))}
      </div>
    </PageLayout>
  );
};

export default Events;
