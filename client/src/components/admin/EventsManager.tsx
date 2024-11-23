import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { format } from 'date-fns';
import { Event } from '../../types/admin';
import DataTable from '../DataTable';
import Modal from '../Modal';
import { eventsApi } from '../../services/api';

interface EventFormData {
  title: string;
  description: string;
  date: string;
  time: string;
  location: string;
  capacity: number;
  imageUrl?: string;
  category: string;
  status: 'upcoming' | 'ongoing' | 'completed';
  registrationDeadline: string;
}

const EventsManager: React.FC = () => {
  const queryClient = useQueryClient();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingEvent, setEditingEvent] = useState<Event | null>(null);
  const [formData, setFormData] = useState<EventFormData>({
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

  // Queries
  const { data: events = [], isLoading } = useQuery({
    queryKey: ['events'],
    queryFn: eventsApi.getAll,
  });

  // Mutations
  const createMutation = useMutation({
    mutationFn: eventsApi.create,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['events'] });
      setIsModalOpen(false);
      resetForm();
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, event }: { id: string; event: Partial<Event> }) =>
      eventsApi.update(id, event),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['events'] });
      setIsModalOpen(false);
      resetForm();
    },
  });

  const deleteMutation = useMutation({
    mutationFn: eventsApi.delete,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['events'] });
    },
  });

  const columns = [
    { 
      key: 'title', 
      header: 'Title',
      render: (value: string, event: Event) => (
        <div className="flex items-center gap-2">
          {event.imageUrl && (
            <img src={event.imageUrl} alt={value} className="w-8 h-8 rounded-full object-cover" />
          )}
          <span>{value}</span>
        </div>
      )
    },
    { 
      key: 'date', 
      header: 'Date', 
      render: (value: string) => format(new Date(value), 'MMM dd, yyyy') 
    },
    { key: 'time', header: 'Time' },
    { key: 'location', header: 'Location' },
    { key: 'capacity', header: 'Capacity' },
    { key: 'registeredCount', header: 'Registered' },
    { 
      key: 'status', 
      header: 'Status',
      render: (value: string) => (
        <span className={`px-2 py-1 rounded-full text-xs ${
          value === 'upcoming' ? 'bg-green-100 text-green-800' :
          value === 'ongoing' ? 'bg-blue-100 text-blue-800' :
          'bg-gray-100 text-gray-800'
        }`}>
          {value}
        </span>
      )
    },
    {
      key: 'actions',
      header: 'Actions',
      render: (_: any, event: Event) => (
        <div className="flex gap-2">
          <button
            onClick={() => handleEdit(event)}
            className="px-3 py-1 text-sm bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
          >
            Edit
          </button>
          <button
            onClick={() => handleDelete(event.id)}
            className="px-3 py-1 text-sm bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
          >
            Delete
          </button>
        </div>
      ),
    },
  ];

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingEvent) {
      updateMutation.mutate({
        id: editingEvent.id,
        event: formData,
      });
    } else {
      createMutation.mutate(formData);
    }
  };

  const handleEdit = (event: Event) => {
    setEditingEvent(event);
    setFormData({
      title: event.title,
      description: event.description,
      date: event.date,
      time: event.time,
      location: event.location,
      capacity: event.capacity,
      imageUrl: event.imageUrl || '',
      category: event.category || '',
      status: event.status || 'upcoming',
      registrationDeadline: event.registrationDeadline || '',
    });
    setIsModalOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this event?')) {
      deleteMutation.mutate(id);
    }
  };

  const resetForm = () => {
    setEditingEvent(null);
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

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-900">Events Management</h2>
        <button
          onClick={() => {
            resetForm();
            setIsModalOpen(true);
          }}
          className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
        >
          Add New Event
        </button>
      </div>

      <DataTable
        data={events}
        columns={columns}
        isLoading={isLoading}
      />

      <Modal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          resetForm();
        }}
        title={editingEvent ? 'Edit Event' : 'Create New Event'}
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Title</label>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleInputChange}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Description</label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              rows={4}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Date</label>
              <input
                type="date"
                name="date"
                value={formData.date}
                onChange={handleInputChange}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Time</label>
              <input
                type="time"
                name="time"
                value={formData.time}
                onChange={handleInputChange}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Location</label>
            <input
              type="text"
              name="location"
              value={formData.location}
              onChange={handleInputChange}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Category</label>
              <select
                name="category"
                value={formData.category}
                onChange={handleInputChange}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                required
              >
                <option value="">Select Category</option>
                <option value="workshop">Workshop</option>
                <option value="seminar">Seminar</option>
                <option value="networking">Networking</option>
                <option value="training">Training</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Status</label>
              <select
                name="status"
                value={formData.status}
                onChange={handleInputChange}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                required
              >
                <option value="upcoming">Upcoming</option>
                <option value="ongoing">Ongoing</option>
                <option value="completed">Completed</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Capacity</label>
              <input
                type="number"
                name="capacity"
                value={formData.capacity}
                onChange={handleInputChange}
                min="0"
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Registration Deadline</label>
              <input
                type="date"
                name="registrationDeadline"
                value={formData.registrationDeadline}
                onChange={handleInputChange}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Image URL</label>
            <input
              type="url"
              name="imageUrl"
              value={formData.imageUrl}
              onChange={handleInputChange}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
              placeholder="https://example.com/image.jpg"
            />
            {formData.imageUrl && (
              <img
                src={formData.imageUrl}
                alt="Preview"
                className="mt-2 h-32 w-32 object-cover rounded-lg"
              />
            )}
          </div>

          <div className="flex justify-end gap-3 mt-6">
            <button
              type="button"
              onClick={() => {
                setIsModalOpen(false);
                resetForm();
              }}
              className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              {editingEvent ? 'Update Event' : 'Create Event'}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default EventsManager;
