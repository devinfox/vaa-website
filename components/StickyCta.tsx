'use client'

import { useEffect, useState } from 'react'
import { ArrowRight } from 'lucide-react'
import { site } from '@/lib/site'
import { usePersona } from './PersonaProvider'

/** Mobile-only bottom bar that appears once the hero scrolls away. */
export function StickyCta() {
  const [show, setShow] = useState(false)
  const { isCoach } = usePersona()
  useEffect(() => {
    const onScroll = () => setShow(window.scrollY > window.innerHeight * 0.9)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <div
      className={`fixed inset-x-0 bottom-0 z-40 px-3 pb-3 transition-all duration-300 md:hidden ${
        show ? 'translate-y-0 opacity-100' : 'pointer-events-none translate-y-6 opacity-0'
      }`}
    >
      <div className="sticky-cta-glass flex items-center justify-between gap-3 rounded-2xl px-4 py-3">
        <div className="min-w-0">
          <div className="truncate text-[11px] font-semibold uppercase tracking-[0.14em] text-violet">{isCoach ? 'For voice teachers' : 'Free for singers'}</div>
          <div className="truncate text-sm font-semibold text-white">{isCoach ? 'Book a platform demo' : 'Actually in tune?'}</div>
          <div className="truncate text-xs text-white/65">{isCoach ? 'See student practice data' : 'Try live pitch feedback'}</div>
        </div>
        <a href={isCoach ? site.demoCoach : site.signupSinger} data-cta="sticky-mobile" className={`btn btn-sm ${isCoach ? 'btn-violet' : 'btn-gold'}`}>
          {isCoach ? 'Demo' : 'Start'} <ArrowRight className="h-4 w-4" />
        </a>
      </div>
    </div>
  )
}
