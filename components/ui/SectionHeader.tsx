/**
 * SectionHeader
 * Consistent section headers across the site
 * 
 * RULES:
 * - Clear hierarchy
 * - Strong text contrast
 * - Optional subtitle for context
 */

import { ReactNode } from 'react'

interface SectionHeaderProps {
  title: string
  subtitle?: string
  children?: ReactNode
  align?: 'left' | 'center'
  className?: string
}

export function SectionHeader({ 
  title, 
  subtitle, 
  children,
  align = 'center',
  className = '' 
}: SectionHeaderProps) {
  const alignStyles = align === 'center' ? 'text-center' : 'text-left'
  
  return (
    <header className={`mb-12 ${alignStyles} ${className}`}>
      <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-3">
        {title}
      </h2>
      {subtitle && (
        <p className="text-lg text-slate-600 max-w-2xl mx-auto">
          {subtitle}
        </p>
      )}
      {children}
    </header>
  )
}
