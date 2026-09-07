'use client'

import { useState, type FormEvent, type ReactNode } from 'react'
import { ArrowRight, Check, Loader2, Mic2, Users } from 'lucide-react'
import { site, type LeadPersona } from '@/lib/site'
import { markSignedUp } from '@/lib/visitor'

type Props = {
  source: string
  defaultPersona?: LeadPersona
  /** Drops the footnote (tight spaces such as the exit-intent card). */
  compact?: boolean
  /** Hide the I sing / I teach switch and keep the default persona. */
  lockPersona?: boolean
  /** Full-width input with the button below it (dialogs). */
  stacked?: boolean
  submitLabel?: string
  footnote?: ReactNode
  autoFocus?: boolean
  onSuccess?: (values: { email: string; first_name: string; last_name: string; persona: LeadPersona }) => void
}

export async function postLead(body: Record<string, string | boolean>) {
  const res = await fetch('/api/lead', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  })
  const data = (await res.json()) as { ok: boolean; error?: string }
  if (!res.ok || !data.ok) throw new Error(data.error ?? 'Something went wrong.')
}

export function LeadForm({ source, defaultPersona = 'singer', compact = false, lockPersona = false, stacked = false, submitLabel, footnote, autoFocus, onSuccess }: Props) {
  const [persona, setPersona] = useState<LeadPersona>(defaultPersona)
  const [firstName, setFirstName] = useState('')
  const [lastName, setLastName] = useState('')
  const [email, setEmail] = useState('')
  const [state, setState] = useState<'idle' | 'loading' | 'done' | 'error'>('idle')
  const [error, setError] = useState<string | null>(null)

  async function submit(e: FormEvent) {
    e.preventDefault()
    setState('loading')
    setError(null)
    const first_name = firstName.trim()
    const last_name = lastName.trim()
    try {
      await postLead({ email, first_name, last_name, persona, source })
      markSignedUp(persona)
      setState('done')
      onSuccess?.({ email, first_name, last_name, persona })
    } catch (err) {
      setState('error')
      setError(err instanceof Error ? err.message : 'Something went wrong.')
    }
  }

  if (state === 'done') {
    // full navigation so the anchor exists even when the student view is showing
    const next = persona === 'coach' ? `/?view=teacher${site.demoCoach}` : site.signupSinger
    return (
      <div className="glass rounded-2xl p-6 text-center sm:p-8">
        <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-mint/15 text-mint">
          <Check className="h-6 w-6" />
        </div>
        <div className="mt-4 font-display text-2xl font-semibold text-white">You&apos;re on the list.</div>
        <p className="mt-2 text-sm text-white/65">
          {persona === 'coach' ? 'We have your email and can point you toward the right teacher walkthrough.' : 'Don’t wait for the email. Your Training Center is ready right now.'}
        </p>
        <a href={next} data-cta={`lead-success-${persona}`} className={`btn mt-6 ${persona === 'coach' ? 'btn-violet' : 'btn-gold'}`}>
          {persona === 'coach' ? 'Book a platform demo' : 'Start singing free'}
          <ArrowRight className="h-4 w-4" />
        </a>
      </div>
    )
  }

  const coach = persona === 'coach'
  const label = submitLabel ?? (coach ? 'Request demo info' : 'Get free tools')
  const inputCls = `h-12 w-full rounded-xl border border-white/12 bg-white/[0.05] px-4 text-white placeholder:text-white/35 outline-none transition focus:ring-4 ${
    coach ? 'focus:border-violet/60 focus:ring-violet/10' : 'focus:border-gold/60 focus:ring-gold/10'
  }`

  return (
    <form onSubmit={submit} className="w-full">
      {!lockPersona && (
        <div className="mb-4 inline-flex rounded-full border border-white/10 bg-white/[0.04] p-1">
          <button
            type="button"
            onClick={() => setPersona('singer')}
            className={`flex items-center gap-2 rounded-full px-3 py-1 text-xs font-semibold transition ${
              persona === 'singer' ? 'bg-gold text-ink shadow' : 'text-white/60 hover:text-white'
            }`}
          >
            <Mic2 className="h-3.5 w-3.5" /> I sing
          </button>
          <button
            type="button"
            onClick={() => setPersona('coach')}
            className={`flex items-center gap-2 rounded-full px-3 py-1 text-xs font-semibold transition ${
              persona === 'coach' ? 'bg-violet text-white shadow' : 'text-white/60 hover:text-white'
            }`}
          >
            <Users className="h-3.5 w-3.5" /> I teach
          </button>
        </div>
      )}

      <div className="mb-3 grid gap-3 min-[400px]:grid-cols-2">
        <div>
          <label className="sr-only" htmlFor={`first-name-${source}`}>
            First name
          </label>
          <input
            id={`first-name-${source}`}
            type="text"
            required
            maxLength={100}
            autoFocus={autoFocus}
            autoComplete="given-name"
            placeholder="First name"
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
            className={inputCls}
          />
        </div>
        <div>
          <label className="sr-only" htmlFor={`last-name-${source}`}>
            Last name
          </label>
          <input
            id={`last-name-${source}`}
            type="text"
            required
            maxLength={100}
            autoComplete="family-name"
            placeholder="Last name"
            value={lastName}
            onChange={(e) => setLastName(e.target.value)}
            className={inputCls}
          />
        </div>
      </div>

      <div className={`flex flex-col gap-3 ${stacked ? '' : 'sm:flex-row'}`}>
        <label className="sr-only" htmlFor={`email-${source}`}>
          Email address
        </label>
        <input
          id={`email-${source}`}
          type="email"
          required
          autoComplete="email"
          placeholder="you@example.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className={`${inputCls} ${stacked ? '' : 'sm:flex-1'}`}
        />
        <button
          type="submit"
          disabled={state === 'loading'}
          data-cta={`lead-submit-${source}`}
          className={`btn h-12 ${coach ? 'btn-violet' : 'btn-gold'} ${stacked ? 'w-full' : ''} disabled:opacity-70`}
        >
          {state === 'loading' ? <Loader2 className="h-4 w-4 animate-spin" /> : null}
          {label}
          <ArrowRight className="h-4 w-4" />
        </button>
      </div>
      {error && <p className="mt-4 text-sm text-rose-300">{error}</p>}
      {footnote !== undefined ? (
        footnote
      ) : compact ? null : (
        <p className="mt-4 text-xs text-white/40">
          {coach
            ? 'A short overview for voice teachers, then occasional studio updates. Unsubscribe any time.'
            : 'Launch invite, early-access pricing and one practice tip a week. Unsubscribe any time.'}
        </p>
      )}
    </form>
  )
}
