'use client'

import SectionHeading from '../../components/SectionHeading'
import { packages } from '../../lib/config'
import { useLang } from '../../components/LangProvider'
import { getTranslation } from '../../lib/lang'
import { getPackageWhatsAppUrl } from '../../lib/whatsappHelper'

export default function PackagesPage() {
  const { lang } = useLang()

  const localPackages = packages.filter(p => p.type === 'Local')
  const diasporaPackages = packages.filter(p => p.type === 'Diaspora')

  return (
    <div>
      {/* Header */}
      <section className="section bg-gradient-to-b from-blue-50 to-white">
        <div className="container max-w-3xl">
          <SectionHeading>{getTranslation(lang, 'packagesTitle')}</SectionHeading>
          <p className="text-lg text-slate-700">
            {getTranslation(lang, 'packagesBody')}
          </p>
        </div>
      </section>

      {/* Packages Grid */}
      <section className="section">
        <div className="container max-w-6xl">
          {/* Local Packages */}
          <div className="mb-16">
            <div className="text-center mb-12 pb-6 border-b-2 border-blue-200">
              <h2 className="text-2xl font-bold text-slate-900">
                {getTranslation(lang, 'packagesHeadingLocal')}
              </h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {localPackages.map(pkg => (
                <PackageCard
                  key={pkg.id}
                  package={pkg}
                  type="local"
                  lang={lang}
                />
              ))}
            </div>
          </div>

          {/* Diaspora Packages */}
          <div>
            <div className="text-center mb-12 pb-6 border-b-2 border-emerald-200">
              <h2 className="text-2xl font-bold text-slate-900">
                {getTranslation(lang, 'packagesHeadingDiaspora')}
              </h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {diasporaPackages.map(pkg => (
                <PackageCard
                  key={pkg.id}
                  package={pkg}
                  type="diaspora"
                  lang={lang}
                />
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Bottom CTA */}
      <section className="section bg-slate-50">
        <div className="container max-w-2xl text-center">
          <h3 className="text-2xl font-semibold mb-4">Not Sure Which Package&quest;</h3>
          <p className="text-slate-700 mb-6">
            WhatsApp us your route and dates—we&apos;ll recommend the best package for your journey.
          </p>
          <a
            href={getPackageWhatsAppUrl('')}
            className="inline-block bg-accent/90 text-white px-6 py-3 rounded-md font-semibold hover:bg-accent transition"
          >
            Chat on WhatsApp
          </a>
        </div>
      </section>
    </div>
  )
}

interface PackageCardProps {
  package: typeof packages[0]
  type: 'local' | 'diaspora'
  lang: string
}

function PackageCard({ package: pkg, type }: PackageCardProps) {
  const borderColor = type === 'local' ? 'border-blue-200' : 'border-emerald-200'
  const accentBg = type === 'local' ? 'bg-blue-50' : 'bg-emerald-50'
  const btnColor = type === 'local' ? 'bg-blue-600 hover:bg-blue-700' : 'bg-emerald-600 hover:bg-emerald-700'
  const badgeColor = type === 'local' ? 'bg-blue-100 text-blue-800' : 'bg-emerald-100 text-emerald-800'

  return (
    <div className={`border-2 ${borderColor} rounded-lg p-6 ${accentBg} hover:shadow-lg transition-shadow`}>
      {/* Header */}
      <div className="flex items-start justify-between mb-4">
        <h3 className="text-xl font-bold text-slate-900 flex-1">
          {pkg.title}
        </h3>
        {pkg.recommended && (
          <span className={`text-xs font-semibold px-2 py-1 rounded whitespace-nowrap ml-2 ${badgeColor}`}>
            {getTranslation('en', 'bestForLocal')}
          </span>
        )}
      </div>

      {/* Includes */}
      <div className="space-y-3 mb-6">
        <p className="text-sm font-semibold text-slate-700 uppercase tracking-wide">Includes:</p>
        <ul className="space-y-2">
          {pkg.includes.map((item, idx) => (
            <li key={idx} className="flex items-start gap-2 text-slate-700">
              <span className="text-emerald-600 font-bold">✓</span>
              <span>{item}</span>
            </li>
          ))}
        </ul>
      </div>

      {/* Note */}
      {pkg.note && (
        <p className="text-sm text-slate-600 italic border-l-2 border-slate-300 pl-3 mb-6">
          {pkg.note}
        </p>
      )}

      {/* CTA */}
      <a
        href={getPackageWhatsAppUrl(pkg.title, pkg.type as 'Local' | 'Diaspora')}
        className={`block w-full text-center text-white font-semibold py-2 px-4 rounded-md transition ${btnColor}`}
      >
        Request This Package
      </a>
    </div>
  )
}
