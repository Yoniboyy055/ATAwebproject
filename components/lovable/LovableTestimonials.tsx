const testimonials = [
  {
    id: 1,
    name: 'Abeba Tekle',
    location: 'Toronto, Canada',
    avatar: '👩',
    rating: 5,
    quote: 'Amanuel made my trip back home unforgettable. Professional, reliable, and genuinely cares about their clients. Highly recommended!',
  },
  {
    id: 2,
    name: 'Yohannes Asmerom',
    location: 'USA',
    avatar: '👨',
    rating: 5,
    quote: 'From visa assistance to hotel bookings, everything was handled smoothly. Best travel agency for Eritreans abroad.',
  },
  {
    id: 3,
    name: 'Rahel Habte',
    location: 'Europe',
    avatar: '👩‍🦰',
    rating: 5,
    quote: 'Family reunion trip organized perfectly. The team understood what we needed and executed flawlessly. Thank you!',
  },
]

export default function LovableTestimonials() {
  return (
    <section className="py-16 md:py-24 bg-gradient-to-b from-white to-slate-50">
      <div className="container max-w-6xl mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-3">
            Loved by Our Clients
          </h2>
          <p className="text-slate-600 text-lg max-w-2xl mx-auto">
            Real experiences from travelers who trusted us with their journeys
          </p>
        </div>

        {/* Testimonial Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {testimonials.map(testimonial => (
            <div
              key={testimonial.id}
              className="rounded-xl border border-slate-200 bg-white p-8 hover:shadow-lg hover:border-emerald-300 transition duration-300"
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
                <div className="text-4xl">{testimonial.avatar}</div>
                <div>
                  <p className="font-bold text-slate-900">{testimonial.name}</p>
                  <p className="text-sm text-slate-600">{testimonial.location}</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Social Proof */}
        <div className="mt-16 bg-emerald-50 rounded-2xl p-8 md:p-12 border border-emerald-200">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            <div>
              <div className="text-3xl font-bold text-emerald-600 mb-2">4.9⭐</div>
              <p className="text-sm text-slate-600">Average Rating</p>
            </div>
            <div>
              <div className="text-3xl font-bold text-emerald-600 mb-2">500+</div>
              <p className="text-sm text-slate-600">Reviews</p>
            </div>
            <div>
              <div className="text-3xl font-bold text-emerald-600 mb-2">98%</div>
              <p className="text-sm text-slate-600">Return Clients</p>
            </div>
            <div>
              <div className="text-3xl font-bold text-emerald-600 mb-2">24/7</div>
              <p className="text-sm text-slate-600">Support</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
