import type { Metadata, Viewport } from 'next'
import { Inter, Cormorant_Garamond } from 'next/font/google'
import './globals.css'
import { site } from '@/lib/site'
import { SEO, JsonLd, organizationJsonLd, websiteJsonLd } from '@/lib/seo'

const inter = Inter({
  variable: '--font-inter',
  subsets: ['latin'],
  display: 'swap',
})

const cormorant = Cormorant_Garamond({
  variable: '--font-cormorant',
  subsets: ['latin'],
  weight: ['300', '400', '500', '600', '700'],
  style: ['normal', 'italic'],
  display: 'swap',
})

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  applicationName: site.name,
  title: {
    default: 'Voice Alchemy Academy · Vocal Training App, Online Voice Lessons & 1:1 Mentorship',
    template: '%s · Voice Alchemy Academy',
  },
  description:
    'A vocal training app for singers, vocal coaches and voice teachers: live pitch, scale and rhythm trainers, AI coaching feedback, online voice lessons, lesson notes, courses and one-on-one mentorship with the founder.',
  keywords: [
    'singing app',
    'vocal training app',
    'pitch trainer',
    'real-time pitch detection',
    'scale trainer',
    'rhythm trainer',
    'AI vocal coach',
    'online voice lessons',
    'singing lessons online',
    'voice mentorship',
    'vocal coach software',
    'voice teacher software',
    'Voice Alchemy Academy',
  ],
  authors: [{ name: site.name, url: site.url }],
  creator: site.name,
  publisher: site.name,
  category: 'education',
  alternates: { canonical: '/' },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true, 'max-image-preview': 'large', 'max-snippet': -1, 'max-video-preview': -1 },
  },
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: site.url,
    siteName: site.name,
    title: 'Voice Alchemy Academy · Vocal training that shows you what your voice is doing',
    description:
      'Live pitch, scale and rhythm trainers, AI coaching feedback, online voice lessons and 1:1 mentorship in one vocal training app.',
    images: [{ url: SEO.ogHome, width: 1200, height: 630, alt: 'Voice Alchemy Academy' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Voice Alchemy Academy · Vocal training that shows you what your voice is doing',
    description: site.tagline,
    images: [SEO.ogHome],
  },
  formatDetection: { email: false, address: false, telephone: false },
  appleWebApp: { capable: true, title: site.name, statusBarStyle: 'black-translucent' },
  // Icons: app/favicon.ico, app/icon.png and app/apple-icon.png are picked up by Next automatically.
}

export const viewport: Viewport = {
  themeColor: '#0b0817',
  width: 'device-width',
  initialScale: 1,
}

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className="dark">
      <body className={`${inter.variable} ${cormorant.variable} font-sans`}>
        <JsonLd data={organizationJsonLd()} />
        <JsonLd data={websiteJsonLd()} />
        {children}
      </body>
    </html>
  )
}
