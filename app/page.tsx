import Image from 'next/image'
import Section from '../components/Section'
import SectionHeading from '../components/SectionHeading'
import Card from '../components/Card'
import QuoteForm from '../components/QuoteForm'
import PackagesSection from '../components/PackagesSection'
import WhoWeServeSection from '../components/WhoWeServeSection'
import HowItWorksSection from '../components/HowItWorksSection'
import TrustProofStrip from '../components/TrustProofStrip'
import { services, destinations, trustBullets, testimonials } from '../lib/data'
import { BRAND } from '../lib/config'
import { getBlurByBase } from '../lib/images'

export const metadata = {
  title: 'Amanuel Travel — Your journey starts before you fly.',
  description: 'Flights, visa help, and travel support — built for Asmara, Eritrea and beyond. WhatsApp-first contact.'
}

export default function Home(){
  return (
    <div>
      {/* HERO */}
      <section className="relative h-[56vh] md:h-[60vh] flex items-center text-white">
        <div className="absolute inset-0 -z-10">
          <Image src="/images/hero.svg" alt="Hero" fill priority sizes="100vw" className="object-cover" />
          <div className="absolute inset-0 bg-gradient-to-b from-black/12 via-transparent to-black/8" />
        </div>
        <div className="container relative z-10">
          <div className="max-w-2xl">
            <h1 className="text-3xl md:text-4xl font-semibold leading-tight">Your journey starts before you fly.</h1>
            <p className="mt-3 text-sm text-white/90">Flights, visa help, and travel support — built for Asmara, Eritrea and beyond.</p>
            <div className="mt-6 flex gap-3">
              <a href="/destinations" className="inline-flex items-center rounded-md bg-accent/90 text-white px-4 py-2">Explore Destinations</a>
              <a href={`https://wa.me/${encodeURIComponent(BRAND.whatsapp)}`} className="inline-flex items-center rounded-md border border-white/30 px-3 py-2">Chat on WhatsApp</a>
            </div>
          </div>
        </div>
      </section>

      {/* SERVICES */}
      <Section>
        <div className="container">
          <SectionHeading>Services</SectionHeading>
          <p className="text-slate-700 max-w-xl">We provide straightforward, diaspora-friendly services focused on speed and clarity.</p>
          <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 gap-4">
            {services.map(s=> <Card key={s.title} title={s.title} description={s.desc} />)}
          </div>
        </div>
      </Section>

      {/* WHO WE SERVE */}
      <WhoWeServeSection />

      {/* DESTINATIONS preview */}
      <Section>
        <div className="container">
          <SectionHeading>Popular Destinations</SectionHeading>
          <p className="text-slate-700 max-w-xl">Fast-loading, simple cards — request a quote directly via WhatsApp.</p>
          <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            {destinations.map(d=> (
              <article key={d.id} className="rounded-lg overflow-hidden bg-white border border-slate-100 card-lift">
                <div className="w-full h-44 relative">
                  {
                    (() => {
                      const name = d.imgSmall.split('/').pop() || d.imgSmall
                      const m = name.match(/^(.*?)(?:-\d+)?(?:\.[^.]+)?$/)
                      const base = m ? m[1] : name
                      // lazy import of blur map on server
                      const blur = getBlurByBase(base)
                      return <Image src={d.imgSmall} alt={`${d.city}, ${d.country}`} fill sizes="(max-width:640px) 100vw, 33vw" className="object-cover" loading="lazy" placeholder={blur ? 'blur' : 'empty'} blurDataURL={blur} />
                    })()
                  }
                </div>
                <div className="p-4">
                  <h3 className="font-semibold">{d.city} <span className="text-sm text-slate-600">— {d.country}</span></h3>
                  <p className="text-sm text-slate-600 mt-2">{d.description}</p>
                  <div className="mt-3">
                    <a className="inline-flex items-center rounded-md bg-accent/90 text-white px-3 py-2 text-sm" href={`https://wa.me/${encodeURIComponent(BRAND.whatsapp)}?text=${encodeURIComponent(`Hi, I'd like a quote for ${d.city}, ${d.country}.`)}`} rel="noopener noreferrer">Request a Quote</a>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </div>
      </Section>

      {/* PACKAGES */}
      <PackagesSection />

      {/* HOW IT WORKS */}
      <HowItWorksSection />

      {/* TRUST & TESTIMONIALS */}
      <Section>
        <div className="container">
          <SectionHeading>Trust & Support</SectionHeading>
          <ul className="list-disc pl-5 text-slate-700">
            {trustBullets.map((t,i)=> <li key={i} className="mb-2">{t}</li>)}
          </ul>
          <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
            {testimonials.map((t,i)=> (
              <blockquote key={i} className="p-4 bg-white border border-slate-100 rounded">
                <p className="text-sm text-slate-700">“{t.text}”</p>
                <div className="mt-2 text-xs text-slate-500">— {t.name}</div>
              </blockquote>
            ))}
          </div>
        </div>
      </Section>
      {/* TRUST PROOF STRIP */}
      <TrustProofStrip />
      {/* CTA BAND */}
      <Section className="bg-slate-50">
        <div className="container">
          <div className="max-w-2xl">
            <SectionHeading>Request a quick quote</SectionHeading>
            {/* Client-side form component handles WhatsApp submission */}
            <QuoteForm className="grid grid-cols-1 md:grid-cols-2 gap-3" />
          </div>
        </div>
      </Section>

    </div>
  )
}
