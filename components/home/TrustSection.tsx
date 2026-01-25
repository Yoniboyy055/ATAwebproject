import Image from 'next/image'

export default function TrustSection() {
  return (
    <section className="py-20 bg-white border-t border-slate-100">
      <div className="container px-4">
        <div className="flex flex-col md:flex-row items-center gap-12">
          <div className="flex-1 w-full">
            <div className="relative h-[400px] w-full rounded-2xl overflow-hidden shadow-xl">
               <Image 
                 src="/images/hero-400.webp" 
                 alt="Amanuel Travel Team" 
                 fill 
                 className="object-cover"
               />
               <div className="absolute inset-0 bg-emerald-900/10" />
            </div>
          </div>
          
          <div className="flex-1">
            <h2 className="text-3xl font-bold text-slate-900 mb-6">
              More Than Just a Booking Engine
            </h2>
            <p className="text-lg text-slate-600 mb-6 leading-relaxed">
              Founded by Amanuel, we understand the unique needs of the Eritrean and Ethiopian diaspora. 
              We don&apos;t just sell tickets; we ensure your journey home is smooth, from visa applications to arrival.
            </p>
            <div className="grid grid-cols-2 gap-6">
              <div>
                <div className="text-3xl font-bold text-emerald-600 mb-1">10+</div>
                <div className="text-sm text-slate-600 font-medium">Years Serving You</div>
              </div>
              <div>
                <div className="text-3xl font-bold text-emerald-600 mb-1">24/7</div>
                <div className="text-sm text-slate-600 font-medium">WhatsApp Support</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
