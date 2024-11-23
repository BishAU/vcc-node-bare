// Mock data for resources
const mockResources = [
  {
    id: '1',
    title: 'Resume Writing Guide',
    description: 'Comprehensive guide to writing an effective resume for modern job markets.',
    type: 'document',
    url: '/resources/resume-guide.pdf',
    category: 'Career Development',
    tags: ['resume', 'career', 'job search'],
    uploadDate: '2024-01-15',
    lastModified: '2024-01-15',
    status: 'active',
    fileSize: 1024,
    downloadCount: 150,
    author: 'VCC Career Team'
  },
  {
    id: '2',
    title: 'Interview Tips Video',
    description: 'Expert tips for acing your job interviews.',
    type: 'video',
    url: '/resources/interview-tips.mp4',
    category: 'Job Search',
    tags: ['interview', 'career', 'job search'],
    uploadDate: '2024-01-20',
    lastModified: '2024-01-20',
    status: 'active',
    fileSize: 5120,
    downloadCount: 75,
    author: 'VCC Interview Specialists'
  }
];

export const resourcesApi = {
  getAll: async (req, res) => {
    try {
      res.json(mockResources);
    } catch (error) {
      console.error('Error fetching resources:', error);
      res.status(500).json({ error: 'Failed to fetch resources' });
    }
  },

  getById: async (req, res) => {
    try {
      const resource = mockResources.find(r => r.id === req.params.id);
      if (!resource) {
        return res.status(404).json({ error: 'Resource not found' });
      }
      res.json(resource);
    } catch (error) {
      console.error('Error fetching resource:', error);
      res.status(500).json({ error: 'Failed to fetch resource' });
    }
  },

  create: async (req, res) => {
    try {
      const newResource = {
        id: String(mockResources.length + 1),
        ...req.body,
        status: 'active',
        downloadCount: 0,
        uploadDate: new Date().toISOString().split('T')[0],
        lastModified: new Date().toISOString().split('T')[0]
      };
      mockResources.push(newResource);
      res.status(201).json(newResource);
    } catch (error) {
      console.error('Error creating resource:', error);
      res.status(500).json({ error: 'Failed to create resource' });
    }
  },

  update: async (req, res) => {
    try {
      const index = mockResources.findIndex(r => r.id === req.params.id);
      if (index === -1) {
        return res.status(404).json({ error: 'Resource not found' });
      }
      mockResources[index] = {
        ...mockResources[index],
        ...req.body,
        lastModified: new Date().toISOString().split('T')[0]
      };
      res.json(mockResources[index]);
    } catch (error) {
      console.error('Error updating resource:', error);
      res.status(500).json({ error: 'Failed to update resource' });
    }
  },

  delete: async (req, res) => {
    try {
      const index = mockResources.findIndex(r => r.id === req.params.id);
      if (index === -1) {
        return res.status(404).json({ error: 'Resource not found' });
      }
      mockResources.splice(index, 1);
      res.status(204).send();
    } catch (error) {
      console.error('Error deleting resource:', error);
      res.status(500).json({ error: 'Failed to delete resource' });
    }
  }
};
