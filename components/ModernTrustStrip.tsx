'use client'

export default function ModernTrustStrip() {
  const trustItems = [
    {
      icon: '✈️',
      metric: '10+',
      label: 'Years Experience'
    },
    {
      icon: '👥',
      metric: '50K+',
      label: 'Happy Travelers'
    },
    {
      icon: '💬',
      metric: '<5 min',
      label: 'WhatsApp Response'
    },
    {
      icon: '🌍',
      metric: '6',
      label: 'Continents'
    },
    {
      icon: '⭐',
      metric: '4.9',
      label: 'Avg. Rating'
    }
  ]

  return (
    <section className="py-8 md:py-12 px-4 bg-gradient-to-r from-slate-50 to-slate-100 border-t border-b border-slate-200">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4 md:gap-6">
          {trustItems.map((item, idx) => (
            <div
              key={idx}
              className="flex flex-col items-center justify-center p-3 sm:p-4 rounded-lg bg-white border border-slate-200 hover:border-emerald-300 hover:shadow-md transition duration-300 animate-fade-in-up"
              style={{ animationDelay: `${idx * 50}ms` }}
            >
              <div className="text-2xl sm:text-3xl mb-2">{item.icon}</div>
              <div className="font-bold text-slate-900 text-lg sm:text-xl">{item.metric}</div>
              <div className="text-xs sm:text-sm text-slate-600 text-center">{item.label}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
