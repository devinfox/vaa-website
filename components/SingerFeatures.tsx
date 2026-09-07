import { ArrowRight, Sparkles } from 'lucide-react'
import { site } from '@/lib/site'
import { Browser } from './DeviceFrames'
import { SectionHeading } from './SectionHeading'

const features = [
  {
    kicker: 'Pitch Trainer',
    title: 'See every note the moment you sing it.',
    body: 'The live pitch trainer shows exactly where each note lands as you sing. Pitch accuracy, vocal stability and tuning habits are tracked session by session, so progress stops being a guess.',
    chips: ['Live pitch feedback', 'Cents accuracy', 'Streaks & best scores'],
    mentor: 'Your mentor sees the same data before your next lesson.',
    src: '/images/app/student_training_pitch_content.webp',
    alt: 'Pitch Trainer with current streak, best score, Singer Performance Insights and an “Improving” banner',
    url: 'voicealchemyacademy.app/training/pitch',
  },
  {
    kicker: 'AI Coach Feedback',
    title: 'Feedback based on how you actually practice.',
    body: 'When you want more guidance, the AI coach connects your teacher’s lesson notes with your pitch and rhythm data, then gives you strengths, focus areas, personal tips and the next vocal exercises to practice.',
    chips: ['Weekly analysis', 'Strengths & focus areas', 'Personalized drills'],
    mentor: 'Mentorship students get their coach’s notes woven directly into the feedback.',
    src: '/images/app/ai_coach_card.webp',
    alt: 'AI Coach Feedback card referencing the teacher’s lessons, with strengths, focus areas, tips and exercises',
    url: 'voicealchemyacademy.app/training/analysis',
    aspect: 'aspect-[16/9]',
  },
  {
    kicker: 'Lesson Notes',
    title: 'Your teacher’s notes, with homework that shows up in your trainers.',
    body: 'Every live voice lesson ends with notes and an AI summary: what you covered, what your teacher heard and what to practice next. Assigned scales and vocal drills appear in your Training Center, so homework is easy to find.',
    chips: ['Published after every lesson', 'AI summary', 'Homework synced'],
    mentor: 'This is the loop mentorship runs on: lesson, notes, practice, repeat.',
    src: '/images/app/lesson_notes_card.webp',
    alt: 'Recent Lesson Notes with AI summary, topics covered, teacher feedback and homework',
    url: 'voicealchemyacademy.app/training',
    aspect: 'aspect-[16/9]',
  },
  {
    kicker: 'Scales & Rhythm',
    title: 'Scales, intervals and timing, scored.',
    body: 'Choose a scale, root and octave, then sing. The scale trainer follows each note in order and scores pitch, sequence and timing. The rhythm trainer checks your timing against a metronome.',
    chips: ['Major, minor, pentatonic', 'Ascending & descending', 'On-beat scoring'],
    mentor: 'Coaches can assign specific scales as homework.',
    src: '/images/app/student_training_scales_content.webp',
    alt: 'Scale Trainer with best score, sequence accuracy, pitch accuracy and recent scale sessions',
    url: 'voicealchemyacademy.app/training/scales',
  },
  {
    kicker: 'Courses',
    title: 'A real vocal curriculum, not a pile of videos.',
    body: 'Structured singing courses from working vocal coaches, with lesson breakdowns, key points, quizzes and progress tracking. Start with Beginner Vocal Foundations and keep building from there.',
    chips: ['Lesson-by-lesson progress', 'Quizzes', 'Built by vocal coaches'],
    mentor: 'Mentors prescribe the exact lessons you need next.',
    src: '/images/app/student_course_player_content.webp',
    alt: 'Course player showing Beginner Vocal Foundations at 45% progress with the curriculum sidebar',
    url: 'voicealchemyacademy.app/courses',
  },
]

export function SingerFeatures() {
  return (
    <section id="singers" className="relative py-24 sm:py-32">
      <div className="pointer-events-none absolute left-[-10%] top-1/3 -z-10 h-[500px] w-[500px] rounded-full bg-gold/10 blur-[140px]" />
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <SectionHeading
          eyebrow="For singers"
          title={
            <>
              Practice that <span className="text-gold-gradient">proves</span> you&apos;re improving.
            </>
          }
          body="Everything below is in the app today. No plugins, no extra hardware. Open it, sing, and watch the numbers move."
        />

        <div className="mt-16 space-y-24 sm:space-y-32">
          {features.map((f, i) => {
            const flip = i % 2 === 1
            return (
              <div key={f.kicker} className="grid items-center gap-12 lg:grid-cols-12">
                <div className={`lg:col-span-5 ${flip ? 'lg:order-2' : ''}`}>
                  <span className="text-xs font-semibold uppercase tracking-[0.2em] text-gold">{f.kicker}</span>
                  <h3 className="mt-4 font-display text-3xl font-medium leading-tight text-white sm:text-4xl lg:text-[2.75rem]">
                    {f.title}
                  </h3>
                  <p className="mt-4 text-white/65 leading-relaxed">{f.body}</p>
                  <div className="mt-6 flex flex-wrap gap-2">
                    {f.chips.map((c) => (
                      <span key={c} className="rounded-full border border-white/10 bg-white/[0.04] px-3 py-1 text-xs font-medium text-white/75">
                        {c}
                      </span>
                    ))}
                  </div>
                  <div className="mt-6 flex items-start gap-3 rounded-xl border border-gold/20 bg-gold/[0.06] px-4 py-3 text-sm text-white/75">
                    <Sparkles className="mt-0.5 h-4 w-4 shrink-0 text-gold" />
                    <span>
                      <span className="font-semibold text-gold">With mentorship: </span>
                      {f.mentor}
                    </span>
                  </div>
                </div>

                <div className={`lg:col-span-7 ${flip ? 'lg:order-1' : ''}`}>
                  <div className="relative">
                    <div className={`pointer-events-none absolute -inset-6 -z-10 rounded-[2rem] blur-3xl ${flip ? 'bg-violet/10' : 'bg-gold/10'}`} />
                    <Browser src={f.src} alt={f.alt} url={f.url} aspect={f.aspect ?? 'aspect-[16/10]'} />
                  </div>
                </div>
              </div>
            )
          })}
        </div>

        <div className="mt-16 flex flex-col items-center gap-4 text-center">
          <a href={site.signupSinger} data-cta="singers-bottom" className="btn btn-gold">
            Start singing free
            <ArrowRight className="h-4 w-4" />
          </a>
          <p className="text-sm text-white/50">Free to start. Works on iPhone, iPad and any browser.</p>
        </div>
      </div>
    </section>
  )
}
