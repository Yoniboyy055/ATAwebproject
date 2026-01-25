/**
 * BentoGrid & BentoTile
 * Modern grid layout for packages and content
 * 
 * RULES:
 * - One featured tile (larger)
 * - Clear visual hierarchy
 * - Hover lift effect (motion-safe)
 * - No pricing overload
 * - Human reassurance in each tile
 */

import { ReactNode } from 'react'
import Link from 'next/link'

interface BentoGridProps {
  children: ReactNode
  className?: string
}

interface BentoTileProps {
  title: string
  subtitle?: string
  description?: string
  icon?: string
  href?: string
  featured?: boolean
  emotionalHook?: string
  humanNote?: string
  className?: string
  children?: ReactNode
}

export function BentoGrid({ children, className = '' }: BentoGridProps) {
  return (
    <div className={`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6 ${className}`}>
      {children}
    </div>
  )
}

export function BentoTile({
  title,
  subtitle,
  description,
  icon,
  href,
  featured = false,
  emotionalHook,
  humanNote,
  className = '',
  children
}: BentoTileProps) {
  const baseStyles = `
    group relative
    rounded-2xl border bg-white
    overflow-hidden
    transition-all duration-300
    motion-safe:hover:-translate-y-1 motion-safe:hover:shadow-xl
  `
  
  const featuredStyles = featured
    ? 'md:col-span-2 md:row-span-2 border-emerald-200 bg-gradient-to-br from-emerald-50 to-white'
    : 'border-slate-200 hover:border-emerald-300'

  const content = (
    <>
      {/* Icon */}
      {icon && (
        <div className={`text-4xl ${featured ? 'text-5xl' : ''} mb-4`}>
          {icon}
        </div>
      )}
      
      {/* Title & Subtitle */}
      <h3 className={`font-bold text-slate-900 mb-1 ${featured ? 'text-2xl' : 'text-xl'} group-hover:text-emerald-600 transition-colors`}>
        {title}
      </h3>
      {subtitle && (
        <p className="text-sm text-slate-500 mb-3">{subtitle}</p>
      )}
      
      {/* Emotional Hook */}
      {emotionalHook && (
        <p className={`text-slate-700 mb-4 ${featured ? 'text-lg' : ''}`}>
          {emotionalHook}
        </p>
      )}
      
      {/* Description */}
      {description && (
        <p className="text-slate-600 text-sm mb-4">
          {description}
        </p>
      )}
      
      {/* Human Note - reassurance */}
      {humanNote && (
        <p className="text-xs text-slate-500 italic border-l-2 border-emerald-300 pl-3 mt-auto">
          {humanNote}
        </p>
      )}
      
      {/* Custom children */}
      {children}
      
      {/* Hover indicator */}
      {href && (
        <div className="mt-4 text-sm font-semibold text-emerald-600 flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
          Learn more
          <svg className="w-4 h-4 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </div>
      )}
    </>
  )

  const wrapperClasses = `${baseStyles} ${featuredStyles} ${className} p-6 ${featured ? 'md:p-8' : ''}`

  if (href) {
    return (
      <Link href={href} className={wrapperClasses}>
        {content}
      </Link>
    )
  }

  return (
    <div className={wrapperClasses}>
      {content}
    </div>
  )
}
