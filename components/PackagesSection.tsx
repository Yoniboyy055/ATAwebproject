'use client'

import { packages } from '@/lib/config'
import { useLang } from './LangProvider'
import { getTranslation } from '@/lib/lang'
import { useQuote } from './QuoteProvider'

export default function PackagesSection() {
  const { lang } = useLang()
  const { openQuote } = useQuote()
  
  const localPackages = packages.filter(p => p.type === 'Local')
  const diasporaPackages = packages.filter(p => p.type === 'Diaspora')
  
  const handleGetOptions = (packageId: string) => {
    openQuote({
      source: 'Packages',
      package: packageId,
      intent: 'Flights + Full Trip Support'
    })
  }

  return (
    <section className="py-16 px-4 bg-gradient-to-b from-white via-blue-50 to-white">
      <div className="max-w-6xl mx-auto">
        {/* Section Header */}
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-slate-900 mb-4">
            {getTranslation(lang, 'packagesTitle')}
          </h2>
          <p className="text-lg text-slate-600">
            {getTranslation(lang, 'packagesBody')}
          </p>
        </div>

        {/* Two-Column Layout */}
        <div className="grid md:grid-cols-2 gap-8">
          {/* Local Column */}
          <div className="space-y-6">
            <div className="text-center mb-8 pb-4 border-b-2 border-blue-200">
              <p className="font-semibold text-blue-700 uppercase tracking-wide">
                {getTranslation(lang, 'bestForLocal')}
              </p>
            </div>
            {localPackages.map(pkg => (
              <PackageCard
                key={pkg.id}
                package={pkg}
                microLine={getTranslation(lang, 'packagesMicroLine')}
                onGetOptions={handleGetOptions}
              />
            ))}
          </div>

          {/* Diaspora Column */}
          <div className="space-y-6">
            <div className="text-center mb-8 pb-4 border-b-2 border-emerald-200">
              <p className="font-semibold text-emerald-700 uppercase tracking-wide">
                {getTranslation(lang, 'bestForDiaspora')}
              </p>
            </div>
            {diasporaPackages.map(pkg => (
              <PackageCard
                key={pkg.id}
                package={pkg}
                microLine={getTranslation(lang, 'packagesMicroLine')}
                onGetOptions={handleGetOptions}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}

interface PackageCardProps {
  package: typeof packages[0]
  microLine: string
  onGetOptions: (id: string) => void
}

function PackageCard({ package: pkg, microLine, onGetOptions }: PackageCardProps) {
  const { lang } = useLang()
  const isLocal = pkg.type === 'Local'
  const borderColor = isLocal ? 'border-blue-200' : 'border-emerald-200'
  const accentBg = isLocal ? 'bg-blue-50' : 'bg-emerald-50'
  const btnColor = isLocal ? 'bg-blue-600 hover:bg-blue-700' : 'bg-emerald-600 hover:bg-emerald-700'
  const badgeColor = isLocal ? 'bg-blue-100 text-blue-800' : 'bg-emerald-100 text-emerald-800'
  
  return (
    <div className={`border-2 ${borderColor} rounded-lg p-6 ${accentBg} hover:shadow-lg transition-shadow`}>
      {/* Header */}
      <div className="flex items-start justify-between mb-4">
        <h3 className="text-xl font-bold text-slate-900 flex-1">
          {pkg.title}
        </h3>
        {pkg.recommended && (
          <span className={`text-xs font-semibold px-2 py-1 rounded whitespace-nowrap ml-2 ${badgeColor}`}>
            Recommended
          </span>
        )}
      </div>

      {/* Micro-line */}
      <p className="text-sm text-slate-600 mb-4 italic">
        {microLine}
      </p>

      {/* Includes List */}
      <div className="mb-4">
        <ul className="space-y-2">
          {pkg.includes.map((item, idx) => (
            <li key={idx} className="flex items-start gap-2 text-slate-700">
              <span className="text-blue-500 font-bold mt-0.5">•</span>
              <span className="text-sm">{item}</span>
            </li>
          ))}
        </ul>
      </div>

      {/* Optional Note */}
      {pkg.note && (
        <p className="text-xs text-slate-600 bg-white bg-opacity-50 rounded px-3 py-2 mb-4 border-l-2 border-slate-300">
          {pkg.note}
        </p>
      )}

      {/* CTA Button */}
      <button
        onClick={() => onGetOptions(pkg.id)}
        className={`w-full py-2 px-4 rounded text-white font-semibold ${btnColor} transition-colors`}
      >
        {getTranslation(lang, 'buttons.getOptions')}
      </button>
    </div>
  )
}
