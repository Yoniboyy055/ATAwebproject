'use client'

import { useLang } from './LangProvider'
import { getTranslation } from '@/lib/lang'

export default function TrustProofStrip() {
  const { lang } = useLang()

  const trustItems = [
    'trustProof1',
    'trustProof2',
    'trustProof3',
    'trustProof4',
    'trustProof5'
  ]

  return (
    <section className="py-12 px-4 bg-slate-900 text-white">
      <div className="max-w-6xl mx-auto">
        {/* Title */}
        <div className="text-center mb-8">
          <h3 className="text-2xl font-bold">
            {getTranslation(lang, 'trustProofTitle')}
          </h3>
        </div>

        {/* Trust Items Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
          {trustItems.map((key, idx) => (
            <div
              key={idx}
              className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-lg px-4 py-3 text-center hover:bg-white/20 transition"
            >
              <p className="text-sm font-medium text-white/90">
                {getTranslation(lang, key)}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
