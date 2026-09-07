'use client'

import { useEffect, useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { Menu, X } from 'lucide-react'
import { site } from '@/lib/site'
import { usePersona } from './PersonaProvider'
import { PersonaToggle } from './PersonaToggle'

export function Navbar({ variant = 'landing' }: { variant?: 'landing' | 'page' }) {
  const [open, setOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const { isCoach, isExplorer } = usePersona()
  const isPage = variant === 'page'

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  const links = isPage
    ? [
        { href: '/', label: 'Home' },
        { href: '/?view=student', label: 'For Singers' },
        { href: '/?view=teacher', label: 'For Coaches' },
        { href: '/#faq', label: 'FAQ' },
      ]
    : isExplorer
    ? [
        { href: '#singers', label: 'For Singers' },
        { href: '#coaches', label: 'For Coaches' },
        { href: '/mentorship', label: 'Mentorship' },
        { href: '#faq', label: 'FAQ' },
      ]
    : [
        { href: isCoach ? '#coaches' : '#singers', label: isCoach ? 'Studio tools' : 'Training' },
        { href: isCoach ? '#mentorship' : '/mentorship', label: 'Mentorship' },
        { href: '#screens', label: 'Screens' },
        { href: '#faq', label: 'FAQ' },
      ]

  const primary = isCoach
    ? { href: site.demoCoach, label: 'Book demo', cls: 'btn-violet' }
    : { href: site.signupSinger, label: 'Start free', cls: 'btn-gold' }

  return (
    <header className="fixed inset-x-0 top-0 z-50 px-3 pt-3 sm:px-4 sm:pt-4">
      <div className={`nav-glass ${open ? 'nav-glass-open' : ''} mx-auto max-w-7xl rounded-2xl px-4 transition-all duration-300 sm:px-6 ${scrolled ? 'py-2' : 'py-3'}`}>
        <div className="flex items-center justify-between gap-4">
          <Link href="/" className="flex items-center" aria-label="Voice Alchemy Academy home">
            <Image src="/images/logo.png" alt="Voice Alchemy Academy" width={164} height={40} priority className="h-8 w-auto sm:h-9" />
          </Link>

          <nav className="hidden items-center gap-8 lg:flex">
            {links.map((l) => (
              <a key={l.href} href={l.href} className="text-sm font-medium tracking-wide text-white/70 transition hover:text-gold">
                {l.label}
              </a>
            ))}
          </nav>

          <div className="hidden items-center gap-3 lg:flex">
            {!isPage && <PersonaToggle />}
            <a href={site.login} className="btn btn-sm btn-ghost">
              Sign in
            </a>
            <a href={primary.href} data-cta="nav-primary" className={`btn btn-sm ${primary.cls}`}>
              {primary.label}
            </a>
          </div>

          <div className="flex items-center gap-2 lg:hidden">
            {!isPage && <PersonaToggle />}
            <button
              onClick={() => setOpen((v) => !v)}
              className="rounded-lg p-2 text-white/80 transition hover:text-gold"
              aria-label={open ? 'Close menu' : 'Open menu'}
              aria-expanded={open}
            >
              {open ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>

        {open && (
          <nav className="mobile-menu-glass mt-4 flex flex-col gap-1 lg:hidden">
            {links.map((l) => (
              <a key={l.href} href={l.href} onClick={() => setOpen(false)} className="rounded-lg px-3 py-2 text-sm font-medium text-white/85 hover:bg-white/8 hover:text-gold">
                {l.label}
              </a>
            ))}
            <div className="mt-2 grid grid-cols-2 gap-2">
              <a href={site.login} className="btn btn-ghost text-sm">
                Sign in
              </a>
              <a href={primary.href} data-cta="nav-primary-mobile" className={`btn ${primary.cls} text-sm`}>
                {primary.label}
              </a>
            </div>
          </nav>
        )}
      </div>
    </header>
  )
}
