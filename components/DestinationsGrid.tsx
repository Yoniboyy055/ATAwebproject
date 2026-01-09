"use client"
import { useState, useMemo } from 'react'
import Image from 'next/image'
import { destinations as allDestinations } from '../lib/data'
import { BRAND } from '../lib/config'

export default function DestinationsGrid({ blurMap }: { blurMap?: Record<string,string> }){
  const [tab,setTab] = useState<'All'|'Eritrea'|'Ethiopia'>('All')
  const [q,setQ] = useState('')
  const list = useMemo(()=>{
    return allDestinations.filter(d=>{
      if(tab!=='All' && d.region !== tab) return false
      if(q && !(d.city.toLowerCase().includes(q.toLowerCase()) || d.description.toLowerCase().includes(q.toLowerCase()))) return false
      return true
    })
  },[tab,q])

  return (
    <div>
      <div className="flex gap-3 items-center">
        <div className="flex space-x-2">
          {['All','Eritrea','Ethiopia'].map((t: 'All'|'Eritrea'|'Ethiopia')=> (
            <button key={t} onClick={()=>setTab(t)} className={`px-3 py-1 rounded-md ${tab===t? 'bg-primary text-white' : 'border border-slate-200'}`}>{t}</button>
          ))}
        </div>
        <input value={q} onChange={(e)=>setQ(e.target.value)} placeholder="Search destinations" className="input ml-auto" />
      </div>

      <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
        {list.map(d=> (
          <article key={d.id} className="rounded-lg overflow-hidden bg-white border border-slate-100 card-lift">
            <div className="w-full h-44 relative">
              {
                (() => {
                  const name = d.imgSmall.split('/').pop() || d.imgSmall
                  const m = name.match(/^(.*?)(?:-\d+)?(?:\.[^.]+)?$/)
                  const base = m ? m[1] : name
                  const blur = blurMap?.[base]
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
  )
}
