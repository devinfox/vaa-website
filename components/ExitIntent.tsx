'use client'

import { useEffect, useRef, useState } from 'react'
import { X } from 'lucide-react'
import { LeadForm } from './LeadForm'
import { TeacherDemoForm } from './TeacherDemoForm'
import { usePersona } from './PersonaProvider'
import { hasSignedUp, promptEligible, promptShownThisSession, recordPromptDismissed, recordPromptShown } from '@/lib/visitor'
import { DEMO_PROMPT_KEY } from './TeacherDemoPopup'
import { STUDENT_PROMPT_KEY } from './StudentPopup'
import { ArrowRight, Mic2 } from 'lucide-react'
import { site } from '@/lib/site'

const KEY = 'exit-intent'

/**
 * Desktop exit-intent capture. Last-chance offer when the cursor leaves the top of the viewport.
 *  - Never for a visitor who already joined this role's funnel.
 *  - Coaches who already saw (and passed on) the demo prompt get a softer ask instead of the same one.
 *  - Once per session, a week off after a dismissal, silent after two.
 */
export function ExitIntent() {
  const [open, setOpen] = useState(false)
  const [mode, setMode] = useState<'demo' | 'coach-soft' | 'singer' | 'singer-soft'>('singer')
  const { isCoach } = usePersona()
  const coachRef = useRef(isCoach)
  useEffect(() => {
    coachRef.current = isCoach
  }, [isCoach])

  useEffect(() => {
    if (typeof window === 'undefined') return
    if (window.matchMedia('(pointer: coarse)').matches) return
    if (!promptEligible(KEY)) return

    const onLeave = (e: MouseEvent) => {
      if (e.clientY > 8) return
      if (window.scrollY < 400) return
      if (document.body.style.overflow === 'hidden') return // another dialog is up
      const coach = coachRef.current
      if (hasSignedUp(coach ? 'coach' : 'singer')) return
      setMode(
        coach
          ? promptShownThisSession(DEMO_PROMPT_KEY)
            ? 'coach-soft'
            : 'demo'
          : promptShownThisSession(STUDENT_PROMPT_KEY)
            ? 'singer-soft'
            : 'singer',
      )
      recordPromptShown(KEY)
      setOpen(true)
      document.removeEventListener('mouseout', onLeave)
    }
    document.addEventListener('mouseout', onLeave)
    return () => document.removeEventListener('mouseout', onLeave)
  }, [])

  const dismiss = () => {
    recordPromptDismissed(KEY)
    setOpen(false)
  }

  useEffect(() => {
    if (!open) return
    const prev = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && dismiss()
    window.addEventListener('keydown', onKey)
    return () => {
      document.body.style.overflow = prev
      window.removeEventListener('keydown', onKey)
    }
  }, [open])

  if (!open) return null

  const copy = {
    demo: {
      title: (
        <>
          Leave with something <span className="text-gold-gradient">useful</span>.
        </>
      ),
      body: 'Tell us where your studio gets stuck and we’ll follow up with a walkthrough of student practice data and online voice lesson tools.',
    },
    'coach-soft': {
      title: (
        <>
          Not ready for a call? <span className="text-gold-gradient">Take the overview.</span>
        </>
      ),
      body: 'Leave your email and we’ll send a short written overview for voice teachers: student practice data, online lessons, notes and scheduling. Read it on your own time.',
    },
    singer: {
      title: (
        <>
          Leave with something <span className="text-gold-gradient">useful</span>.
        </>
      ),
      body: 'Drop your email and we’ll send a short guide to the three pitch mistakes almost every self-taught singer makes.',
    },
    'singer-soft': {
      title: (
        <>
          Skip the email. <span className="text-gold-gradient">Just try it.</span>
        </>
      ),
      body: 'No inbox, no guide, no form. Open the free pitch trainer, sing one line and see where it lands. Thirty seconds.',
    },
  }[mode]

  return (
    <div
      className="fixed inset-0 z-[60] flex items-center justify-center bg-ink/80 p-4 backdrop-blur-sm"
      role="presentation"
      onClick={dismiss}
    >
      <div
        className="modal-enter glass-gold relative w-full max-w-lg rounded-3xl p-6 sm:p-8"
        role="dialog"
        aria-modal="true"
        aria-labelledby="exit-title"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={dismiss}
          className="absolute right-4 top-4 rounded-full p-2 text-white/60 transition hover:bg-white/10 hover:text-white"
          aria-label="Close"
        >
          <X className="h-5 w-5" />
        </button>
        <div className="eyebrow">
          <span className="h-1.5 w-1.5 rounded-full bg-gold" /> Before you go
        </div>
        <h3 id="exit-title" className="mt-4 font-display text-3xl font-medium leading-tight text-white sm:text-4xl">
          {copy.title}
        </h3>
        <p className="mt-4 text-sm text-white/65 sm:text-base">{copy.body}</p>
        <div className="mt-6">
          {mode === 'demo' && <TeacherDemoForm source="exit-intent" compact onSuccess={() => recordPromptShown(DEMO_PROMPT_KEY)} />}
          {mode === 'coach-soft' && <LeadForm source="exit-intent-soft" defaultPersona="coach" lockPersona compact />}
          {mode === 'singer' && <LeadForm source="exit-intent" compact defaultPersona="singer" />}
          {mode === 'singer-soft' && (
            <a href={site.signupSinger} data-cta="exit-intent-soft-signup" className="btn btn-gold w-full">
              <Mic2 className="h-4 w-4" />
              Open the free pitch trainer
              <ArrowRight className="h-4 w-4" />
            </a>
          )}
        </div>
        <button type="button" onClick={dismiss} className="mt-4 w-full py-1 text-center text-sm font-medium text-white/50 transition hover:text-white">
          No thanks, I&apos;ll keep reading
        </button>
      </div>
    </div>
  )
}
