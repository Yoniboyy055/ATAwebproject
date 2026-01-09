import Section from '../../components/Section'
import SectionHeading from '../../components/SectionHeading'
import DestinationsGrid from '../../components/DestinationsGrid'
import { BLUR_MAP } from '../../lib/images'

export const metadata = {
  title: 'Destinations — Amanuel Travel',
  description: 'Explore destinations in Eritrea and Ethiopia — discover our curated itineraries.'
}

export default function Destinations(){
  return (
    <div>
      <Section>
        <div className="container">
          <h1 className="text-2xl font-semibold">Destinations</h1>
          <SectionHeading>Explore our cities</SectionHeading>
          <p className="text-slate-700 max-w-xl">Browse our focused list of cities across Eritrea and Ethiopia. Use filters and search to find the right city, then request a quote via WhatsApp.</p>
          <div className="mt-6">
            <DestinationsGrid blurMap={BLUR_MAP} />
          </div>
        </div>
      </Section>
    </div>
  )
}
