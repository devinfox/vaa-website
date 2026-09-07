/**
 * CRM lead intake client.
 *
 * Every lead-capture form on the site forwards to the CRM's inbound lead
 * endpoint so the person is created (or updated) as a lead and auto-enrolled
 * in the matching email funnel.
 *
 * Env:
 *  - CRM_LEADS_URL     e.g. https://www.voicealchemyacademy.app/api/leads/inbound
 *  - CRM_LEADS_SECRET  must match LEAD_INTAKE_SECRET in the CRM's Vercel env
 */

export type CrmLeadType = 'lead' | 'lead_details' | 'teacher_demo' | 'teacher_demo_details' | 'mentorship_application'

export interface CrmLeadPayload {
  type: CrmLeadType
  email: string
  first_name: string
  last_name: string
  persona: 'singer' | 'coach'
  source: string
  page?: string | null
  metadata?: Record<string, unknown>
}

export interface CrmLeadResult {
  ok: boolean
  status: number
  body?: unknown
  /** false when CRM_LEADS_URL is unset; the call was skipped. */
  configured: boolean
}

const TIMEOUT_MS = 8000

/**
 * POST a lead to the CRM. Never throws.
 * Resolves `{ ok: false, status: 0, configured: false }` when CRM_LEADS_URL is unset,
 * and `{ ok: false, status: 0, configured: true }` on a network error or timeout.
 */
export async function sendToCrm(payload: CrmLeadPayload): Promise<CrmLeadResult> {
  const url = process.env.CRM_LEADS_URL
  if (!url) return { ok: false, status: 0, configured: false }

  const controller = new AbortController()
  const timer = setTimeout(() => controller.abort(), TIMEOUT_MS)

  try {
    const res = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${process.env.CRM_LEADS_SECRET ?? ''}`,
      },
      body: JSON.stringify(payload),
      signal: controller.signal,
    })

    let body: unknown = undefined
    try {
      body = await res.json()
    } catch {
      /* non-JSON response; status alone is enough */
    }

    if (!res.ok) console.error('[crm] responded', res.status, body)
    return { ok: res.ok, status: res.status, body, configured: true }
  } catch (err) {
    console.error('[crm] request failed', err)
    return { ok: false, status: 0, configured: true }
  } finally {
    clearTimeout(timer)
  }
}
