import LovableHero from '@/components/lovable/LovableHero'
import ModernTrustStrip from '@/components/ModernTrustStrip'
import LovableServices from '@/components/lovable/LovableServices'
import LovableDestinations from '@/components/lovable/LovableDestinations'
import LovableTestimonials from '@/components/lovable/LovableTestimonials'
import LovableTrust from '@/components/lovable/LovableTrust'
import LovablePackages from '@/components/lovable/LovablePackages'
import LovableFaqPreview from '@/components/lovable/LovableFaqPreview'
import LovableFinalCta from '@/components/lovable/LovableFinalCta'
import HowItWorksSection from '@/components/HowItWorksSection'
import { generateOrganizationSchema, generateLocalBusinessSchema } from '@/lib/schema'

export const metadata = {
  title: 'Amanuel Travel — Travel Home & Beyond',
  description: 'Flights, visa guidance, and human-led support for Eritrea/Ethiopia routes. Trusted by diaspora and local travelers.'
}

export default function Home() {
  const organizationSchema = generateOrganizationSchema()
  const localBusinessSchema = generateLocalBusinessSchema()

  return (
    <main>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(localBusinessSchema) }}
      />
      <LovableHero />
      <ModernTrustStrip />
      <LovableServices />
      <LovableDestinations />
      <LovablePackages />
      <HowItWorksSection />
      <LovableTrust />
      <LovableTestimonials />
      <LovableFaqPreview />
      <LovableFinalCta />
    </main>
  )
}
