'use client'

import { ArrowRight, Calendar, Check, Users, Video } from 'lucide-react'
import { site } from '@/lib/site'
import { Browser, MacBook } from './DeviceFrames'
import { SectionHeading } from './SectionHeading'
import { TeacherDemoForm } from './TeacherDemoForm'
import { usePersona } from './PersonaProvider'

const tiles = [
  {
    title: 'Your students’ practice, visible',
    body: 'Every pitch, rhythm and scale session your students complete appears in your roster: who practiced today, who needs support, recent activity and coaching signals. Walk into each voice lesson already knowing what they worked on.',
    src: '/images/app/teacher_students_content.webp',
    alt: 'My Students roster with per-student pitch, rhythm and scale scores, 14-day activity and coaching signals',
    aspect: 'aspect-[16/10]',
    url: 'voicealchemyacademy.app/students',
  },
  {
    title: 'Build and sell your own courses',
    body: 'Create singing courses with modules, lessons and quizzes. Publish them to your own students or share them with the academy.',
    src: '/images/app/teacher_courses_content.webp',
    alt: 'Vocal Progress Paths and Course Studio with a Create Course & Quizzes button',
    aspect: 'aspect-[16/10]',
    url: 'voicealchemyacademy.app/courses/builder',
  },
  {
    title: 'Every student, one page',
    body: 'See 30-day vocal training scores, recent practice sessions, the next lesson, your latest notes and coaching signals on one student page. Assign the work there and see whether it gets done.',
    src: '/images/app/teacher_student_detail_content.webp',
    alt: 'Student detail page with tool performance, recent sessions, next lesson, lesson notes and coaching signal',
    aspect: 'aspect-[16/10]',
    url: 'voicealchemyacademy.app/training/scales',
  },
]

const liveBullets = ['Online voice lessons inside the app', 'Automatic transcripts and summaries', 'Notes feed the student’s AI coach', 'Calendar and scheduling included']

export function CoachSection() {
  const { isCoach } = usePersona()
  return (
    <section id="coaches" className="relative py-24 sm:py-32">
      <div className="pointer-events-none absolute right-[-10%] top-0 -z-10 h-[600px] w-[600px] rounded-full bg-violet/15 blur-[150px]" />
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <SectionHeading
          eyebrow="For vocal coaches"
          tone="violet"
          title={
            isCoach ? (
              <>
                Built for the way you <span className="text-violet-gradient">actually teach</span>.
              </>
            ) : (
              <>
                Run your whole studio from <span className="text-violet-gradient">one dashboard</span>.
              </>
            )
          }
          body="Roster, scheduling, courses, online voice lessons and every student’s practice data. Book a demo and we’ll show how VAA fits the way you already teach."
        />

        {!isCoach && (
          <div className="relative mx-auto mt-16 max-w-5xl">
            <div className="pointer-events-none absolute inset-x-[15%] top-[25%] -z-10 h-[55%] rounded-full bg-violet/15 blur-[110px]" />
            <MacBook src="/images/app/coach_dashboard.webp" alt="Voice Alchemy Academy coach dashboard with active students, live studio and practice arena" />
          </div>
        )}

        <div className="mt-16 grid gap-6 lg:grid-cols-2">
          {tiles.map((t, i) => (
            <div key={t.title} className={`glass glass-hover rounded-3xl p-6 sm:p-8 ${i === 0 ? 'lg:col-span-2' : ''}`}>
              <div className={i === 0 ? 'grid items-center gap-8 lg:grid-cols-12' : ''}>
                <div className={i === 0 ? 'lg:col-span-4' : ''}>
                  <h3 className="font-display text-2xl font-semibold text-white sm:text-3xl">{t.title}</h3>
                  <p className="mt-4 text-sm leading-relaxed text-white/65 sm:text-base">{t.body}</p>
                </div>
                <div className={`${i === 0 ? 'lg:col-span-8' : 'mt-6'}`}>
                  <Browser src={t.src} alt={t.alt} aspect={t.aspect} url={t.url} />
                </div>
              </div>
            </div>
          ))}

          <div className="glass-violet glass-hover relative overflow-hidden rounded-3xl p-6 sm:p-8 lg:col-span-2">
            <div className="pointer-events-none absolute -right-16 -top-16 h-56 w-56 rounded-full bg-violet/25 blur-[80px]" />
            <div className="relative grid items-center gap-8 lg:grid-cols-12">
              <div className="lg:col-span-7">
                <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.18em] text-violet">
                  <Video className="h-4 w-4" /> Live classroom
                </div>
                <h3 className="mt-4 font-display text-2xl font-semibold text-white sm:text-3xl">
                  Teach live. Let the app take the notes.
                </h3>
                <p className="mt-4 text-sm leading-relaxed text-white/65 sm:text-base">
                  Teach online voice lessons inside the platform. Each session is transcribed and summarized automatically, and
                  the summary feeds the student&apos;s AI coach so your advice stays with them between lessons.
                </p>
                <ul className="mt-6 grid gap-2 sm:grid-cols-2">
                  {liveBullets.map((b) => (
                    <li key={b} className="flex items-center gap-3 text-sm text-white/80">
                      <Check className="h-4 w-4 text-violet" /> {b}
                    </li>
                  ))}
                </ul>
              </div>
              <div className="grid grid-cols-2 gap-4 lg:col-span-5">
                {[
                  { icon: Users, k: 'Roster', v: 'Every student, one view' },
                  { icon: Video, k: 'Live', v: 'Online voice lessons' },
                  { icon: Calendar, k: 'Calendar', v: 'Scheduling built in' },
                  { icon: Check, k: 'Notes', v: 'Auto transcripts' },
                ].map((s) => (
                  <div key={s.k} className="glass rounded-2xl p-4">
                    <s.icon className="h-5 w-5 text-violet" />
                    <div className="mt-4 text-xs font-semibold uppercase tracking-wider text-white/50">{s.k}</div>
                    <div className="mt-1 text-sm font-medium text-white">{s.v}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        <div className="mt-16 flex flex-col items-center gap-4 text-center">
          <a href={site.demoCoach} data-cta="coaches-bottom-demo" className="btn btn-violet">
            Book a platform demo
            <ArrowRight className="h-4 w-4" />
          </a>
          <p className="max-w-md text-sm text-white/55">
            We&apos;ll tailor the walkthrough around your student count, teaching format and the parts of your studio that need the most support.
          </p>
        </div>

        <div id="teacher-demo" className="mx-auto mt-16 max-w-3xl scroll-mt-24">
          <div className="glass-violet rounded-[2rem] p-8 sm:p-12">
            <div className="text-center">
              <div className="eyebrow">
                <span className="h-1.5 w-1.5 rounded-full bg-violet" /> Platform demo
              </div>
              <h3 className="mt-4 font-display text-3xl font-medium leading-tight text-white sm:text-4xl">
                See VAA with your voice studio.
              </h3>
              <p className="mx-auto mt-4 max-w-xl text-sm leading-relaxed text-white/65 sm:text-base">
                Tell us how you teach. We&apos;ll show student practice data, online lessons, notes, recordings, scheduling and courses in context.
              </p>
            </div>
            <div className="mt-6">
              <TeacherDemoForm source="coach-section" />
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
