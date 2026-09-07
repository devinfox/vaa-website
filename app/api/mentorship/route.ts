import { NextResponse } from 'next/server'
import { site } from '@/lib/site'
import { sendToCrm } from '@/lib/crm'

/**
 * 1:1 mentorship application handler.
 *
 * Delivery order:
 *  1. SendGrid (SENDGRID_API_KEY + MENTORSHIP_FROM_EMAIL, a verified sender) → emails MENTORSHIP_TO_EMAIL
 *  2. Resend (RESEND_API_KEY + MENTORSHIP_FROM_EMAIL) → same
 *  3. CRM intake (CRM_LEADS_URL) so the applicant is auto-enrolled in the mentorship funnel
 *  4. LEAD_WEBHOOK_URL (JSON POST) as a secondary copy if set
 *  5. Console log so nothing is lost in development
 */
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

type Application = {
  email: string
  firstName: string
  lastName: string
  artistName: string
  phone: string
  pronouns: string
  location: string
  history: string
  goals: string
  discovery: string
  comments: string
}

const FIELDS: { key: keyof Application; label: string; required?: boolean; max: number }[] = [
  { key: 'email', label: 'Email', required: true, max: 200 },
  { key: 'firstName', label: 'First Name', required: true, max: 100 },
  { key: 'lastName', label: 'Last Name', required: true, max: 100 },
  { key: 'artistName', label: 'Artist Name', max: 120 },
  { key: 'phone', label: 'Phone Number', max: 60 },
  { key: 'pronouns', label: 'Pronouns', max: 60 },
  { key: 'location', label: 'Location/Time Zone', max: 120 },
  { key: 'history', label: "What's your singing history?", required: true, max: 4000 },
  { key: 'goals', label: 'What are your singing goals?', required: true, max: 4000 },
  { key: 'discovery', label: 'How did you find this course and what drew you to sign up?', max: 4000 },
  { key: 'comments', label: 'Comments', max: 4000 },
]

function escapeHtml(s: string) {
  return s.replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c] as string)
}

export async function POST(request: Request) {
  let body: Record<string, unknown>
  try {
    body = await request.json()
  } catch {
    return NextResponse.json({ ok: false, error: 'Invalid request.' }, { status: 400 })
  }

  // Honeypot: real users never fill this
  if (typeof body.website === 'string' && body.website.trim() !== '') {
    return NextResponse.json({ ok: true })
  }

  const app = {} as Application
  for (const f of FIELDS) {
    const v = typeof body[f.key] === 'string' ? (body[f.key] as string).trim().slice(0, f.max) : ''
    if (f.required && !v) return NextResponse.json({ ok: false, error: `${f.label} is required.` }, { status: 422 })
    app[f.key] = v
  }
  if (!EMAIL_RE.test(app.email)) return NextResponse.json({ ok: false, error: 'Please enter a valid email.' }, { status: 422 })

  const to = process.env.MENTORSHIP_TO_EMAIL || site.mentorshipInbox
  const from = process.env.MENTORSHIP_FROM_EMAIL || site.contactEmail
  const fullName = `${app.firstName} ${app.lastName}`.trim()
  const subject = `Voice Application — ${fullName}${app.artistName ? ` (${app.artistName})` : ''}`
  const lines = FIELDS.map((f) => `${f.label}\n${app[f.key] || '—'}`)
  const text = `New 1:1 mentorship application\n\n${lines.join('\n\n')}\n\nSubmitted ${new Date().toISOString()} from ${request.headers.get('referer') ?? 'unknown page'}`
  const html = `<div style="font-family:Inter,Arial,sans-serif;max-width:640px;color:#111"><h2 style="margin:0 0 16px">New 1:1 mentorship application</h2>${FIELDS.map(
    (f) => `<p style="margin:0 0 14px"><strong style="display:block;color:#7a6a3a;font-size:12px;text-transform:uppercase;letter-spacing:.08em">${escapeHtml(f.label)}</strong>${escapeHtml(app[f.key] || '—').replace(/\n/g, '<br>')}</p>`,
  ).join('')}<p style="color:#888;font-size:12px">Submitted ${new Date().toLocaleString('en-US', { timeZone: 'America/New_York' })} ET</p></div>`

  let delivered = false

  if (process.env.SENDGRID_API_KEY) {
    try {
      const res = await fetch('https://api.sendgrid.com/v3/mail/send', {
        method: 'POST',
        headers: { Authorization: `Bearer ${process.env.SENDGRID_API_KEY}`, 'Content-Type': 'application/json' },
        body: JSON.stringify({
          personalizations: [{ to: [{ email: to }] }],
          from: { email: from, name: 'Voice Alchemy Academy' },
          reply_to: { email: app.email, name: fullName },
          subject,
          content: [
            { type: 'text/plain', value: text },
            { type: 'text/html', value: html },
          ],
        }),
      })
      delivered = res.ok
      if (!res.ok) console.error('[mentorship] SendGrid responded', res.status, await res.text())
    } catch (err) {
      console.error('[mentorship] SendGrid failed', err)
    }
  } else if (process.env.RESEND_API_KEY) {
    try {
      const res = await fetch('https://api.resend.com/emails', {
        method: 'POST',
        headers: { Authorization: `Bearer ${process.env.RESEND_API_KEY}`, 'Content-Type': 'application/json' },
        body: JSON.stringify({ from: `Voice Alchemy Academy <${from}>`, to: [to], reply_to: app.email, subject, text, html }),
      })
      delivered = res.ok
      if (!res.ok) console.error('[mentorship] Resend responded', res.status, await res.text())
    } catch (err) {
      console.error('[mentorship] Resend failed', err)
    }
  }

  // CRM intake (auto-enrolls the applicant in the mentorship funnel). Fire-and-forget, same as the webhook.
  sendToCrm({
    type: 'mentorship_application',
    email: app.email,
    first_name: app.firstName,
    last_name: app.lastName,
    persona: 'singer',
    source: 'mentorship-application',
    page: request.headers.get('referer') ?? null,
    metadata: {
      artistName: app.artistName,
      phone: app.phone,
      pronouns: app.pronouns,
      location: app.location,
      history: app.history,
      goals: app.goals,
      discovery: app.discovery,
      comments: app.comments,
    },
  }).catch((err) => console.error('[mentorship] CRM failed', err))

  if (process.env.LEAD_WEBHOOK_URL) {
    fetch(process.env.LEAD_WEBHOOK_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ type: 'mentorship_application', to, ...app, fullName, createdAt: new Date().toISOString() }),
    }).catch((err) => console.error('[mentorship] webhook failed', err))
  }

  if (!delivered) {
    console.log(`[mentorship] application for ${to} (no email provider configured)\n` + text)
    if (process.env.NODE_ENV === 'production' && !process.env.LEAD_WEBHOOK_URL) {
      return NextResponse.json({ ok: false, error: 'We could not send your application right now. Please email us directly.' }, { status: 502 })
    }
  }

  return NextResponse.json({ ok: true })
}
