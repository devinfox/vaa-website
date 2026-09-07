'use client'

import { useEffect } from 'react'
import Image from 'next/image'
import { ArrowRight, Check, Compass, Mic2, Users } from 'lucide-react'
import { usePersona } from './PersonaProvider'

const doors = [
  {
    id: 'singer',
    tone: 'gold',
    icon: Mic2,
    kicker: 'For singers & artists',
    title: 'I want to sing better.',
    bullets: ['See your pitch live, note by note', 'Train with free vocal tools', 'Upgrade to coaching any time'],
    cta: 'Show me the student side',
  },
  {
    id: 'coach',
    tone: 'violet',
    icon: Users,
    kicker: 'For vocal coaches & studios',
    title: 'I teach voice.',
    bullets: ['Student practice data', 'Online lesson tools', 'Book a guided platform demo'],
    cta: 'Show me the coach side',
  },
] as const

/**
 * Full-screen first-visit prompt. Rendered on the server so first-time visitors
 * see it instantly; the provider hides it as soon as a stored/URL choice exists.
 */
export function WelcomeGate() {
  const { chosen, setPersona } = usePersona()

  useEffect(() => {
    if (chosen) return
    const prev = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && setPersona('explorer', { scrollTop: false })
    window.addEventListener('keydown', onKey)
    return () => {
      document.body.style.overflow = prev
      window.removeEventListener('keydown', onKey)
    }
  }, [chosen, setPersona])

  if (chosen) return null

  return (
    <div
      className="fixed inset-0 z-[80] overflow-y-auto bg-ink/92 backdrop-blur-xl"
      role="dialog"
      aria-modal="true"
      aria-labelledby="gate-title"
    >
      <div className="pointer-events-none absolute left-1/2 top-0 h-[600px] w-[1000px] -translate-x-1/2 rounded-full bg-violet/20 blur-[160px]" />
      <div className="pointer-events-none absolute bottom-0 right-0 h-[500px] w-[500px] rounded-full bg-gold/10 blur-[140px]" />

      <div className="relative mx-auto flex min-h-full max-w-5xl flex-col items-center justify-center px-4 py-12 sm:px-6">
        <Image src="/images/logo.png" alt="Voice Alchemy Academy" width={220} height={54} priority className="h-10 w-auto sm:h-12" />
        <p className="eyebrow mt-8">
          <span className="h-1.5 w-1.5 rounded-full bg-gold" /> Welcome
        </p>
        <h1 id="gate-title" className="mt-4 text-center font-display text-4xl font-medium leading-[1.05] tracking-tight text-white sm:text-5xl lg:text-6xl">
          Which one are <span className="text-gold-gradient">you</span>?
        </h1>
        <p className="mt-4 max-w-xl text-center text-white/60 sm:text-lg">
          The app is built for singers and the voice teachers who coach them. Pick your side and we&apos;ll take you there.
        </p>

        <div className="mt-8 grid w-full gap-6 md:grid-cols-2">
          {doors.map((d) => {
            const gold = d.tone === 'gold'
            const Icon = d.icon
            return (
              <button
                key={d.id}
                type="button"
                onClick={() => setPersona(d.id, { scrollTop: false })}
                data-cta={`gate-${d.id}`}
                className={`${gold ? 'glass-gold' : 'glass-violet'} glass-hover group relative overflow-hidden rounded-3xl p-6 text-left sm:p-8`}
              >
                <div className={`pointer-events-none absolute -right-16 -top-16 h-56 w-56 rounded-full blur-[80px] ${gold ? 'bg-gold/20' : 'bg-violet/25'}`} />
                <div className="relative">
                  <div className="flex items-center gap-3">
                    <div className={`flex h-12 w-12 items-center justify-center rounded-xl ${gold ? 'bg-gold/15 text-gold' : 'bg-violet/20 text-violet'}`}>
                      <Icon className="h-5 w-5" />
                    </div>
                    <span className={`text-[11px] font-semibold uppercase tracking-[0.18em] ${gold ? 'text-gold' : 'text-violet'}`}>{d.kicker}</span>
                  </div>
                  <div className="mt-4 font-display text-3xl font-medium text-white sm:text-4xl">{d.title}</div>
                  <ul className="mt-4 space-y-2">
                    {d.bullets.map((b) => (
                      <li key={b} className="flex items-center gap-3 text-sm text-white/75">
                        <span className={`flex h-4 w-4 items-center justify-center rounded-full ${gold ? 'bg-gold/20 text-gold' : 'bg-violet/25 text-violet'}`}>
                          <Check className="h-3 w-3" />
                        </span>
                        {b}
                      </li>
                    ))}
                  </ul>
                  <div className={`btn mt-8 ${gold ? 'btn-gold' : 'btn-violet'} group-hover:-translate-y-0.5`}>
                    {d.cta}
                    <ArrowRight className="h-4 w-4" />
                  </div>
                </div>
              </button>
            )
          })}
        </div>

        <button
          type="button"
          onClick={() => setPersona('explorer', { scrollTop: false })}
          data-cta="gate-explore"
          className="mt-8 inline-flex items-center gap-2 text-sm font-medium text-white/55 transition hover:text-white"
        >
          <Compass className="h-4 w-4" />
          I&apos;m just looking around
          <ArrowRight className="h-3.5 w-3.5" />
        </button>
      </div>
    </div>
  )
}
