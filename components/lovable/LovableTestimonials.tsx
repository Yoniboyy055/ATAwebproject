import SectionHeader from '@/components/ui/SectionHeader'

const testimonials = [
  {
    id: 1,
    name: 'Abeba Tekle',
    location: 'Toronto, Canada',
    rating: 5,
    quote: 'Amanuel made my trip back home unforgettable. Professional, reliable, and genuinely cares about their clients. Highly recommended!',
  },
  {
    id: 2,
    name: 'Yohannes Asmerom',
    location: 'USA',
    rating: 5,
    quote: 'From visa assistance to hotel bookings, everything was handled smoothly. Best travel agency for Eritreans abroad.',
  },
  {
    id: 3,
    name: 'Rahel Habte',
    location: 'Europe',
    rating: 5,
    quote: 'Family reunion trip organized perfectly. The team understood what we needed and executed flawlessly. Thank you!',
  },
]

export default function LovableTestimonials() {
  return (
    <section className="bg-white py-16 md:py-24">
      <div className="container max-w-6xl mx-auto px-4">
        <SectionHeader
          title="Trusted by families who travel home"
          subtitle="Real experiences from travelers who wanted calm, clear guidance."
          className="mb-12"
        />

        {/* Testimonial Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {testimonials.map((testimonial) => (
            <div
              key={testimonial.id}
              className="rounded-2xl border border-slate-200 bg-white p-6 shadow-soft-sm"
            >
              {/* Stars */}
              <div className="flex gap-1 mb-4">
                {[...Array(testimonial.rating)].map((_, i) => (
                  <span key={i} className="text-yellow-400">⭐</span>
                ))}
              </div>

              {/* Quote */}
              <p className="text-slate-700 mb-6 leading-relaxed">
                &ldquo;{testimonial.quote}&rdquo;
              </p>

              {/* Author */}
              <div className="flex items-center gap-4 pt-6 border-t border-slate-200">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-slate-100 text-sm font-semibold text-slate-700">
                  {testimonial.name
                    .split(' ')
                    .map((part) => part[0])
                    .join('')
                    .slice(0, 2)}
                </div>
                <div>
                  <p className="font-bold text-slate-900">{testimonial.name}</p>
                  <p className="text-sm text-slate-600">{testimonial.location}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
