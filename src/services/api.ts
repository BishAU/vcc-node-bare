import axios from 'axios';
import { Event, Resource } from '../types/admin';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add request interceptor to include auth token
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('authToken');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Events API
export const eventsApi = {
  getAll: async () => {
    const response = await api.get<Event[]>('/events');
    return response.data;
  },

  getById: async (id: string) => {
    const response = await api.get<Event>(`/events/${id}`);
    return response.data;
  },

  create: async (event: Omit<Event, 'id' | 'createdAt' | 'updatedAt' | 'registeredCount'>) => {
    const response = await api.post<Event>('/events', event);
    return response.data;
  },

  update: async (id: string, event: Partial<Event>) => {
    const response = await api.put<Event>(`/events/${id}`, event);
    return response.data;
  },

  delete: async (id: string) => {
    await api.delete(`/events/${id}`);
  },
};

// Resources API
export const resourcesApi = {
  getAll: async () => {
    const response = await api.get<Resource[]>('/resources');
    return response.data;
  },

  getById: async (id: string) => {
    const response = await api.get<Resource>(`/resources/${id}`);
    return response.data;
  },

  create: async (resource: Omit<Resource, 'id' | 'createdAt' | 'updatedAt' | 'downloadCount'>) => {
    const response = await api.post<Resource>('/resources', resource);
    return response.data;
  },

  update: async (id: string, resource: Partial<Resource>) => {
    const response = await api.put<Resource>(`/resources/${id}`, resource);
    return response.data;
  },

  delete: async (id: string) => {
    await api.delete(`/resources/${id}`);
  },
};

export default api;
