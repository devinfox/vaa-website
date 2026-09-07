'use client'

import { useState, type FormEvent } from 'react'
import { Activity, ArrowRight, BookOpen, Check, Loader2, Mic2 } from 'lucide-react'
import { site } from '@/lib/site'
import { useEngagementPrompt } from '@/lib/useEngagementPrompt'
import { LeadForm, postLead } from './LeadForm'
import { DeclineButton, PromptDialog } from './PromptDialog'
import { usePersona } from './PersonaProvider'

export const STUDENT_PROMPT_KEY = 'student-tools'
const SOURCE = 'student-popup'

type Step = 'ask' | 'form' | 'details' | 'done'

const inputCls =
  'w-full rounded-xl border border-white/12 bg-white/[0.05] px-4 py-3 text-white placeholder:text-white/30 outline-none transition focus:border-gold/60 focus:ring-4 focus:ring-gold/10'

export const goalOptions = [
  { value: 'pitch', label: 'Singing in tune' },
  { value: 'range', label: 'Range and high notes' },
  { value: 'tone', label: 'Tone and confidence' },
  { value: 'performing', label: 'Auditions and performing' },
] as const

export const levelOptions = [
  { value: 'beginner', label: 'Just starting' },
  { value: 'self-taught', label: 'Self-taught, a while' },
  { value: 'lessons', label: 'Have taken lessons' },
  { value: 'performing', label: 'Perform regularly' },
] as const

/**
 * Singer-only lead-magnet prompt.
 *  - Value first: the free pitch tools and a short guide, not "subscribe".
 *  - Two-step opt-in, name + email only, optional profiling after capture.
 *  - Thank-you hands off to the real conversion: the free signup.
 */
export function StudentPopup() {
  const { isSinger, chosen } = usePersona()
  const { open, dismiss, complete } = useEngagementPrompt({ promptKey: STUDENT_PROMPT_KEY, role: 'singer', enabled: isSinger && chosen, avoidId: 'get-started' })
  const [step, setStep] = useState<Step>('ask')
  const [lead, setLead] = useState<{ email: string; first_name: string; last_name: string } | null>(null)

  const converted = step === 'details' || step === 'done'
  const close = converted ? complete : dismiss

  if (!isSinger) return null

  return (
    <PromptDialog open={open} onClose={close} labelledBy="student-popup-title" tone="gold">
      {step === 'ask' && (
        <>
          <div className="eyebrow">
            <span className="h-1.5 w-1.5 rounded-full bg-gold" /> Free for singers
          </div>
          <h3 id="student-popup-title" className="mt-4 font-display text-3xl font-medium leading-tight text-white sm:text-4xl">
            Want to know if you&rsquo;re <span className="text-gold-gradient">actually in tune</span>?
          </h3>
          <p className="mt-3 text-sm text-white/65 sm:text-base">See every note land, in cents, the moment you sing it. Free to start, nothing to buy.</p>
          <ul className="mt-5 space-y-2.5">
            {[
              { icon: Mic2, t: 'Live pitch mirror plus scale and rhythm trainers' },
              { icon: BookOpen, t: 'A short guide to the 3 pitch mistakes self-taught singers make' },
              { icon: Activity, t: 'One practice tip a week, from working coaches' },
            ].map((b) => (
              <li key={b.t} className="flex items-center gap-3 text-sm text-white/80">
                <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-gold/15 text-gold">
                  <b.icon className="h-3.5 w-3.5" />
                </span>
                {b.t}
              </li>
            ))}
          </ul>
          <div className="mt-6 flex flex-col gap-3">
            <button type="button" data-autofocus="true" data-cta="student-popup-yes" onClick={() => setStep('form')} className="btn btn-gold w-full">
              Yes, send me the free tools
              <ArrowRight className="h-4 w-4" />
            </button>
            <DeclineButton onClick={dismiss} cta="student-popup-no" />
          </div>
        </>
      )}

      {step === 'form' && (
        <>
          <div className="eyebrow">
            <span className="h-1.5 w-1.5 rounded-full bg-gold" /> Almost there
          </div>
          <h3 id="student-popup-title" className="mt-4 font-display text-3xl font-medium leading-tight text-white sm:text-4xl">
            Where should we <span className="text-gold-gradient">send it</span>?
          </h3>
          <p className="mt-3 text-sm text-white/65">Your name and email. The guide and your free-tools link arrive in one message.</p>
          <div className="mt-5">
            <LeadForm
              source={SOURCE}
              defaultPersona="singer"
              lockPersona
              stacked
              autoFocus
              submitLabel="Send me the free tools"
              footnote={<p className="mt-3 text-center text-xs text-white/45">One email now, one practice tip a week after. Unsubscribe any time.</p>}
              onSuccess={(v) => {
                setLead({ email: v.email, first_name: v.first_name, last_name: v.last_name })
                setStep('details')
              }}
            />
          </div>
          <div className="mt-3">
            <DeclineButton onClick={dismiss} cta="student-popup-no-form" />
          </div>
        </>
      )}

      {step === 'details' && lead && <DetailsStep lead={lead} onDone={() => setStep('done')} />}

      {step === 'done' && (
        <div className="text-center">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-mint/15 text-mint">
            <Check className="h-6 w-6" />
          </div>
          <h3 id="student-popup-title" className="mt-4 font-display text-3xl font-medium text-white">
            Check your inbox.
          </h3>
          <p className="mx-auto mt-2 max-w-sm text-sm text-white/65">
            The guide is on its way. Don&apos;t wait for it, though: your Training Center is ready right now, and the pitch trainer takes 30 seconds to try.
          </p>
          <a href={site.signupSinger} data-cta="student-popup-signup" data-autofocus="true" className="btn btn-gold mt-6 w-full">
            <Mic2 className="h-4 w-4" />
            Start singing free
            <ArrowRight className="h-4 w-4" />
          </a>
          <button type="button" onClick={complete} className="mt-3 w-full py-1 text-center text-sm font-medium text-white/50 transition hover:text-white">
            Back to the page
          </button>
        </div>
      )}
    </PromptDialog>
  )
}

