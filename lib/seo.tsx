import { site } from '@/lib/site'

/**
 * Shared SEO constants and JSON-LD builders. Page metadata lives next to each
 * page; this keeps the organization facts and structured data in one place.
 */
export const SEO = {
  siteName: site.name,
  url: site.url,
  logo: `${site.url}/icons/icon-512.png`,
  ogHome: '/og/home.png',
  ogMentorship: '/og/mentorship.png',
  ogTeachers: '/og/teachers.png',
  twitterHandle: undefined as string | undefined,
}

export function organizationJsonLd() {
  return {
    '@context': 'https://schema.org',
    '@type': 'EducationalOrganization',
    '@id': `${site.url}/#organization`,
    name: site.name,
    url: site.url,
    logo: SEO.logo,
    email: site.contactEmail,
    founder: { '@type': 'Person', name: site.founder },
    sameAs: [site.instagram, site.mainSite],
    description:
      'Voice Alchemy Academy is a vocal training app and online voice studio: live pitch, scale and rhythm trainers, AI coaching feedback, online voice lessons, courses and one-on-one mentorship.',
  }
}

export function websiteJsonLd() {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    '@id': `${site.url}/#website`,
    name: site.name,
    url: site.url,
    publisher: { '@id': `${site.url}/#organization` },
    inLanguage: 'en',
  }
}

export function softwareAppJsonLd() {
  return {
    '@context': 'https://schema.org',
    '@type': 'SoftwareApplication',
    name: `${site.name} app`,
    url: site.url,
    applicationCategory: 'EducationalApplication',
    operatingSystem: 'Web, iOS',
    offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD', description: 'Free account with pitch, scale and rhythm trainers. Courses, coaching feedback and mentorship are paid upgrades.' },
    featureList: ['Real-time pitch detection', 'Scale trainer', 'Rhythm trainer', 'AI coaching feedback', 'Online voice lessons', 'Lesson notes', 'Courses'],
    publisher: { '@id': `${site.url}/#organization` },
  }
}

export function faqJsonLd(items: { q: string; a: string }[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: items.map(({ q, a }) => ({
      '@type': 'Question',
      name: q,
      acceptedAnswer: { '@type': 'Answer', text: a },
    })),
  }
}

export function mentorshipCourseJsonLd() {
  return {
    '@context': 'https://schema.org',
    '@type': 'Course',
    name: 'One-on-one voice mentorship with the founder',
    description:
      'A semester-long, one-on-one voice mentorship for adults with Julia, founder of Voice Alchemy Academy: weekly live online voice lessons inside the app, lesson notes, assigned practice and the Voice Mentorship e-workbook.',
    url: `${site.url}/mentorship`,
    provider: { '@id': `${site.url}/#organization` },
    instructor: { '@type': 'Person', name: site.founder, jobTitle: 'Founder & mentor' },
    educationalLevel: 'Beginner to advanced',
    audience: { '@type': 'Audience', audienceType: 'Adult singers' },
    hasCourseInstance: {
      '@type': 'CourseInstance',
      courseMode: 'Online',
      courseWorkload: 'One live lesson per week for a semester',
    },
  }
}

/** Render one JSON-LD block. Safe: the payload is built from constants, not user input. */
export function JsonLd({ data }: { data: object }) {
  return <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }} />
}
