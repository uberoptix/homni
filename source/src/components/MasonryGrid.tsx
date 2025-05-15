import React from 'react';

interface MasonryGridProps {
  children: React.ReactNode;
  className?: string;
}

/**
 * A CSS-based masonry grid layout component.
 * Uses CSS columns with break-inside: avoid for a true masonry layout
 * that works consistently across screen sizes without JavaScript calculation.
 */
const MasonryGrid: React.FC<MasonryGridProps> = ({ children, className = '' }) => {
  return (
    <div className={`masonry-grid ${className}`}>
      {children}
    </div>
  );
};

export default MasonryGrid; 