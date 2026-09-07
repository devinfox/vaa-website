'use client'

import Image from 'next/image'
import { Star } from 'lucide-react'
import { SectionHeading } from './SectionHeading'
import { usePersona } from './PersonaProvider'

/**
 * PLACEHOLDER COPY — swap for real student and coach quotes before launch.
 * Names, roles and quotes below are illustrative only.
 */
type Quote = { quote: string; name: string; role: string; avatar: string; who: 'singer' | 'coach' }

const quotes: Quote[] = [
  {
    quote:
      'I used to record myself and guess. Now I open the pitch trainer, sing the line, and know in five seconds whether it was flat. My mentor sees the same screen in our lesson.',
    name: 'Maya R.',
    role: 'Indie artist · mentorship student',
    avatar: '/images/photos/avatar-1.jpg',
    who: 'singer',
  },
  {
    quote:
      'The AI notes after each session are eerily accurate. It flagged that my breath was running out on descending scales before my teacher did.',
    name: 'Daniel K.',
    role: 'Worship leader',
    avatar: '/images/photos/avatar-2.jpg',
    who: 'singer',
  },
  {
    quote:
      'I replaced my scheduling app and my course platform. Seeing what students actually practiced between lessons changed how I teach.',
    name: 'Sofia L.',
    role: 'Vocal coach · 40+ students',
    avatar: '/images/photos/avatar-4.jpg',
    who: 'coach',
  },
  {
    quote:
      'My students used to say they practiced. Now I open their Training Center and see the scales, the scores and the days they skipped. Lessons got honest, fast.',
    name: 'Marcus T.',
    role: 'Voice teacher · contemporary & musical theater',
    avatar: '/images/photos/avatar-6.jpg',
    who: 'coach',
  },
  {
    quote:
      'The automatic lesson notes alone saved me an hour a night. And the AI coach repeats my corrections back to the student all week.',
    name: 'Elena V.',
    role: 'Studio owner · 3 teachers',
    avatar: '/images/photos/avatar-3.jpg',
    who: 'coach',
  },
  {
    quote:
      'Three weeks of streaks and my chorus finally stopped going flat. Seeing the needle sit in the green is weirdly addictive.',
    name: 'Jordan P.',
    role: 'Singer-songwriter',
    avatar: '/images/photos/avatar-5.jpg',
    who: 'singer',
  },
]

export function Testimonials() {
  const { persona } = usePersona()
  const shown =
    persona === 'coach'
      ? quotes.filter((q) => q.who === 'coach')
      : persona === 'singer'
        ? quotes.filter((q) => q.who === 'singer')
        : [quotes[0], quotes[1], quotes[2]]
  return (
    <section className="relative py-24 sm:py-32">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <SectionHeading
          eyebrow="From the studio"
          title={
            persona === 'coach' ? (
              <>
                Coaches <span className="text-gold-gradient">see it.</span>
              </>
            ) : persona === 'singer' ? (
              <>
                Singers <span className="text-gold-gradient">hear it.</span>
              </>
            ) : (
              <>
                Singers hear it. <span className="text-gold-gradient">Coaches see it.</span>
              </>
            )
          }
        />
        <div className="mt-16 grid gap-6 md:grid-cols-3">
          {shown.map((q) => (
            <figure key={q.name} className="glass glass-hover flex flex-col rounded-3xl p-6 sm:p-8">
              <div className="flex gap-0.5 text-gold">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star key={i} className="h-4 w-4 fill-current" />
                ))}
              </div>
              <blockquote className="mt-4 flex-1 font-display text-xl leading-snug text-white/90 sm:text-[1.35rem]">
                &ldquo;{q.quote}&rdquo;
              </blockquote>
              <figcaption className="mt-6 flex items-center gap-3">
                <Image src={q.avatar} alt="" width={40} height={40} className="h-10 w-10 rounded-full object-cover ring-2 ring-gold/30" />
                <div>
                  <div className="text-sm font-semibold text-white">{q.name}</div>
                  <div className="text-xs text-white/50">{q.role}</div>
                </div>
              </figcaption>
            </figure>
          ))}
        </div>
      </div>
    </section>
  )
}
