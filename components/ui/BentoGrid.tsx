import React from 'react'

export interface BentoGridProps
  extends React.HTMLAttributes<HTMLDivElement> {}

export interface BentoTileProps
  extends React.HTMLAttributes<HTMLDivElement> {
  featured?: boolean
}

export function bentoTileClasses({
  featured = false,
  className = ''
}: {
  featured?: boolean
  className?: string
} = {}) {
  return [
    'rounded-2xl border border-slate-200 bg-white p-6 shadow-soft-sm',
    featured ? 'md:col-span-2 md:row-span-2' : '',
    className
  ]
    .filter(Boolean)
    .join(' ')
}

export default function BentoGrid({ className = '', ...props }: BentoGridProps) {
  return (
    <div
      className={[
        'grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3',
        className
      ]
        .filter(Boolean)
        .join(' ')}
      {...props}
    />
  )
}

export function BentoTile({
  featured = false,
  className = '',
  ...props
}: BentoTileProps) {
  return <div className={bentoTileClasses({ featured, className })} {...props} />
}
