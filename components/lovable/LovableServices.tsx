import Link from 'next/link'

const categories = [
  { icon: '🏖️', label: 'Beach', count: '48 trips', slug: 'beach' },
  { icon: '🏔️', label: 'Adventure', count: '35 trips', slug: 'adventure' },
  { icon: '🌆', label: 'City Breaks', count: '52 trips', slug: 'city' },
  { icon: '👨‍👩‍👧‍👦', label: 'Family', count: '28 trips', slug: 'family' },
  { icon: '💑', label: 'Honeymoon', count: '24 trips', slug: 'honeymoon' },
  { icon: '✨', label: 'Luxury', count: '18 trips', slug: 'luxury' },
]

export default function LovableServices() {
  return (
    <section className="py-16 md:py-24 bg-gradient-to-b from-white to-slate-50">
      <div className="container max-w-6xl mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-3">
            Explore by Category
          </h2>
          <p className="text-slate-600 text-lg max-w-2xl mx-auto">
            Whether you&rsquo;re seeking adventure, relaxation, or cultural immersion, find the perfect trip tailored to your travel style.
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 md:gap-6">
          {categories.map(cat => (
            <Link
              key={cat.slug}
              href={`/packages?category=${cat.slug}`}
              className="group p-6 md:p-8 rounded-xl border border-slate-200 hover:border-emerald-300 hover:shadow-lg bg-white hover:bg-gradient-to-br hover:from-emerald-50 hover:to-white transition duration-300"
            >
              <div className="text-4xl md:text-5xl mb-3">{cat.icon}</div>
              <h3 className="text-lg md:text-xl font-bold text-slate-900 mb-1">{cat.label}</h3>
              <p className="text-sm text-slate-600 group-hover:text-emerald-600 transition">{cat.count}</p>
            </Link>
          ))}
        </div>

        {/* Hot Deals Badge */}
        <div className="mt-12 text-center">
          <span className="inline-flex items-center gap-2 bg-red-100 text-red-700 px-4 py-2 rounded-full font-semibold text-sm">
            🔥 Hot Deals
          </span>
        </div>
      </div>
    </section>
  )
}
