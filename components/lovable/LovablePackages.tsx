import Link from 'next/link'

interface PackageCardProps {
  id: string
  title: string
  location: string
  rating: number
  reviews: number
  duration: string
  price: number
  discountedPrice: number
  tags: string[]
  image: string
  discount?: number
  countdown?: string
}

const packages: PackageCardProps[] = [
  {
    id: 'asmara-city',
    title: 'Asmara City Break',
    location: 'Asmara, Eritrea',
    rating: 4.9,
    reviews: 142,
    duration: '3 days',
    price: 899,
    discountedPrice: 699,
    discount: 22,
    countdown: '47h 59m left',
    tags: ['Culture', 'History', 'Food'],
    image: '/images/hero.svg'
  },
  {
    id: 'massawa-escape',
    title: 'Massawa Red Sea Escape',
    location: 'Massawa, Eritrea',
    rating: 4.8,
    reviews: 98,
    duration: '4 days',
    price: 799,
    discountedPrice: 599,
    discount: 25,
    countdown: '23h 59m left',
    tags: ['Beach', 'Diving', 'Relax'],
    image: '/images/hero.svg'
  },
  {
    id: 'keren-heritage',
    title: 'Keren Heritage Tour',
    location: 'Keren, Eritrea',
    rating: 5.0,
    reviews: 67,
    duration: '2 days',
    price: 499,
    discountedPrice: 379,
    discount: 24,
    countdown: '18h 30m left',
    tags: ['Heritage', 'Adventure', 'Culture'],
    image: '/images/hero.svg'
  },
]

function PackageCard({ pkg }: { pkg: PackageCardProps }) {
  return (
    <div className="group rounded-xl overflow-hidden bg-white border border-slate-200 hover:border-emerald-300 hover:shadow-xl transition duration-300">
      {/* Image */}
      <div className="relative h-48 md:h-56 overflow-hidden bg-slate-100">
        <div className="w-full h-full bg-gradient-to-br from-emerald-400 to-blue-500 flex items-center justify-center text-white text-sm font-semibold">
          {pkg.location}
        </div>
        {pkg.discount && (
          <div className="absolute top-4 right-4 bg-red-500 text-white px-3 py-1 rounded-full text-sm font-bold">
            -{pkg.discount}%
          </div>
        )}
        {pkg.countdown && (
          <div className="absolute top-4 left-4 bg-black/60 text-white px-3 py-1 rounded-lg text-xs font-semibold">
            {pkg.countdown}
          </div>
        )}
      </div>

      {/* Content */}
      <div className="p-5 md:p-6">
        {/* Rating */}
        <div className="flex items-center gap-2 mb-3">
          <span className="text-yellow-400">⭐</span>
          <span className="font-bold text-slate-900">{pkg.rating}</span>
          <span className="text-slate-600 text-sm">({pkg.reviews})</span>
        </div>

        {/* Title */}
        <h3 className="text-lg md:text-xl font-bold text-slate-900 mb-2 group-hover:text-emerald-600 transition">
          {pkg.title}
        </h3>

        {/* Tags */}
        <div className="flex flex-wrap gap-1 mb-3">
          {pkg.tags.map((tag, i) => (
            <span key={i} className="text-xs bg-slate-100 text-slate-700 px-2 py-1 rounded-full">
              {tag}
            </span>
          ))}
        </div>

        {/* Duration & Price */}
        <div className="border-t border-slate-200 pt-3 mt-3">
          <div className="flex items-center justify-between">
            <span className="text-sm text-slate-600">{pkg.duration}</span>
            <div className="text-right">
              <div className="line-through text-slate-400 text-sm">${pkg.price}</div>
              <div className="text-xl font-bold text-emerald-600">${pkg.discountedPrice}</div>
            </div>
          </div>
        </div>

        {/* CTA */}
        <Link
          href={`/packages#${pkg.id}`}
          className="mt-4 w-full block text-center bg-emerald-600 hover:bg-emerald-700 text-white py-2 rounded-lg font-semibold transition"
        >
          View Details
        </Link>
      </div>
    </div>
  )
}

export default function LovablePackages() {
  return (
    <section className="py-16 md:py-24 bg-white">
      <div className="container max-w-6xl mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-3">
            Featured Packages
          </h2>
          <p className="text-slate-600 text-lg max-w-2xl mx-auto">
            Handpicked destinations with exclusive offers. Book now before they&rsquo;re gone!
          </p>
        </div>

        {/* Package Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          {packages.map(pkg => (
            <PackageCard key={pkg.id} pkg={pkg} />
          ))}
        </div>

        {/* View All CTA */}
        <div className="text-center">
          <Link
            href="/packages"
            className="inline-flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white px-8 py-4 rounded-lg font-bold transition shadow-lg hover:shadow-xl"
          >
            View All Packages →
          </Link>
        </div>
      </div>
    </section>
  )
}
