'use client'

import Image from 'next/image'
import Link from 'next/link'
import { site } from '@/lib/site'
import { LeadForm } from './LeadForm'
import { TeacherDemoForm } from './TeacherDemoForm'
import { usePersona } from './PersonaProvider'

export function FinalCta() {
  const { isCoach } = usePersona()
  return (
    <section id="get-started" className="relative py-24 sm:py-32">
      <div className="pointer-events-none absolute left-1/2 top-1/2 -z-10 h-[600px] w-[900px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-gold/10 blur-[160px]" />
      <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
        <div className="glass-gold relative overflow-hidden rounded-[2rem] p-8 text-center sm:p-12">
          <div className="pointer-events-none absolute -left-24 -top-24 h-72 w-72 rounded-full bg-violet/20 blur-[100px]" />
          <div className="pointer-events-none absolute -bottom-24 -right-24 h-72 w-72 rounded-full bg-gold/20 blur-[100px]" />
          <div className="relative">
            <h2 className="font-display text-4xl font-medium leading-[1.05] tracking-tight text-white sm:text-5xl lg:text-6xl">
              {isCoach ? (
                <>
                  Ready to <span className="text-gold-gradient">see your students practice</span>?
                </>
              ) : (
                <>
                  Ready to <span className="text-gold-gradient">hear the difference</span>?
                </>
              )}
            </h2>
            <p className="mx-auto mt-6 max-w-2xl text-white/70 sm:text-lg">
              {isCoach
                ? 'Tell us how your studio runs and we’ll show the platform around your real teaching setup: student practice data, online lessons, notes, recordings, scheduling and courses.'
                : 'Create a free account, open the Training Center and try the vocal tools today. Pitch, rhythm and scale practice are the quickest way to feel how it works.'}
            </p>
            <div className="mx-auto mt-8 max-w-xl text-left">
              {isCoach ? <TeacherDemoForm source="final-cta" /> : <LeadForm source="final-cta" defaultPersona="singer" />}
            </div>
            {!isCoach && (
              <div className="mx-auto mt-10 flex max-w-xl items-center gap-4 rounded-2xl border border-white/10 bg-white/[0.04] p-4 text-left">
                <div className="relative h-14 w-14 flex-shrink-0 overflow-hidden rounded-full ring-2 ring-gold/60">
                  <Image src="/images/photos/julia-founder-square.webp" alt={`${site.founder}, founder of Voice Alchemy Academy`} fill sizes="56px" className="object-cover" />
                </div>
                <div className="min-w-0">
                  <div className="text-sm font-semibold text-white">Founder-led, start to finish</div>
                  <p className="mt-0.5 text-sm text-white/60">
                    {site.founder}, founder of Voice Alchemy Academy, reads every mentorship application and teaches every mentorship lesson herself.{' '}
                    <Link href={site.mentorshipApply} className="text-gold underline-offset-4 hover:underline">
                      About mentorship
                    </Link>
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  )
}
