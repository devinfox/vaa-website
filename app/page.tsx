import type { Metadata } from 'next'
import { LandingPage } from '@/components/LandingPage'
import { faqs } from '@/lib/faqs'
import { JsonLd, SEO, faqJsonLd, softwareAppJsonLd } from '@/lib/seo'

const COACH_OG = {
  title: 'Voice Alchemy Academy for vocal coaches · See what your students practiced before the lesson',
  description:
    'Student practice data before each lesson, live online lessons with automatic notes, homework recordings, scheduling and a course builder. Book a platform demo built around your studio.',
}

/**
 * The homepage has a coach view at /?view=teacher. Link previews are fetched
 * for the exact URL, so that view gets its own title, description and image.
 */
export async function generateMetadata({ searchParams }: { searchParams: Promise<{ view?: string }> }): Promise<Metadata> {
  const { view } = await searchParams
  if (view === 'teacher') {
    return {
      title: { absolute: COACH_OG.title },
      description: COACH_OG.description,
      alternates: { canonical: '/?view=teacher' },
      openGraph: {
        url: '/?view=teacher',
        title: COACH_OG.title,
        description: COACH_OG.description,
        images: [{ url: SEO.ogTeachers, width: 1200, height: 630, alt: 'Voice Alchemy Academy for vocal coaches and studios' }],
      },
      twitter: { card: 'summary_large_image', title: COACH_OG.title, description: COACH_OG.description, images: [SEO.ogTeachers] },
    }
  }
  return {
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
