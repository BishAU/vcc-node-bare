import axios from 'axios';

const API_BASE_URL = '/api';

interface Resource {
  id: string;
  title: string;
  description: string;
  type: 'document' | 'video' | 'link' | 'other';
  url: string;
  category: string;
  tags: string[];
  uploadDate: string;
  lastModified: string;
  status: 'active' | 'archived' | 'draft';
  fileSize?: number;
  downloadCount: number;
  author: string;
}

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

export const resourcesApi = {
  getAll: async (): Promise<Resource[]> => {
    try {
      const response = await axios.get(`${API_BASE_URL}/resources`);
      return response.data;
    } catch (error) {
      console.error('Error fetching resources:', error);
      return [];
    }
  },
  
  getById: async (id: string): Promise<Resource | null> => {
    try {
      const response = await axios.get(`${API_BASE_URL}/resources/${id}`);
      return response.data;
    } catch (error) {
      console.error(`Error fetching resource ${id}:`, error);
      return null;
    }
  }
};

export const eventsApi = {
  getAll: async (): Promise<Event[]> => {
    try {
      const response = await axios.get(`${API_BASE_URL}/events`);
      return response.data;
    } catch (error) {
      console.error('Error fetching events:', error);
      return [];
    }
  },
  
  getById: async (id: string): Promise<Event | null> => {
    try {
      const response = await axios.get(`${API_BASE_URL}/events/${id}`);
      return response.data;
    } catch (error) {
      console.error(`Error fetching event ${id}:`, error);
      return null;
    }
  }
};
