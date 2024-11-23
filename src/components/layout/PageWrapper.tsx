import React from 'react';
import { sharedStyles } from '../../styles/shared';

interface PageWrapperProps {
  children: React.ReactNode;
  title?: string;
}

export const PageWrapper: React.FC<PageWrapperProps> = ({ children, title }) => {
  return (
    <div className={sharedStyles.pageContainer}>
      <div className={sharedStyles.contentWrapper}>
        {title && <h1 className={sharedStyles.heading}>{title}</h1>}
        {children}
      </div>
    </div>
  );
};
