import '../styles/globals.css'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import GoogleAnalytics from '../components/GoogleAnalytics'
import { LangProvider } from '../components/LangProvider'
import { AuthProvider } from '../components/AuthProvider'
import { Metadata, Viewport } from 'next'

const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://amanueltravel.com'

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
}

export const metadata: Metadata = {
  metadataBase: new URL(baseUrl),
  title: {
    default: 'Amanuel Travel Agency - Flights & Visa Services',
    template: '%s — Amanuel Travel Agency'
  },
  description: 'Premium, reliable travel services — flights, tours and visa help for Canada ↔ Africa routes. Talk with a real agent.',
  keywords: [
    'travel agency',
    'flight booking',
    'visa assistance',
    'Canada to Africa',
    'Eritrea',
    'Ethiopia',
    'travel services',
    'tour packages',
    'diaspora travel'
  ],
  authors: [{ name: 'Amanuel Travel Agency', url: baseUrl }],
  creator: 'Amanuel Travel Agency',
  publisher: 'Amanuel Travel Agency',
  formatDetection: {
    email: true,
    telephone: true,
    address: true,
  },
  openGraph: {
    type: 'website',
    locale: 'en_US',
    alternateLocale: ['ti_ER', 'am_ET'],
    url: baseUrl,
    siteName: 'Amanuel Travel Agency',
    title: 'Amanuel Travel Agency - Flights & Visa Services',
    description: 'Trusted travel bookings and visa assistance for Canada ↔ Africa routes',
    images: [
      {
        url: '/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'Amanuel Travel Agency',
        type: 'image/jpeg',
      }
    ]
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Amanuel Travel Agency',
    description: 'Flights, visa assistance & tour packages for Africa routes',
    images: ['/og-image.jpg'],
  },
  icons: {
    icon: '/favicon.svg',
    apple: '/favicon.svg',
  },
  manifest: '/site.webmanifest',
  robots: {
    index: true,
    follow: true,
    'max-image-preview': 'large',
    'max-snippet': -1,
    'max-video-preview': -1,
    googleBot: {
      index: true,
      follow: true,
      'max-image-preview': 'large',
      'max-snippet': -1,
      'max-video-preview': -1,
    },
  },
  alternates: {
    canonical: baseUrl,
    languages: {
      en: `${baseUrl}/en`,
      ti: `${baseUrl}/ti`,
      am: `${baseUrl}/am`,
    }
  }
}

export default function RootLayout({children}:{children:React.ReactNode}){
  return (
    <html lang="en">
      <head>
        <link rel="icon" href="/favicon.svg" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </head>
      <body>
        <AuthProvider>
          <LangProvider>
            <GoogleAnalytics />
            <Navbar />
            <main>{children}</main>
            <Footer />
          </LangProvider>
        </AuthProvider>
      </body>
    </html>
  )
}
