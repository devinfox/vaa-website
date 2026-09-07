'use client'

import Image from 'next/image'
import { usePathname } from 'next/navigation'
import { site } from '@/lib/site'
import { usePersona } from './PersonaProvider'

type FooterLink = { l: string; h?: string; onClick?: () => void }

export function Footer() {
  const pathname = usePathname()
  const { persona, setPersona } = usePersona()
  const onLanding = pathname === '/'

  // Sections only exist in the view that owns them, so a cross-view link
  // switches the view in place instead of pointing at a missing anchor.
  const singers: FooterLink = !onLanding
    ? { l: 'For singers', h: '/?view=student' }
    : persona === 'coach'
      ? { l: 'For singers', onClick: () => setPersona('singer') }
      : { l: 'For singers', h: '#singers' }
  const coaches: FooterLink = !onLanding
    ? { l: 'For coaches', h: '/?view=teacher' }
    : persona === 'singer'
      ? { l: 'For coaches', onClick: () => setPersona('coach') }
      : { l: 'For coaches', h: '#coaches' }
  const demo: FooterLink = !onLanding
    ? { l: 'Book a teacher demo', h: `/?view=teacher${site.demoCoach}` }
    : persona === 'coach'
      ? { l: 'Book a teacher demo', h: site.demoCoach }
      : { l: 'Book a teacher demo', onClick: () => setPersona('coach', { hash: site.demoCoach }) }

  const cols: { h: string; links: FooterLink[] }[] = [
    {
      h: 'Product',
      links: [singers, coaches, { l: '1:1 Mentorship', h: '/mentorship' }, { l: 'FAQ', h: onLanding ? '#faq' : '/#faq' }],
    },
    {
      h: 'Account',
      links: [{ l: 'Sign in', h: site.login }, { l: 'Start free', h: site.signupSinger }, demo],
    },
    {
      h: 'Academy',
      links: [
        { l: 'voicealchemyacademy.com', h: site.mainSite },
        { l: 'Contact', h: `mailto:${site.contactEmail}` },
      ],
    },
  ]

  const linkCls = 'text-sm text-white/65 transition hover:text-white'

  return (
    <footer className="relative border-t border-white/[0.06] pb-32 pt-16 md:pb-16">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid gap-12 md:grid-cols-12">
          <div className="md:col-span-5">
            <Image src="/images/logo.png" alt="Voice Alchemy Academy" width={200} height={49} className="h-10 w-auto" />
            <p className="mt-4 max-w-sm text-sm leading-relaxed text-white/55">{site.tagline}</p>
          </div>
          {cols.map((c) => (
            <div key={c.h} className="md:col-span-2">
              <div className="text-xs font-semibold uppercase tracking-[0.18em] text-gold">{c.h}</div>
              <ul className="mt-4 space-y-2">
                {c.links.map((l) => (
                  <li key={l.l}>
                    {l.onClick ? (
                      <button type="button" onClick={l.onClick} className={`${linkCls} text-left`}>
                        {l.l}
                      </button>
                    ) : (
                      <a href={l.h} className={linkCls}>
                        {l.l}
                      </a>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        <div className="mt-12 flex flex-col items-start justify-between gap-4 border-t border-white/[0.06] pt-6 text-xs text-white/40 sm:flex-row sm:items-center">
          <span>© {new Date().getFullYear()} Voice Alchemy Academy LLC. All rights reserved.</span>
          <span>Made for singers who want proof, and coaches who want their evenings back.</span>
        </div>
      </div>
    </footer>
  )
}
