import React, { forwardRef, useId } from 'react'

export interface InputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string
  helperText?: string
  error?: string
}

const baseClasses =
  'w-full rounded-lg border px-4 py-3 text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-primary/30 disabled:cursor-not-allowed disabled:bg-slate-50 disabled:text-slate-500'

const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, helperText, error, className, id, ...props }, ref) => {
    const inputId = id ?? useId()
    const hasError = Boolean(error)

    return (
      <div className="space-y-2">
        {label && (
          <label
            htmlFor={inputId}
            className="text-sm font-medium text-slate-700"
          >
            {label}
          </label>
        )}
        <input
          id={inputId}
          ref={ref}
          aria-invalid={hasError || undefined}
          className={[
            baseClasses,
            hasError
              ? 'border-rose-400 focus:ring-rose-200'
              : 'border-slate-300',
            className
          ]
            .filter(Boolean)
            .join(' ')}
          {...props}
        />
        {hasError ? (
          <p className="text-xs text-rose-600">{error}</p>
        ) : (
          helperText && <p className="text-xs text-slate-500">{helperText}</p>
        )}
      </div>
    )
  }
)

Input.displayName = 'Input'

export default Input
