import type { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'
import { ArrowRight, BookOpen, Compass, Heart, Layers, Mic2, ShieldCheck, Sparkles, Users } from 'lucide-react'
import { PageShell } from '@/components/PageShell'
import { MentorshipForm } from '@/components/MentorshipForm'
import { Browser } from '@/components/DeviceFrames'
import { site } from '@/lib/site'
import { JsonLd, SEO, mentorshipCourseJsonLd } from '@/lib/seo'

export const metadata: Metadata = {
  title: 'One-on-One Voice Mentorship with the Founder',
  description:
    'A semester-long, one-on-one voice mentorship for adults with Julia, founder of Voice Alchemy Academy. Weekly live online voice lessons inside the app, lesson notes, assigned practice and the Voice Mentorship e-workbook. All genres and levels, limited seats.',
  keywords: [
    'voice mentorship',
    'one-on-one singing lessons',
    'private voice lessons online',
    'vocal coach for adults',
    'singing mentor',
    'semester voice program',
    'Voice Alchemy Academy mentorship',
  ],
  alternates: { canonical: '/mentorship' },
  openGraph: {
    type: 'website',
    url: '/mentorship',
    title: 'One-on-one voice mentorship with Julia · Voice Alchemy Academy',
    description:
      'A semester of weekly live lessons inside the app, with your practice data on screen. Adults, all genres and levels. Limited seats each semester.',
    images: [{ url: SEO.ogMentorship, width: 1200, height: 630, alt: 'Julia, founder of Voice Alchemy Academy' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'One-on-one voice mentorship with Julia · Voice Alchemy Academy',
    description: 'A semester of weekly live voice lessons inside the app. Adults, all genres and levels. Limited seats.',
    images: [SEO.ogMentorship],
  },
}

const elements = [
  { icon: Compass, t: 'A voice that feels like yours', d: 'Work on your sound, instincts and musical choices so your singing feels less forced and more honest.' },
  { icon: ShieldCheck, t: 'Safety and structure', d: 'Explore your voice inside a clear, supportive process, with room for both discipline and creative risk.' },
  { icon: Heart, t: 'Sensitive guidance', d: 'Get personal feedback from a mentor who listens closely to your voice, your goals and the way you learn.' },
  { icon: BookOpen, t: 'Rooted vocal training', d: 'Build technique through warm-ups, breath, tone, musicality and traditions that have shaped real singers.' },
  { icon: Layers, t: 'Whole-artist development', d: 'Work on more than notes: stage presence, storytelling, lyrics, confidence and how you want to be heard.' },
  { icon: Users, t: 'All genres and levels', d: 'Come as you are, whether you are new to singing, returning to it or already performing.' },
  { icon: Sparkles, t: 'App-supported practice', d: 'Use live pitch tracking, lesson notes and assigned vocal exercises between your one-on-one lessons.' },
]

const expect = [
  'A full semester of one-on-one singing lessons and voice mentorship',
  'The Voice Mentorship e-workbook with philosophy, tools, warm-ups, exercises and space for your own notes',
  'Practice with technology, instruments or both as you build stronger vocal technique',
  'An optional final performance opportunity with the rest of your cohort',
]

const curriculum = ['Framework', 'Theory', 'Breathing', 'Posture', 'Warm-ups', 'Lyrics', 'Presentation', 'Tone', 'Storytelling']

export default function MentorshipPage() {
  return (
    <>
      <JsonLd data={mentorshipCourseJsonLd()} />
      <PageShell>
      {/* Hero */}
      <section className="relative overflow-hidden pt-32 pb-24 sm:pb-32 lg:pt-48">
        <div className="pointer-events-none absolute left-1/2 top-24 -z-10 h-[520px] w-[900px] -translate-x-1/2 rounded-full bg-gold/15 blur-[140px] animate-glow" />
        <div className="pointer-events-none absolute right-[-10%] top-[45%] -z-10 h-[420px] w-[420px] rounded-full bg-violet/15 blur-[120px]" />
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid items-center gap-12 lg:grid-cols-12">
            <div className="lg:col-span-6">
              <div className="eyebrow rise rise-1">
                <span className="h-1.5 w-1.5 rounded-full bg-gold" />
                Private mentorship · with the founder
              </div>
              <h1 className="rise rise-2 mt-6 font-display text-5xl font-medium leading-[1.02] tracking-tight text-white sm:text-6xl lg:text-7xl">
                Where your voice has room to <span className="text-gold-gradient">grow honestly</span>.
              </h1>
              <p className="rise rise-3 mt-6 max-w-xl text-base leading-relaxed text-white/70 sm:text-lg">
                A semester-long, one-on-one voice mentorship for adults with {site.founder}, founder of Voice Alchemy Academy.
                You&apos;ll work on vocal technique, musical expression, confidence and artistry, with the app supporting
                your practice between lessons.
              </p>
              <div className="rise rise-4 mt-8 flex flex-col gap-3 sm:flex-row">
                <a href="#apply" data-cta="mentorship-hero-apply" className="btn btn-gold">
                  <Mic2 className="h-4 w-4" />
                  Start your Voice Application
                  <ArrowRight className="h-4 w-4" />
                </a>
                <Link href="/?view=student" className="btn btn-ghost">
                  See the app first
                </Link>
              </div>
              <p className="rise rise-4 mt-4 text-xs text-white/45">Semester-based · Adults · All genres, levels and end goals · Limited seats</p>
            </div>

            <div className="lg:col-span-6">
              <div className="relative">
                <div className="pointer-events-none absolute -inset-6 -z-10 rounded-[2.5rem] bg-gold/10 blur-3xl" />
                <figure className="glass-gold overflow-hidden rounded-[2rem] p-2">
                  <div className="relative aspect-[3/2] overflow-hidden rounded-[1.6rem]">
                    <Image src="/images/photos/mentorship-call.jpg" alt={`A singer in a live online lesson with ${site.founder} on screen`} fill priority sizes="(min-width: 1024px) 50vw, 100vw" className="object-cover object-left" />
                  </div>
                  <figcaption className="flex items-center gap-3 p-4">
                    <div className="relative h-10 w-10 overflow-hidden rounded-full ring-2 ring-gold/60">
                      <Image src="/images/photos/julia-founder-square.webp" alt={site.founder} fill sizes="40px" className="object-cover" />
                    </div>
                    <div>
                      <div className="text-sm font-semibold text-white">{site.founder}, founder &amp; mentor</div>
                      <div className="text-xs text-white/55">Live one-on-one lessons, inside the Voice Alchemy app</div>
                    </div>
                  </figcaption>
                </figure>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Hello letter */}
      <section className="relative py-24 sm:py-32">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
          <div className="glass rounded-[2rem] p-8 sm:p-12">
            <div className="font-display text-4xl font-medium text-gold-gradient sm:text-5xl">Hello!</div>
            <p className="mt-6 text-lg leading-relaxed text-white/80 sm:text-xl">
              Welcome to Voice Alchemy Academy. This semester-long mentorship is for adults who want a more personal way
              to study voice: real one-on-one singing lessons, thoughtful artistic guidance and clear practice between
              sessions. We&apos;ll work on the parts of singing that matter most to you, from technique and tone to confidence,
              storytelling and performance.
            </p>
          </div>
        </div>
      </section>

      {/* Seven elements */}
      <section className="relative py-24 sm:py-32">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-3xl text-center">
            <div className="eyebrow">
              <span className="h-1.5 w-1.5 rounded-full bg-gold" /> What sets the mentorship apart
            </div>
            <h2 className="mt-6 font-display text-4xl font-medium leading-[1.05] tracking-tight text-white sm:text-5xl">
              Seven parts of a <span className="text-gold-gradient">stronger</span> singing practice.
            </h2>
          </div>
          <div className="mt-16 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {elements.map((e, i) => (
              <div key={e.t} className={`glass glass-hover rounded-3xl p-6 sm:p-8 ${i === 6 ? 'sm:col-span-2 lg:col-span-1' : ''}`}>
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gold/15 text-gold">
                  <e.icon className="h-5 w-5" />
                </div>
                <h3 className="mt-4 font-display text-2xl font-semibold text-white">{e.t}</h3>
                <p className="mt-2 text-sm leading-relaxed text-white/65">{e.d}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* What to expect + app */}
      <section className="relative overflow-hidden py-24 sm:py-32">
        <div className="absolute inset-0 -z-10">
          <Image src="/images/photos/studio-mic.jpg" alt="" fill sizes="100vw" className="object-cover opacity-30" />
          <div className="absolute inset-0 bg-gradient-to-b from-ink via-ink/85 to-ink" />
        </div>
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid gap-12 lg:grid-cols-12 lg:items-center">
            <div className="lg:col-span-6">
              <div className="eyebrow">
                <span className="h-1.5 w-1.5 rounded-full bg-gold" /> In this series, you can expect
              </div>
              <ul className="mt-6 space-y-3">
                {expect.map((x) => (
                  <li key={x} className="flex items-start gap-3 text-white/85">
                    <span className="mt-1 flex h-4 w-4 shrink-0 items-center justify-center rounded-full bg-gold/20 text-gold">
                      <Sparkles className="h-3 w-3" />
                    </span>
                    <span className="leading-relaxed">{x}</span>
                  </li>
                ))}
              </ul>
              <p className="mt-6 leading-relaxed text-white/70">
                Throughout the series, we&apos;ll move through framework, theory, breathing, posture, warm-ups, lyrics,
                presentation, tone and storytelling. By the end, you&apos;ll have creative direction for your music and the
                option to share it in a final recital.
              </p>
              <div className="mt-6 flex flex-wrap gap-2">
                {curriculum.map((c) => (
                  <span key={c} className="rounded-full border border-gold/25 bg-gold/[0.08] px-3 py-1 text-xs font-medium text-gold-light">
                    {c}
                  </span>
                ))}
              </div>
            </div>
            <div className="lg:col-span-6">
              <div className="glass-gold rounded-3xl p-6 sm:p-8">
                <div className="text-xs font-semibold uppercase tracking-[0.18em] text-gold">How the app supports your lessons</div>
                <h3 className="mt-4 font-display text-2xl font-semibold text-white sm:text-3xl">Your lessons live inside the app.</h3>
                <p className="mt-4 text-sm leading-relaxed text-white/65">
                  Every lesson is published to your Training Center with an AI summary, topics covered, {site.founder}
                  &apos;s feedback and your homework. Assigned scales and drills appear in your trainers, and your mentor
                  sees your practice data before the next lesson.
                </p>
                <div className="mt-6">
                  <Browser src="/images/app/lesson_notes_card.webp" alt="Recent lesson notes with AI summary, teacher feedback and homework inside the app" aspect="aspect-[16/9]" url="voicealchemyacademy.app/training" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Your mentor */}
      <section className="relative py-24 sm:py-32">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid items-center gap-12 lg:grid-cols-12 lg:gap-16">
            <div className="lg:col-span-5">
              <div className="relative mx-auto max-w-md lg:max-w-none">
                <div className="pointer-events-none absolute -inset-6 -z-10 rounded-[2.5rem] bg-gold/10 blur-3xl" />
                <figure className="glass-gold overflow-hidden rounded-[2rem] p-2">
                  <div className="relative aspect-[4/5] overflow-hidden rounded-[1.6rem]">
                    <Image src="/images/photos/julia-founder.webp" alt={`${site.founder}, founder of Voice Alchemy Academy, writing at the piano`} fill sizes="(min-width: 1024px) 40vw, 100vw" className="object-cover object-top" />
                  </div>
                </figure>
              </div>
            </div>
            <div className="lg:col-span-7">
              <div className="eyebrow">
                <span className="h-1.5 w-1.5 rounded-full bg-gold" /> Your mentor
              </div>
              <h2 className="mt-6 font-display text-4xl font-medium leading-[1.05] tracking-tight text-white sm:text-5xl">
                Meet <span className="text-gold-gradient">{site.founder}</span>.
              </h2>
              <p className="mt-6 text-white/70 sm:text-lg">
                {site.founder} is the founder of Voice Alchemy Academy and the only mentor in this program. Each semester she takes a small
                number of adult singers and works with them one-on-one, live inside the app, with their practice data on screen.
              </p>
              <p className="mt-4 text-white/70 sm:text-lg">
                She reads every Voice Application herself. When the fit is right, the first step is a relaxed conversation about where your
                voice is today and where you want it to go.
              </p>
              <div className="mt-8">
                <a href="#apply" data-cta="mentorship-founder-apply" className="btn btn-gold">
                  Apply for a semester
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Application */}
      <section id="apply" className="relative py-24 sm:py-32">
        <div className="pointer-events-none absolute left-1/2 top-1/2 -z-10 h-[600px] w-[900px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-gold/10 blur-[160px]" />
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-2xl text-center">
            <div className="eyebrow">
              <span className="h-1.5 w-1.5 rounded-full bg-gold" /> Voice Application
            </div>
            <h2 className="mt-6 font-display text-4xl font-medium leading-[1.05] tracking-tight text-white sm:text-5xl lg:text-6xl">
              Tell us about your voice.
            </h2>
            <p className="mt-6 text-white/65 sm:text-lg">
              Tell us about your voice and where you want it to go. {site.founder} reads every application personally.
            </p>
          </div>
          <div className="relative mt-16">
            <MentorshipForm />
          </div>
          <p className="mt-8 text-center text-sm text-white/45">
            Visit us on Instagram (
            <a href={site.instagram} target="_blank" rel="noreferrer" className="text-gold underline-offset-4 hover:underline">
              @VoiceAlchemyAcademy
            </a>
            ) for voice tips, philosophy, tools and music that inspires us.
          </p>
        </div>
      </section>
    </PageShell>
    </>
  )
}
