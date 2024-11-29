import React from 'react';
import { PageWrapper } from '../../components/layout/PageWrapper';
import { sharedStyles } from '../../styles/shared';
import { motion } from 'framer-motion';

const Team = () => {
  const team = [
    {
      name: 'Sarah Johnson',
      role: 'Executive Director',
      bio: 'With over 15 years of experience in career development and regional employment services.',
      image: '/images/team/sarah.jpg'
    },
    {
      name: 'Michael Chen',
      role: 'Career Services Manager',
      bio: 'Specializing in connecting regional businesses with talented professionals.',
      image: '/images/team/michael.jpg'
    },
    {
      name: 'Emma Wilson',
      role: 'Training Coordinator',
      bio: 'Expert in developing and implementing career development programs.',
      image: '/images/team/emma.jpg'
    },
    {
      name: 'David Thompson',
      role: 'Employer Relations',
      bio: 'Building strong partnerships with regional employers and industry leaders.',
      image: '/images/team/david.jpg'
    }
  ];

  return (
    <PageWrapper>
      <div className={sharedStyles.pageContainer}>
        <div className={sharedStyles.contentWrapper}>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <h1 className={sharedStyles.heading}>Our Team</h1>
            <p className="text-xl text-gray-300 mb-8">
              Meet the dedicated professionals working to connect talent with opportunities in regional Australia.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {team.map((member) => (
                <motion.div
                  key={member.name}
                  className={`${sharedStyles.card} flex flex-col items-center text-center`}
                  whileHover={{ scale: 1.02 }}
                  transition={{ duration: 0.2 }}
                >
                  <div className="w-32 h-32 rounded-full overflow-hidden mb-4">
                    <img
                      src={member.image}
                      alt={member.name}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        e.currentTarget.src = 'https://via.placeholder.com/128?text=VCC';
                      }}
                    />
                  </div>
                  <h3 className="text-xl font-bold text-white mb-2">{member.name}</h3>
                  <p className="text-purple-400 mb-2">{member.role}</p>
                  <p className="text-gray-300 text-sm">{member.bio}</p>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </PageWrapper>
  );
};

export default Team;
