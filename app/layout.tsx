import '../styles/globals.css'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import { QuoteProvider } from '../components/QuoteProvider'
import { LangProvider } from '../components/LangProvider'
import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Amanuel Travel Agency',
  description: 'Premium, reliable travel services — flights, tours and visa help for Canada ↔ Africa routes. Chat with us on WhatsApp.',
  openGraph: {
    title: 'Amanuel Travel Agency',
    description: 'Trusted travel bookings and visa assistance for Canada ↔ Africa',    images: [{ url: '/images/hero.svg', width: 1200, height: 630 }]  }
}

export default function RootLayout({children}:{children:React.ReactNode}){
  return (
    <html lang="en">
      <head>
        <link rel="icon" href="/favicon.svg" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </head>
      <body>
        <LangProvider>
          <QuoteProvider>
            <Navbar />
            <main>{children}</main>
            <Footer />
          </QuoteProvider>
        </LangProvider>
      </body>
    </html>
  )
}
