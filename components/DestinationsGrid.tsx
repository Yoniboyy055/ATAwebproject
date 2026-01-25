"use client"
import { useState, useMemo } from 'react'
import Image from 'next/image'
import { destinations as allDestinations } from '../lib/data'
import BentoGrid, { BentoTile } from '@/components/ui/BentoGrid'
import Input from '@/components/ui/Input'
import { buttonClasses } from '@/components/ui/Button'

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
      <div className="flex flex-col gap-4 md:flex-row md:items-end">
        <div className="flex flex-wrap gap-2">
          {(['All','Eritrea','Ethiopia'] as const).map((t)=> (
            <button
              key={t}
              onClick={()=>setTab(t)}
              className={buttonClasses({
                variant: tab === t ? 'primary' : 'secondary',
                size: 'sm',
                className: tab === t ? 'bg-slate-900 hover:bg-slate-900' : ''
              })}
            >
              {t}
            </button>
          ))}
        </div>
        <div className="w-full md:ml-auto md:w-72">
          <Input
            aria-label="Search destinations"
            value={q}
            onChange={(e)=>setQ(e.target.value)}
            placeholder="Search destinations"
          />
        </div>
      </div>

      <BentoGrid className="mt-6">
        {list.map((d, idx)=> (
          <BentoTile key={d.id} featured={idx === 0} className="flex flex-col gap-4">
            <div className="relative h-40 w-full overflow-hidden rounded-lg bg-slate-100">
              {
                (() => {
                  const name = d.imgSmall.split('/').pop() || d.imgSmall
                  const m = name.match(/^(.*?)(?:-\d+)?(?:\.[^.]+)?$/)
                  const base = m ? m[1] : name
                  const blur = blurMap?.[base]
                  return (
                    <Image
                      src={d.imgSmall}
                      alt={`${d.city}, ${d.country}`}
                      fill
                      sizes="(max-width:640px) 100vw, 33vw"
                      className="object-cover"
                      loading="lazy"
                      placeholder={blur ? 'blur' : 'empty'}
                      blurDataURL={blur}
                    />
                  )
                })()
              }
            </div>
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">
                {d.country}
              </p>
              <h3 className="mt-2 text-lg font-semibold text-slate-900">{d.city}</h3>
              <p className="mt-2 text-sm text-slate-600">{d.description}</p>
            </div>
          </BentoTile>
        ))}
      </BentoGrid>
    </div>
  )
}
