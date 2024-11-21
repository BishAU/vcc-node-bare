import React from 'react';
import { motion } from 'framer-motion';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

const upcomingEvents = [
  {
    id: 1,
    title: 'Virtual Career Fair',
    date: 'March 15, 2024',
    time: '10:00 AM - 4:00 PM AEST',
    location: 'Online',
    description: 'Connect with employers from across Regional Victoria in our virtual career fair.',
    category: 'Career Fair',
    registrationLink: '#'
  },
  {
    id: 2,
    title: 'Digital Skills Workshop',
    date: 'March 20, 2024',
    time: '2:00 PM - 4:00 PM AEST',
    location: 'Online',
    description: 'Learn essential digital skills for the modern workplace.',
    category: 'Workshop',
    registrationLink: '#'
  },
  {
    id: 3,
    title: 'Regional Networking Meetup',
    date: 'March 25, 2024',
    time: '5:30 PM - 7:30 PM AEST',
    location: 'Bendigo Business Hub',
    description: 'Network with professionals in your region and discover new opportunities.',
    category: 'Networking',
    registrationLink: '#'
  }
];

const pastEvents = [
  {
    id: 4,
    title: 'Resume Writing Masterclass',
    date: 'February 28, 2024',
    location: 'Online',
    category: 'Workshop',
    recordingLink: '#'
  },
  {
    id: 5,
    title: 'Industry Insights: Technology',
    date: 'February 15, 2024',
    location: 'Online',
    category: 'Webinar',
    recordingLink: '#'
  }
];

const Events: React.FC = () => {
  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      <div className="relative isolate px-6 pt-14 lg:px-8">
        <div className="mx-auto max-w-7xl py-24 sm:py-32">
          {/* Header */}
          <div className="mx-auto max-w-2xl text-center">
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-4xl font-bold tracking-tight text-gray-900 sm:text-6xl"
            >
              Events
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="mt-6 text-lg leading-8 text-gray-600"
            >
              Join our community events and enhance your professional growth
            </motion.p>
          </div>

          {/* Upcoming Events */}
          <div className="mt-16">
            <h2 className="text-2xl font-bold text-gray-900 mb-8">Upcoming Events</h2>
            <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
              {upcomingEvents.map((event, index) => (
                <motion.div
                  key={event.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm hover:shadow-lg transition-shadow"
                >
                  <div className="flex items-center justify-between mb-4">
                    <span className="inline-flex items-center rounded-full bg-indigo-50 px-2 py-1 text-xs font-medium text-indigo-700">
                      {event.category}
                    </span>
                    <span className="text-sm text-gray-500">{event.date}</span>
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">{event.title}</h3>
                  <p className="text-gray-600 mb-4">{event.description}</p>
                  <div className="space-y-2 text-sm text-gray-500">
                    <p>🕒 {event.time}</p>
                    <p>📍 {event.location}</p>
                  </div>
                  <div className="mt-6">
                    <a
                      href={event.registrationLink}
                      className="inline-flex items-center justify-center rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 w-full"
                    >
                      Register Now
                    </a>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Past Events */}
          <div className="mt-20">
            <h2 className="text-2xl font-bold text-gray-900 mb-8">Past Events</h2>
            <div className="space-y-4">
              {pastEvents.map((event, index) => (
                <motion.div
                  key={event.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="flex items-center justify-between p-4 bg-gray-50 rounded-lg"
                >
                  <div>
                    <h3 className="font-medium text-gray-900">{event.title}</h3>
                    <div className="mt-1 flex items-center gap-x-4 text-sm text-gray-500">
                      <p>{event.date}</p>
                      <p>{event.location}</p>
                      <span className="inline-flex items-center rounded-full bg-gray-100 px-2 py-1 text-xs font-medium text-gray-600">
                        {event.category}
                      </span>
                    </div>
                  </div>
                  <a
                    href={event.recordingLink}
                    className="text-sm font-semibold text-indigo-600 hover:text-indigo-500"
                  >
                    Watch Recording
                  </a>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Event Calendar */}
          <div className="mt-20">
            <div className="bg-white p-8 rounded-2xl border border-gray-200 shadow-sm">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Event Calendar</h2>
              <p className="text-gray-600">
                Want to see all our upcoming events? Check out our full calendar to plan ahead.
              </p>
              <div className="mt-6">
                <a
                  href="#"
                  className="inline-flex items-center text-sm font-semibold text-indigo-600 hover:text-indigo-500"
                >
                  View Full Calendar <span aria-hidden="true">→</span>
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default Events;
