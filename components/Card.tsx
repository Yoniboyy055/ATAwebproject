import Image from 'next/image'
import { getBlurForSrc } from '../lib/images'

type CardProps = {
  title: string
  description?: string
  img?: string
  href?: string
}

export default function Card({title,description,img,href}: CardProps){
  const blur = img ? getBlurForSrc(img) : undefined
  return (
    <article className="rounded-lg border border-slate-100 p-4 bg-white">
      {img && <div className="rounded-md overflow-hidden mb-3" style={{height:120}}>
        <Image src={img} alt={title} width={420} height={120} className="object-cover w-full h-full" placeholder={blur ? 'blur' : 'empty'} blurDataURL={blur} />
      </div>}
      <h3 className="font-semibold">{title}</h3>
      {description && <p className="text-sm text-slate-600 mt-1">{description}</p>}
      {href && <a className="mt-3 inline-block text-sm text-primary" href={href}>Learn more →</a>}
    </article>
  )
}
