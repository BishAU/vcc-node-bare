import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { FiUser, FiLock, FiMail, FiBell, FiGlobe, FiShield } from 'react-icons/fi';
import { PageLayout } from '../components/layout/PageLayout';
import { sharedStyles } from '../styles/shared';

const Settings: React.FC = () => {
  const [activeTab, setActiveTab] = useState('profile');

  const tabs = [
    { id: 'profile', name: 'Profile', icon: <FiUser /> },
    { id: 'security', name: 'Security', icon: <FiLock /> },
    { id: 'notifications', name: 'Notifications', icon: <FiBell /> },
    { id: 'integrations', name: 'Integrations', icon: <FiGlobe /> },
    { id: 'privacy', name: 'Privacy', icon: <FiShield /> },
  ];

  return (
    <PageLayout title="Settings">
      {/* Settings Navigation */}
      <div className="border-b border-gray-700 mb-6">
        <nav className="-mb-px flex space-x-8">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`
                group inline-flex items-center py-4 px-1 border-b-2 font-medium text-sm
                ${
                  activeTab === tab.id
                    ? 'border-purple-500 text-purple-400'
                    : 'border-transparent text-gray-400 hover:text-gray-300 hover:border-gray-300'
                }
              `}
            >
              <span className="mr-2">{tab.icon}</span>
              {tab.name}
            </button>
          ))}
        </nav>
      </div>

      {/* Settings Content */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="max-w-4xl mx-auto"
      >
        {activeTab === 'profile' && (
          <div className={sharedStyles.card}>
            <h2 className={sharedStyles.cardHeader}>Profile Settings</h2>
            <div className="space-y-6">
              <div className={sharedStyles.form.group}>
                <label className={sharedStyles.form.label}>
                  Full Name
                </label>
                <input
                  type="text"
                  className={sharedStyles.form.input}
                  placeholder="Your name"
                />
              </div>
              <div className={sharedStyles.form.group}>
                <label className={sharedStyles.form.label}>
                  Email
                </label>
                <input
                  type="email"
                  className={sharedStyles.form.input}
                  placeholder="your@email.com"
                />
              </div>
              <div className={sharedStyles.form.group}>
                <label className={sharedStyles.form.label}>
                  Bio
                </label>
                <textarea
                  className={sharedStyles.form.textarea}
                  rows={4}
                  placeholder="Tell us about yourself"
                />
              </div>
              <div className="flex justify-end">
                <button className={`${sharedStyles.button.base} ${sharedStyles.button.primary}`}>
                  Save Changes
                </button>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'security' && (
          <div className={sharedStyles.card}>
            <h2 className={sharedStyles.cardHeader}>Security Settings</h2>
            <div className="space-y-6">
              <div className={sharedStyles.form.group}>
                <label className={sharedStyles.form.label}>
                  Current Password
                </label>
                <input
                  type="password"
                  className={sharedStyles.form.input}
                />
              </div>
              <div className={sharedStyles.form.group}>
                <label className={sharedStyles.form.label}>
                  New Password
                </label>
                <input
                  type="password"
                  className={sharedStyles.form.input}
                />
              </div>
              <div className={sharedStyles.form.group}>
                <label className={sharedStyles.form.label}>
                  Confirm New Password
                </label>
                <input
                  type="password"
                  className={sharedStyles.form.input}
                />
              </div>
              <div className="flex justify-end">
                <button className={`${sharedStyles.button.base} ${sharedStyles.button.primary}`}>
                  Update Password
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Add other tab content as needed */}
      </motion.div>
    </PageLayout>
  );
};

export default Settings;
