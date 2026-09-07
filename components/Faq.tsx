'use client'

import { ChevronDown } from 'lucide-react'
import { SectionHeading } from './SectionHeading'
import { usePersona } from './PersonaProvider'
import { faqs, type Faq } from '@/lib/faqs'



export function Faq() {
  const { persona } = usePersona()
  const shown = faqs.filter((f) => f.who === 'all' || persona === 'explorer' || f.who === persona)
  return (
    <section id="faq" className="relative py-24 sm:py-32">
      <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
        <SectionHeading
          eyebrow="Questions"
          tone={persona === 'coach' ? 'violet' : 'gold'}
          title={persona === 'coach' ? <>What voice teachers usually ask before switching.</> : <>What singers usually ask before they start.</>}
        />
        <div className="mt-16 space-y-4">
          {shown.map((f) => (
            <details key={f.q} className="faq glass group rounded-2xl p-6">
              <summary className="flex items-center justify-between gap-4">
                <span className="font-display text-xl font-semibold text-white sm:text-2xl">{f.q}</span>
                <ChevronDown className={`faq-chevron h-5 w-5 shrink-0 ${persona === 'coach' ? 'text-violet' : 'text-gold'}`} />
              </summary>
              <p className="mt-4 text-sm leading-relaxed text-white/65 sm:text-base">{persona === 'coach' && f.aCoach ? f.aCoach : f.a}</p>
            </details>
          ))}
        </div>
      </div>
    </section>
  )
}
