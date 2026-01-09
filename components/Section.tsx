"use client"
import { useEffect, useRef } from 'react'

export default function Section({children, className='', ...props}:{children:React.ReactNode, className?:string}){
  const ref = useRef<HTMLElement | null>(null)
  useEffect(()=>{
    const el = ref.current
    if(!el) return
    const obs = new IntersectionObserver((entries)=>{
      entries.forEach(en=>{
        if(en.isIntersecting){
          el.setAttribute('data-visible','true')
          obs.unobserve(el)
        }
      })
    },{threshold:0.12})
    obs.observe(el)
    return ()=> obs.disconnect()
  },[])

  return (
    <section ref={ref as any} data-visible="false" className={`section ${className}`} {...props}>{children}</section>
  )
}
