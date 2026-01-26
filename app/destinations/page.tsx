import Section from '../../components/Section'
import SectionHeader from '../../components/ui/SectionHeader'
import DestinationsGrid from '../../components/DestinationsGrid'
import { BLUR_MAP } from '../../lib/images'
import { Metadata } from 'next'
import { BRAND } from '../../lib/config'
import { buttonClasses } from '@/components/ui/Button'

const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://amanueltravel.com'

export const metadata: Metadata = {
  title: 'Destinations — Eritrea, Ethiopia & More',
  description: 'Explore destinations in Eritrea and Ethiopia — discover our curated itineraries and travel options.',
  keywords: ['destinations', 'Eritrea', 'Ethiopia', 'travel', 'cities'],
  openGraph: {
    title: 'Top Travel Destinations',
    description: 'Explore curated cities in Eritrea and Ethiopia with expert travel guides',
    url: `${baseUrl}/destinations`,
    type: 'website',
    images: [
      {
        url: '/images/dest-800.webp',
        width: 1200,
        height: 630,
        alt: 'Travel Destinations',
      }
    ]
  }
}

export default function Destinations(){
  return (
    <div>
      <Section>
        <div className="container">
          <SectionHeader
            title="Destinations"
            subtitle="Browse cities across Eritrea and Ethiopia with calm, guided support."
            align="left"
          />
          <p className="mt-4 max-w-xl text-sm text-slate-600">
            Use filters and search to find the right city. When you are ready,
            talk with a real agent to plan dates and routing.
          </p>
          <div className="mt-6">
            <DestinationsGrid blurMap={BLUR_MAP} />
          </div>
          <div className="mt-10">
            <a
              href={`https://wa.me/${BRAND.whatsappNumber}?text=Hi! I'm part of the diaspora and need help planning a family trip. Can you help me choose a destination?`}
              target="_blank"
              rel="noopener noreferrer"
              className={buttonClasses({ variant: 'primary', size: 'lg' })}
            >
              Talk to an Agent
            </a>
            <p className="mt-2 text-sm text-slate-500">
              Available by WhatsApp, phone, or email.
            </p>
          </div>
        </div>
      </Section>
    </div>
  )
}
