'use client'

import { useState, type FormEvent } from 'react'
import { ArrowRight, CalendarCheck, Check, Loader2, Users, Video } from 'lucide-react'
import { site } from '@/lib/site'
import { useEngagementPrompt } from '@/lib/useEngagementPrompt'
import { TeacherDemoForm, demoInputCls, painOptions, postDemo, studentCountOptions } from './TeacherDemoForm'
import { DeclineButton, PromptDialog } from './PromptDialog'
import { usePersona } from './PersonaProvider'

export const DEMO_PROMPT_KEY = 'teacher-demo'
const SOURCE = 'demo-popup'

type Step = 'ask' | 'form' | 'details' | 'done'
type Lead = { firstName: string; lastName: string; fullName: string; email: string }

/**
 * Coach-only demo prompt.
 *  - Two-step opt-in: a yes/no micro-commitment before any fields appear.
 *  - Name + email only, then optional progressive profiling after the lead is captured.
 *  - Trigger, capping and signup recognition live in useEngagementPrompt.
 */
export function TeacherDemoPopup() {
  const { isCoach, chosen } = usePersona()
  const { open, dismiss, complete } = useEngagementPrompt({ promptKey: DEMO_PROMPT_KEY, role: 'coach', enabled: isCoach && chosen, avoidId: 'teacher-demo' })
  const [step, setStep] = useState<Step>('ask')
  const [lead, setLead] = useState<Lead | null>(null)

  // Leaving before the lead is captured counts as a dismissal; afterwards it is just closing.
  const converted = step === 'details' || step === 'done'
  const close = converted ? complete : dismiss

  // If the visitor switches back to the student view while it is open, get out of the way.
  if (!isCoach) return null

  return (
    <PromptDialog open={open} onClose={close} labelledBy="demo-popup-title" tone="violet">
      {step === 'ask' && (
        <>
          <div className="eyebrow">
            <span className="h-1.5 w-1.5 rounded-full bg-violet" /> Platform demo
          </div>
          <h3 id="demo-popup-title" className="mt-4 font-display text-3xl font-medium leading-tight text-white sm:text-4xl">
            Want to see VAA with <span className="text-violet-gradient">your studio</span> in it?
          </h3>
          <p className="mt-3 text-sm text-white/65 sm:text-base">A short walkthrough built around how you teach. Nothing to install, nothing to prepare.</p>
          <ul className="mt-5 space-y-2.5">
            {[
              { icon: Users, t: 'What your students practiced before each lesson' },
              { icon: Video, t: 'Live lessons with notes that write themselves' },
              { icon: CalendarCheck, t: 'Scheduling, courses and homework in one place' },
            ].map((b) => (
              <li key={b.t} className="flex items-center gap-3 text-sm text-white/80">
                <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-violet/20 text-violet">
                  <b.icon className="h-3.5 w-3.5" />
                </span>
                {b.t}
              </li>
            ))}
          </ul>
          <div className="mt-6 flex flex-col gap-3">
            <button type="button" data-autofocus="true" data-cta="demo-popup-yes" onClick={() => setStep('form')} className="btn btn-violet w-full">
              Yes, show me the walkthrough
              <ArrowRight className="h-4 w-4" />
            </button>
            <DeclineButton onClick={dismiss} cta="demo-popup-no" />
          </div>
        </>
      )}

      {step === 'form' && (
        <>
          <div className="eyebrow">
            <span className="h-1.5 w-1.5 rounded-full bg-violet" /> Almost there
          </div>
          <h3 id="demo-popup-title" className="mt-4 font-display text-3xl font-medium leading-tight text-white sm:text-4xl">
            Where should we send the <span className="text-violet-gradient">times</span>?
          </h3>
          <p className="mt-3 text-sm text-white/65">Name and email is all we need. We&apos;ll reply with a few slots that fit a teaching schedule.</p>
          <div className="mt-5">
            <TeacherDemoForm
              source={SOURCE}
              minimal
              autoFocus
              submitLabel="Book my demo"
              footnote={<p className="mt-3 text-center text-xs text-white/45">One reply from {site.contactEmail} to schedule. No newsletter, no spam.</p>}
              onSuccess={(v) => {
                setLead(v)
                setStep('details')
              }}
            />
          </div>
          <div className="mt-3">
            <DeclineButton onClick={dismiss} cta="demo-popup-no-form" />
          </div>
        </>
      )}

      {step === 'details' && lead && <DetailsStep lead={lead} onDone={() => setStep('done')} />}

      {step === 'done' && (
        <div className="text-center">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-mint/15 text-mint">
            <Check className="h-6 w-6" />
          </div>
          <h3 id="demo-popup-title" className="mt-4 font-display text-3xl font-medium text-white">
            You&apos;re booked in.
          </h3>
          <p className="mx-auto mt-2 max-w-sm text-sm text-white/65">
            Watch for an email from {site.contactEmail} with a few times. In the meantime, the teacher section below shows what we&apos;ll walk through.
          </p>
          <button type="button" data-autofocus="true" onClick={complete} className="btn btn-ghost mt-6 w-full">
            Back to the page
          </button>
        </div>
      )}
    </PromptDialog>
  )
}

