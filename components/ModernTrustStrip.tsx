/**
 * Trust Strip - Quick Social Proof
 * 
 * CONSTITUTION RULES:
 * - No excessive animations
 * - Clear, readable metrics
 * - Respects reduced motion
 */

export default function ModernTrustStrip() {
  const trustItems = [
    { metric: '25+', label: 'Years' },
    { metric: '50K+', label: 'Trips' },
    { metric: '<2hr', label: 'Response' },
    { metric: 'Human', label: 'Support' },
  ]

  return (
    <section className="py-6 md:py-8 bg-slate-900 text-white">
      <div className="container max-w-4xl mx-auto px-4">
        <div className="flex flex-wrap items-center justify-center gap-8 md:gap-12">
          {trustItems.map((item, idx) => (
            <div key={idx} className="text-center">
              <div className="font-bold text-xl md:text-2xl">{item.metric}</div>
              <div className="text-xs text-slate-400 uppercase tracking-wide">{item.label}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
