import LovableHero from '@/components/lovable/LovableHero'
import LovableServices from '@/components/lovable/LovableServices'
import LovablePackages from '@/components/lovable/LovablePackages'
import LovableDestinations from '@/components/lovable/LovableDestinations'
import LovableTestimonials from '@/components/lovable/LovableTestimonials'
import LovableTrust from '@/components/lovable/LovableTrust'
import LovableFaqPreview from '@/components/lovable/LovableFaqPreview'
import LovableFinalCta from '@/components/lovable/LovableFinalCta'

export const metadata = {
  title: 'Amanuel Travel — Travel Home & Beyond',
  description: 'Fast flights, visa help, and trusted support for Eritrea/Ethiopia routes. WhatsApp-first service for diaspora & local travelers.'
}

export default function Home() {
  return (
    <main>
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
