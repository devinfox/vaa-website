'use client'

import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useSyncExternalStore, type ReactNode } from 'react'
import type { Persona } from '@/lib/site'
import { lastSignedUpRole } from '@/lib/visitor'

type SetOpts = {
  scrollTop?: boolean
  /** Scroll to this in-page anchor once the new view has rendered (e.g. '#teacher-demo'). */
  hash?: string
}

type Ctx = {
  persona: Persona
  /** true when the visitor has arrived with ?view= / a stored choice or has switched manually */
  chosen: boolean
  setPersona: (p: Persona, opts?: SetOpts) => void
  isCoach: boolean
  isSinger: boolean
  isExplorer: boolean
}

const PersonaContext = createContext<Ctx | null>(null)
const STORAGE_KEY = 'vaa-view'

const fromParam: Record<string, Persona> = {
  teacher: 'coach',
  coach: 'coach',
  student: 'singer',
  singer: 'singer',
  explore: 'explorer',
  explorer: 'explorer',
}
const toParam: Record<Persona, string> = { coach: 'teacher', singer: 'student', explorer: 'explore' }

/* ---- tiny external store so SSR defaults to the student funnel and the client hydrates to any stored choice ---- */
type Snapshot = { persona: Persona; chosen: boolean }
const SERVER_SNAPSHOT: Snapshot = { persona: 'singer', chosen: true }

let snapshot: Snapshot | null = null
let lastSearch: string | null = null
const listeners = new Set<() => void>()

function personaFromUrl(): Persona | null {
  const q = new URLSearchParams(window.location.search).get('view')
  return q && fromParam[q] ? fromParam[q] : null
}

function readInitial(): Snapshot {
  const fromUrl = personaFromUrl()
  if (fromUrl) return { persona: fromUrl, chosen: true }
  try {
    const s = localStorage.getItem(STORAGE_KEY)
    if (s && s in toParam) return { persona: s as Persona, chosen: true }
  } catch {}
  // Returning visitor who already joined a funnel: skip the gate and open their side.
  const signed = lastSignedUpRole()
  if (signed) return { persona: signed, chosen: true }
  return { persona: 'singer', chosen: true }
}

function getSnapshot(): Snapshot {
  if (!snapshot) {
    snapshot = readInitial()
    lastSearch = window.location.search
    return snapshot
  }
  // Client-side navigation to /?view=… keeps this module alive, so re-read the
  // param whenever the query string changes. Result is cached per search string.
  const search = window.location.search
  if (search !== lastSearch) {
    lastSearch = search
    const fromUrl = personaFromUrl()
    if (fromUrl && (fromUrl !== snapshot.persona || !snapshot.chosen)) snapshot = { persona: fromUrl, chosen: true }
  }
  return snapshot
}

function subscribe(cb: () => void) {
  listeners.add(cb)
  return () => listeners.delete(cb)
}

function write(next: Snapshot) {
  snapshot = next
  listeners.forEach((l) => l())
}

function scrollToHash(hash: string, behavior: ScrollBehavior = 'smooth') {
  const id = hash.replace(/^#/, '')
  // The keyed <main> remounts on a persona switch, so let the new view commit first.
  // A timer rather than rAF: frames are paused in background tabs, timers are not.
  window.setTimeout(() => {
    const el = document.getElementById(id)
    el?.scrollIntoView({ behavior, block: 'start' })
  }, 60)
}

export function PersonaProvider({ children }: { children: ReactNode }) {
  const { persona, chosen } = useSyncExternalStore(subscribe, getSnapshot, () => SERVER_SNAPSHOT)

  const setPersona = useCallback((p: Persona, opts?: SetOpts) => {
    write({ persona: p, chosen: true })
    try {
      localStorage.setItem(STORAGE_KEY, p)
    } catch {}
    const url = new URL(window.location.href)
    url.searchParams.set('view', toParam[p])
    url.hash = opts?.hash ?? ''
    lastSearch = url.search
    window.history.replaceState(null, '', url)
    if (opts?.hash) scrollToHash(opts.hash)
    else if (opts?.scrollTop !== false) window.scrollTo({ top: 0, behavior: 'smooth' })
  }, [])

  // A full load of /?view=teacher#teacher-demo renders the student view on the
  // server, so the browser cannot find the anchor. Finish the jump once the
  // client has switched to the requested view.
  const jumped = useRef(false)
  useEffect(() => {
    if (jumped.current || !chosen) return
    if (window.location.hash && personaFromUrl()) {
      jumped.current = true
      const hash = window.location.hash
      scrollToHash(hash, 'instant')
      // The browser restores scroll position at `load`, which can land after hydration on an
      // image-heavy page and undo the jump. Repeat it once the load has settled.
      if (document.readyState !== 'complete') window.addEventListener('load', () => scrollToHash(hash, 'instant'), { once: true })
    }
  }, [chosen])

  const value = useMemo<Ctx>(
    () => ({
      persona,
      chosen,
      setPersona,
      isCoach: persona === 'coach',
      isSinger: persona === 'singer',
      isExplorer: persona === 'explorer',
    }),
    [persona, chosen, setPersona],
  )

  return <PersonaContext.Provider value={value}>{children}</PersonaContext.Provider>
}

export function usePersona() {
  const ctx = useContext(PersonaContext)
  if (!ctx) throw new Error('usePersona must be used inside PersonaProvider')
  return ctx
}
