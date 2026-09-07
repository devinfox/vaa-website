'use client'

import { Browser, Tablet } from './DeviceFrames'
import { SectionHeading } from './SectionHeading'
import { usePersona } from './PersonaProvider'

const studentScreens = [
  { src: '/images/app/student_courses.webp', alt: 'Course catalog', label: 'Courses' },
  { src: '/images/app/student_training_scales.webp', alt: 'Scale trainer', label: 'Scale trainer' },
  { src: '/images/app/student_training_rhythm.webp', alt: 'Rhythm trainer', label: 'Rhythm trainer' },
  { src: '/images/app/student_lesson_notes.webp', alt: 'Lesson notes archive', label: 'Lesson notes' },
  { src: '/images/app/student_my_lessons.webp', alt: 'My lessons', label: 'My lessons' },
]

const coachScreens = [
  { src: '/images/app/teacher_student_detail.webp', alt: 'Student detail', label: 'Student detail' },
  { src: '/images/app/teacher_courses.webp', alt: 'Course studio', label: 'Course studio' },
  { src: '/images/app/teacher_course_builder.webp', alt: 'Course builder', label: 'Course builder' },
  { src: '/images/app/teacher_calendar.webp', alt: 'Lesson calendar', label: 'Calendar' },
  { src: '/images/app/teacher_requests.webp', alt: 'Enrollment requests', label: 'Requests' },
]

export function ScreenGallery() {
  const { isCoach } = usePersona()
  const screens = isCoach ? coachScreens : studentScreens
  const tablet = isCoach
    ? { src: '/images/app/teacher_students.webp', alt: 'My Students roster on iPad' }
    : { src: '/images/app/student_dashboard.webp', alt: 'Student dashboard on iPad' }

  return (
    <section id="screens" className="relative overflow-hidden py-24 sm:py-32">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <SectionHeading
          eyebrow="Designed as one system"
          title={
            <>
              Every screen, <span className="text-gold-gradient">one design language.</span>
            </>
          }
          body={
            isCoach
              ? 'Dark, calm and legible at the end of a full teaching day. One interface for your dashboard on desktop and for your students on iPhone and iPad.'
              : 'Dark, calm and legible at 11pm after a long rehearsal. The same interface on iPhone, iPad and desktop.'
          }
        />

        <div className="relative mx-auto mt-16 max-w-4xl">
          <div className="pointer-events-none absolute inset-x-[20%] top-[20%] -z-10 h-[60%] rounded-full bg-gold/10 blur-[100px]" />
          <Tablet src={tablet.src} alt={tablet.alt} />
        </div>
      </div>

      <div className="no-scrollbar mt-16 flex snap-x snap-mandatory gap-6 overflow-x-auto px-4 pb-4 sm:px-6 lg:px-[max(1.5rem,calc((100vw-80rem)/2+2rem))]">
        {screens.map((s) => (
          <figure key={s.label} className="w-[82vw] shrink-0 snap-center sm:w-[480px]">
            <Browser src={s.src} alt={s.alt} sizes="(min-width: 640px) 480px, 82vw" />
            <figcaption className="mt-3 text-center text-xs font-semibold uppercase tracking-[0.18em] text-white/45">{s.label}</figcaption>
          </figure>
        ))}
      </div>
    </section>
  )
}
