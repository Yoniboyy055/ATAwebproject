/**
 * Input Component
 * Form input with focus, error, and success states
 * 
 * RULES:
 * - Clear visual feedback for all states
 * - Strong text contrast
 * - Accessible focus states
 */

import { InputHTMLAttributes, forwardRef } from 'react'

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string
  error?: string
  success?: string
  hint?: string
}

const baseStyles = `
  w-full px-4 py-3
  rounded-lg border
  text-slate-900 placeholder-slate-400
  transition-all duration-200
  focus:outline-none focus:ring-2 focus:ring-offset-0
`

const stateStyles = {
  default: 'border-slate-300 focus:border-emerald-500 focus:ring-emerald-500/20',
  error: 'border-red-400 focus:border-red-500 focus:ring-red-500/20 bg-red-50/50',
  success: 'border-emerald-400 focus:border-emerald-500 focus:ring-emerald-500/20 bg-emerald-50/50'
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, success, hint, className = '', id, ...props }, ref) => {
    const inputId = id || props.name
    const state = error ? 'error' : success ? 'success' : 'default'
    
    return (
      <div className="space-y-1.5">
        {label && (
          <label 
            htmlFor={inputId}
            className="block text-sm font-medium text-slate-700"
          >
            {label}
          </label>
        )}
        
        <input
          ref={ref}
          id={inputId}
          className={`${baseStyles} ${stateStyles[state]} ${className}`}
          aria-invalid={error ? 'true' : 'false'}
          aria-describedby={error ? `${inputId}-error` : hint ? `${inputId}-hint` : undefined}
          {...props}
        />
        
        {error && (
          <p id={`${inputId}-error`} className="text-sm text-red-600 font-medium">
            {error}
          </p>
        )}
        
        {success && !error && (
          <p className="text-sm text-emerald-600 font-medium">
            {success}
          </p>
        )}
        
        {hint && !error && !success && (
          <p id={`${inputId}-hint`} className="text-sm text-slate-500">
            {hint}
          </p>
        )}
      </div>
    )
  }
)

Input.displayName = 'Input'
