import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import FlagshipRequestForm from '@/components/ata/FlagshipRequestForm'
import { flagshipPreview } from '@/lib/ata/flagship-preview'
import { getAtaFeatureFlags } from '@/lib/ata/feature-flags'

export const metadata: Metadata = {
  title: 'ATA Flagship Foundation Preview',
  description: 'A non-production technical preview with no verified commercial tour facts.',
  robots: { index: false, follow: false },
}

export default function FlagshipPreviewPage() {
  if (!getAtaFeatureFlags().flagshipPreview) notFound()

  return (
    <main className="min-h-screen bg-[#f3efe4] text-[#102f30]">
      <section className="relative overflow-hidden border-b border-[#102f30]/15">
        <div className="absolute inset-y-0 right-0 hidden w-[38%] bg-[#0b3b3c] lg:block" />
        <div className="relative mx-auto grid max-w-7xl gap-10 px-5 py-16 sm:px-8 md:py-24 lg:grid-cols-[1.35fr_.65fr] lg:px-12">
          <div>
            <p className="font-mono text-xs font-bold uppercase tracking-[0.24em] text-[#a43f2c]">
              Non-production foundation · Draft
            </p>
            <h1 className="mt-8 max-w-4xl text-5xl font-black leading-[0.92] tracking-[-0.055em] sm:text-7xl lg:text-8xl">
              One tour.
              <br />
              Facts first.
              <br />
              Requests only.
            </h1>
            <p className="mt-8 max-w-2xl text-lg leading-8 text-[#315253]">
              This skeleton proves the customer journey and verification rules.
              It does not publish a price, date, itinerary, seat, testimonial,
              supplier, policy, or booking promise.
            </p>
          </div>

          <aside className="relative z-10 self-end rounded-[2rem] bg-[#f8f5ec] p-7 shadow-2xl shadow-black/10 lg:translate-y-16">
            <p className="font-mono text-xs uppercase tracking-[0.2em] text-[#a43f2c]">
              Working candidate
            </p>
            <h2 className="mt-4 text-3xl font-black leading-tight">
              {flagshipPreview.workingTitle}
            </h2>
            <dl className="mt-8 space-y-4 border-t border-[#102f30]/15 pt-5 text-sm">
              <div className="flex justify-between gap-6">
                <dt>Publication</dt><dd className="font-bold">Draft</dd>
              </div>
              <div className="flex justify-between gap-6">
                <dt>Commercial facts</dt><dd className="font-bold">Hidden</dd>
              </div>
              <div className="flex justify-between gap-6">
                <dt>Payments</dt><dd className="font-bold">Disabled</dd>
              </div>
              <div className="flex justify-between gap-6">
                <dt>Request service</dt><dd className="font-bold">Test only</dd>
              </div>
            </dl>
          </aside>
        </div>
      </section>

      <section className="mx-auto grid max-w-7xl gap-10 px-5 py-16 sm:px-8 lg:grid-cols-[.8fr_1.2fr] lg:px-12 lg:py-28">
        <div>
          <p className="font-mono text-xs font-bold uppercase tracking-[0.22em] text-[#a43f2c]">
            Verification ledger
          </p>
          <h2 className="mt-5 text-4xl font-black tracking-[-0.04em]">
            Empty by design.
          </h2>
          <p className="mt-5 max-w-lg leading-7 text-[#315253]">
            A field becomes public only when it has a value, publication approval,
            and source evidence. Missing evidence produces no placeholder claim.
          </p>
          <div className="mt-10 space-y-3">
            {['Dates', 'Duration', 'Price', 'Availability', 'Itinerary', 'Inclusions', 'Policies'].map((item) => (
              <div key={item} className="flex items-center justify-between border-b border-[#102f30]/15 py-3">
                <span className="font-semibold">{item}</span>
                <span className="rounded-full bg-[#d8d0bd] px-3 py-1 font-mono text-[10px] font-bold uppercase tracking-wider">
                  Awaiting approval
                </span>
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-[2rem] bg-white p-6 shadow-xl shadow-[#102f30]/10 sm:p-10">
          <p className="font-mono text-xs font-bold uppercase tracking-[0.2em] text-[#a43f2c]">
            Test-only workflow
          </p>
          <h2 className="mt-4 text-3xl font-black tracking-[-0.035em]">
            Ask ATA to review a request
          </h2>
          <p className="mb-8 mt-3 text-sm leading-6 text-slate-600">
            This preview stores nothing and sends no email, SMS, payment, receipt,
            or production notification.
          </p>
          <FlagshipRequestForm />
        </div>
      </section>
    </main>
  )
}

