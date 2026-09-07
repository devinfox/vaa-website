'use client'

import { ArrowRight, CalendarCheck, Check, Mic2, Sparkles, Users } from 'lucide-react'
import { site } from '@/lib/site'
import { MacBook, Phone } from './DeviceFrames'
import { PhonePitchScreen } from './PhonePitchScreen'
import { usePersona } from './PersonaProvider'

export function Hero() {
  const { persona, isCoach, setPersona } = usePersona()

  const copy = {
    explorer: {
      eyebrow: 'Now on iPhone, iPad & the web',
      title: (
        <>
          Your voice, finally <em className="text-gold-gradient not-italic">visible</em>.
        </>
      ),
      body:
        'Voice Alchemy Academy turns vocal practice into something you can actually see: live pitch tracking, scale and rhythm scoring, progress streaks and structured singing lessons. When you want more support, AI coaching, courses and a real voice mentor are built in.',
      proof: ['Free vocal training tools', 'Real-time pitch detection', '1:1 voice mentorship built in'],
      shot: '/images/app/student_training_pitch.webp',
      alt: 'Voice Alchemy Academy Training Center showing a student’s Pitch Trainer scores and Singer Performance Insights',
    },
    singer: {
      eyebrow: 'For singers & artists',
      title: (
        <>
          Stop guessing. <em className="text-gold-gradient not-italic">Sing</em> yourself improve.
        </>
      ),
      body:
        'Sing into your phone or laptop and watch every note land in real time. Start free with pitch, scale and rhythm practice, build a streak, then add deeper vocal coaching, courses and 1:1 mentorship when you want a bigger push.',
      proof: ['Live pitch feedback as you sing', 'Free pitch, scale & rhythm tools', 'Mentors who see your practice data'],
      shot: '/images/app/student_training_pitch.webp',
      alt: 'Voice Alchemy Academy Training Center showing a student’s Pitch Trainer scores and Singer Performance Insights',
    },
    coach: {
      eyebrow: 'For vocal coaches & studios',
      title: (
        <>
          See what students practiced <em className="text-violet-gradient not-italic">before every lesson</em>.
        </>
      ),
      body:
        'Book a platform walkthrough and we’ll show you how VAA helps voice teachers manage students, scheduling, online lessons, courses and between-lesson practice data in one place.',
      proof: ['Student practice data', 'Live lessons with automatic notes', 'Course builder & quizzes'],
      shot: '/images/app/coach_dashboard.webp',
      alt: 'Voice Alchemy Academy coach dashboard with active students, live studio and practice arena',
    },
  }[persona]

  return (
    <section className="relative overflow-hidden pt-32 pb-24 sm:pb-32 lg:pt-48">
      <div className={`pointer-events-none absolute left-1/2 top-24 -z-10 h-[520px] w-[900px] -translate-x-1/2 rounded-full blur-[140px] animate-glow ${isCoach ? 'bg-violet/25' : 'bg-violet/20'}`} />
      <div className={`pointer-events-none absolute right-[-10%] top-[40%] -z-10 h-[420px] w-[420px] rounded-full blur-[120px] ${isCoach ? 'bg-violet/10' : 'bg-gold/10'}`} />

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-4xl text-center">
          <div className="eyebrow rise rise-1">
            <span className="relative flex h-2 w-2">
              <span className={`absolute inline-flex h-full w-full animate-ping rounded-full opacity-60 ${isCoach ? 'bg-violet' : 'bg-gold'}`} />
              <span className={`relative inline-flex h-2 w-2 rounded-full ${isCoach ? 'bg-violet' : 'bg-gold'}`} />
            </span>
            {copy.eyebrow}
          </div>

          <h1 className="rise rise-2 mt-6 font-display text-5xl font-medium leading-[1.02] tracking-tight text-white sm:text-6xl lg:text-[5.25rem]">
            {copy.title}
          </h1>

          <p className="rise rise-3 mx-auto mt-6 max-w-2xl text-base leading-relaxed text-white/70 sm:text-lg">{copy.body}</p>

          <div className="rise rise-4 mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
            {isCoach ? (
              <>
                <a href={site.demoCoach} data-cta="hero-coach-demo" className="btn btn-violet w-full sm:w-auto">
                  <Users className="h-4 w-4" />
                  Book a platform demo
                  <ArrowRight className="h-4 w-4" />
                </a>
                <a href="#coaches" className="btn btn-ghost w-full sm:w-auto">
                  <CalendarCheck className="h-4 w-4 text-violet" />
                  See teacher tools
                </a>
              </>
            ) : (
              <>
                <a href={site.signupSinger} data-cta="hero-singer" className="btn btn-gold w-full sm:w-auto">
                  <Mic2 className="h-4 w-4" />
                  Start singing free
                  <ArrowRight className="h-4 w-4" />
                </a>
                {persona === 'singer' ? (
                  <a href="#mentorship" className="btn btn-ghost w-full sm:w-auto">
                    <Sparkles className="h-4 w-4 text-gold" />
                    Explore 1:1 mentorship
                  </a>
                ) : (
                  <button type="button" onClick={() => setPersona('coach')} data-cta="hero-switch-coach" className="btn btn-ghost w-full sm:w-auto">
                    <Users className="h-4 w-4 text-violet" />
                    I teach voice
                  </button>
                )}
              </>
            )}
          </div>

          <ul className="rise rise-4 mt-6 flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-sm text-white/65">
            {copy.proof.map((p) => (
              <li key={p} className="flex items-center gap-3">
                <span className="flex h-4 w-4 items-center justify-center rounded-full bg-mint/15 text-mint">
                  <Check className="h-3 w-3" />
                </span>
                {p}
              </li>
            ))}
          </ul>
        </div>

        <div className="relative mx-auto mt-16 max-w-6xl">
          <div className={`pointer-events-none absolute inset-x-[10%] top-[20%] -z-10 h-[60%] rounded-full blur-[110px] ${isCoach ? 'bg-violet/15' : 'bg-gold/10'}`} />
          <div className="relative lg:pl-24">
            <div className="animate-float">
              <MacBook src={copy.shot} alt={copy.alt} priority />
            </div>
            <div className="absolute -bottom-16 left-0 hidden w-[28%] max-w-[250px] sm:block lg:-left-2 lg:w-[24%]">
              <div className="animate-float" style={{ animationDelay: '1.5s' }}>
                <Phone>
                  <PhonePitchScreen />
                </Phone>
              </div>
              {isCoach && (
                <p className="mt-4 text-center text-[11px] font-semibold uppercase tracking-[0.18em] text-white/40">What your students see</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
