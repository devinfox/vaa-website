'use client'

import type { ReactNode } from 'react'
import { PersonaProvider } from './PersonaProvider'
import { Navbar } from './Navbar'
import { Footer } from './Footer'

/** Chrome for secondary pages: page-variant navbar (no persona toggle) + footer. */
export function PageShell({ children }: { children: ReactNode }) {
  return (
    <PersonaProvider>
      <Navbar variant="page" />
      <main>{children}</main>
      <Footer />
    </PersonaProvider>
  )
}
