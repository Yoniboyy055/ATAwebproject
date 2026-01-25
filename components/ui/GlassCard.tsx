import React from 'react';

interface GlassCardProps {
  children: React.ReactNode;
  className?: string;
}

export function GlassCard({ children, className = '' }: GlassCardProps) {
  return (
    <div className={`bg-white/80 backdrop-blur-md border border-white/40 shadow-sm rounded-2xl ${className}`}>
      {children}
    </div>
  );
}