/** Optional second ask, only after the email is already captured. */
function DetailsStep({ lead, onDone }: { lead: { email: string; first_name: string; last_name: string }; onDone: () => void }) {
  const [goal, setGoal] = useState('')
  const [level, setLevel] = useState('')
  const [state, setState] = useState<'idle' | 'loading'>('idle')

  async function submit(e: FormEvent) {
    e.preventDefault()
    if (!goal && !level) return onDone()
    setState('loading')
    try {
      await postLead({ ...lead, persona: 'singer', source: SOURCE, goal, level, followUp: true })
    } catch {
      /* the email is already in; a failed follow-up should not block the thank-you */
    }
    onDone()
  }

  return (
    <>
      <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.18em] text-mint">
        <Check className="h-4 w-4" /> You&rsquo;re on the list
      </div>
      <h3 id="student-popup-title" className="mt-4 font-display text-3xl font-medium leading-tight text-white">
        What are you working on? <span className="text-white/50">(optional)</span>
      </h3>
      <p className="mt-2 text-sm text-white/65">Two quick picks so the tips we send actually fit your voice.</p>
      <form onSubmit={submit} className="mt-5 space-y-4">
        <label className="block">
          <span className="mb-2 block text-xs font-semibold uppercase tracking-[0.14em] text-gold">Main goal</span>
          <select value={goal} onChange={(e) => setGoal(e.target.value)} className={inputCls} data-autofocus="true">
            <option className="bg-ink" value="">Pick one</option>
            {goalOptions.map((o) => (
              <option key={o.value} className="bg-ink" value={o.value}>{o.label}</option>
            ))}
          </select>
        </label>
        <label className="block">
          <span className="mb-2 block text-xs font-semibold uppercase tracking-[0.14em] text-gold">Where you are</span>
          <select value={level} onChange={(e) => setLevel(e.target.value)} className={inputCls}>
            <option className="bg-ink" value="">Pick one</option>
            {levelOptions.map((o) => (
              <option key={o.value} className="bg-ink" value={o.value}>{o.label}</option>
            ))}
          </select>
        </label>
        <button type="submit" disabled={state === 'loading'} data-cta="student-popup-details" className="btn btn-gold w-full disabled:opacity-70">
          {state === 'loading' ? <Loader2 className="h-4 w-4 animate-spin" /> : null}
          {goal || level ? 'Send and finish' : 'Skip for now'}
          <ArrowRight className="h-4 w-4" />
        </button>
      </form>
    </>
  )
}
