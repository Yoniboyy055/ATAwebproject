'use client'

import { useEffect, useState } from 'react'
import Section from '../../components/Section'
import SectionHeader from '../../components/ui/SectionHeader'
import BentoGrid, { BentoTile } from '../../components/ui/BentoGrid'
import { useLang } from '../../components/LangProvider'
import { getTranslation } from '../../lib/lang'
import { getPackageWhatsAppUrl } from '../../lib/whatsappHelper'
import { buttonClasses } from '@/components/ui/Button'

interface Package {
  id: string
  type: 'Local' | 'Diaspora'
  title: string
  description: string
  price: number | null
  recommended: boolean
  includes: string[]
  note: string | null
}

export default function PackagesPage() {
  const { lang } = useLang()
  const [packages, setPackages] = useState<Package[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const load = async () => {
      try {
        const res = await fetch('/api/admin/packages')
        if (res.ok) {
          const d = await res.json()
          setPackages(d.packages || [])
        }
      } catch (err) {
        console.error('Failed to fetch packages:', err)
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [])

  const localPackages = packages.filter(p => p.type === 'Local')
  const diasporaPackages = packages.filter(p => p.type === 'Diaspora')
  const featuredId = packages.find(pkg => pkg.recommended)?.id

  if (loading) {
    return (
      <div>
        <Section className="bg-slate-50">
          <div className="container max-w-3xl">
            <SectionHeader
              title={getTranslation(lang, 'packagesTitle')}
              subtitle={getTranslation(lang, 'packagesBody')}
              align="left"
            />
          </div>
        </Section>
        <Section>
          <div className="container max-w-6xl text-center py-12 text-slate-500">
            Loading packages…
          </div>
        </Section>
      </div>
    )
  }

  if (packages.length === 0) {
    return (
      <div>
        <Section className="bg-slate-50">
          <div className="container max-w-3xl">
            <SectionHeader
              title={getTranslation(lang, 'packagesTitle')}
              subtitle={getTranslation(lang, 'packagesBody')}
              align="left"
            />
          </div>
        </Section>
        <Section>
          <div className="container max-w-6xl text-center py-16 text-slate-500">
            <p className="text-xl">No packages available yet.</p>
            <p className="mt-2 text-slate-400">Check back soon for our travel packages.</p>
          </div>
        </Section>
        <Section className="bg-white">
          <div className="container max-w-2xl text-center">
            <SectionHeader
              title="Not sure which package fits?"
              subtitle="Share your route and dates. We will recommend the clearest option."
            />
            <a
              href={getPackageWhatsAppUrl('')}
              className={buttonClasses({ variant: 'primary', size: 'lg' })}
            >
              Talk to an Agent
            </a>
            <p className="mt-3 text-sm text-slate-500">
              Available by WhatsApp, phone, or email.
            </p>
          </div>
        </Section>
      </div>
    )
  }

  return (
    <div>
      {/* Header */}
      <Section className="bg-slate-50">
        <div className="container max-w-3xl">
          <SectionHeader
            title={getTranslation(lang, 'packagesTitle')}
            subtitle={getTranslation(lang, 'packagesBody')}
            align="left"
          />
        </div>
      </Section>

      {/* Packages Grid */}
      <Section>
        <div className="container max-w-6xl">
          {/* Local Packages */}
          {localPackages.length > 0 && (
            <div className="mb-16">
              <SectionHeader
                title={getTranslation(lang, 'packagesHeadingLocal')}
                subtitle="Support for local outbound travel and family coordination."
                align="left"
                className="mb-8"
              />
              <BentoGrid>
                {localPackages.map(pkg => (
                  <PackageTile
                    key={pkg.id}
                    package={pkg}
                    featured={pkg.id === featuredId}
                  />
                ))}
              </BentoGrid>
            </div>
          )}

          {/* Diaspora Packages */}
          {diasporaPackages.length > 0 && (
            <div>
              <SectionHeader
                title={getTranslation(lang, 'packagesHeadingDiaspora')}
                subtitle="Trips home for diaspora families and heritage travel."
                align="left"
                className="mb-8"
              />
              <BentoGrid>
                {diasporaPackages.map(pkg => (
                  <PackageTile
                    key={pkg.id}
                    package={pkg}
                    featured={pkg.id === featuredId}
                  />
                ))}
              </BentoGrid>
            </div>
          )}
        </div>
      </Section>

      {/* Bottom CTA */}
      <Section className="bg-white">
        <div className="container max-w-2xl text-center">
          <SectionHeader
            title="Not sure which package fits?"
            subtitle="Share your route and dates. We will recommend the clearest option."
          />
          <a
            href={getPackageWhatsAppUrl('')}
            className={buttonClasses({ variant: 'primary', size: 'lg' })}
          >
            Talk to an Agent
          </a>
          <p className="mt-3 text-sm text-slate-500">
            Available by WhatsApp, phone, or email.
          </p>
        </div>
      </Section>
    </div>
  )
}

interface PackageTileProps {
  package: Package
  featured?: boolean
}

function PackageTile({ package: pkg, featured = false }: PackageTileProps) {
  const normalizeItem = (item: string) =>
    item.replace(/whatsapp/gi, 'agent')
  const items = pkg.includes.slice(0, 4).map(normalizeItem)

  return (
    <BentoTile
      featured={featured}
      className={[
        'flex h-full flex-col gap-4',
        featured ? 'border-primary/30 bg-primary/5' : ''
      ]
        .filter(Boolean)
        .join(' ')}
    >
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">
            {pkg.type}
          </p>
          <h3 className="mt-2 text-lg font-semibold text-slate-900">
            {pkg.title}
          </h3>
        </div>
        {pkg.recommended && (
          <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-600">
            Recommended
          </span>
        )}
      </div>

      {pkg.description && (
        <p className="text-sm text-slate-500">{pkg.description}</p>
      )}

      {items.length > 0 && (
        <ul className="space-y-2 text-sm text-slate-600">
          {items.map((item) => (
            <li key={item} className="flex items-start gap-2">
              <span className="mt-1 h-1.5 w-1.5 rounded-full bg-primary/60" />
              <span>{item}</span>
            </li>
          ))}
        </ul>
      )}

      {pkg.note && (
        <p className="text-sm text-slate-500">{pkg.note}</p>
      )}

      {pkg.price != null && (
        <p className="text-sm font-semibold text-slate-700">From ${pkg.price.toLocaleString()}</p>
      )}
    </BentoTile>
  )
}
