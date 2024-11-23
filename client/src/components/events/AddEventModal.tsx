import React, { useState } from 'react';
import { sharedStyles, combineClasses } from '../../styles/shared';
import Modal from '../Modal';

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

interface AddEventModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAdd: (event: Omit<Event, 'id' | 'registeredCount'>) => void;
}

export const AddEventModal: React.FC<AddEventModalProps> = ({
  isOpen,
  onClose,
  onAdd,
}) => {
  const [formData, setFormData] = useState<Omit<Event, 'id' | 'registeredCount'>>({
    title: '',
    description: '',
    date: '',
    time: '',
    location: '',
    capacity: 0,
    imageUrl: '',
    category: '',
    status: 'upcoming',
    registrationDeadline: '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onAdd(formData);
    onClose();
    setFormData({
      title: '',
      description: '',
      date: '',
      time: '',
      location: '',
      capacity: 0,
      imageUrl: '',
      category: '',
      status: 'upcoming',
      registrationDeadline: '',
    });
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'capacity' ? parseInt(value) || 0 : value,
    }));
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Add New Event">
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className={sharedStyles.form.group}>
          <label htmlFor="title" className={sharedStyles.form.label}>
            Event Title
          </label>
          <input
            type="text"
            id="title"
            name="title"
            value={formData.title}
            onChange={handleChange}
            className={sharedStyles.form.input}
            required
          />
        </div>

        <div className={sharedStyles.form.group}>
          <label htmlFor="description" className={sharedStyles.form.label}>
            Description
          </label>
          <textarea
            id="description"
            name="description"
            value={formData.description}
            onChange={handleChange}
            className={sharedStyles.form.textarea}
            rows={4}
            required
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className={sharedStyles.form.group}>
            <label htmlFor="date" className={sharedStyles.form.label}>
              Date
            </label>
            <input
              type="date"
              id="date"
              name="date"
              value={formData.date}
              onChange={handleChange}
              className={sharedStyles.form.input}
              required
            />
          </div>

          <div className={sharedStyles.form.group}>
            <label htmlFor="time" className={sharedStyles.form.label}>
              Time
            </label>
            <input
              type="time"
              id="time"
              name="time"
              value={formData.time}
              onChange={handleChange}
              className={sharedStyles.form.input}
              required
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className={sharedStyles.form.group}>
            <label htmlFor="location" className={sharedStyles.form.label}>
              Location
            </label>
            <input
              type="text"
              id="location"
              name="location"
              value={formData.location}
              onChange={handleChange}
              className={sharedStyles.form.input}
              required
            />
          </div>

          <div className={sharedStyles.form.group}>
            <label htmlFor="capacity" className={sharedStyles.form.label}>
              Capacity
            </label>
            <input
              type="number"
              id="capacity"
              name="capacity"
              value={formData.capacity}
              onChange={handleChange}
              className={sharedStyles.form.input}
              min="0"
              required
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className={sharedStyles.form.group}>
            <label htmlFor="category" className={sharedStyles.form.label}>
              Category
            </label>
            <select
              id="category"
              name="category"
              value={formData.category}
              onChange={handleChange}
              className={sharedStyles.form.select}
              required
            >
              <option value="">Select a category</option>
              <option value="Workshop">Workshop</option>
              <option value="Seminar">Seminar</option>
              <option value="Networking">Networking</option>
              <option value="Career Fair">Career Fair</option>
              <option value="Training">Training</option>
            </select>
          </div>

          <div className={sharedStyles.form.group}>
            <label htmlFor="status" className={sharedStyles.form.label}>
              Status
            </label>
            <select
              id="status"
              name="status"
              value={formData.status}
              onChange={handleChange}
              className={sharedStyles.form.select}
              required
            >
              <option value="upcoming">Upcoming</option>
              <option value="ongoing">Ongoing</option>
              <option value="completed">Completed</option>
            </select>
          </div>
        </div>

        <div className={sharedStyles.form.group}>
          <label htmlFor="registrationDeadline" className={sharedStyles.form.label}>
            Registration Deadline
          </label>
          <input
            type="date"
            id="registrationDeadline"
            name="registrationDeadline"
            value={formData.registrationDeadline}
            onChange={handleChange}
            className={sharedStyles.form.input}
            required
          />
        </div>

        <div className={sharedStyles.form.group}>
          <label htmlFor="imageUrl" className={sharedStyles.form.label}>
            Image URL
          </label>
          <input
            type="url"
            id="imageUrl"
            name="imageUrl"
            value={formData.imageUrl}
            onChange={handleChange}
            className={sharedStyles.form.input}
            placeholder="https://"
          />
        </div>

        <div className="flex justify-end space-x-4">
          <button
            type="button"
            onClick={onClose}
            className={combineClasses(sharedStyles.button.base, sharedStyles.button.ghost)}
          >
            Cancel
          </button>
          <button
            type="submit"
            className={combineClasses(sharedStyles.button.base, sharedStyles.button.primary)}
          >
            Add Event
          </button>
        </div>
      </form>
    </Modal>
  );
};
