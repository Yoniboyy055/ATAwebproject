/**
 * Button Components
 * Primary and Secondary button variants
 * 
 * RULES:
 * - CTAs must be explicit (not "Explore", "Get Started")
 * - One primary CTA per section
 * - Includes hover lift and press feedback
 * - Respects reduced-motion preferences
 */

import { ButtonHTMLAttributes, ReactNode } from 'react'

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode
  variant?: 'primary' | 'secondary' | 'ghost'
  size?: 'sm' | 'md' | 'lg'
  /** Full width on mobile, auto on desktop */
  fullWidthMobile?: boolean
}

const baseStyles = `
  inline-flex items-center justify-center gap-2 
  font-semibold rounded-lg 
  transition-all duration-200
  focus:outline-none focus:ring-2 focus:ring-offset-2
  disabled:opacity-50 disabled:cursor-not-allowed
  motion-safe:hover:-translate-y-0.5 motion-safe:hover:shadow-lg
  motion-safe:active:scale-95
`

const variants = {
  primary: `
    bg-emerald-600 text-white
    hover:bg-emerald-700
    focus:ring-emerald-500
  `,
  secondary: `
    bg-slate-100 text-slate-900
    hover:bg-slate-200
    focus:ring-slate-400
    border border-slate-200
  `,
  ghost: `
    bg-transparent text-slate-700
    hover:bg-slate-100
    focus:ring-slate-400
  `
}

const sizes = {
  sm: 'px-3 py-1.5 text-sm',
  md: 'px-5 py-2.5 text-base',
  lg: 'px-8 py-3.5 text-lg'
}

export function PrimaryButton({ 
  children, 
  className = '', 
  size = 'md',
  fullWidthMobile = false,
  ...props 
}: ButtonProps) {
  const mobileWidth = fullWidthMobile ? 'w-full sm:w-auto' : ''
  
  return (
    <button
      className={`${baseStyles} ${variants.primary} ${sizes[size]} ${mobileWidth} ${className}`}
      {...props}
    >
      {children}
    </button>
  )
}

export function SecondaryButton({ 
  children, 
  className = '', 
  size = 'md',
  fullWidthMobile = false,
  ...props 
}: ButtonProps) {
  const mobileWidth = fullWidthMobile ? 'w-full sm:w-auto' : ''
  
  return (
    <button
      className={`${baseStyles} ${variants.secondary} ${sizes[size]} ${mobileWidth} ${className}`}
      {...props}
    >
      {children}
    </button>
  )
}

export function GhostButton({ 
  children, 
  className = '', 
  size = 'md',
  fullWidthMobile = false,
  ...props 
}: ButtonProps) {
  const mobileWidth = fullWidthMobile ? 'w-full sm:w-auto' : ''
  
  return (
    <button
      className={`${baseStyles} ${variants.ghost} ${sizes[size]} ${mobileWidth} ${className}`}
      {...props}
    >
      {children}
    </button>
  )
}
