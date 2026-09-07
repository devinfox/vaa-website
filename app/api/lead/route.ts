import { NextResponse } from 'next/server'
import { sendToCrm } from '@/lib/crm'

/**
 * Lead capture endpoint used by every form on the landing page.
 *
 * Every submission is forwarded to the CRM's inbound lead endpoint
 * (CRM_LEADS_URL + CRM_LEADS_SECRET) so the person is auto-enrolled in the
 * matching email funnel. When the CRM is configured and rejects the lead the
 * form shows an error so nothing is silently lost.
 *
 * Optionally, LEAD_WEBHOOK_URL (e.g. a Zapier/Make hook) also receives a copy
 * of the legacy JSON. Without either, submissions are logged to the server
 * console during development.
 */
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

export async function POST(request: Request) {
  let body: Record<string, unknown>
  try {
    body = await request.json()
  } catch {
    return NextResponse.json({ ok: false, error: 'Invalid JSON' }, { status: 400 })
  }

  const str = (k: string, max = 64) => (typeof body[k] === 'string' ? (body[k] as string).trim().slice(0, max) : null)

  const email = typeof body.email === 'string' ? body.email.trim().toLowerCase() : ''
  const firstName = str('first_name', 100) || str('firstName', 100) || ''
  const lastName = str('last_name', 100) || str('lastName', 100) || ''
  const persona = body.persona === 'coach' ? 'coach' : 'singer'
  const source = typeof body.source === 'string' ? body.source.slice(0, 64) : 'landing'

  if (!firstName) {
    return NextResponse.json({ ok: false, error: 'Please enter your first name.' }, { status: 422 })
  }
  if (!lastName) {
    return NextResponse.json({ ok: false, error: 'Please enter your last name.' }, { status: 422 })
  }
  if (!EMAIL_RE.test(email)) {
    return NextResponse.json({ ok: false, error: 'Please enter a valid email.' }, { status: 422 })
  }

  const goal = str('goal')
  const level = str('level')
  const followUp = body.followUp === true
  const page = request.headers.get('referer') ?? null
  const userAgent = request.headers.get('user-agent') ?? null

  const lead = {
    email,
    first_name: firstName,
    last_name: lastName,
    persona,
    source,
    // optional progressive-profiling fields (student popup)
    goal,
    level,
    followUp,
    page,
    userAgent,
    createdAt: new Date().toISOString(),
  }

  // 1. CRM (auto-enrolls the lead in an email funnel). Awaited so a failure surfaces to the form.
  const crm = await sendToCrm({
    type: followUp ? 'lead_details' : 'lead',
    email,
    first_name: firstName,
    last_name: lastName,
    persona,
    source,
    page,
    metadata: { goal, level, followUp, userAgent },
  })
  if (crm.configured && !crm.ok) {
    return NextResponse.json({ ok: false, error: 'Could not save your details. Try again.' }, { status: 502 })
  }

  // 2. Legacy webhook copy (optional).
  const webhook = process.env.LEAD_WEBHOOK_URL
  if (webhook) {
    try {
      const res = await fetch(webhook, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(lead),
      })
      if (!res.ok) {
        console.error('[lead] webhook responded', res.status)
        if (!crm.configured) {
          return NextResponse.json({ ok: false, error: 'Could not save your email. Try again.' }, { status: 502 })
        }
      }
    } catch (err) {
      console.error('[lead] webhook failed', err)
      if (!crm.configured) {
        return NextResponse.json({ ok: false, error: 'Could not save your email. Try again.' }, { status: 502 })
      }
    }
  } else if (!crm.configured) {
    console.log('[lead]', JSON.stringify(lead))
  }

  return NextResponse.json({ ok: true })
}
