'use client'

import { usePersona } from './PersonaProvider'

const singerItems = [
  'Live pitch mirror',
  'Scale trainer',
  'Rhythm trainer',
  'AI coach feedback',
  'Video courses',
  'Live 1:1 lessons',
  'Lesson transcripts',
  'Practice streaks',
  'Homework synced',
]

const coachItems = [
  'Coach dashboard',
  'Student practice data',
  'Online voice lessons',
  'Automatic lesson notes',
  'Course studio',
  'Quizzes & homework',
  'Homework recordings',
  'Scheduling & calendar',
  'Enrollment requests',
  'Student detail pages',
]

export function Ticker() {
  const { persona } = usePersona()
  const items = persona === 'coach' ? coachItems : persona === 'singer' ? singerItems : [...singerItems, ...coachItems]
  const row = [...items, ...items]
  return (
    <div className="marquee relative overflow-hidden border-y border-white/[0.06] bg-white/[0.02] py-4">
      <div className="pointer-events-none absolute inset-y-0 left-0 z-10 w-24 bg-gradient-to-r from-ink to-transparent" />
      <div className="pointer-events-none absolute inset-y-0 right-0 z-10 w-24 bg-gradient-to-l from-ink to-transparent" />
      <div className="marquee-track">
        {row.map((t, i) => (
          <div key={i} className="flex items-center gap-6 px-6 text-xs font-semibold uppercase tracking-[0.2em] text-white/45">
            <span>{t}</span>
            <span className={`h-1 w-1 rounded-full ${persona === 'coach' ? 'bg-violet/70' : 'bg-gold/70'}`} />
          </div>
        ))}
      </div>
    </div>
  )
}
