import { NextResponse } from 'next/server'
import { site } from '@/lib/site'
import { sendToCrm } from '@/lib/crm'

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

type DemoRequest = {
  firstName: string
  lastName: string
  email: string
  phone: string
  studioName: string
  studentCount: string
  teachingFormat: string
  biggestPain: string
  notes: string
  source: string
}

const FIELDS: { key: keyof DemoRequest; label: string; required?: boolean; max: number }[] = [
  { key: 'firstName', label: 'First name', required: true, max: 100 },
  { key: 'lastName', label: 'Last name', required: true, max: 100 },
  { key: 'email', label: 'Email', required: true, max: 200 },
  { key: 'phone', label: 'Phone', max: 60 },
  { key: 'studioName', label: 'Studio / Business', max: 160 },
  { key: 'studentCount', label: 'Students', max: 40 },
  { key: 'teachingFormat', label: 'Teaching Format', max: 80 },
  { key: 'biggestPain', label: 'Biggest Pain', max: 120 },
  { key: 'notes', label: 'Notes', max: 2000 },
  { key: 'source', label: 'Source', max: 80 },
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

  if (typeof body.website === 'string' && body.website.trim() !== '') {
    return NextResponse.json({ ok: true })
  }

  const demo = {} as DemoRequest
  for (const f of FIELDS) {
    const value = typeof body[f.key] === 'string' ? (body[f.key] as string).trim().slice(0, f.max) : ''
    if (f.required && !value) return NextResponse.json({ ok: false, error: `${f.label} is required.` }, { status: 422 })
    demo[f.key] = value
  }

  if (!EMAIL_RE.test(demo.email)) {
    return NextResponse.json({ ok: false, error: 'Please enter a valid email.' }, { status: 422 })
  }

  const to = process.env.DEMO_TO_EMAIL || process.env.MENTORSHIP_TO_EMAIL || site.mentorshipInbox
  const from = process.env.DEMO_FROM_EMAIL || process.env.MENTORSHIP_FROM_EMAIL || site.contactEmail
  const followUp = body.followUp === true
  const fullName = `${demo.firstName} ${demo.lastName}`.trim()
  const subject = `${followUp ? 'Demo request details' : 'Teacher demo request'} - ${fullName}${demo.studioName ? ` (${demo.studioName})` : ''}`
  const lines = FIELDS.map((f) => `${f.label}\n${demo[f.key] || '-'}`)
  const heading = followUp ? 'Extra details for a teacher demo request' : 'New teacher platform demo request'
  const text = `${heading}\n\n${lines.join('\n\n')}\n\nSubmitted ${new Date().toISOString()} from ${request.headers.get('referer') ?? 'unknown page'}`
  const html = `<div style="font-family:Inter,Arial,sans-serif;max-width:640px;color:#111"><h2 style="margin:0 0 16px">${heading}</h2>${FIELDS.map(
    (f) => `<p style="margin:0 0 14px"><strong style="display:block;color:#6d45b8;font-size:12px;text-transform:uppercase;letter-spacing:.08em">${escapeHtml(f.label)}</strong>${escapeHtml(demo[f.key] || '-').replace(/\n/g, '<br>')}</p>`,
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
          reply_to: { email: demo.email, name: fullName },
          subject,
          content: [
            { type: 'text/plain', value: text },
            { type: 'text/html', value: html },
          ],
        }),
      })
      delivered = res.ok
      if (!res.ok) console.error('[demo] SendGrid responded', res.status, await res.text())
    } catch (err) {
      console.error('[demo] SendGrid failed', err)
    }
  } else if (process.env.RESEND_API_KEY) {
    try {
      const res = await fetch('https://api.resend.com/emails', {
        method: 'POST',
        headers: { Authorization: `Bearer ${process.env.RESEND_API_KEY}`, 'Content-Type': 'application/json' },
        body: JSON.stringify({ from: `Voice Alchemy Academy <${from}>`, to: [to], reply_to: demo.email, subject, text, html }),
      })
      delivered = res.ok
      if (!res.ok) console.error('[demo] Resend responded', res.status, await res.text())
    } catch (err) {
      console.error('[demo] Resend failed', err)
    }
  }

  const page = request.headers.get('referer') ?? null

  // CRM intake (auto-enrolls the coach in the demo funnel). Fire-and-forget, same as the webhook.
  sendToCrm({
    type: followUp ? 'teacher_demo_details' : 'teacher_demo',
    email: demo.email,
    first_name: demo.firstName,
    last_name: demo.lastName,
    persona: 'coach',
    source: demo.source || 'demo',
    page,
    metadata: {
      phone: demo.phone,
      studioName: demo.studioName,
      studentCount: demo.studentCount,
      teachingFormat: demo.teachingFormat,
      biggestPain: demo.biggestPain,
      notes: demo.notes,
    },
  }).catch((err) => console.error('[demo] CRM failed', err))

  const webhook = process.env.DEMO_WEBHOOK_URL || process.env.LEAD_WEBHOOK_URL
  if (webhook) {
    fetch(webhook, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ type: followUp ? 'teacher_demo_details' : 'teacher_demo', ...demo, fullName, page, createdAt: new Date().toISOString() }),
    }).catch((err) => console.error('[demo] webhook failed', err))
  }

  if (!delivered) {
    console.log(`[demo] request for ${to} (no email provider configured)\n` + text)
    if (process.env.NODE_ENV === 'production' && !webhook) {
      return NextResponse.json({ ok: false, error: 'We could not send your demo request right now. Please email us directly.' }, { status: 502 })
    }
  }

  return NextResponse.json({ ok: true })
}
