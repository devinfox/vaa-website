'use client'

import Image from 'next/image'
import Link from 'next/link'
import { ArrowRight, Calendar, FileText, Headphones, Target } from 'lucide-react'
import { site } from '@/lib/site'
import { usePersona } from './PersonaProvider'

const singerPerks = [
  { icon: Calendar, t: 'Weekly live 1:1 lessons', d: 'Inside the app, with your practice data on screen.' },
  { icon: FileText, t: 'Transcripts & notes, automatically', d: 'Every lesson is transcribed and summarized for you.' },
  { icon: Target, t: 'A plan that adapts weekly', d: 'Your mentor prescribes scales, courses and drills that sync to your Training Center.' },
  { icon: Headphones, t: 'Priority feedback', d: 'Recordings and song drafts reviewed by a human, not just the AI.' },
]

const coachPerks = [
  { icon: Calendar, t: 'Live 1:1 lessons in the app', d: 'Video lessons with your student’s Training Center data beside you.' },
  { icon: FileText, t: 'Notes that write themselves', d: 'Every lesson is transcribed and summarized, then fed to the student’s AI coach.' },
  { icon: Target, t: 'Prescribe, then verify', d: 'Assign scales, courses and drills. See every attempt before the next lesson.' },
  { icon: Headphones, t: 'Recordings in one place', d: 'Homework recordings and song drafts land in your dashboard, not your inbox.' },
]

export function MentorshipBand() {
  const { isCoach } = usePersona()
  const perks = isCoach ? coachPerks : singerPerks
  return (
    <section id="mentorship" className="relative overflow-hidden py-24 sm:py-32">
      <div className="absolute inset-0 -z-10">
        <Image src="/images/photos/studio-mic.jpg" alt="" fill sizes="100vw" className="object-cover opacity-35" />
        <div className="absolute inset-0 bg-gradient-to-b from-ink via-ink/85 to-ink" />
        <div className="absolute inset-0 bg-[radial-gradient(800px_400px_at_50%_50%,rgba(206,180,102,0.14),transparent_70%)]" />
      </div>

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="glass-gold rounded-[2rem] p-8 sm:p-12">
          <div className="grid gap-12 lg:grid-cols-12 lg:items-center">
            <div className="lg:col-span-6">
              <div className="eyebrow">
                <span className="h-1.5 w-1.5 rounded-full bg-gold" />
                {isCoach ? 'Mentorship tools, built in' : 'Private mentorship with the founder'}
              </div>
              {isCoach ? (
                <>
                  <h2 className="mt-6 font-display text-4xl font-medium leading-[1.05] tracking-tight text-white sm:text-5xl lg:text-6xl">
                    Turn lessons into <span className="text-gold-gradient">mentorship</span>.
                  </h2>
                  <p className="mt-6 text-white/70 leading-relaxed sm:text-lg">
                    The academy&apos;s own 1:1 mentorship program runs on these tools. Use them with your students: live
                    lessons with their practice data on screen, automatic notes, and a weekly plan they actually follow
                    because it shows up in the app they practice in.
                  </p>
                  <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                    <a href={site.demoCoach} data-cta="mentorship-coach-demo" className="btn btn-gold">
                      Book a platform demo
                      <ArrowRight className="h-4 w-4" />
                    </a>
                    <a href={`mailto:${site.contactEmail}?subject=Mentorship%20tools%20question`} className="btn btn-ghost">
                      Ask how it works
                    </a>
                  </div>
                </>
              ) : (
                <>
                  <h2 className="mt-6 font-display text-4xl font-medium leading-[1.05] tracking-tight text-white sm:text-5xl lg:text-6xl">
                    The app makes you consistent. <span className="text-gold-gradient">A mentor makes you undeniable.</span>
                  </h2>
                  <p className="mt-6 text-white/70 leading-relaxed sm:text-lg">
                    A semester of one-on-one lessons with {site.founder}, the founder of Voice Alchemy Academy. Deeply personal
                    exploration, sensitive guidance and traditional musical lineages, now paired with the app: your mentor
                    sees your practice data, hears your recordings and builds your plan week by week.
                  </p>
                  <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                    <Link href={site.mentorshipApply} data-cta="mentorship-apply" className="btn btn-gold">
                      Apply for 1:1 mentorship
                      <ArrowRight className="h-4 w-4" />
                    </Link>
                    <a href={`mailto:${site.contactEmail}?subject=Mentorship%20question`} className="btn btn-ghost">
                      Ask a question first
                    </a>
                  </div>
                  <p className="mt-4 text-xs text-white/45">Semester-long. Adults, all genres and levels. Seats are limited so every student gets real attention.</p>
                </>
              )}
            </div>

            <div className="grid gap-4 sm:grid-cols-2 lg:col-span-6">
              {!isCoach && (
                <figure className="glass overflow-hidden rounded-2xl p-2 sm:col-span-2">
                  <div className="relative aspect-[21/9] overflow-hidden rounded-xl">
                    <Image src="/images/photos/mentorship-call.jpg" alt={`A singer in a live online lesson with ${site.founder} on screen`} fill sizes="(min-width: 1024px) 40vw, 100vw" className="object-cover object-left" />
                  </div>
                  <figcaption className="p-4 text-xs text-white/60">
                    <span className="font-semibold text-white">{site.founder}</span>, founder &amp; mentor, in a live one-on-one lesson
                  </figcaption>
                </figure>
              )}
              {perks.map((p) => (
                <div key={p.t} className="glass rounded-2xl p-6">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gold/15 text-gold">
                    <p.icon className="h-5 w-5" />
                  </div>
                  <div className="mt-4 font-display text-xl font-semibold text-white">{p.t}</div>
                  <p className="mt-2 text-sm text-white/60">{p.d}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
