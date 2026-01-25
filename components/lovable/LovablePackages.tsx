import Link from 'next/link'
import { packages } from '@/lib/config'
import BentoGrid, { BentoTile } from '@/components/ui/BentoGrid'
import SectionHeader from '@/components/ui/SectionHeader'
import { buttonClasses } from '@/components/ui/Button'

export default function LovablePackages() {
  const featuredId = packages.find((pkg) => pkg.recommended)?.id
  const normalizeItem = (item: string) =>
    item.replace(/whatsapp/gi, 'agent')

  return (
    <section className="bg-white py-16 md:py-24">
      <div className="container max-w-6xl mx-auto px-4">
        <SectionHeader
          title="Support packages built around real trips"
          subtitle="Choose the level of guidance that fits your route and family needs."
          className="mb-12"
        />

        <BentoGrid>
          {packages.map((pkg) => {
            const featured = pkg.id === featuredId
            const items = pkg.includes.slice(0, 4).map(normalizeItem)

            return (
              <BentoTile
                key={pkg.id}
                featured={featured}
                className={[
                  'flex h-full flex-col gap-4',
                  featured ? 'border-primary/30 bg-primary/5' : ''
                ]
                  .filter(Boolean)
                  .join(' ')}
              >
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">
                    {pkg.type}
                  </p>
                  <h3 className="mt-2 text-xl font-semibold text-slate-900">
                    {pkg.title}
                  </h3>
                </div>

                <ul className="space-y-2 text-sm text-slate-600">
                  {items.map((item) => (
                    <li key={item} className="flex items-start gap-2">
                      <span className="mt-1 h-1.5 w-1.5 rounded-full bg-primary/60" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>

                {pkg.note && (
                  <p className="text-sm text-slate-500">{pkg.note}</p>
                )}
              </BentoTile>
            )
          })}
        </BentoGrid>

        <div className="mt-12 text-center">
          <Link
            href="/packages"
            className={buttonClasses({ variant: 'secondary', size: 'lg' })}
          >
            View All Packages
          </Link>
        </div>
      </div>
    </section>
  )
}
