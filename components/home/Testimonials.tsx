import { Star } from 'lucide-react'

const testimonials = [
  // Local Outbound
  {
    id: 'local-1',
    name: 'A. Haile (Asmara)',
    role: 'Flight to Canada',
    quote: 'Fast replies on WhatsApp. Got my best price without the stress.',
    rating: 5,
    type: 'local'
  },
  {
    id: 'local-2',
    name: 'S. Woldemariam (Addis)',
    role: 'Visa & Flight',
    quote: 'Clear checklist for my US visa. Excellent support from start to finish.',
    rating: 5,
    type: 'local'
  },
  {
    id: 'local-3',
    name: 'M. Tekle (Asmara)',
    role: 'Multiple Destinations',
    quote: 'Best agency I have worked with. Competitive prices, zero confusion.',
    rating: 5,
    type: 'local'
  },
  // Diaspora
  {
    id: 'diaspora-1',
    name: 'K. Gebretsadik (Toronto)',
    role: 'Family Reunion',
    quote: 'Booked flights home with hotel + pickup. Everything was perfect. Highly recommend!',
    rating: 5,
    type: 'diaspora'
  },
  {
    id: 'diaspora-2',
    name: 'N. Abreha (London)',
    role: 'Vacation + Visa',
    quote: 'They handled my multi-city route and visa requirements. Stress-free experience.',
    rating: 5,
    type: 'diaspora'
  },
  {
    id: 'diaspora-3',
    name: 'R. Dagne (San Francisco)',
    role: 'Extended Trip',
    quote: 'First time organizing travel home. Amazing support. Will use again!',
    rating: 5,
    type: 'diaspora'
  }
]

export default function Testimonials() {
  const localTestimonials = testimonials.filter(t => t.type === 'local')
  const diasporaTestimonials = testimonials.filter(t => t.type === 'diaspora')

  const TestimonialCard = ({ item }: { item: typeof testimonials[0] }) => (
    <div className="p-6 rounded-xl bg-white border border-slate-200 hover:border-slate-300 hover:shadow-md transition">
      <div className="flex gap-1 mb-3">
        {Array.from({ length: item.rating }).map((_, i) => (
          <Star key={i} size={16} className="fill-amber-400 text-amber-400" />
        ))}
      </div>
      <p className="text-slate-700 italic mb-4">&quot;{item.quote}&quot;</p>
      <div>
        <p className="font-semibold text-slate-900">{item.name}</p>
        <p className="text-xs text-slate-600">{item.role}</p>
      </div>
    </div>
  )

  return (
    <section className="py-16 bg-white">
      <div className="container">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-slate-900">Trusted by Travelers</h2>
          <p className="mt-2 text-slate-600">
            From local adventurers to diaspora homecomers
          </p>
        </div>

        {/* Local Outbound */}
        <div className="mb-12">
          <h3 className="text-xl font-bold text-slate-900 mb-4">🌍 Local Outbound</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {localTestimonials.map(item => (
              <TestimonialCard key={item.id} item={item} />
            ))}
          </div>
        </div>

        {/* Diaspora */}
        <div>
          <h3 className="text-xl font-bold text-slate-900 mb-4">🏡 Diaspora Returns</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {diasporaTestimonials.map(item => (
              <TestimonialCard key={item.id} item={item} />
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
