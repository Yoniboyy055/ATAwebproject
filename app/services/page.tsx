import Section from '../../components/Section'
import SectionHeading from '../../components/SectionHeading'
import Card from '../../components/Card'
import { services } from '../../lib/data'

export const metadata = {
  title: 'Services — Amanuel Travel',
  description: 'Flights, tours, visa assistance and trusted travel support for Canada ↔ Africa.'
}

export default function ServicesPage(){
  return (
    <div>
      <Section>
        <div className="container">
          <h1 className="text-2xl font-semibold">Services</h1>
          <SectionHeading>What we offer</SectionHeading>
          <p className="text-slate-700 max-w-xl">Our core services are designed for low-network, mobile-first travelers and diaspora clients — clear pricing, WhatsApp communication and dependable local partners.</p>
          <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 gap-4">
            {services.map(s=> <Card key={s.title} title={s.title} description={s.desc} />)}
          </div>
        </div>
      </Section>
    </div>
  )
}
