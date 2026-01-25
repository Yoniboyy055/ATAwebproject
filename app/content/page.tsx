import Link from 'next/link'

const contentItems = [
  {
    id: 1,
    title: 'Complete Visa Guide: Eritrea 2026',
    category: 'Visa Guide',
    excerpt: 'Everything you need to know about Eritrean visa requirements, documentation, and timelines.',
    image: '📋',
    readTime: '8 min read',
    date: 'Jan 10, 2026',
    slug: 'eritrea-visa-guide-2026'
  },
  {
    id: 2,
    title: '10 Best Hidden Gems in Eritrea',
    category: 'Travel Guide',
    excerpt: 'Discover lesser-known destinations that will make your Eritrea trip unforgettable.',
    image: '🏝️',
    readTime: '12 min read',
    date: 'Jan 8, 2026',
    slug: 'hidden-gems-eritrea'
  },
  {
    id: 3,
    title: 'Diaspora Return: Planning Your Home Visit',
    category: 'Travel Tips',
    excerpt: 'Step-by-step guide for planning the perfect return trip home for diaspora communities.',
    image: '🏠',
    readTime: '10 min read',
    date: 'Jan 5, 2026',
    slug: 'diaspora-return-guide'
  },
  {
    id: 4,
    title: 'Budget Travel to Ethiopia: Complete Breakdown',
    category: 'Budget Tips',
    excerpt: 'Travel to Ethiopia affordably without compromising on experience. Detailed budget breakdown.',
    image: '💰',
    readTime: '9 min read',
    date: 'Jan 1, 2026',
    slug: 'budget-ethiopia-travel'
  },
  {
    id: 5,
    title: 'Packing Essentials for Africa Travel',
    category: 'Packing Guide',
    excerpt: 'What to pack for safe, comfortable travel to Eritrea and Ethiopia. Expert recommendations.',
    image: '🧳',
    readTime: '7 min read',
    date: 'Dec 28, 2025',
    slug: 'packing-guide-africa'
  },
  {
    id: 6,
    title: 'Why Choose Amanuel: Customer Stories',
    category: 'Case Studies',
    excerpt: 'Real stories from satisfied travelers and their unforgettable journeys with Amanuel.',
    image: '⭐',
    readTime: '6 min read',
    date: 'Dec 25, 2025',
    slug: 'customer-stories'
  },
  {
    id: 7,
    title: 'Best Time to Visit Eritrea & Ethiopia',
    category: 'Travel Planning',
    excerpt: 'Seasonal guide: weather, festivals, and best times to visit for optimal experience.',
    image: '📅',
    readTime: '11 min read',
    date: 'Dec 20, 2025',
    slug: 'best-time-visit'
  },
  {
    id: 8,
    title: 'Food Guide: What to Eat in Asmara',
    category: 'Food & Culture',
    excerpt: 'Discover Eritrean cuisine with our guide to must-try dishes and authentic restaurants.',
    image: '🍽️',
    readTime: '8 min read',
    date: 'Dec 15, 2025',
    slug: 'food-guide-asmara'
  },
]

const categories = [
  'All',
  'Visa Guide',
  'Travel Guide',
  'Travel Tips',
  'Budget Tips',
  'Packing Guide',
  'Case Studies',
  'Travel Planning',
  'Food & Culture'
]

export default function ContentHubPage() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-slate-50 to-white">
      {/* Hero Section */}
      <section className="py-12 md:py-16 px-4 sm:px-6 lg:px-8 bg-gradient-to-r from-blue-600 to-emerald-600 text-white">
        <div className="max-w-6xl mx-auto">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            Travel Resources & Insights
          </h1>
          <p className="text-lg text-blue-100 max-w-2xl">
            Expert guides, travel tips, and real customer stories to help you plan your perfect journey.
          </p>
        </div>
      </section>

      {/* Category Filter */}
      <section className="py-8 px-4 sm:px-6 lg:px-8 border-b border-slate-200 bg-white">
        <div className="max-w-6xl mx-auto">
          <p className="text-sm font-semibold text-slate-600 mb-4">Filter by Category</p>
          <div className="flex flex-wrap gap-2">
            {categories.map((cat, idx) => (
              <button
                key={idx}
                className={`px-4 py-2 rounded-full font-medium text-sm transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/30 focus-visible:ring-offset-2 ${
                  idx === 0
                    ? 'bg-emerald-600 text-white'
                    : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Content Grid */}
      <section className="py-12 md:py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {contentItems.map((item) => (
              <Link
                key={item.id}
                href={`/blog/${item.slug}`}
                className="group rounded-2xl border border-slate-200 bg-white transition duration-300 overflow-hidden cursor-pointer hover:border-slate-300 hover:shadow-soft focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/30 focus-visible:ring-offset-2"
              >
                <div className="relative overflow-hidden bg-gradient-to-br from-slate-100 to-slate-50 p-8 flex items-center justify-center min-h-48">
                  <div className="text-6xl group-hover:scale-110 transition duration-300">
                    {item.image}
                  </div>
                </div>

                <div className="p-6">
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-xs font-semibold text-emerald-600 bg-emerald-50 px-3 py-1 rounded-full">
                      {item.category}
                    </span>
                    <span className="text-xs text-slate-500">{item.readTime}</span>
                  </div>

                  <h3 className="text-lg font-bold text-slate-900 mb-2 group-hover:text-emerald-600 transition line-clamp-2">
                    {item.title}
                  </h3>

                  <p className="text-sm text-slate-600 mb-4 line-clamp-2">
                    {item.excerpt}
                  </p>

                  <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
                    <span className="text-xs text-slate-500">{item.date}</span>
                    <span className="text-primary font-semibold text-sm group-hover:translate-x-1 transition">
                      Read →
                    </span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-12 md:py-16 px-4 sm:px-6 lg:px-8 bg-gradient-to-r from-emerald-600 to-teal-600 text-white">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Didn&apos;t find what you&apos;re looking for?
          </h2>
          <p className="text-lg text-emerald-100 mb-8">
            Talk with an agent for answers and clear next steps.
          </p>
          <a
            href="https://wa.me/2917197086?text=Hi! I have questions about planning my trip. Can you help?"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block bg-white text-slate-900 hover:bg-slate-100 px-8 py-4 rounded-lg font-bold transition shadow-soft"
          >
            Talk to an Agent
          </a>
        </div>
      </section>
    </main>
  )
}
