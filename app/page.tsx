import LovableHero from '@/components/lovable/LovableHero'
import LovableServices from '@/components/lovable/LovableServices'
import LovableTrust from '@/components/lovable/LovableTrust'
import LovableFaqPreview from '@/components/lovable/LovableFaqPreview'
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
      <LovableServices />
      <LovableTrust />
      <LovableFaqPreview />
    </main>
  )
}
