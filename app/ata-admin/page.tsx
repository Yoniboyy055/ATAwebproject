import Link from 'next/link'
import { notFound } from 'next/navigation'
import { getAtaFeatureFlags } from '@/lib/ata/feature-flags'
import { createAtaPreviewRepository, PREVIEW_PROVENANCE } from '@/lib/ata/preview-repository'
import PreviewBanner from '@/components/ata/PreviewBanner'

export const metadata = { title:'ATA owner experience preview', robots:{index:false,follow:false} }

const nav = ['Overview','Tours','Content','Pricing','Dates & availability','Customer requests','Quotes','Verification','Approvals','Publication','Media','Policies','Users & roles','Audit history','Settings']
const workflowLabels: Record<string,string> = {
  DRAFT:'Draft',SUBMITTED:'Submitted',UNDER_REVIEW:'Under review',MORE_INFORMATION_REQUIRED:'More information required',QUALIFIED:'Qualified',QUOTE_PREPARATION:'Quote preparation',QUOTE_SENT:'Quote sent',CUSTOMER_RESPONSE_PENDING:'Customer response pending',ACCEPTED_IN_PRINCIPLE:'Accepted in principle',PAYMENT_PENDING:'Payment pending',MANUALLY_CONFIRMED:'Manually confirmed',DECLINED:'Declined',CANCELLED:'Cancelled',CLOSED:'Closed',ARCHIVED:'Archived',
}

