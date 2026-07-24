import { notFound } from 'next/navigation'
import { getAtaFeatureFlags } from '@/lib/ata/feature-flags'

const queues = [
  ['Owner decisions','13 awaiting ATA/YK approval'],
  ['Content intake','No public facts approved'],
  ['Request operations','Test records only'],
  ['Migration','Proposal only — not applied'],
]

export const metadata = { title:'ATA staging review console', robots:{index:false,follow:false} }

export default function AtaAdminFoundationPage() {
  if (!getAtaFeatureFlags().stagingAdmin) notFound()
  return <main className="min-h-screen bg-[#edf3f1] text-[#123b3a]">
    <header className="border-b border-[#123b3a]/20 bg-[#123b3a] px-6 py-5 text-white">
      <div className="mx-auto flex max-w-6xl items-center justify-between">
        <div><p className="font-mono text-xs uppercase tracking-[.22em] text-[#a9d7cc]">ATA / staging ledger</p>
        <h1 className="mt-1 text-2xl font-semibold">Verification review console</h1></div>
        <span className="border border-[#a9d7cc] px-3 py-1 font-mono text-xs uppercase">Non-production</span>
      </div>
    </header>
    <section className="mx-auto grid max-w-6xl gap-8 px-6 py-10 lg:grid-cols-[1fr_2fr]">
      <aside className="border-l-4 border-[#d69b67] bg-white p-6 shadow-sm">
        <p className="font-mono text-xs uppercase tracking-widest text-[#52706c]">Control boundary</p>
        <h2 className="mt-3 text-3xl font-semibold leading-tight">Nothing is public merely because it was submitted.</h2>
        <p className="mt-4 text-sm leading-6 text-[#45615e]">Identity, role assignment, verification and publication approval are separate controls. Production access remains disabled.</p>
      </aside>
      <div className="grid gap-4 sm:grid-cols-2">
        {queues.map(([title,note])=><article key={title} className="border border-[#123b3a]/15 bg-white p-5 shadow-sm">
          <div className="mb-8 h-1 w-12 bg-[#d69b67]" /><h2 className="text-lg font-semibold">{title}</h2>
          <p className="mt-2 text-sm text-[#52706c]">{note}</p><button disabled className="mt-6 border border-[#123b3a]/20 px-3 py-2 text-xs uppercase tracking-wider opacity-50">Awaiting identity setup</button>
        </article>)}
      </div>
    </section>
  </main>
}
