'use client'

import { useCallback, useEffect, useState } from 'react'
import type { LeadPersona } from './site'
import { hasSignedUp, promptEligible, recordPromptDismissed, recordPromptShown } from './visitor'

/* Engagement thresholds. Never on load: wait for a real signal of interest. */
const MIN_DWELL_MS = 8_000
const DWELL_MS = 25_000
const SCROLL_DEPTH = 0.45

type Options = {
  /** Storage key for frequency capping. */
  promptKey: string
  /** The funnel this prompt feeds; a browser that already joined it is never asked. */
  role: LeadPersona
  /** Arm the trigger only while true (e.g. the matching persona view is showing). */
  enabled: boolean
  /** Section id of the on-page form; the prompt stays quiet while it is in view. */
  avoidId?: string
}

/**
 * Shared trigger + frequency-capping engine for nurture prompts.
 *  - Fires once per session on scroll depth or dwell time, never before a minimum dwell.
 *  - Never while the visitor is at (or typing in) the on-page form.
 *  - A week off after a dismissal, silent after two, never after a signup.
 */
export function useEngagementPrompt({ promptKey, role, enabled, avoidId }: Options) {
  const [open, setOpen] = useState(false)

  useEffect(() => {
    if (!enabled) return
    if (hasSignedUp(role) || !promptEligible(promptKey)) return

    const start = Date.now()
    let done = false
    let reachedDepth = false

    const engagedWithForm = () => {
      const el = avoidId ? document.getElementById(avoidId) : null
      if (el) {
        const r = el.getBoundingClientRect()
        if (r.top < window.innerHeight && r.bottom > 0) return true
      }
      const tag = document.activeElement?.tagName
      return tag === 'INPUT' || tag === 'TEXTAREA' || tag === 'SELECT'
    }

    const fire = () => {
      if (done || Date.now() - start < MIN_DWELL_MS) return
      if (hasSignedUp(role) || engagedWithForm()) return
      if (document.body.style.overflow === 'hidden') return // another dialog is up
      done = true
      cleanup()
      recordPromptShown(promptKey)
      setOpen(true)
    }

    const onScroll = () => {
      const max = document.documentElement.scrollHeight - window.innerHeight
      if (max > 0 && window.scrollY / max >= SCROLL_DEPTH) {
        reachedDepth = true
        fire()
      }
    }
    const dwell = window.setTimeout(fire, DWELL_MS)
    // retries cover depth reached before the minimum dwell, and a fire() that bailed
    // because the visitor was at the on-page form (or another dialog) at that moment
    const retry = window.setInterval(() => {
      const elapsed = Date.now() - start
      if (elapsed >= DWELL_MS || (reachedDepth && elapsed >= MIN_DWELL_MS)) fire()
    }, 2_000)
    window.addEventListener('scroll', onScroll, { passive: true })

    const cleanup = () => {
      window.clearTimeout(dwell)
      window.clearInterval(retry)
      window.removeEventListener('scroll', onScroll)
    }
    return cleanup
  }, [enabled, role, promptKey, avoidId])

  /** Closed without converting: starts the cooldown. */
  const dismiss = useCallback(() => {
    recordPromptDismissed(promptKey)
    setOpen(false)
  }, [promptKey])

  /** Closed after converting (or after the thank-you): no cooldown penalty. */
  const complete = useCallback(() => setOpen(false), [])

  return { open, dismiss, complete }
}
