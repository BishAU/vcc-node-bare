// Initialize mock data for development
export const initializeData = async () => {
  try {
    // Mock user data
    const mockUsers = [
      {
        id: '1',
        email: 'demo@example.com',
        name: 'Demo User',
        role: 'admin',
      },
    ];

    // Mock projects
    const mockProjects = [
      {
        id: '1',
        name: 'Sport Car Design',
        description: 'Modern sports car exterior design project',
        status: 'in_progress',
        thumbnail: '/mockImages/project1.jpg',
        lastModified: new Date(),
      },
      {
        id: '2',
        name: 'Electric SUV Concept',
        description: 'Futuristic electric SUV design concept',
        status: 'draft',
        thumbnail: '/mockImages/project2.jpg',
        lastModified: new Date(),
      },
    ];

    // Mock designs
    const mockDesigns = [
      {
        id: '1',
        projectId: '1',
        name: 'Front View',
        thumbnail: '/mockImages/design1.jpg',
        status: 'completed',
        lastModified: new Date(),
      },
      {
        id: '2',
        projectId: '1',
        name: 'Side Profile',
        thumbnail: '/mockImages/design2.jpg',
        status: 'in_progress',
        lastModified: new Date(),
      },
    ];

    // Store mock data in localStorage for development
    await Promise.all([
      localStorage.setItem('mockUsers', JSON.stringify(mockUsers)),
      localStorage.setItem('mockProjects', JSON.stringify(mockProjects)),
      localStorage.setItem('mockDesigns', JSON.stringify(mockDesigns))
    ]);

    return {
      users: mockUsers,
      projects: mockProjects,
      designs: mockDesigns,
    };
  } catch (error) {
    console.error('Error initializing data:', error);
    throw error;
  }
};