export default function AtaAdminPage() {
  if (!getAtaFeatureFlags().stagingAdmin) notFound()
  const repo = createAtaPreviewRepository()
  const summary = repo.getSummary()
  return <main className="min-h-screen bg-[#edf1ec] text-[#17393b]">
    <PreviewBanner />
    <div className="lg:grid lg:grid-cols-[260px_1fr]">
      <aside className="border-r border-white/10 bg-[#0b3032] p-5 text-white lg:sticky lg:top-0 lg:h-screen">
        <div className="flex items-center justify-between"><div><p className="font-serif text-xl">Amanuel Travel</p><p className="mt-1 text-[10px] uppercase tracking-[.22em] text-white/55">Owner administration</p></div><span className="rounded-full bg-[#f0b44b] px-2 py-1 text-[10px] font-bold text-[#17393b]">Preview</span></div>
        <nav className="mt-8 grid max-h-[calc(100vh-150px)] grid-cols-2 gap-1 overflow-auto text-sm lg:grid-cols-1" aria-label="Owner administration">
          {nav.map((item,i)=><a key={item} href={`#${item.toLowerCase().replaceAll(' ','-').replace('&','and')}`} className={`rounded-lg px-3 py-2.5 ${i===0?'bg-white/12 text-[#f3cb7a]':'text-white/70 hover:bg-white/8 hover:text-white'}`}>{item}</a>)}
        </nav>
      </aside>
      <div>
        <header className="flex flex-wrap items-center justify-between gap-4 border-b border-[#17393b]/10 bg-white px-5 py-5 lg:px-9"><div><p className="text-xs font-bold uppercase tracking-[.2em] text-[#a3482e]">ATA Owner · Business authority</p><h1 className="mt-1 font-serif text-3xl">Operations overview</h1></div><div className="flex gap-3"><Link href="/ata-review" className="rounded-full border border-[#17393b]/20 px-4 py-2 text-sm font-bold">Review guide</Link><Link href="/" className="rounded-full bg-[#17393b] px-4 py-2 text-sm font-bold text-white">View website</Link></div></header>
        <div className="mx-auto max-w-[1500px] space-y-8 p-5 lg:p-9">
          <section id="overview"><div className="rounded-2xl border border-amber-300 bg-amber-50 p-4 text-sm"><b>Demonstration workspace.</b> Every number and record on this page is preview data. Nothing here is published or connected to Supabase.</div>
          <div className="mt-5 grid gap-3 sm:grid-cols-2 xl:grid-cols-5">{[
            ['Tours in draft',summary.draftTours],['Missing prices',summary.missingPrices],['Dates not published',summary.unpublishedDates],['Awaiting evidence',summary.awaitingEvidence],['Customer requests',summary.customerRequests],
          ].map(([label,value])=><article key={label} className="rounded-2xl border border-[#17393b]/10 bg-white p-5 shadow-sm"><p className="text-sm text-[#557173]">{label}</p><p className="mt-4 font-serif text-4xl">{value}</p><p className="mt-2 text-[10px] font-bold uppercase tracking-wider text-[#a3482e]">Demo count</p></article>)}</div></section>

          <section id="tours" className="grid gap-6 xl:grid-cols-[1.1fr_.9fr]"><div className="rounded-2xl border border-[#17393b]/10 bg-white p-6"><div className="flex justify-between"><div><p className="text-xs font-bold uppercase tracking-wider text-[#a3482e]">Tour management</p><h2 className="mt-2 font-serif text-3xl">Working tours</h2></div><button className="h-fit rounded-full bg-[#17393b] px-4 py-2 text-sm font-bold text-white">Create tour</button></div><div className="mt-6 space-y-3">{repo.getTours().map(t=><article key={t.id} className="rounded-xl border border-[#17393b]/10 p-4"><div className="flex flex-wrap justify-between gap-3"><div><h3 className="font-bold">{t.title}</h3><p className="mt-1 text-xs text-[#557173]">{t.status} · {t.priceStatus} · {t.dateStatus}</p></div><span className="rounded-full bg-[#e9eee9] px-3 py-1 text-xs font-bold">{t.readiness}% ready</span></div><div className="mt-4 h-1.5 rounded-full bg-[#e4e9e5]"><div className="h-full rounded-full bg-[#d2963c]" style={{width:`${t.readiness}%`}}/></div></article>)}</div></div>
          <div className="rounded-2xl bg-[#17393b] p-6 text-white"><p className="text-xs font-bold uppercase tracking-wider text-[#f3cb7a]">Tour editor · preview</p><h2 className="mt-2 font-serif text-3xl">Highlands to Red Sea</h2><div className="mt-6 grid gap-3 sm:grid-cols-2">{['Summary','Destination sections','Itinerary','Inclusions & exclusions','Accommodation','Transportation','Important information','Images & rights'].map((x,i)=><button key={x} className="rounded-xl border border-white/15 p-3 text-left text-sm hover:border-[#f3cb7a]"><span className="mr-2 text-[#f3cb7a]">{i<3?'●':'○'}</span>{x}</button>)}</div><button className="mt-6 w-full rounded-full bg-[#f0b44b] py-3 font-bold text-[#17393b]">Preview changes</button></div></section>

          <section id="pricing" className="grid gap-6 xl:grid-cols-2"><EditorCard title="Pricing and publication" eyebrow="Controlled commercial information"><div className="grid gap-4 sm:grid-cols-2"><Field label="Pricing status" value="Not provided"/><Field label="Price type" value="Contact ATA"/><Field label="Currency" value="Not selected"/><Field label="Public display" value="Request current pricing"/></div><StateActions /></EditorCard><EditorCard title="Dates and availability" eyebrow="No invented capacity"><div className="grid gap-4 sm:grid-cols-2"><Field label="Departure" value="Not provided"/><Field label="Return" value="Not provided"/><Field label="Availability" value="Registration of interest open"/><Field label="Publication" value="Not published"/></div><StateActions /></EditorCard></section>

          <section id="verification" className="rounded-2xl border border-[#17393b]/10 bg-white p-6"><p className="text-xs font-bold uppercase tracking-wider text-[#a3482e]">Separate control gates</p><h2 className="mt-2 font-serif text-3xl">Evidence → verification → ATA approval → release</h2><div className="mt-7 grid gap-3 md:grid-cols-5">{[['Draft created','Complete'],['Evidence attached','Missing'],['Fact verified','Pending'],['ATA business approval','Locked'],['Public release','Locked']].map(([x,s],i)=><div key={x} className="relative rounded-xl border border-[#17393b]/10 p-4"><span className="text-xs font-bold text-[#a3482e]">0{i+1}</span><h3 className="mt-5 font-bold">{x}</h3><p className="mt-2 text-xs text-[#557173]">{s}</p></div>)}</div><div className="mt-5 rounded-xl bg-[#f6edd9] p-4 text-sm"><b>Approval never publishes automatically.</b> Release is a separate deliberate action available only to ATA publication authority.</div></section>

          <section id="customer-requests" className="grid gap-6 xl:grid-cols-[1fr_1.2fr]"><div className="rounded-2xl border border-[#17393b]/10 bg-white p-6"><p className="text-xs font-bold uppercase tracking-wider text-[#a3482e]">Customer requests</p><h2 className="mt-2 font-serif text-3xl">Operations queue</h2><div className="mt-5 space-y-3">{repo.getRequests().map(r=><article key={r.id} className="rounded-xl border border-[#17393b]/10 p-4"><div className="flex justify-between gap-3"><div><b>{r.guest}</b><p className="mt-1 text-xs text-[#557173]">{r.id} · {r.owner}</p></div><span className="h-fit rounded-full bg-[#e9eee9] px-3 py-1 text-[10px] font-bold">{workflowLabels[r.status]}</span></div></article>)}</div></div>
          <div className="rounded-2xl border border-[#17393b]/10 bg-white p-6"><p className="text-xs font-bold uppercase tracking-wider text-[#a3482e]">Full request lifecycle</p><h2 className="mt-2 font-serif text-3xl">15 controlled states</h2><div className="mt-5 flex flex-wrap gap-2">{repo.getWorkflow().map((s,i)=><span key={s} className={`${s==='MANUALLY_CONFIRMED'?'bg-[#17393b] text-white':'bg-[#edf1ec]'} rounded-full px-3 py-2 text-xs font-bold`}>{i+1}. {workflowLabels[s]}</span>)}</div><p className="mt-5 rounded-xl border-l-4 border-[#a3482e] bg-[#f8eee9] p-4 text-sm"><b>Confirmation restriction:</b> Submitted, quote sent, accepted in principle and payment pending are not confirmations. Only <b>Manually confirmed</b> represents confirmation.</p></div></section>

          <section id="audit-history" className="rounded-2xl border border-[#17393b]/10 bg-white p-6"><p className="text-xs font-bold uppercase tracking-wider text-[#a3482e]">Activity and audit history</p><h2 className="mt-2 font-serif text-3xl">Who changed what—and why</h2><div className="mt-6 overflow-x-auto"><table className="w-full min-w-[720px] text-left text-sm"><thead><tr className="border-b border-[#17393b]/15 text-[#557173]">{['Actor','Action','Entity','Previous','New','Time','Environment'].map(x=><th key={x} className="pb-3 pr-4 font-medium">{x}</th>)}</tr></thead><tbody><tr className="border-b border-[#17393b]/10"><td className="py-4 pr-4 font-bold">ATA Owner</td><td>Approved wording</td><td>Tour summary</td><td>Under review</td><td>Approved, unreleased</td><td>Today 09:14</td><td><span className="rounded-full bg-amber-100 px-2 py-1 text-xs">Preview</span></td></tr></tbody></table></div></section>
          <p className="text-xs text-[#557173]">{PREVIEW_PROVENANCE}</p>
        </div>
      </div>
    </div>
  </main>
}

function EditorCard({title,eyebrow,children}:{title:string;eyebrow:string;children:React.ReactNode}){return <article className="rounded-2xl border border-[#17393b]/10 bg-white p-6"><p className="text-xs font-bold uppercase tracking-wider text-[#a3482e]">{eyebrow}</p><h2 className="mb-6 mt-2 font-serif text-3xl">{title}</h2>{children}</article>}
function Field({label,value}:{label:string;value:string}){return <label className="text-sm font-bold">{label}<span className="mt-2 block rounded-xl border border-[#17393b]/15 bg-[#f8faf7] p-3 font-normal text-[#557173]">{value}</span></label>}
function StateActions(){return <div className="mt-6 flex flex-wrap gap-3"><button className="rounded-full bg-[#17393b] px-4 py-2 text-sm font-bold text-white">Save preview changes</button><button disabled className="rounded-full border border-[#17393b]/20 px-4 py-2 text-sm opacity-50">Publish — approval required</button></div>}
