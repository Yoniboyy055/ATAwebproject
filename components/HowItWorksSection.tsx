'use client'

import { useLang } from './LangProvider'
import { getTranslation } from '@/lib/lang'
import { BRAND } from '@/lib/config'

export default function HowItWorksSection() {
  const { lang } = useLang()

  const steps = [
    {
      number: '1',
      titleKey: 'howStep1Title',
      bodyKey: 'howStep1Body',
      icon: '📋'
    },
    {
      number: '2',
      titleKey: 'howStep2Title',
      bodyKey: 'howStep2Body',
      icon: '✓'
    },
    {
      number: '3',
      titleKey: 'howStep3Title',
      bodyKey: 'howStep3Body',
      icon: '🚀'
    }
  ]

  return (
    <section className="py-16 px-4 bg-gradient-to-b from-blue-50 to-white">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-slate-900 mb-4">
            {getTranslation(lang, 'howItWorksTitle')}
          </h2>
          <p className="text-lg text-slate-600 max-w-2xl mx-auto">
            {getTranslation(lang, 'howItWorksBody')}
          </p>
        </div>

        {/* Steps */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {steps.map((step, idx) => (
            <div key={idx} className="relative">
              {/* Step Card */}
              <div className="bg-white border border-slate-200 rounded-lg p-8 h-full hover:shadow-lg transition-shadow">
                {/* Icon & Number */}
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-14 h-14 bg-accent/10 rounded-full flex items-center justify-center text-2xl">
                    {step.icon}
                  </div>
                  <div className="text-3xl font-bold text-accent">{step.number}</div>
                </div>

                {/* Content */}
                <h3 className="text-xl font-bold text-slate-900 mb-2">
                  {getTranslation(lang, step.titleKey)}
                </h3>
                <p className="text-slate-700">
                  {getTranslation(lang, step.bodyKey)}
                </p>
              </div>

              {/* Connector Arrow (hidden on last item) */}
              {idx < steps.length - 1 && (
                <div className="hidden md:block absolute top-1/2 -right-4 w-8 h-0.5 bg-accent/30 transform -translate-y-1/2" />
              )}
            </div>
          ))}
        </div>

        {/* Bottom CTA */}
        <div className="text-center mt-12">
          <a
            href={`https://wa.me/${encodeURIComponent(BRAND.whatsapp)}`}
            className="inline-block bg-accent/90 text-white px-8 py-3 rounded-md font-semibold hover:bg-accent transition"
          >
            {getTranslation(lang, 'howCta')}
          </a>
        </div>
      </div>
    </section>
  )
}
