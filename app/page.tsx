import Hero from '@/components/home/Hero'
import TrustSection from '@/components/home/TrustSection'
import PackagesBento from '@/components/home/PackagesBento'
import HowItWorks from '@/components/home/HowItWorks'
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
      
      <Hero />
      <TrustSection />
      <PackagesBento />
      <HowItWorks />
    </main>
  )
}
