'use client'

import { PersonaProvider, usePersona } from './PersonaProvider'
import { Navbar } from './Navbar'
import { Hero } from './Hero'
import { Ticker } from './Ticker'
import { PathSplit } from './PathSplit'
import { SingerFeatures } from './SingerFeatures'
import { MentorshipBand } from './MentorshipBand'
import { CoachSection } from './CoachSection'
import { ScreenGallery } from './ScreenGallery'
import { Testimonials } from './Testimonials'
import { Faq } from './Faq'
import { FinalCta } from './FinalCta'
import { Footer } from './Footer'
import { StickyCta } from './StickyCta'
import { ExitIntent } from './ExitIntent'
import { AudienceSwitchCta } from './AudienceSwitchCta'
import { TeacherDemoPopup } from './TeacherDemoPopup'
import { StudentPopup } from './StudentPopup'

function Body() {
  const { persona, isCoach, isSinger, isExplorer } = usePersona()
  return (
    <>
      <Navbar />
      {/* key remounts the page so the fade-in plays on every switch */}
      <main key={persona} className="view-enter">
        <Hero />
        <Ticker />
        {isExplorer && <PathSplit />}
        {(isSinger || isExplorer) && <SingerFeatures />}
        {isCoach && <CoachSection />}
        <MentorshipBand />
        {isExplorer && <CoachSection />}
        <ScreenGallery />
        <Testimonials />
        <Faq />
        <FinalCta />
      </main>
      <Footer />
      <AudienceSwitchCta />
      <StickyCta />
      <TeacherDemoPopup />
      <StudentPopup />
      <ExitIntent />
    </>
  )
}

export function LandingPage() {
  return (
    <PersonaProvider>
      <Body />
    </PersonaProvider>
  )
}
