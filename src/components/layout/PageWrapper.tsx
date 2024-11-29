import React from 'react';
import { PublicNavbar } from '../PublicNavbar';
import { Footer } from './Footer';
import { sharedStyles } from '../../styles/shared';

interface PageWrapperProps {
  children: React.ReactNode;
  title?: string;
}

export const PageWrapper: React.FC<PageWrapperProps> = ({ children, title }) => {
  return (
    <div className="min-h-screen flex flex-col">
      <PublicNavbar />
      <main className="flex-grow w-full">
        {title && <h1 className={sharedStyles.heading}>{title}</h1>}
        {children}
      </main>
      <Footer />
    </div>
  );
};
