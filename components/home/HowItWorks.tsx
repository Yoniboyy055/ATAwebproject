import { SectionHeader } from '@/components/ui/SectionHeader'

export default function HowItWorks() {
  const steps = [
    {
      num: '01',
      title: 'Choose Your Trip',
      desc: 'Browse our packages or tell us your destination and dates.'
    },
    {
      num: '02',
      title: 'Chat with an Agent',
      desc: 'We discuss options via WhatsApp and handle visa details.'
    },
    {
      num: '03',
      title: 'Travel Stress-Free',
      desc: 'Receive your tickets and itinerary. We support you until you arrive.'
    }
  ]

  return (
    <section className="py-20 bg-white">
      <div className="container px-4">
        <SectionHeader title="How It Works" subtitle="Planning your trip should be as relaxing as the journey itself." />
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative">
          {steps.map((step, idx) => (
            <div key={idx} className="relative p-8 rounded-2xl bg-slate-50 border border-slate-100 hover:border-emerald-200 transition-colors">
              <div className="text-6xl font-bold text-slate-200 mb-4 font-mono">{step.num}</div>
              <h3 className="text-xl font-bold text-slate-900 mb-3">{step.title}</h3>
              <p className="text-slate-600 leading-relaxed">{step.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
