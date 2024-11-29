import React from 'react';
import { sharedStyles } from '../../styles/shared';
import { PageWrapper } from './PageWrapper';

interface PageLayoutProps {
  children: React.ReactNode;
  title?: string;
}

export const PageLayout: React.FC<PageLayoutProps> = ({ children, title }) => {
  return (
    <PageWrapper>
      <div className={sharedStyles.pageContainer}>
        <div className={sharedStyles.contentWrapper}>
          {title && <h1 className={sharedStyles.heading}>{title}</h1>}
          {children}
        </div>
      </div>
    </PageWrapper>
  );
};
