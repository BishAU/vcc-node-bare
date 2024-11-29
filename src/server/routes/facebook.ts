import express from 'express';

const router = express.Router();

// Get Facebook feed data
router.get('/feed', async (_req, res) => {
  try {
    // Return mock data for now
    const mockPost = {
      id: '1',
      message: 'Check out our latest updates and opportunities! Join us in making a difference in the lives of experienced professionals seeking remote work opportunities.',
      full_picture: '/images/facebook/latest-post.jpg',
      created_time: new Date().toISOString(),
      permalink_url: 'https://facebook.com/VirtualContactCentreLimited'
    };

    const mockPhotos = [
      { id: '1', source: '/images/facebook/photo1.jpg', created_time: new Date().toISOString() },
      { id: '2', source: '/images/facebook/photo2.jpg', created_time: new Date().toISOString() },
      { id: '3', source: '/images/facebook/photo3.jpg', created_time: new Date().toISOString() },
      { id: '4', source: '/images/facebook/photo4.jpg', created_time: new Date().toISOString() },
      { id: '5', source: '/images/facebook/photo5.jpg', created_time: new Date().toISOString() },
      { id: '6', source: '/images/facebook/photo6.jpg', created_time: new Date().toISOString() }
    ];

    res.json({
      latestPost: mockPost,
      recentPhotos: mockPhotos
    });
  } catch (error) {
    console.error('Error fetching Facebook data:', error);
    res.status(500).json({
      error: 'Failed to fetch Facebook data',
      details: process.env.NODE_ENV === 'development' ? (error as Error).message : undefined
    });
  }
});

export default router;
