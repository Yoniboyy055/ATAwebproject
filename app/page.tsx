import LovableHero from '@/components/lovable/LovableHero'
import LovableServices from '@/components/lovable/LovableServices'
import LovablePackages from '@/components/lovable/LovablePackages'
import LovableDestinations from '@/components/lovable/LovableDestinations'
import LovableTestimonials from '@/components/lovable/LovableTestimonials'
import LovableTrust from '@/components/lovable/LovableTrust'
import LovableFaqPreview from '@/components/lovable/LovableFaqPreview'
import LovableFinalCta from '@/components/lovable/LovableFinalCta'
import StructuredData from '@/components/StructuredData'
import { generateOrganizationSchema, generateLocalBusinessSchema } from '@/lib/schema'

export const metadata = {
  title: 'Amanuel Travel — Travel Home & Beyond',
  description: 'Fast flights, visa help, and trusted support for Eritrea/Ethiopia routes. WhatsApp-first service for diaspora & local travelers.'
}

export default function Home() {
  const schemas = [generateOrganizationSchema(), generateLocalBusinessSchema()]

  return (
    <main>
      <StructuredData data={schemas} />
      <LovableHero />
      <LovableServices />
      <LovablePackages />
      <LovableDestinations />
      <LovableTrust />
      <LovableTestimonials />
      <LovableFaqPreview />
      <LovableFinalCta />
    </main>
  )
}
