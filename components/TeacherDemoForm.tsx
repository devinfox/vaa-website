'use client'

import { useState, type FormEvent, type ReactNode } from 'react'
import { ArrowRight, Check, Loader2 } from 'lucide-react'
import { site } from '@/lib/site'
import { markSignedUp } from '@/lib/visitor'

type Values = {
  firstName: string
  lastName: string
  email: string
  phone: string
  studioName: string
  studentCount: string
  teachingFormat: string
  biggestPain: string
  notes: string
  website: string
}

type Props = {
  source: string
  /** Drops phone / format / notes. */
  compact?: boolean
  /** Name + email only. Everything else is asked later (progressive profiling). */
  minimal?: boolean
  submitLabel?: string
  footnote?: ReactNode
  /** Auto-focus the first field (use inside dialogs). */
  autoFocus?: boolean
  onSuccess?: (values: { firstName: string; lastName: string; fullName: string; email: string }) => void
}

const empty: Values = {
  firstName: '',
  lastName: '',
  email: '',
  phone: '',
  studioName: '',
  studentCount: '',
  teachingFormat: '',
  biggestPain: '',
  notes: '',
  website: '',
}

export const demoInputCls =
  'w-full rounded-xl border border-white/12 bg-white/[0.05] px-4 py-3 text-white placeholder:text-white/30 outline-none transition focus:border-violet/60 focus:ring-4 focus:ring-violet/10'

const labelCls = 'mb-2 block text-xs font-semibold uppercase tracking-[0.14em] text-violet'

export const studentCountOptions = ['1-10', '11-25', '26-50', '51+'] as const
export const painOptions = [
  { value: 'practice-accountability', label: 'Student practice accountability' },
  { value: 'lesson-flow', label: 'Live lesson flow and notes' },
  { value: 'courses', label: 'Courses, quizzes and homework' },
  { value: 'scheduling', label: 'Scheduling and student management' },
  { value: 'all-in-one', label: 'Replacing scattered tools' },
] as const

export async function postDemo(body: Record<string, string | boolean>) {
  const res = await fetch('/api/demo', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  })
  const data = (await res.json()) as { ok: boolean; error?: string }
  if (!res.ok || !data.ok) throw new Error(data.error ?? 'Something went wrong.')
}

