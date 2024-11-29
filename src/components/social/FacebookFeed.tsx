import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { FiFacebook } from 'react-icons/fi';
import { sharedStyles } from '../../styles/shared';
import axios from 'axios';

interface FacebookPost {
  id: string;
  message?: string;
  full_picture?: string;
  created_time: string;
  permalink_url: string;
}

interface FacebookPhoto {
  id: string;
  source: string;
  created_time: string;
}

const FACEBOOK_LINK = 'https://www.facebook.com/VirtualContactCentreLimited';

export const FacebookFeed: React.FC = () => {
  const [latestPost, setLatestPost] = useState<FacebookPost | null>(null);
  const [recentPhotos, setRecentPhotos] = useState<FacebookPhoto[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchFacebookData = async () => {
      try {
        const response = await axios.get('/api/facebook/feed');
        setLatestPost(response.data.latestPost);
        setRecentPhotos(response.data.recentPhotos || []);
        setError(null);
      } catch (err) {
        console.error('Error fetching Facebook data:', err);
        setError('Failed to load Facebook content');
        // Fall back to placeholder content in case of error
        setLatestPost({
          id: '1',
          message: 'Check out our latest updates and opportunities! Join us in making a difference in the lives of experienced professionals seeking remote work opportunities.',
          full_picture: '/images/facebook/latest-post.jpg',
          created_time: new Date().toISOString(),
          permalink_url: FACEBOOK_LINK
        });
        setRecentPhotos([
          { id: '1', source: '/images/facebook/photo1.jpg', created_time: new Date().toISOString() },
          { id: '2', source: '/images/facebook/photo2.jpg', created_time: new Date().toISOString() },
          { id: '3', source: '/images/facebook/photo3.jpg', created_time: new Date().toISOString() },
          { id: '4', source: '/images/facebook/photo4.jpg', created_time: new Date().toISOString() },
          { id: '5', source: '/images/facebook/photo5.jpg', created_time: new Date().toISOString() },
          { id: '6', source: '/images/facebook/photo6.jpg', created_time: new Date().toISOString() }
        ]);
      } finally {
        setLoading(false);
      }
    };

    fetchFacebookData();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-48">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-500"></div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {error && (
        <div className="bg-red-500/10 text-red-400 p-4 rounded-lg mb-4">
          {error}
        </div>
      )}

      {/* Latest Post Widget */}
      {latestPost && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className={`${sharedStyles.card} overflow-hidden`}
        >
          <div className="flex items-center space-x-2 mb-4">
            <FiFacebook className="text-2xl text-blue-500" />
            <h3 className="text-xl font-bold text-white">Latest from Facebook</h3>
          </div>
          
          {latestPost.full_picture && (
            <div className="relative h-64 mb-4 rounded-lg overflow-hidden">
              <img
                src={latestPost.full_picture}
                alt="Latest Facebook post"
                className="absolute inset-0 w-full h-full object-cover"
                onError={(e) => {
                  e.currentTarget.src = '/images/facebook/placeholder.svg';
                }}
              />
            </div>
          )}
          
          <p className="text-gray-300 mb-4">{latestPost.message}</p>
          
          <a
            href={latestPost.permalink_url}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center space-x-2 text-purple-400 hover:text-purple-300 transition-colors"
          >
            <span>View on Facebook</span>
            <FiFacebook />
          </a>
        </motion.div>
      )}

      {/* Recent Photos Grid */}
      {Array.isArray(recentPhotos) && recentPhotos.length > 0 && (
        <div>
          <h3 className="text-xl font-bold text-white mb-4">Recent Photos</h3>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {recentPhotos.map((photo) => (
              <motion.a
                key={photo.id}
                href={FACEBOOK_LINK}
                target="_blank"
                rel="noopener noreferrer"
                className="relative aspect-square rounded-lg overflow-hidden"
                whileHover={{ scale: 1.05 }}
                transition={{ duration: 0.2 }}
              >
                <img
                  src={photo.source}
                  alt={`Facebook photo ${photo.id}`}
                  className="absolute inset-0 w-full h-full object-cover"
                  onError={(e) => {
                    e.currentTarget.src = '/images/facebook/placeholder.svg';
                  }}
                />
              </motion.a>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
