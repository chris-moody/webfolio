import { useEffect, useState } from 'react'
import { Link } from 'react-router'
import { ScrollRegion } from '@/components/ScrollRegion'
import { pageMeta, SITE } from '@/site'
import type { Route } from './+types/colophon'

// Build time only: the JSON ships as route data, not in the page bundle.
export const loader = async () => {
  const [baseline, latest] = await Promise.all([
    import('../../../perf/baseline.json').then((m) => m.default),
    import('../../../perf/latest.json').then((m) => m.default),
  ])
  return { baseline, latest }
}

export const meta: Route.MetaFunction = () =>
  pageMeta({
    title: 'Colophon · Christopher Moody',
    description:
      'How this site is built and how fast it is: lab scores, field Core Web Vitals, and what changed them.',
    path: '/colophon',
  })

const kb = (bytes: number) => `${Math.round(bytes / 1024).toLocaleString()} KB`
const seconds = (ms: number) => `${(ms / 1000).toFixed(1)} s`

const table =
  'w-full text-left text-sm tabular-nums [&_td]:border-t [&_td]:border-border [&_td]:py-1.5 [&_td]:pr-4 [&_th]:pb-1.5 [&_th]:pr-4 [&_tbody_th]:border-t [&_tbody_th]:border-border [&_tbody_th]:py-1.5 [&_tbody_th]:font-normal'

interface FieldMetric {
  p75: number | null
  count: number
  good: number
}
interface FieldSummary {
  generatedAt: string
  windowDays: number
  samples: number
  metrics: Record<'LCP' | 'INP' | 'CLS' | 'TTFB' | 'FCP', FieldMetric>
}

const formatField = (name: string, value: number | null) =>
  value === null
    ? '–'
    : name === 'CLS'
      ? value.toFixed(3)
      : `${Math.round(value).toLocaleString()} ms`

