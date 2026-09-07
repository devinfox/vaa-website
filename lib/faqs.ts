/** FAQ content shared by the FAQ section and the FAQPage structured data. */
/** `a` is the singer / explorer answer; `aCoach` replaces it in the coach view. */
export type Faq = { q: string; a: string; aCoach?: string; who: 'all' | 'singer' | 'coach' }

export const faqs: Faq[] = [
  {
    who: 'singer',
    q: 'Is it really free to start?',
    a: 'Yes. Create an account, open the Training Center and start singing. The pitch, scale and rhythm trainers are available right away. Courses, mentorship and advanced coaching tools are paid upgrades.',
  },
  {
    who: 'coach',
    q: 'What does a demo involve?',
    a: 'A short live walkthrough on a video call, built around your student count and teaching format. We start with what matters most to your studio, then show roster, student practice data, online lessons, notes, scheduling and courses. Bring questions; there is nothing to prepare.',
  },
  {
    who: 'all',
    q: 'Do I need a special microphone?',
    a: 'No. The pitch detection runs on your phone or laptop microphone. Headphones help when you practice with backing tracks, but nothing is required.',
    aCoach: 'No. Your students’ pitch detection runs on their phone or laptop microphone, and online voice lessons use your normal webcam and mic. Nothing to buy or install for either side.',
  },
  {
    who: 'all',
    q: 'What does the AI coach actually do?',
    a: 'For upgraded coaching, it analyzes pitch and rhythm data plus any notes your teacher has left, then gives you a short summary: strengths, areas to focus on and three personalized drills. It is a practice partner, not a replacement for a human vocal coach.',
    aCoach: 'It reads each student’s pitch and rhythm data together with the notes you left after the last lesson, then gives them a short summary: strengths, focus areas and three drills. Your corrections stay with them all week. It supports your teaching; it does not replace it.',
  },
  {
    who: 'singer',
    q: 'How does 1:1 mentorship work?',
    a: 'You apply, we match you with a Voice Alchemy mentor, and you meet weekly for live online voice lessons inside the app. Every lesson is transcribed and summarized, and your mentor assigns courses and drills that appear in your Training Center. Seats are limited each semester.',
  },
  {
    who: 'coach',
    q: 'Can I bring my existing students?',
    a: 'Yes. Book a demo and we’ll show how existing students move into the platform. You get the roster, their practice data, scheduling, online lessons and the course builder.',
  },
  {
    who: 'coach',
    q: 'What does it cost to run my studio here?',
    a: 'Book a platform demo and we will walk you through current studio access, pricing and what is included for your students.',
  },
  {
    who: 'all',
    q: 'Which devices are supported?',
    a: 'iPhone and iPad via the App Store, plus any modern desktop or mobile browser. Your progress syncs across all of them.',
    aCoach: 'Your students use iPhone, iPad or any modern browser; the coach dashboard works on any desktop or tablet browser. Practice data syncs across all of them.',
  },
]
