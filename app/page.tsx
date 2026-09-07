import type { Metadata } from 'next'
import { LandingPage } from '@/components/LandingPage'
import { faqs } from '@/lib/faqs'
import { JsonLd, SEO, faqJsonLd, softwareAppJsonLd } from '@/lib/seo'

export const metadata: Metadata = {
  title: { absolute: 'Voice Alchemy Academy · Vocal Training App with Live Pitch Tracking, Online Voice Lessons & 1:1 Mentorship' },
  description:
    'Start free with real-time pitch, scale and rhythm trainers, then add AI coaching feedback, online voice lessons, courses and one-on-one mentorship. For singers, vocal coaches and voice studios.',
  alternates: { canonical: '/' },
  openGraph: {
    url: '/',
    title: 'Voice Alchemy Academy · Vocal training that shows you what your voice is doing',
    description:
      'Start free with live pitch, scale and rhythm trainers. Add AI coaching feedback, online voice lessons, courses and 1:1 mentorship when you want more.',
    images: [{ url: SEO.ogHome, width: 1200, height: 630, alt: 'Voice Alchemy Academy vocal training app' }],
  },
}

export default function HomePage() {
  // FAQ schema uses the singer answers, which are the ones shown by default.
  const faqItems = faqs.filter((f) => f.who !== 'coach').map((f) => ({ q: f.q, a: f.a }))
  return (
    <>
      <JsonLd data={softwareAppJsonLd()} />
      <JsonLd data={faqJsonLd(faqItems)} />
      <LandingPage />
    </>
  )
}
