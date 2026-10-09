// Pure logic for the field-data collector (vitals.mts): validation and p75
// aggregation. Unit-tested in vitals.test.ts; no Netlify APIs here.

export const METRICS = ['LCP', 'INP', 'CLS', 'TTFB', 'FCP'] as const
export type MetricName = (typeof METRICS)[number]

export interface VitalSample {
  name: MetricName
  value: number
  rating: 'good' | 'needs-improvement' | 'poor'
  /** Route path only: no query, no hash. */
  path: string
  navigationType: string
  /** Day bucket, YYYY-MM-DD (UTC). */
  day: string
}

const RATINGS = new Set(['good', 'needs-improvement', 'poor'])
const MAX_VALUE: Record<MetricName, number> = {
  LCP: 60_000,
  INP: 60_000,
  CLS: 10,
  TTFB: 60_000,
  FCP: 60_000,
}

/** Accepts only well-formed samples; strips anything not needed. */
export const sanitizeSample = (
  input: unknown,
  now = new Date()
): VitalSample | null => {
  if (!input || typeof input !== 'object') return null
  const raw = input as Record<string, unknown>
  const name = raw.name as MetricName
  if (!METRICS.includes(name)) return null
  const value = Number(raw.value)
  if (!Number.isFinite(value) || value < 0 || value > MAX_VALUE[name])
    return null
  if (typeof raw.rating !== 'string' || !RATINGS.has(raw.rating)) return null
  if (
    typeof raw.path !== 'string' ||
    !raw.path.startsWith('/') ||
    raw.path.length > 200
  )
    return null
  const path = raw.path.split(/[?#]/)[0]!.replace(/\/+$/, '') || '/'
  return {
    name,
    value: Math.round(value * 1000) / 1000,
    rating: raw.rating as VitalSample['rating'],
    path,
    navigationType:
      typeof raw.navigationType === 'string'
        ? raw.navigationType.slice(0, 32)
        : 'unknown',
    day: now.toISOString().slice(0, 10),
  }
}

/** 75th percentile, nearest-rank (the method CrUX uses). */
export const p75 = (values: number[]) => {
  if (!values.length) return null
  const sorted = [...values].sort((a, b) => a - b)
  return sorted[Math.ceil(0.75 * sorted.length) - 1]!
}

export interface MetricSummary {
  p75: number | null
  count: number
  good: number
}

export interface FieldSummary {
  generatedAt: string
  windowDays: number
  samples: number
  metrics: Record<MetricName, MetricSummary>
  routes: Record<string, Partial<Record<MetricName, MetricSummary>>>
}

const summarizeValues = (samples: VitalSample[]): MetricSummary => ({
  p75: p75(samples.map((sample) => sample.value)),
  count: samples.length,
  good: samples.filter((sample) => sample.rating === 'good').length,
})

export const summarize = (
  samples: VitalSample[],
  windowDays: number,
  now = new Date()
): FieldSummary => {
  const metrics = Object.fromEntries(
    METRICS.map((name) => [
      name,
      summarizeValues(samples.filter((sample) => sample.name === name)),
    ])
  ) as Record<MetricName, MetricSummary>
  const routes: FieldSummary['routes'] = {}
  for (const path of new Set(samples.map((sample) => sample.path))) {
    routes[path] = Object.fromEntries(
      METRICS.map((name) => [
        name,
        summarizeValues(
          samples.filter((s) => s.path === path && s.name === name)
        ),
      ]).filter(([, summary]) => (summary as MetricSummary).count > 0)
    )
  }
  return {
    generatedAt: now.toISOString(),
    windowDays,
    samples: samples.length,
    metrics,
    routes,
  }
}

/** Oldest day (YYYY-MM-DD) inside a window ending today. */
export const windowStart = (days: number, now = new Date()) =>
  new Date(now.getTime() - (days - 1) * 86_400_000).toISOString().slice(0, 10)
