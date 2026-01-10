import Link from 'next/link'

const categories = [
  {
    id: 'flights',
    title: 'Flights',
    description: 'Best routes & prices',
    icon: '✈️',
    color: 'from-blue-50 to-blue-100',
    href: '/services#flights'
  },
  {
    id: 'visa',
    title: 'Visa Assistance',
    description: 'Quick & reliable help',
    icon: '📋',
    color: 'from-purple-50 to-purple-100',
    href: '/services#visa'
  },
  {
    id: 'tours',
    title: 'Tours',
    description: 'Eritrea & Ethiopia',
    icon: '🗺️',
    color: 'from-amber-50 to-amber-100',
    href: '/services#tours'
  },
  {
    id: 'hotels',
    title: 'Hotels',
    description: 'Accommodation & stays',
    icon: '🏨',
    color: 'from-green-50 to-green-100',
    href: '/services#hotels'
  },
  {
    id: 'transport',
    title: 'Transport',
    description: 'Airport & ground',
    icon: '🚗',
    color: 'from-red-50 to-red-100',
    href: '/services#transport'
  },
  {
    id: 'support',
    title: 'Support',
    description: '24/7 WhatsApp help',
    icon: '💬',
    color: 'from-emerald-50 to-emerald-100',
    href: '/services#support'
  }
]

export default function CategoryTiles() {
  return (
    <section className="py-16 bg-gradient-to-b from-slate-50 to-white">
      <div className="container">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-slate-900">Our Services</h2>
          <p className="mt-2 text-slate-600">Everything you need for hassle-free travel</p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {categories.map(cat => (
            <Link
              key={cat.id}
              href={cat.href}
              className={`group p-6 rounded-xl bg-gradient-to-br ${cat.color} border border-slate-200 hover:border-slate-300 hover:shadow-md transition`}
            >
              <div className="text-4xl mb-3">{cat.icon}</div>
              <h3 className="text-xl font-semibold text-slate-900">{cat.title}</h3>
              <p className="mt-1 text-sm text-slate-700">{cat.description}</p>
              <div className="mt-4 text-sm font-medium text-blue-600 group-hover:underline">Learn more →</div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  )
}
