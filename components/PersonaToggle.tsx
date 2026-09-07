'use client'

import { GraduationCap, Mic2 } from 'lucide-react'
import { usePersona } from './PersonaProvider'

type Target = 'singer' | 'coach'

function Pill({ target, pad, onSelect }: { target: Target; pad: string; onSelect: (t: Target) => void }) {
  const coach = target === 'coach'
  const Icon = coach ? GraduationCap : Mic2
  const dot = coach ? 'bg-violet' : 'bg-gold'
  return (
    <button
      type="button"
      onClick={() => onSelect(target)}
      data-cta={`switch-to-${coach ? 'teacher' : 'student'}`}
      className={`group inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/[0.04] font-semibold text-white/80 backdrop-blur-md transition hover:border-white/35 hover:bg-white/[0.08] hover:text-white ${pad}`}
    >
      <span className="relative flex h-1.5 w-1.5">
        <span className={`absolute inline-flex h-full w-full animate-ping rounded-full opacity-60 ${dot}`} />
        <span className={`relative inline-flex h-1.5 w-1.5 rounded-full ${dot}`} />
      </span>
      <Icon className={`h-3.5 w-3.5 ${coach ? 'text-violet' : 'text-gold'}`} />
      <span>{coach ? "I'm a teacher" : "I'm here to sing"}</span>
    </button>
  )
}

/**
 * The quiet control that flips the page between funnels.
 * Outlined pill, small type, soft pulsing dot so the eye still finds it.
 * In the "just looking" view it offers both doors.
 */
export function PersonaToggle({ className = '', size = 'sm' }: { className?: string; size?: 'sm' | 'md' }) {
  const { isCoach, isExplorer, setPersona } = usePersona()
  const pad = size === 'md' ? 'px-4 py-3 text-sm' : 'px-3 py-2 text-xs'

  if (isExplorer) {
    return (
      <div className={`flex items-center gap-2 ${className}`}>
        <Pill target="singer" pad={pad} onSelect={setPersona} />
        <Pill target="coach" pad={pad} onSelect={setPersona} />
      </div>
    )
  }
  return (
    <div className={className}>
      <Pill target={isCoach ? 'singer' : 'coach'} pad={pad} onSelect={setPersona} />
    </div>
  )
}
