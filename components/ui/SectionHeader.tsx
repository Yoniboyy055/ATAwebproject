import React from 'react'

export interface SectionHeaderProps {
  title: string
  subtitle?: string
  align?: 'left' | 'center'
  eyebrow?: string
  tone?: 'dark' | 'light'
  className?: string
}

export default function SectionHeader({
  title,
  subtitle,
  align = 'center',
  eyebrow,
  tone = 'dark',
  className = ''
}: SectionHeaderProps) {
  const titleTone = tone === 'light' ? 'text-white' : 'text-slate-900'
  const subtitleTone = tone === 'light' ? 'text-white/70' : 'text-slate-600'
  const eyebrowTone = tone === 'light' ? 'text-white/60' : 'text-slate-500'

  return (
    <div
      className={[
        align === 'center' ? 'text-center items-center' : 'text-left',
        'flex flex-col gap-3',
        className
      ]
        .filter(Boolean)
        .join(' ')}
    >
      {eyebrow && (
        <p
          className={`text-xs font-semibold uppercase tracking-[0.2em] ${eyebrowTone}`}
        >
          {eyebrow}
        </p>
      )}
      <h2 className={`text-3xl font-semibold md:text-4xl ${titleTone}`}>
        {title}
      </h2>
      {subtitle && (
        <p className={`text-base md:text-lg ${subtitleTone}`}>{subtitle}</p>
      )}
    </div>
  )
}
