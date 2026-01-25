import React from 'react';

interface BentoGridProps {
  children: React.ReactNode;
  className?: string;
}

export function BentoGrid({ children, className = '' }: BentoGridProps) {
  return (
    <div className={`grid grid-cols-1 md:grid-cols-3 gap-6 ${className}`}>
      {children}
    </div>
  );
}

interface BentoTileProps {
  children: React.ReactNode;
  className?: string;
  span?: 1 | 2 | 3;
}

export function BentoTile({ children, className = '', span = 1 }: BentoTileProps) {
  const spanClass = span === 2 ? 'md:col-span-2' : span === 3 ? 'md:col-span-3' : 'md:col-span-1';
  return (
    <div className={`bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden flex flex-col ${spanClass} ${className}`}>
      {children}
    </div>
  );
}
