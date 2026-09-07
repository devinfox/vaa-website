/**
 * Single source of truth for links and brand copy.
 * Update these before launch — every CTA on the page reads from here.
 */
export const site = {
  name: 'Voice Alchemy Academy',
  shortName: 'VAA',
  tagline: 'Real-time vocal training, AI coaching and 1:1 voice mentorship in one app.',
  url: 'https://voicealchemyacademy.app',
  mainSite: 'https://voicealchemyacademy.com',
  contactEmail: 'hello@voicealchemyacademy.com',

  // Funnel destinations
  signupSinger: 'https://voicealchemyacademy.app/signup?role=student&src=landing',
  signupCoach: 'https://voicealchemyacademy.app/signup?role=teacher&src=landing',
  demoCoach: '#teacher-demo',
  login: 'https://voicealchemyacademy.app/login',
  mentorshipApply: '/mentorship',
  // Where mentorship applications are delivered (override with MENTORSHIP_TO_EMAIL)
  mentorshipInbox: 'voicealchemyacademy@gmail.com',
  founder: 'Julia',
  instagram: 'https://instagram.com/VoiceAlchemyAcademy',

  // Store links — replace '#' with the real App Store URL when live
  appStore: '#',
} as const

export type Persona = 'singer' | 'coach' | 'explorer'
export type LeadPersona = Exclude<Persona, 'explorer'>
