'use client'

import { useEffect, useRef, type ReactNode } from 'react'
import { X } from 'lucide-react'

type Props = {
  open: boolean
  onClose: () => void
  labelledBy: string
  tone?: 'gold' | 'violet'
  children: ReactNode
}

/**
 * Dialog shell for nurture prompts: bottom sheet on small screens, centered card on
 * larger ones. Scroll lock, Escape, overlay click, focus trap, and initial focus on the
 * element marked data-autofocus (falls back to the first focusable).
 */
export function PromptDialog({ open, onClose, labelledBy, tone = 'gold', children }: Props) {
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!open) return
    const prev = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    const node = ref.current
    const focusables = () =>
      Array.from(node?.querySelectorAll<HTMLElement>('button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])') ?? []).filter(
        (el) => !el.hasAttribute('disabled') && el.getAttribute('aria-hidden') !== 'true' && el.closest('[aria-hidden="true"]') === null,
      )
    const first = focusables().find((el) => el.dataset.autofocus === 'true') ?? focusables()[0]
    first?.focus()
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        e.preventDefault()
        onClose()
        return
      }
      if (e.key !== 'Tab') return
      const list = focusables()
      if (list.length === 0) return
      const a = list[0]
      const z = list[list.length - 1]
      if (e.shiftKey && document.activeElement === a) {
        e.preventDefault()
        z.focus()
      } else if (!e.shiftKey && document.activeElement === z) {
        e.preventDefault()
        a.focus()
      }
    }
    window.addEventListener('keydown', onKey)
    return () => {
      document.body.style.overflow = prev
      window.removeEventListener('keydown', onKey)
    }
  }, [open, onClose])

  if (!open) return null

  const glass = tone === 'violet' ? 'glass-violet' : 'glass-gold'
  const glow = tone === 'violet' ? 'bg-violet/25' : 'bg-gold/20'

  return (
    <div className="fixed inset-0 z-[70] flex items-end justify-center bg-ink/75 backdrop-blur-sm sm:items-center sm:p-4" role="presentation" onClick={onClose}>
      <div
        ref={ref}
        role="dialog"
        aria-modal="true"
        aria-labelledby={labelledBy}
        className={`modal-enter ${glass} relative w-full max-h-[92vh] overflow-y-auto rounded-t-3xl p-6 sm:max-w-md sm:rounded-3xl sm:p-8`}
        onClick={(e) => e.stopPropagation()}
      >
        <div className={`pointer-events-none absolute -right-16 -top-16 h-48 w-48 rounded-full blur-[80px] ${glow}`} />
        <button type="button" onClick={onClose} className="absolute right-4 top-4 rounded-full p-2 text-white/60 transition hover:bg-white/10 hover:text-white" aria-label="Close">
          <X className="h-5 w-5" />
        </button>
        <div className="relative">{children}</div>
      </div>
    </div>
  )
}

/** Neutral decline link. Never guilt-trips ("No, I don't want to improve"). */
export function DeclineButton({ onClick, cta }: { onClick: () => void; cta: string }) {
  return (
    <button type="button" data-cta={cta} onClick={onClick} className="w-full py-1 text-center text-sm font-medium text-white/50 transition hover:text-white">
      No thanks, I&rsquo;ll keep reading
    </button>
  )
}
