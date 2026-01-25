import LovableHero from '@/components/lovable/LovableHero'
import ModernTrustStrip from '@/components/ModernTrustStrip'
import LovableServices from '@/components/lovable/LovableServices'
import LovableDestinations from '@/components/lovable/LovableDestinations'
import LovableTestimonials from '@/components/lovable/LovableTestimonials'
import LovableTrust from '@/components/lovable/LovableTrust'
import LovableFaqPreview from '@/components/lovable/LovableFaqPreview'
import LovableFinalCta from '@/components/lovable/LovableFinalCta'
import { generateOrganizationSchema, generateLocalBusinessSchema } from '@/lib/schema'

export const metadata = {
  title: 'Amanuel Travel — Travel Home & Beyond',
  description: 'Fast flights, visa help, and trusted support for Eritrea/Ethiopia routes. WhatsApp-first service for diaspora & local travelers.'
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
      <LovableTrust />
      <LovableTestimonials />
      <LovableFaqPreview />
      <LovableFinalCta />
    </main>
  )
}