/** Field data from real visits, fetched in the browser (it changes daily). */
const FieldData = () => {
  const [state, setState] = useState<{
    status: 'loading' | 'ready' | 'unavailable'
    data?: FieldSummary
  }>({
    status: 'loading',
  })
  useEffect(() => {
    // The collector only runs on the production site (see src/rum.ts).
    const production = window.location.hostname === new URL(SITE.url).hostname
    const load = production
      ? fetch('/api/vitals').then((response) =>
          response.ok
            ? (response.json() as Promise<FieldSummary>)
            : Promise.reject(new Error(String(response.status)))
        )
      : Promise.reject(new Error('Field data is collected on production only'))
    load
      .then((data) => setState({ status: 'ready', data }))
      .catch(() => setState({ status: 'unavailable' }))
  }, [])

  if (state.status === 'loading')
    return <p className="mt-3 text-fg-muted">Loading field data…</p>
  if (state.status === 'unavailable' || !state.data)
    return (
      <p className="mt-3 text-fg-muted">
        Field data isn’t available here. It’s collected only on the production
        site (webfolio.moodydigital.com).
      </p>
    )
  const { data } = state
  return (
    <>
      <p className="mt-3 text-fg-muted">
        75th percentile of real visits over the last {data.windowDays} days:{' '}
        {data.samples.toLocaleString()} samples.
        {data.samples < 500 &&
          ' This is a personal site; with this few samples, treat the numbers as indicative.'}
      </p>
      <ScrollRegion label="Field Core Web Vitals" className="mt-3">
        <table className={table}>
          <thead>
            <tr>
              <th scope="col">Metric</th>
              <th scope="col">p75</th>
              <th scope="col">Good</th>
              <th scope="col">Samples</th>
            </tr>
          </thead>
          <tbody>
            {Object.entries(data.metrics).map(([name, metric]) => (
              <tr key={name}>
                <th scope="row">{name}</th>
                <td>{formatField(name, metric.p75)}</td>
                <td>
                  {metric.count
                    ? `${Math.round((100 * metric.good) / metric.count)}%`
                    : '–'}
                </td>
                <td>{metric.count.toLocaleString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </ScrollRegion>
    </>
  )
}

const repo = (file: string) => `${SITE.repo}/blob/develop/${file}`

export default function Colophon({ loaderData }: Route.ComponentProps) {
  const { baseline, latest } = loaderData
  const routes = latest.routes as Record<
    string,
    {
      scores: {
        performance: number
        accessibility: number
        bestPractices: number
        seo: number
      }
      lcpMs: number
      tbtMs: number
      cls: number
      totalBytes: number
    }
  >
  const before = baseline.routes as Record<
    string,
    {
      scores: { performance: number; seo: number }
      lcpMs: number
      totalBytes: number
    }
  >
  const after = routes['/']!
  const home = before['/']!

  return (
    <>
      <h1 className="text-4xl font-bold tracking-tight">Colophon</h1>
      <p className="mt-4 max-w-prose text-lg text-fg-muted">
        How this site is built, how fast it is, and what made it that way. The
        numbers below are generated from the measurement files in the repository
        at build time, not typed by hand.
      </p>

      <section aria-labelledby="lab" className="mt-12">
        <h2 id="lab" className="text-2xl font-bold tracking-tight">
          Lab scores
        </h2>
        <p className="mt-3 max-w-prose text-fg-muted">
          Measured {latest.measuredAt} at commit{' '}
          <a href={`${SITE.repo}/commit/${latest.commit}`}>
            <code className="font-mono text-sm">{latest.commit}</code>
          </a>
          . {latest.tool}. Lighthouse CI enforces budgets on every pull request.
        </p>
        <ScrollRegion label="Lab scores by page" className="mt-3">
          <table className={table}>
            <thead>
              <tr>
                <th scope="col">Page</th>
                <th scope="col">Performance</th>
                <th scope="col">Accessibility</th>
                <th scope="col">Best practices</th>
                <th scope="col">SEO</th>
                <th scope="col">LCP</th>
                <th scope="col">TBT</th>
                <th scope="col">CLS</th>
                <th scope="col">Transfer</th>
              </tr>
            </thead>
            <tbody>
              {Object.entries(routes).map(([route, result]) => (
                <tr key={route}>
                  <th scope="row">
                    <Link to={route}>{route}</Link>
                  </th>
                  <td>{result.scores.performance}</td>
                  <td>{result.scores.accessibility}</td>
                  <td>{result.scores.bestPractices}</td>
                  <td>{result.scores.seo}</td>
                  <td>{seconds(result.lcpMs)}</td>
                  <td>{result.tbtMs} ms</td>
                  <td>{result.cls}</td>
                  <td>{kb(result.totalBytes)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </ScrollRegion>
      </section>

      <section aria-labelledby="before-after" className="mt-12">
        <h2 id="before-after" className="text-2xl font-bold tracking-tight">
          Before and after
        </h2>
        <p className="mt-3 max-w-prose text-fg-muted">
          The home page on {baseline.capturedAt} (before the rework) against
          today. The “before” run was against the live site over HTTP/2; “after”
          runs on a local HTTP/1.1 server, which Lighthouse scores more harshly,
          so the improvement is understated.
        </p>
        <ScrollRegion label="Home page before and after" className="mt-3">
          <table className={table}>
            <thead>
              <tr>
                <th scope="col">Home page</th>
                <th scope="col">Before</th>
                <th scope="col">After</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <th scope="row">Lighthouse performance</th>
                <td>{home.scores.performance}</td>
                <td>{after.scores.performance}</td>
              </tr>
              <tr>
                <th scope="row">Lighthouse SEO</th>
                <td>{home.scores.seo}</td>
                <td>{after.scores.seo}</td>
              </tr>
              <tr>
                <th scope="row">Largest Contentful Paint</th>
                <td>{seconds(home.lcpMs)}</td>
                <td>{seconds(after.lcpMs)}</td>
              </tr>
              <tr>
                <th scope="row">Page weight</th>
                <td>{kb(home.totalBytes)}</td>
                <td>{kb(after.totalBytes)}</td>
              </tr>
              <tr>
                <th scope="row">Initial JavaScript (gzipped)</th>
                <td>{baseline.build.mainChunkGzipKB} KB</td>
                <td>
                  {
                    (latest.weights as Record<string, { jsKb: number }>)['/']
                      ?.jsKb
                  }{' '}
                  KB
                </td>
              </tr>
            </tbody>
          </table>
        </ScrollRegion>
      </section>

      <section aria-labelledby="how" className="mt-12">
        <h2 id="how" className="text-2xl font-bold tracking-tight">
          What made the difference
        </h2>
        <ul className="mt-4 max-w-prose list-disc space-y-2 pl-6">
          <li>
            <strong>Prerendering.</strong> Every page is static HTML with its
            content in it, hydrated by React Router (
            <a
              href={repo(
                'docs/adr/0001-prerender-with-react-router-framework-mode.md'
              )}
            >
              ADR 0001
            </a>
            ). Unknown URLs get a real 404.
          </li>
          <li>
            <strong>Content pages without the tour’s stack.</strong> Home,
            resume, lab, and system pages use Tailwind on design tokens; MUI,
            Emotion, GSAP, Pixi, and d3 load only in the tour.
          </li>
          <li>
            <strong>Splitting the tour.</strong> PixiJS, React Flow, d3, the
            logo marquees, and the flair videos load with the slide that uses
            them, then prefetch on the visitor’s first interaction (prefetching
            on idle cost 300–500 ms of blocking time). Tour JavaScript went from
            427 KB to about 256 KB gzipped.
          </li>
          <li>
            <strong>Images.</strong> The about-me photo went from 950 KB to
            13–24 KB as responsive AVIF (with WebP and JPEG fallbacks, explicit
            dimensions, and high fetch priority). The 41 technology logos went
            from 1.2 MB of oversized PNGs to 240 KB, and they no longer preload
            on every tour page.
          </li>
          <li>
            <strong>GIFs to video.</strong> The flair animations went from 0.6–2
            MB GIFs to 25–142 KB muted, looping H.264/VP9 video with posters.
          </li>
          <li>
            <strong>Fonts.</strong> Latin subsets only. The tour’s CSS went from
            31.6 KB to 6.7 KB gzipped.
          </li>
          <li>
            <strong>Build-time computation.</strong> The design system’s
            contrast matrix is computed during prerendering, not in the browser
            (it was 230 ms of main-thread time under throttling).
          </li>
        </ul>
      </section>

      <section aria-labelledby="field" className="mt-12">
        <h2 id="field" className="text-2xl font-bold tracking-tight">
          Field data
        </h2>
        <FieldData />
        <p className="mt-3 max-w-prose text-sm text-fg-muted">
          Collected with <code className="font-mono">web-vitals</code> on the
          production site only. A sample is a metric, its value, and the page
          path: no cookies, no IP addresses, no identifiers (
          <a href={repo('netlify/functions/vitals.mts')}>collector source</a>).
        </p>
      </section>

      <section aria-labelledby="stack" className="mt-12">
        <h2 id="stack" className="text-2xl font-bold tracking-tight">
          Stack
        </h2>
        <ul className="mt-4 max-w-prose list-disc space-y-1.5 pl-6">
          <li>
            React 19, TypeScript (strict), Vite 8, React Router 7 framework mode
            with static prerendering
          </li>
          <li>
            Tailwind 4 on a token system shared with MUI 6 (
            <Link to="/system">design system</Link>)
          </li>
          <li>
            TanStack Table, Virtual, and Query, and a Web Worker for the{' '}
            <Link to="/lab/tape">Tape</Link> demo
          </li>
          <li>
            Vitest, Playwright with axe, Lighthouse CI, and per-route size
            budgets in GitHub Actions
          </li>
          <li>
            Netlify hosting (static files plus one function for field data)
          </li>
        </ul>
        <p className="mt-4">
          Source: <a href={SITE.repo}>github.com/chris-moody/webfolio</a> ·
          Decisions:{' '}
          <a href={repo('docs/adr/README.md')}>architecture decision records</a>
        </p>
      </section>
    </>
  )
}
