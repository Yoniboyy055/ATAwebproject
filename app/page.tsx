import Image from 'next/image'
import Link from 'next/link'
import type { Metadata } from 'next'
import PreviewBanner from '@/components/ata/PreviewBanner'
import PublicNav from '@/components/ata/PublicNav'

export const metadata: Metadata = {
  title: 'Amanuel Travel Agency — Travel shaped with care',
  description: 'Explore a controlled preview of ATA’s flagship Eritrea travel experience.',
  robots: { index: false, follow: false },
}

const steps = [
  ['Tell us what you need', 'Share your travel interests and practical needs. A request is not a booking confirmation.'],
  ['ATA reviews it', 'A person checks the details, asks questions when needed and prepares the next step.'],
  ['Receive a considered quote', 'ATA sends a quote for review. A quote is not a booking confirmation.'],
  ['ATA confirms manually', 'Only a final “Manually confirmed” status represents confirmation.'],
]

export default function Home() {
  return <main className="min-h-screen bg-[#f4f1e9] text-[#153638]">
    <PreviewBanner /><PublicNav />
    <section className="relative min-h-[760px] overflow-hidden bg-[#0c3032] text-white">
      <Image src="/images/hero-1200.webp" alt="A view across Asmara" fill priority className="object-cover opacity-55" sizes="100vw" />
      <div className="absolute inset-0 bg-gradient-to-r from-[#09292b] via-[#09292b]/80 to-transparent" />
      <div className="relative mx-auto flex min-h-[760px] max-w-7xl items-end px-5 pb-20 pt-24 lg:px-10 lg:pb-28">
        <div className="max-w-4xl">
          <p className="mb-6 text-xs font-bold uppercase tracking-[.3em] text-[#f0c56f]">Amanuel Travel Agency · Experience preview</p>
          <h1 className="font-serif text-6xl leading-[.9] tracking-[-.045em] sm:text-7xl lg:text-[7.6rem]">From the highlands<br/><em className="font-normal text-[#f0c56f]">toward the Red Sea.</em></h1>
          <p className="mt-8 max-w-2xl text-lg leading-8 text-white/80">A carefully controlled travel experience, shaped by ATA’s human guidance—from first conversation to manual confirmation.</p>
          <div className="mt-10 flex flex-wrap gap-4">
            <Link href="/tours/flagship-preview" className="rounded-full bg-[#f0b44b] px-7 py-4 font-bold text-[#102c2d]">Explore the flagship journey</Link>
            <Link href="/ata-review" className="rounded-full border border-white/35 px-7 py-4 font-bold">Open the ATA review guide</Link>
          </div>
        </div>
      </div>
      <div className="absolute bottom-0 right-0 hidden w-[38%] border-t border-white/20 px-10 py-6 text-xs uppercase tracking-[.22em] text-white/70 lg:block">Highlands → escarpment → coast</div>
    </section>
    <section className="mx-auto grid max-w-7xl gap-12 px-5 py-24 lg:grid-cols-[.8fr_1.2fr] lg:px-10 lg:py-32">
      <div><p className="text-xs font-bold uppercase tracking-[.25em] text-[#a3482e]">ATA’s service model</p><h2 className="mt-5 font-serif text-5xl leading-[1.02]">Travel is personal.<br/>The process should be clear.</h2></div>
      <div className="grid gap-px overflow-hidden rounded-3xl border border-[#153638]/15 bg-[#153638]/15 sm:grid-cols-2">
        {['Human review at every important stage','Prices controlled by ATA','Facts verified before release','Confirmation given manually'].map((x,i)=><div key={x} className="bg-white p-7"><span className="text-xs font-bold text-[#a3482e]">0{i+1}</span><p className="mt-8 font-serif text-2xl">{x}</p></div>)}
      </div>
    </section>
    <section className="bg-[#cbdad3] px-5 py-24 lg:px-10 lg:py-32">
      <div className="mx-auto grid max-w-7xl gap-8 lg:grid-cols-2">
        <div className="relative min-h-[520px] overflow-hidden rounded-[2rem]"><Image src="/images/dest-massawa-800.webp" alt="A coastal view of Massawa" fill className="object-cover" sizes="(max-width:1024px) 100vw,50vw"/></div>
        <div className="flex flex-col justify-center rounded-[2rem] bg-[#0c3032] p-8 text-white lg:p-14"><p className="text-xs font-bold uppercase tracking-[.25em] text-[#f0c56f]">Flagship working experience</p><h2 className="mt-5 font-serif text-5xl leading-none">Asmara, Massawa and the journey between.</h2><p className="mt-7 leading-7 text-white/75">A polished preview built from controlled copy. Operational facts, dates and prices remain deliberately unpublished until ATA supplies and approves them.</p><Link href="/tours/flagship-preview" className="mt-9 w-fit border-b border-[#f0c56f] pb-2 font-bold text-[#f0c56f]">View the tour experience →</Link></div>
      </div>
    </section>
    <section id="how-it-works" className="mx-auto max-w-7xl px-5 py-24 lg:px-10 lg:py-32"><p className="text-xs font-bold uppercase tracking-[.25em] text-[#a3482e]">A request, not instant booking</p><h2 className="mt-5 max-w-3xl font-serif text-5xl">A transparent path from interest to confirmation.</h2><div className="mt-14 grid gap-8 md:grid-cols-2 lg:grid-cols-4">{steps.map(([title,body],i)=><article key={title} className="border-t-2 border-[#153638] pt-5"><p className="text-sm font-bold text-[#a3482e]">Step {i+1}</p><h3 className="mt-5 font-serif text-2xl">{title}</h3><p className="mt-3 text-sm leading-6 text-[#496668]">{body}</p></article>)}</div></section>
    <footer className="bg-[#09292b] px-5 py-14 text-white lg:px-10"><div className="mx-auto flex max-w-7xl flex-col justify-between gap-8 md:flex-row"><div><p className="font-serif text-3xl">Amanuel Travel Agency</p><p className="mt-2 text-sm text-white/60">A controlled digital travel operation—public experience, owner administration and human workflow.</p></div><div className="flex gap-6 text-sm"><Link href="/tours/flagship-preview">Flagship tour</Link><Link href="/ata-review">Review guide</Link><Link href="/ata-admin">Owner preview</Link></div></div></footer>
  </main>
}
