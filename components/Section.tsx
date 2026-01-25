"use client"

export default function Section({children, className='', ...props}:{children:React.ReactNode, className?:string}){
  return (
    <section className={`section ${className}`} {...props}>{children}</section>
  )
}
