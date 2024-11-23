// Mock data for events
const mockEvents = [
  {
    id: '1',
    title: 'Career Fair 2024',
    description: 'Annual career fair featuring top employers from various industries.',
    date: '2024-03-15',
    time: '10:00 AM',
    location: 'Melbourne Convention Centre',
    capacity: 500,
    registeredCount: 250,
    imageUrl: '/images/career-fair.jpg',
    category: 'Career Fair',
    status: 'upcoming',
    registrationDeadline: '2024-03-10'
  },
  {
    id: '2',
    title: 'Resume Workshop',
    description: 'Hands-on workshop to help you craft an effective resume.',
    date: '2024-03-20',
    time: '2:00 PM',
    location: 'VCC Training Room',
    capacity: 50,
    registeredCount: 35,
    imageUrl: '/images/resume-workshop.jpg',
    category: 'Workshop',
    status: 'upcoming',
    registrationDeadline: '2024-03-18'
  }
];

export const eventsApi = {
  getAll: async (req, res) => {
    try {
      res.json(mockEvents);
    } catch (error) {
      console.error('Error fetching events:', error);
      res.status(500).json({ error: 'Failed to fetch events' });
    }
  },

  getById: async (req, res) => {
    try {
      const event = mockEvents.find(e => e.id === req.params.id);
      if (!event) {
        return res.status(404).json({ error: 'Event not found' });
      }
      res.json(event);
    } catch (error) {
      console.error('Error fetching event:', error);
      res.status(500).json({ error: 'Failed to fetch event' });
    }
  },

  create: async (req, res) => {
    try {
      const newEvent = {
        id: String(mockEvents.length + 1),
        ...req.body,
        status: 'upcoming',
        registeredCount: 0
      };
      mockEvents.push(newEvent);
      res.status(201).json(newEvent);
    } catch (error) {
      console.error('Error creating event:', error);
      res.status(500).json({ error: 'Failed to create event' });
    }
  },

  update: async (req, res) => {
    try {
      const index = mockEvents.findIndex(e => e.id === req.params.id);
      if (index === -1) {
        return res.status(404).json({ error: 'Event not found' });
      }
      mockEvents[index] = { ...mockEvents[index], ...req.body };
      res.json(mockEvents[index]);
    } catch (error) {
      console.error('Error updating event:', error);
      res.status(500).json({ error: 'Failed to update event' });
    }
  },

  delete: async (req, res) => {
    try {
      const index = mockEvents.findIndex(e => e.id === req.params.id);
      if (index === -1) {
        return res.status(404).json({ error: 'Event not found' });
      }
      mockEvents.splice(index, 1);
      res.status(204).send();
    } catch (error) {
      console.error('Error deleting event:', error);
      res.status(500).json({ error: 'Failed to delete event' });
    }
  }
};
