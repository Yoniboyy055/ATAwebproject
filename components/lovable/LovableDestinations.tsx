import Link from 'next/link'
import Image from 'next/image'
import BentoGrid, { bentoTileClasses } from '@/components/ui/BentoGrid'
import SectionHeader from '@/components/ui/SectionHeader'
import { buttonClasses } from '@/components/ui/Button'

const destinations = [
  { name: 'Asmara', country: 'Eritrea', image: '/images/dest-1.svg', description: 'Heritage boulevards, cafés, and calm city rhythms.', featured: true },
  { name: 'Massawa', country: 'Eritrea', image: '/images/dest-2.svg', description: 'Red Sea coastline, history, and warm water escapes.' },
  { name: 'Addis Ababa', country: 'Ethiopia', image: '/images/dest-3.svg', description: 'Culture, markets, and a vibrant city gateway.' },
  { name: 'Keren', country: 'Eritrea', image: '/images/dest-4.svg', description: 'Mountain views and quieter local heritage.' },
  { name: 'Lalibela', country: 'Ethiopia', image: '/images/dest-5.svg', description: 'UNESCO sites and spiritual heritage travel.' },
  { name: 'Gondar', country: 'Ethiopia', image: '/images/dest-6.svg', description: 'Historic castles and family-friendly tours.' },
]

export default function LovableDestinations() {
  return (
    <section className="bg-slate-50 py-16 md:py-24">
      <div className="container max-w-6xl mx-auto px-4">
        <SectionHeader
          title="Destinations shaped for real journeys"
          subtitle="Thoughtful routes across Eritrea and Ethiopia, guided by local insight."
          className="mb-12"
        />

        <BentoGrid>
          {destinations.map(dest => (
            <Link
              key={`${dest.name}-${dest.country}`}
              href={`/destinations?search=${dest.name}`}
              className={bentoTileClasses({
                featured: Boolean(dest.featured),
                className: [
                  'group flex flex-col gap-4 transition hover:-translate-y-0.5 hover:shadow-soft focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/30 focus-visible:ring-offset-2 cursor-pointer',
                  dest.featured ? 'bg-slate-900 text-white border-slate-800' : ''
                ]
                  .filter(Boolean)
                  .join(' ')
              })}
            >
              <div className="relative h-36 w-full overflow-hidden rounded-lg bg-slate-100">
                <Image
                  src={dest.image}
                  alt={`${dest.name}, ${dest.country}`}
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 100vw, 33vw"
                />
              </div>
              <div>
                <p className={`text-xs font-semibold uppercase tracking-[0.2em] ${dest.featured ? 'text-white/60' : 'text-slate-500'}`}>
                  {dest.country}
                </p>
                <h3 className="mt-2 text-xl font-semibold">
                  {dest.name}
                </h3>
                <p className={`mt-2 text-sm ${dest.featured ? 'text-white/75' : 'text-slate-600'}`}>
                  {dest.description}
                </p>
                <p className={`mt-4 text-sm font-medium ${dest.featured ? 'text-white' : 'text-primary'}`}>
                  View destination details
                </p>
              </div>
            </Link>
          ))}
        </BentoGrid>

        {/* View All CTA */}
        <div className="text-center mt-12">
          <Link
            href="/destinations"
            className={buttonClasses({ variant: 'secondary', size: 'lg' })}
          >
            Explore All Destinations
          </Link>
        </div>
      </div>
    </section>
  )
}
