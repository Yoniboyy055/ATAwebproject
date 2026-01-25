/**
 * GlassCard
 * Container-only glass effect component
 * 
 * RULES:
 * - Use ONLY as a framing/container element
 * - NEVER put long text, prices, dates, or booking info on glass
 * - Glass must not compete with content readability
 */

import { ReactNode } from 'react'

interface GlassCardProps {
  children: ReactNode
  className?: string
  /** Disable glass effect for content that needs maximum readability */
  solid?: boolean
}

export function GlassCard({ children, className = '', solid = false }: GlassCardProps) {
  const baseStyles = 'rounded-2xl p-6 md:p-8'
  
  const glassStyles = solid
    ? 'bg-white border border-slate-200'
    : 'bg-white/80 backdrop-blur-lg border border-slate-200/50'

  return (
    <div className={`${baseStyles} ${glassStyles} ${className}`}>
      {children}
    </div>
  )
}
