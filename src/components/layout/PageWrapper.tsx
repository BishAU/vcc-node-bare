import React from 'react';
import { Navbar } from './Navbar';
import { Footer } from './Footer';
import { sharedStyles } from '../../styles/shared';

interface PageWrapperProps {
  children: React.ReactNode;
  title?: string;
}

export const PageWrapper: React.FC<PageWrapperProps> = ({ children, title }) => {
  return (
    <div className={`min-h-screen bg-gray-900 ${sharedStyles.pageContainer}`}>
      <Navbar />
      <main className={sharedStyles.contentWrapper}>
        {title && <h1 className={sharedStyles.heading}>{title}</h1>}
        {children}
      </main>
      <Footer />
    </div>
  );
};