/** Optional second ask, only after the lead is already captured. */
function DetailsStep({ lead, onDone }: { lead: Lead; onDone: () => void }) {
  const [studentCount, setStudentCount] = useState('')
  const [biggestPain, setBiggestPain] = useState('')
  const [state, setState] = useState<'idle' | 'loading'>('idle')

  async function submit(e: FormEvent) {
    e.preventDefault()
    if (!studentCount && !biggestPain) return onDone()
    setState('loading')
    try {
      await postDemo({ firstName: lead.firstName, lastName: lead.lastName, email: lead.email, studentCount, biggestPain, source: SOURCE, followUp: true })
    } catch {
      /* the lead is already in; a failed follow-up should not block the thank-you */
    }
    onDone()
  }

  return (
    <>
      <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.18em] text-mint">
        <Check className="h-4 w-4" /> Request received
      </div>
      <h3 id="demo-popup-title" className="mt-4 font-display text-3xl font-medium leading-tight text-white">
        Help us tailor it? <span className="text-white/50">(optional)</span>
      </h3>
      <p className="mt-2 text-sm text-white/65">Two quick picks so the walkthrough starts with what matters to your studio.</p>
      <form onSubmit={submit} className="mt-5 space-y-4">
        <label className="block">
          <span className="mb-2 block text-xs font-semibold uppercase tracking-[0.14em] text-violet">Students</span>
          <select value={studentCount} onChange={(e) => setStudentCount(e.target.value)} className={demoInputCls} data-autofocus="true">
            <option className="bg-ink" value="">How many?</option>
            {studentCountOptions.map((o) => (
              <option key={o} className="bg-ink" value={o}>{o}</option>
            ))}
          </select>
        </label>
        <label className="block">
          <span className="mb-2 block text-xs font-semibold uppercase tracking-[0.14em] text-violet">Biggest pain</span>
          <select value={biggestPain} onChange={(e) => setBiggestPain(e.target.value)} className={demoInputCls}>
            <option className="bg-ink" value="">What should we show first?</option>
            {painOptions.map((o) => (
              <option key={o.value} className="bg-ink" value={o.value}>{o.label}</option>
            ))}
          </select>
        </label>
        <button type="submit" disabled={state === 'loading'} data-cta="demo-popup-details" className="btn btn-violet w-full disabled:opacity-70">
          {state === 'loading' ? <Loader2 className="h-4 w-4 animate-spin" /> : null}
          {studentCount || biggestPain ? 'Send and finish' : 'Skip for now'}
          <ArrowRight className="h-4 w-4" />
        </button>
      </form>
    </>
  )
}
