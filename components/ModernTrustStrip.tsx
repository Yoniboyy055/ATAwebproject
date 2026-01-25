import GlassCard from '@/components/ui/GlassCard'
import SectionHeader from '@/components/ui/SectionHeader'

export default function ModernTrustStrip() {
  const trustItems = [
    {
      metric: '10+ years',
      label: 'Serving Eritrean and Ethiopian travelers'
    },
    {
      metric: '4.9 average',
      label: 'Rated by returning families and groups'
    },
    {
      metric: '50K+ trips',
      label: 'Coordinated with real agents'
    },
    {
      metric: 'Human-led',
      label: 'Clear guidance from a local team'
    }
  ]

  return (
    <section className="bg-slate-900 py-12">
      <div className="container">
        <SectionHeader
          title="Trusted support, not a platform"
          subtitle="A local team helping families travel home and abroad with clarity."
          tone="light"
          className="mb-10"
        />
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {trustItems.map((item) => (
            <GlassCard key={item.metric} className="p-5 text-white">
              <p className="text-xl font-semibold">{item.metric}</p>
              <p className="mt-2 text-sm text-white/70">{item.label}</p>
            </GlassCard>
          ))}
        </div>
      </div>
    </section>
  )
}
