'use client'

import { useState, type FormEvent } from 'react'
import { ArrowRight, Check, Loader2 } from 'lucide-react'
import { site } from '@/lib/site'
import { markSignedUp } from '@/lib/visitor'

type ShortKey = 'email' | 'firstName' | 'lastName' | 'artistName' | 'phone' | 'pronouns' | 'location'
type LongKey = 'history' | 'goals' | 'discovery' | 'comments'
type Values = Record<ShortKey | LongKey | 'website', string>

type ShortField = { key: ShortKey; label: string; type: string; required?: boolean; autoComplete?: string; placeholder?: string; maxLength?: number }
type LongField = { key: LongKey; label: string; required?: boolean }

const fields: ShortField[] = [
  { key: 'email', label: 'Email', type: 'email', required: true, autoComplete: 'email', placeholder: 'you@example.com' },
  { key: 'firstName', label: 'First Name', type: 'text', required: true, autoComplete: 'given-name', placeholder: 'First name', maxLength: 100 },
  { key: 'lastName', label: 'Last Name', type: 'text', required: true, autoComplete: 'family-name', placeholder: 'Last name', maxLength: 100 },
  { key: 'artistName', label: 'Artist Name', type: 'text', placeholder: 'If you perform under one' },
  { key: 'phone', label: 'Phone Number', type: 'tel', autoComplete: 'tel', placeholder: '+1 (555) 000-0000' },
  { key: 'pronouns', label: 'Pronouns', type: 'text', placeholder: 'she/her, he/him, they/them…' },
  { key: 'location', label: 'Location/Time Zone', type: 'text', placeholder: 'Brooklyn, NY · Eastern' },
]

const longFields: LongField[] = [
  { key: 'history', label: "What's your singing history? (Trainings, performances, singing in the car...)", required: true },
  { key: 'goals', label: 'What are your singing goals?', required: true },
  { key: 'discovery', label: 'How did you find this course and what drew you to sign up?' },
  { key: 'comments', label: 'Comments' },
]

const empty: Values = { email: '', firstName: '', lastName: '', artistName: '', phone: '', pronouns: '', location: '', history: '', goals: '', discovery: '', comments: '', website: '' }

const inputCls =
  'w-full rounded-xl border border-white/12 bg-white/[0.05] px-4 py-3 text-white placeholder:text-white/30 outline-none transition focus:border-gold/60 focus:ring-4 focus:ring-gold/10'

export function MentorshipForm() {
  const [values, setValues] = useState<Values>(empty)
  const [state, setState] = useState<'idle' | 'loading' | 'done' | 'error'>('idle')
  const [error, setError] = useState<string | null>(null)

  const set = (k: keyof Values) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
    setValues((v) => ({ ...v, [k]: e.target.value }))

  async function submit(e: FormEvent) {
    e.preventDefault()
    setState('loading')
    setError(null)
    try {
      const res = await fetch('/api/mentorship', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(values),
      })
      const data = (await res.json()) as { ok: boolean; error?: string }
      if (!res.ok || !data.ok) throw new Error(data.error ?? 'Something went wrong.')
      markSignedUp('singer')
      setState('done')
    } catch (err) {
      setState('error')
      setError(err instanceof Error ? err.message : 'Something went wrong.')
    }
  }

  if (state === 'done') {
    return (
      <div className="glass-gold rounded-3xl p-8 text-center sm:p-12">
        <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-mint/15 text-mint">
          <Check className="h-6 w-6" />
        </div>
        <h3 className="mt-4 font-display text-3xl font-medium text-white">Your application is in.</h3>
        <p className="mx-auto mt-2 max-w-md text-white/70">
          Thank you for trusting us with your voice. {site.founder} reads every application personally and will reply
          from {site.contactEmail} within a few days.
        </p>
        <p className="mt-6 text-sm text-white/50">
          In the meantime, explore{' '}
          <a href={site.instagram} className="text-gold underline-offset-4 hover:underline" target="_blank" rel="noreferrer">
            @VoiceAlchemyAcademy
          </a>{' '}
          for philosophy, tips, tools and inspiring music.
        </p>
      </div>
    )
  }

  return (
    <form onSubmit={submit} className="glass-gold rounded-3xl p-8 sm:p-12">
      <div className="grid gap-4 sm:grid-cols-2">
        {fields.map((f) => (
          <label key={f.key} className="block">
            <span className="mb-2 block text-xs font-semibold uppercase tracking-[0.14em] text-gold">
              {f.label}
              {f.required && <span className="text-white/40"> *</span>}
            </span>
            <input
              type={f.type}
              required={f.required}
              autoComplete={f.autoComplete}
              maxLength={f.maxLength}
              placeholder={f.placeholder}
              value={values[f.key]}
              onChange={set(f.key)}
              className={inputCls}
            />
          </label>
        ))}
      </div>

      <div className="mt-4 space-y-4">
        {longFields.map((f) => (
          <label key={f.key} className="block">
            <span className="mb-2 block text-xs font-semibold uppercase tracking-[0.14em] text-gold">
              {f.label}
              {f.required && <span className="text-white/40"> *</span>}
            </span>
            <textarea required={f.required} rows={f.key === 'comments' ? 3 : 4} value={values[f.key]} onChange={set(f.key)} className={`${inputCls} resize-y`} />
          </label>
        ))}
      </div>

      {/* Honeypot: hidden from people, tempting to bots */}
      <div className="absolute -left-[9999px] top-auto h-px w-px overflow-hidden" aria-hidden="true">
        <label>
          Website
          <input type="text" tabIndex={-1} autoComplete="off" value={values.website} onChange={set('website')} />
        </label>
      </div>

      {error && <p className="mt-4 text-sm text-rose-300">{error}</p>}

      <div className="mt-6 flex flex-col items-start gap-4 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-xs text-white/45">
          Your application goes straight to {site.founder}. We never share your details.
        </p>
        <button type="submit" disabled={state === 'loading'} data-cta="mentorship-send" className="btn btn-gold disabled:opacity-70">
          {state === 'loading' ? <Loader2 className="h-4 w-4 animate-spin" /> : null}
          Send
          <ArrowRight className="h-4 w-4" />
        </button>
      </div>
    </form>
  )
}
