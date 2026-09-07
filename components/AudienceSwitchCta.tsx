'use client'

import { ArrowRight, GraduationCap, Mic2 } from 'lucide-react'
import { usePersona } from './PersonaProvider'

export function AudienceSwitchCta() {
  const { isCoach, setPersona } = usePersona()
  const next = isCoach ? 'singer' : 'coach'
  const Icon = isCoach ? Mic2 : GraduationCap

  return (
    <div className="fixed inset-x-0 bottom-6 z-40 hidden justify-start px-6 md:flex lg:px-8">
      <button
        type="button"
        onClick={() => setPersona(next)}
        data-cta={`sticky-switch-${isCoach ? 'student' : 'teacher'}`}
        className={`group inline-flex max-w-[calc(100vw-1.5rem)] items-center gap-2 rounded-full border px-4 py-2 text-xs font-semibold shadow-2xl backdrop-blur-xl transition hover:-translate-y-0.5 sm:text-sm ${
          isCoach
            ? 'border-gold/35 bg-gold/[0.12] text-gold-light hover:border-gold/60 hover:bg-gold/[0.18]'
            : 'border-violet/35 bg-violet/[0.12] text-violet hover:border-violet/60 hover:bg-violet/[0.18]'
        }`}
      >
        <span className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full ${isCoach ? 'bg-gold/15' : 'bg-violet/15'}`}>
          <Icon className="h-3.5 w-3.5" />
        </span>
        <span className="truncate">{isCoach ? "I'm here to sing" : "I'm a teacher"}</span>
        <ArrowRight className="h-3.5 w-3.5 shrink-0 transition group-hover:translate-x-0.5" />
      </button>
    </div>
  )
}
