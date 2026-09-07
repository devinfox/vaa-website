/**
 * Browser-side memory of what this visitor has already done, so the site
 * stops asking once they have joined a funnel. Everything here is best-effort:
 * storage can be blocked or cleared, and every call swallows those failures.
 */
import type { LeadPersona } from './site'

const SIGNUP_KEY = 'vaa-signups'

type Signups = Partial<Record<LeadPersona, string>>

export function readSignups(): Signups {
  if (typeof window === 'undefined') return {}
  try {
    const raw = localStorage.getItem(SIGNUP_KEY)
    if (!raw) return {}
    const parsed = JSON.parse(raw) as unknown
    return parsed && typeof parsed === 'object' ? (parsed as Signups) : {}
  } catch {
    return {}
  }
}

/** Record that this browser completed a role's email funnel (lead, demo request or mentorship application). */
export function markSignedUp(role: LeadPersona) {
  if (typeof window === 'undefined') return
  try {
    const next: Signups = { ...readSignups(), [role]: new Date().toISOString() }
    localStorage.setItem(SIGNUP_KEY, JSON.stringify(next))
    window.dispatchEvent(new CustomEvent('vaa:signup', { detail: role }))
  } catch {}
}

export function hasSignedUp(role: LeadPersona): boolean {
  return Boolean(readSignups()[role])
}

/** The role this visitor most recently signed up for, if any. */
export function lastSignedUpRole(): LeadPersona | null {
  const s = readSignups()
  const entries = (Object.entries(s) as [LeadPersona, string][]).filter(([, at]) => at)
  if (entries.length === 0) return null
  entries.sort((a, b) => (a[1] < b[1] ? 1 : -1))
  return entries[0][0]
}

/* ---- once-per-session flags for prompts ---- */
export function sessionFlag(key: string): boolean {
  if (typeof window === 'undefined') return false
  try {
    return sessionStorage.getItem(key) === '1'
  } catch {
    return false
  }
}

export function setSessionFlag(key: string) {
  if (typeof window === 'undefined') return
  try {
    sessionStorage.setItem(key, '1')
  } catch {}
}

/* ---- frequency capping for prompts (modals, slide-ins) ----
 * Industry defaults: show at most once per session, back off for a week after
 * a dismissal, and stop asking entirely after a couple of dismissals.
 */
type PromptState = { shownAt?: string; dismissedAt?: string; dismissals?: number }

const DAY = 24 * 60 * 60 * 1000

function promptKey(key: string) {
  return `vaa-prompt-${key}`
}

export function readPrompt(key: string): PromptState {
  if (typeof window === 'undefined') return {}
  try {
    const raw = localStorage.getItem(promptKey(key))
    return raw ? (JSON.parse(raw) as PromptState) : {}
  } catch {
    return {}
  }
}

function writePrompt(key: string, next: PromptState) {
  try {
    localStorage.setItem(promptKey(key), JSON.stringify(next))
  } catch {}
}

export function promptEligible(key: string, opts: { cooldownDays?: number; maxDismissals?: number } = {}): boolean {
  const { cooldownDays = 7, maxDismissals = 2 } = opts
  if (sessionFlag(promptKey(key))) return false
  const s = readPrompt(key)
  if ((s.dismissals ?? 0) >= maxDismissals) return false
  if (s.dismissedAt && Date.now() - Date.parse(s.dismissedAt) < cooldownDays * DAY) return false
  return true
}

export function recordPromptShown(key: string) {
  setSessionFlag(promptKey(key))
  writePrompt(key, { ...readPrompt(key), shownAt: new Date().toISOString() })
}

export function recordPromptDismissed(key: string) {
  const s = readPrompt(key)
  writePrompt(key, { ...s, dismissedAt: new Date().toISOString(), dismissals: (s.dismissals ?? 0) + 1 })
}

/** True when the prompt fired earlier in this browser session (shown, converted or dismissed). */
export function promptShownThisSession(key: string) {
  return sessionFlag(promptKey(key))
}
