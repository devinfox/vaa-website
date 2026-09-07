'use client'

import { ArrowRight, Check, Mic2, Users } from 'lucide-react'
import { site } from '@/lib/site'
import { SectionHeading } from './SectionHeading'
import { usePersona } from './PersonaProvider'

const paths = [
  {
    id: 'singer',
    icon: Mic2,
    tone: 'gold',
    kicker: 'For singers & artists',
    title: 'I want to sing better.',
    body: 'Practice with instant feedback, follow a real vocal curriculum and know whether your singing is improving.',
    bullets: [
      'See your pitch live, note by note',
      'Free pitch, scale and rhythm tools',
      'Build streaks and see your scores',
      'Add AI coaching, courses or mentorship any time',
    ],
    cta: 'Start free as a singer',
    href: site.signupSinger,
  },
  {
    id: 'coach',
    icon: Users,
    tone: 'violet',
    kicker: 'For vocal coaches & studios',
    title: 'I teach voice.',
    body: 'Run your voice studio from one dashboard and see what students practiced between lessons.',
    bullets: [
      'Student practice data',
      'Online lessons with AI notes',
      'Build and sell your own courses',
      'See it on a guided demo',
    ],
    cta: 'Book a platform demo',
    href: site.demoCoach,
  },
] as const

export function PathSplit() {
  const { setPersona } = usePersona()
  return (
    <section className="relative py-24 sm:py-32">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <SectionHeading
          eyebrow="Two ways in"
          title={
            <>
              One platform. <span className="text-gold-gradient">Two ways to start.</span>
            </>
          }
          body="Singers train inside it. Coaches run their studio inside it. Mentorship is where the two meet."
        />

        <div className="mt-16 grid gap-6 lg:grid-cols-2">
          {paths.map((p) => {
            const gold = p.tone === 'gold'
            const Icon = p.icon
            return (
              <div key={p.id} className={`${gold ? 'glass-gold' : 'glass-violet'} glass-hover relative overflow-hidden rounded-3xl p-8 sm:p-12`}>
                <div
                  className={`pointer-events-none absolute -right-20 -top-20 h-64 w-64 rounded-full blur-[90px] ${
                    gold ? 'bg-gold/20' : 'bg-violet/25'
                  }`}
                />
                <div className="relative">
                  <div className="flex items-center gap-3">
                    <div
                      className={`flex h-12 w-12 items-center justify-center rounded-xl ${
                        gold ? 'bg-gold/15 text-gold' : 'bg-violet/20 text-violet'
                      }`}
                    >
                      <Icon className="h-5 w-5" />
                    </div>
                    <span className={`text-xs font-semibold uppercase tracking-[0.18em] ${gold ? 'text-gold' : 'text-violet'}`}>
                      {p.kicker}
                    </span>
                  </div>

                  <h3 className="mt-6 font-display text-4xl font-medium text-white sm:text-5xl">{p.title}</h3>
                  <p className="mt-6 text-white/65">{p.body}</p>

                  <ul className="mt-6 space-y-2">
                    {p.bullets.map((b) => (
                      <li key={b} className="flex items-start gap-3 text-sm text-white/80">
                        <span
                          className={`mt-0.5 flex h-4 w-4 shrink-0 items-center justify-center rounded-full ${
                            gold ? 'bg-gold/20 text-gold' : 'bg-violet/25 text-violet'
                          }`}
                        >
                          <Check className="h-3 w-3" />
                        </span>
                        {b}
                      </li>
                    ))}
                  </ul>

                  <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-center">
                    <a href={p.href} data-cta={`path-${p.id}`} className={`btn ${gold ? 'btn-gold' : 'btn-violet'}`}>
                      {p.cta}
                      <ArrowRight className="h-4 w-4" />
                    </a>
                    <button
                      type="button"
                      onClick={() => setPersona(p.id)}
                      data-cta={`path-switch-${p.id}`}
                      className="text-sm font-medium text-white/60 transition hover:text-white"
                    >
                      Show me the {gold ? 'student' : 'coach'} side →
                    </button>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
