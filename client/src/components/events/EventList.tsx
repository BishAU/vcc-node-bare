import React from 'react';
import { sharedStyles, combineClasses } from '../../styles/shared';
import { FiCalendar, FiMapPin, FiUsers } from 'react-icons/fi';

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

const EventList: React.FC<{ events: Event[] }> = ({ events }) => {
  const getStatusBadgeClass = (status: Event['status']) => {
    switch (status) {
      case 'upcoming':
        return sharedStyles.badge.blue;
      case 'ongoing':
        return sharedStyles.badge.green;
      case 'completed':
        return sharedStyles.badge.gray;
      default:
        return sharedStyles.badge.default;
    }
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {events.map((event) => (
        <div
          key={event.id}
          className={combineClasses(
            sharedStyles.card.container,
            'flex flex-col p-6 hover:shadow-lg transition-shadow duration-200'
          )}
        >
          {event.imageUrl && (
            <img
              src={event.imageUrl}
              alt={event.title}
              className="w-full h-48 object-cover rounded-lg mb-4"
            />
          )}
          
          <div className="mb-4">
            <span className={getStatusBadgeClass(event.status)}>
              {event.status}
            </span>
          </div>

          <h3 className="font-semibold text-lg mb-2">{event.title}</h3>
          <p className="text-gray-300 mb-4 flex-grow">{event.description}</p>
          
          <div className="space-y-3 mb-4">
            <div className="flex items-center gap-2 text-gray-400">
              <FiCalendar className="w-4 h-4" />
              <span>{new Date(event.date).toLocaleDateString()} at {event.time}</span>
            </div>
            
            <div className="flex items-center gap-2 text-gray-400">
              <FiMapPin className="w-4 h-4" />
              <span>{event.location}</span>
            </div>
            
            <div className="flex items-center gap-2 text-gray-400">
              <FiUsers className="w-4 h-4" />
              <span>{event.registeredCount} / {event.capacity} registered</span>
            </div>
          </div>
          
          <div className="flex items-center justify-between text-sm text-gray-400 mb-4">
            <span>{event.category}</span>
            <span>Register by {new Date(event.registrationDeadline).toLocaleDateString()}</span>
          </div>
          
          <button
            className={combineClasses(
              sharedStyles.button.base,
              event.registeredCount >= event.capacity
                ? sharedStyles.button.disabled
                : sharedStyles.button.primary
            )}
            disabled={event.registeredCount >= event.capacity}
          >
            {event.registeredCount >= event.capacity ? 'Event Full' : 'Register Now'}
          </button>
        </div>
      ))}
    </div>
  );
};

export default EventList;
