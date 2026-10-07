import { getStore } from '@netlify/blobs'
import type { Config } from '@netlify/functions'
import { sanitizeSample, summarize, type VitalSample, windowStart } from './vitals.lib.ts'

// Field Core Web Vitals (ADR 0003). POST stores one sample per beacon; GET
// returns p75 per metric and route over the last 28 days. No cookies, no IPs,
// no user identifiers: a sample is a metric, a value, and a path.

const WINDOW_DAYS = 28
const RETENTION_DAYS = 90
const SUMMARY_TTL_MS = 60 * 60 * 1000
const MAX_SAMPLES = 20_000

export default async (request: Request) => {
  const store = getStore('web-vitals')

  if (request.method === 'POST') {
    const length = Number(request.headers.get('content-length') ?? 0)
    if (length > 4096) return new Response(null, { status: 413 })
    let body: unknown
    try {
      body = JSON.parse(await request.text())
    } catch {
      return new Response(null, { status: 400 })
    }
    const sample = sanitizeSample(body)
    if (!sample) return new Response(null, { status: 400 })
    await store.setJSON(`samples/${sample.day}/${crypto.randomUUID()}`, sample)
    return new Response(null, { status: 204 })
  }

  if (request.method === 'GET') {
    const cached = (await store.get('summary', { type: 'json' })) as { generatedAt: string } | null
    if (cached && Date.now() - Date.parse(cached.generatedAt) < SUMMARY_TTL_MS) return Response.json(cached)

    const from = windowStart(WINDOW_DAYS)
    const expired = windowStart(RETENTION_DAYS)
    const { blobs } = await store.list({ prefix: 'samples/' })
    const samples: VitalSample[] = []
    for (const { key } of blobs) {
      const day = key.split('/')[1] ?? ''
      if (day < expired) {
        await store.delete(key)
        continue
      }
      if (day < from || samples.length >= MAX_SAMPLES) continue
      const sample = (await store.get(key, { type: 'json' })) as VitalSample | null
      if (sample) samples.push(sample)
    }
    const summary = summarize(samples, WINDOW_DAYS)
    await store.setJSON('summary', summary)
    return Response.json(summary, { headers: { 'Cache-Control': 'public, max-age=300' } })
  }

  return new Response(null, { status: 405, headers: { Allow: 'GET, POST' } })
}

export const config: Config = { path: '/api/vitals' }
