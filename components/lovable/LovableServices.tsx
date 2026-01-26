import Link from 'next/link'
import SectionHeader from '@/components/ui/SectionHeader'

const services = [
  {
    short: 'FL',
    title: 'Flights',
    description: 'Route planning and fare guidance from a real agent.',
    link: '/flights'
  },
  {
    short: 'VS',
    title: 'Visa & Documents',
    description: 'Clear checklists and document guidance for your route.',
    link: '/services'
  },
  {
    short: 'ST',
    title: 'Hotels & Stays',
    description: 'Local recommendations that match your budget and needs.',
    link: '/services'
  },
  {
    short: 'TR',
    title: 'Tours & Activities',
    description: 'Curated experiences for family and heritage travel.',
    link: '/packages'
  },
  {
    short: 'GT',
    title: 'Ground Transport',
    description: 'Arrival coordination and local transfer support.',
    link: '/services'
  },
  {
    short: 'TP',
    title: 'Full Trip Planning',
    description: 'End-to-end support for complex family trips.',
    link: '/book'
  },
]

export default function LovableServices() {
  return (
    <section className="bg-white py-16 md:py-24">
      <div className="container max-w-6xl mx-auto px-4">
        <SectionHeader
          title="Everything you need, handled by people"
          subtitle="From flights to documents, we keep your travel decisions simple and clear."
          className="mb-12"
        />

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {services.map((service, idx) => (
            <Link
              key={idx}
              href={service.link}
              className="group rounded-2xl border border-slate-200 bg-white p-6 shadow-soft-sm transition hover:-translate-y-0.5 hover:shadow-soft focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/30 focus-visible:ring-offset-2 cursor-pointer"
            >
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-slate-100 text-sm font-semibold text-slate-700">
                {service.short}
              </div>
              <h3 className="mt-4 text-lg font-semibold text-slate-900">
                {service.title}
              </h3>
              <p className="mt-2 text-sm text-slate-600">{service.description}</p>
            </Link>
          ))}
        </div>
      </div>
    </section>
  )
}
