import Link from 'next/link'
import { BentoGrid, BentoTile } from '@/components/ui/BentoGrid'
import { SectionHeader } from '@/components/ui/SectionHeader'

export default function PackagesBento() {
  return (
    <section className="py-20 bg-slate-50">
      <div className="container px-4">
        <SectionHeader 
          title="Curated Travel Experiences" 
          subtitle="Choose the level of support that fits your journey home."
        />
        
        <BentoGrid>
          {/* Featured Tile - Diaspora Homecoming */}
          <BentoTile span={2} className="relative min-h-[400px] group cursor-pointer">
             <Link href="/packages" className="absolute inset-0 z-10" />
             <div className="absolute inset-0 bg-[url('/images/hero-800.webp')] bg-cover bg-center transition-transform duration-700 group-hover:scale-105" />
             <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/40 to-transparent" />
             
             <div className="relative z-20 h-full flex flex-col justify-end p-8 text-white">
               <div className="mb-4">
                 <span className="bg-emerald-600 text-white text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider">Most Popular</span>
               </div>
               <h3 className="text-3xl font-bold mb-2">Diaspora Homecoming</h3>
               <p className="text-white/90 mb-4 text-lg">Reconnect with your roots without the stress. We handle complex multi-city routes and family logistics.</p>
               <div className="flex items-center gap-4 text-sm font-medium text-emerald-300">
                 <span>✓ Eritrea & Ethiopia</span>
                 <span>✓ Full Visa Support</span>
                 <span>✓ 24/7 WhatsApp</span>
               </div>
             </div>
          </BentoTile>

          {/* Secondary Tile - Local Travel */}
          <BentoTile className="bg-white p-8 flex flex-col justify-between h-full border-t-4 border-emerald-500 hover:shadow-lg transition-shadow">
            <div>
              <h3 className="text-xl font-bold text-slate-900 mb-2">Local Explorer</h3>
              <p className="text-slate-600 mb-6">Perfect for locals exploring the region or business travel.</p>
              <ul className="space-y-3 mb-6">
                 <li className="flex items-center gap-2 text-sm text-slate-700">
                   <span className="text-emerald-500">✓</span> Flight Options
                 </li>
                 <li className="flex items-center gap-2 text-sm text-slate-700">
                   <span className="text-emerald-500">✓</span> Date Flexibility
                 </li>
                 <li className="flex items-center gap-2 text-sm text-slate-700">
                   <span className="text-emerald-500">✓</span> Quick Booking
                 </li>
              </ul>
            </div>
            <Link href="/packages" className="text-emerald-600 font-bold hover:text-emerald-700 flex items-center gap-1 group-hover:gap-2 transition-all">
              View Details →
            </Link>
          </BentoTile>

          {/* Third Tile - Family Group */}
          <BentoTile className="bg-slate-900 p-8 flex flex-col justify-between h-full text-white">
             <div>
              <h3 className="text-xl font-bold text-white mb-2">Family & Groups</h3>
              <p className="text-slate-300 mb-6">Coordinated travel for large families and weddings.</p>
              <div className="bg-white/10 rounded-lg p-4 backdrop-blur-sm">
                <p className="text-sm italic text-slate-200">&quot;We coordinate arrivals from different countries so you meet at home together.&quot;</p>
              </div>
            </div>
             <Link href="/packages" className="text-emerald-400 font-bold hover:text-emerald-300 flex items-center gap-1 mt-6">
              Plan Group Trip →
            </Link>
          </BentoTile>
        </BentoGrid>
      </div>
    </section>
  )
}
