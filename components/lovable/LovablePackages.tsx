import Link from 'next/link'

interface TierPackage {
  name: 'Basic' | 'Standard' | 'Premium'
  emoji: string
  description: string
  price: string
  features: string[]
  cta: string
  popular?: boolean
}

const packageTiers: TierPackage[] = [
  {
    name: 'Basic',
    emoji: '✈️',
    description: 'Flight + Hotel booking',
    price: '$599',
    features: [
      'Flight booking',
      'Hotel recommendations',
      'WhatsApp support',
      'Travel insurance info',
      'Basic itinerary',
    ],
    cta: 'Get Started'
  },
  {
    name: 'Standard',
    emoji: '🌟',
    description: 'Complete trip arrangement',
    price: '$899',
    features: [
      'All from Basic',
      'Visa assistance',
      'Airport transfers',
      'Guided tours',
      'Restaurant bookings',
      ' 24/7 WhatsApp support',
      'Detailed itinerary',
    ],
    cta: 'Most Popular',
    popular: true
  },
  {
    name: 'Premium',
    emoji: '👑',
    description: 'VIP concierge service',
    price: '$1,299',
    features: [
      'All from Standard',
      'Personal travel consultant',
      'Luxury accommodations',
      'Private transfers',
      'VIP experiences',
      'Travel insurance included',
      'Emergency assistance',
      'Post-trip support',
    ],
    cta: 'Go Premium'
  },
]

export default function LovablePackages() {
  return (
    <section className="py-16 md:py-24 bg-gradient-to-b from-slate-50 to-white">
      <div className="container max-w-7xl mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-slate-900 mb-4">
            Choose Your Travel Package
          </h2>
          <p className="text-slate-600 text-lg max-w-3xl mx-auto">
            Simple, transparent pricing. Everything you need, nothing you don&rsquo;t.
          </p>
        </div>

        {/* Pricing Tiers Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8 mb-12">
          {packageTiers.map((tier) => (
            <div
              key={tier.name}
              className={`relative rounded-2xl overflow-hidden transition duration-300 ${
                tier.popular
                  ? 'md:scale-105 border-2 border-emerald-500 shadow-2xl'
                  : 'border border-slate-200 hover:border-slate-300 hover:shadow-lg'
              }`}
            >
              {/* Popular badge */}
              {tier.popular && (
                <div className="absolute top-0 right-0 bg-emerald-500 text-white px-4 py-1 text-sm font-bold rounded-bl-lg">
                  POPULAR
                </div>
              )}

              <div className={`p-8 h-full flex flex-col ${
                tier.popular ? 'bg-gradient-to-br from-emerald-50 to-white' : 'bg-white'
              }`}>
                {/* Icon & Name */}
                <div className="mb-6">
                  <div className="text-5xl mb-3">{tier.emoji}</div>
                  <h3 className="text-3xl font-bold text-slate-900">{tier.name}</h3>
                  <p className="text-slate-600 text-sm mt-1">{tier.description}</p>
                </div>

                {/* Price */}
                <div className="mb-8">
                  <div className="text-5xl font-bold text-slate-900">{tier.price}</div>
                  <p className="text-slate-600 text-sm mt-1">per trip</p>
                </div>

                {/* Features List */}
                <ul className="space-y-3 mb-8 flex-1">
                  {tier.features.map((feature, i) => (
                    <li key={i} className="flex items-start gap-3">
                      <svg className="w-5 h-5 text-emerald-500 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                      <span className="text-slate-700">{feature}</span>
                    </li>
                  ))}
                </ul>

                {/* CTA Button */}
                <Link
                  href={`/book?package=${tier.name.toLowerCase()}`}
                  className={`w-full py-3 rounded-lg font-bold transition duration-200 text-center ${
                    tier.popular
                      ? 'bg-emerald-600 hover:bg-emerald-700 text-white shadow-lg hover:shadow-xl'
                      : 'bg-slate-100 hover:bg-slate-200 text-slate-900'
                  }`}
                >
                  {tier.cta}
                </Link>
              </div>
            </div>
          ))}
        </div>

        {/* Bottom CTA */}
        <div className="bg-gradient-to-r from-blue-600 to-emerald-600 rounded-2xl p-8 md:p-12 text-center text-white">
          <h3 className="text-2xl md:text-3xl font-bold mb-4">Not sure which package is right for you?</h3>
          <p className="text-blue-100 text-lg mb-6 max-w-2xl mx-auto">
            Chat with our travel experts on WhatsApp. They&rsquo;ll help you find the perfect package for your needs.
          </p>
          <Link
            href="/contact"
            className="inline-block bg-white text-emerald-600 hover:bg-slate-100 px-8 py-4 rounded-lg font-bold transition duration-200"
          >
            💬 Chat with Experts
          </Link>
        </div>
      </div>
    </section>
  )
}
