'use client'

import { useLang } from './LangProvider'
import { getTranslation } from '@/lib/lang'
import SectionHeader from '@/components/ui/SectionHeader'

export default function HowItWorksSection() {
  const { lang } = useLang()

  const steps = [
    {
      number: '1',
      titleKey: 'howStep1Title',
      bodyKey: 'howStep1Body',
    },
    {
      number: '2',
      titleKey: 'howStep2Title',
      bodyKey: 'howStep2Body',
    },
    {
      number: '3',
      titleKey: 'howStep3Title',
      bodyKey: 'howStep3Body',
    }
  ]

  return (
    <section className="bg-slate-50 py-16 md:py-24">
      <div className="container max-w-6xl mx-auto px-4">
        <SectionHeader
          title={getTranslation(lang, 'howItWorksTitle')}
          subtitle={getTranslation(lang, 'howItWorksBody')}
          className="mb-12"
        />

        <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
          {steps.map((step, idx) => (
            <div
              key={idx}
              className="rounded-2xl border border-slate-200 bg-white p-6 shadow-soft-sm"
            >
              <div className="flex items-center gap-4">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-slate-100 text-sm font-semibold text-slate-700">
                  {step.number}
                </div>
                <h3 className="text-lg font-semibold text-slate-900">
                  {getTranslation(lang, step.titleKey)}
                </h3>
              </div>
              <p className="mt-4 text-sm text-slate-600">
                {getTranslation(lang, step.bodyKey)}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
