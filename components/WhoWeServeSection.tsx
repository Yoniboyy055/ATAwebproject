'use client'

import { useLang } from './LangProvider'
import { getTranslation } from '@/lib/lang'
import { getPackageWhatsAppUrl } from '@/lib/whatsappHelper'

export default function WhoWeServeSection() {
  const { lang } = useLang()

  return (
    <section className="py-16 px-4 bg-white">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-slate-900 mb-4">
            {getTranslation(lang, 'whoWeServeTitle')}
          </h2>
          <p className="text-lg text-slate-600 max-w-2xl mx-auto">
            {getTranslation(lang, 'whoWeServeBody')}
          </p>
        </div>

        {/* Two-Column Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Local Travelers Card */}
          <div className="border-2 border-blue-200 rounded-lg p-8 bg-blue-50 hover:shadow-lg transition-shadow">
            <h3 className="text-2xl font-bold text-slate-900 mb-4">
              {getTranslation(lang, 'whoWeServeLocalTitle')}
            </h3>
            <ul className="space-y-3 mb-6">
              <li className="flex items-start gap-3">
                <span className="text-blue-600 font-bold text-lg flex-shrink-0">✓</span>
                <p className="text-slate-700">{getTranslation(lang, 'whoWeServeLocalBul1')}</p>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-blue-600 font-bold text-lg flex-shrink-0">✓</span>
                <p className="text-slate-700">{getTranslation(lang, 'whoWeServeLocalBul2')}</p>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-blue-600 font-bold text-lg flex-shrink-0">✓</span>
                <p className="text-slate-700">{getTranslation(lang, 'whoWeServeLocalBul3')}</p>
              </li>
            </ul>
            <a
              href={getPackageWhatsAppUrl('', 'Local')}
              className="inline-block w-full text-center bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-4 rounded-md transition"
            >
              {getTranslation(lang, 'whoWeServeLocalCta')}
            </a>
          </div>

          {/* Diaspora Travelers Card */}
          <div className="border-2 border-emerald-200 rounded-lg p-8 bg-emerald-50 hover:shadow-lg transition-shadow">
            <h3 className="text-2xl font-bold text-slate-900 mb-4">
              {getTranslation(lang, 'whoWeServeDiasporaTitle')}
            </h3>
            <ul className="space-y-3 mb-6">
              <li className="flex items-start gap-3">
                <span className="text-emerald-600 font-bold text-lg flex-shrink-0">✓</span>
                <p className="text-slate-700">{getTranslation(lang, 'whoWeServeDiasporaBul1')}</p>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-emerald-600 font-bold text-lg flex-shrink-0">✓</span>
                <p className="text-slate-700">{getTranslation(lang, 'whoWeServeDiasporaBul2')}</p>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-emerald-600 font-bold text-lg flex-shrink-0">✓</span>
                <p className="text-slate-700">{getTranslation(lang, 'whoWeServeDiasporaBul3')}</p>
              </li>
            </ul>
            <a
              href={getPackageWhatsAppUrl('', 'Diaspora')}
              className="inline-block w-full text-center bg-emerald-600 hover:bg-emerald-700 text-white font-semibold py-3 px-4 rounded-md transition"
            >
              {getTranslation(lang, 'whoWeServeDiasporaCta')}
            </a>
          </div>
        </div>
      </div>
    </section>
  )
}
