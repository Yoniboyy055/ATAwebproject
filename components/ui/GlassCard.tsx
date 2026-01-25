import React from 'react'

export interface GlassCardProps
  extends React.HTMLAttributes<HTMLDivElement> {}

export default function GlassCard({ className = '', ...props }: GlassCardProps) {
  return (
    <div
      className={[
        'glass-panel rounded-2xl border border-white/10 bg-white/10 backdrop-blur-lg shadow-soft',
        className
      ]
        .filter(Boolean)
        .join(' ')}
      {...props}
    />
  )
}