export function TeacherDemoForm({ source, compact = false, minimal = false, submitLabel = 'Request demo', footnote, autoFocus, onSuccess }: Props) {
  const [values, setValues] = useState<Values>(empty)
  const [state, setState] = useState<'idle' | 'loading' | 'done' | 'error'>('idle')
  const [error, setError] = useState<string | null>(null)

  const set = (key: keyof Values) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) =>
    setValues((v) => ({ ...v, [key]: e.target.value }))

  async function submit(e: FormEvent) {
    e.preventDefault()
    setState('loading')
    setError(null)
    const firstName = values.firstName.trim()
    const lastName = values.lastName.trim()
    try {
      await postDemo({ ...values, firstName, lastName, source })
      markSignedUp('coach')
      setState('done')
      onSuccess?.({ firstName, lastName, fullName: `${firstName} ${lastName}`.trim(), email: values.email })
    } catch (err) {
      setState('error')
      setError(err instanceof Error ? err.message : 'Something went wrong.')
    }
  }

  if (state === 'done') {
    return (
      <div className="glass rounded-2xl p-6 text-center sm:p-8">
        <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-mint/15 text-mint">
          <Check className="h-6 w-6" />
        </div>
        <div className="mt-4 font-display text-2xl font-semibold text-white">Demo request received.</div>
        <p className="mx-auto mt-2 max-w-md text-sm text-white/65">
          We have your studio details. We&apos;ll follow up from {site.contactEmail} with the best walkthrough path for your teaching setup.
        </p>
      </div>
    )
  }

  const short = compact || minimal

  return (
    <form onSubmit={submit} className="w-full">
      <div className={`grid gap-4 ${minimal ? '' : 'sm:grid-cols-2'}`}>
        <label className="block">
          <span className={labelCls}>First name *</span>
          <input required maxLength={100} autoFocus={autoFocus} autoComplete="given-name" placeholder="First name" value={values.firstName} onChange={set('firstName')} className={demoInputCls} />
        </label>
        <label className="block">
          <span className={labelCls}>Last name *</span>
          <input required maxLength={100} autoComplete="family-name" placeholder="Last name" value={values.lastName} onChange={set('lastName')} className={demoInputCls} />
        </label>
        <label className={`block ${minimal ? '' : 'sm:col-span-2'}`}>
          <span className={labelCls}>Email *</span>
          <input required type="email" autoComplete="email" placeholder="you@example.com" value={values.email} onChange={set('email')} className={demoInputCls} />
        </label>
        {!short && (
          <label className="block">
            <span className={labelCls}>Phone</span>
            <input type="tel" autoComplete="tel" placeholder="+1 (555) 000-0000" value={values.phone} onChange={set('phone')} className={demoInputCls} />
          </label>
        )}
        {!minimal && (
          <>
            <label className="block">
              <span className={labelCls}>Studio / Business</span>
              <input placeholder="Studio name" value={values.studioName} onChange={set('studioName')} className={demoInputCls} />
            </label>
            <label className="block">
              <span className={labelCls}>Students *</span>
              <select required value={values.studentCount} onChange={set('studentCount')} className={demoInputCls}>
                <option className="bg-ink" value="">How many?</option>
                {studentCountOptions.map((o) => (
                  <option key={o} className="bg-ink" value={o}>{o}</option>
                ))}
              </select>
            </label>
          </>
        )}
        {!short && (
          <label className="block">
            <span className={labelCls}>Teaching Format</span>
            <select value={values.teachingFormat} onChange={set('teachingFormat')} className={demoInputCls}>
              <option className="bg-ink" value="">Choose one</option>
              <option className="bg-ink" value="online">Online</option>
              <option className="bg-ink" value="in-person">In person</option>
              <option className="bg-ink" value="hybrid">Hybrid</option>
            </select>
          </label>
        )}
      </div>

      {!minimal && (
        <label className="mt-4 block">
          <span className={labelCls}>Biggest Pain *</span>
          <select required value={values.biggestPain} onChange={set('biggestPain')} className={demoInputCls}>
            <option className="bg-ink" value="">What should we show you?</option>
            {painOptions.map((o) => (
              <option key={o.value} className="bg-ink" value={o.value}>{o.label}</option>
            ))}
          </select>
        </label>
      )}

      {!short && (
        <label className="mt-4 block">
          <span className={labelCls}>Anything else?</span>
          <textarea rows={3} placeholder="Tell us what your studio needs to see." value={values.notes} onChange={set('notes')} className={`${demoInputCls} resize-y`} />
        </label>
      )}

      <div className="absolute -left-[9999px] top-auto h-px w-px overflow-hidden" aria-hidden="true">
        <label>
          Website
          <input type="text" tabIndex={-1} autoComplete="off" value={values.website} onChange={set('website')} />
        </label>
      </div>

      {error && <p className="mt-4 text-sm text-rose-300">{error}</p>}

      {minimal ? (
        <div className="mt-5">
          <button type="submit" disabled={state === 'loading'} data-cta={`demo-submit-${source}`} className="btn btn-violet w-full disabled:opacity-70">
            {state === 'loading' ? <Loader2 className="h-4 w-4 animate-spin" /> : null}
            {submitLabel}
            <ArrowRight className="h-4 w-4" />
          </button>
          {footnote !== undefined ? footnote : null}
        </div>
      ) : (
        <div className="mt-6 flex flex-col items-start gap-4 sm:flex-row sm:items-center sm:justify-between">
          {footnote !== undefined ? footnote : <p className="text-xs text-white/45">Built for vocal coaches who want to see what happens between lessons.</p>}
          <button type="submit" disabled={state === 'loading'} data-cta={`demo-submit-${source}`} className="btn btn-violet disabled:opacity-70">
            {state === 'loading' ? <Loader2 className="h-4 w-4 animate-spin" /> : null}
            {submitLabel}
            <ArrowRight className="h-4 w-4" />
          </button>
        </div>
      )}
    </form>
  )
}
