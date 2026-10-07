// Turns the Lighthouse CI reports (.lighthouseci/) and route weights
// (perf/route-weights.json) into perf/latest.json, which /colophon publishes.
// Run via `yarn perf:update` (build → budgets → lhci → this).
import { execSync } from 'node:child_process'
import { readdirSync, readFileSync, writeFileSync } from 'node:fs'
import path from 'node:path'

const dir = '.lighthouseci'
const reports = readdirSync(dir).filter(
  (name) => name.startsWith('lhr-') && name.endsWith('.json')
)
if (!reports.length)
  throw new Error(
    'No Lighthouse reports in .lighthouseci/. Run `yarn lhci` first.'
  )

const median = (values) => {
  const sorted = [...values].sort((a, b) => a - b)
  return sorted[Math.floor(sorted.length / 2)]
}

const byRoute = {}
let lighthouseVersion = ''
for (const name of reports) {
  const report = JSON.parse(readFileSync(path.join(dir, name), 'utf8'))
  lighthouseVersion = report.lighthouseVersion
  const route = new URL(report.finalDisplayedUrl).pathname
  ;(byRoute[route] ??= []).push(report)
}

const routes = Object.fromEntries(
  Object.entries(byRoute)
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([route, runs]) => {
      const metric = (id) =>
        median(runs.map((run) => run.audits[id].numericValue))
      const score = (id) =>
        Math.round(median(runs.map((run) => run.categories[id].score)) * 100)
      return [
        route,
        {
          runs: runs.length,
          scores: {
            performance: score('performance'),
            accessibility: score('accessibility'),
            bestPractices: score('best-practices'),
            seo: score('seo'),
          },
          lcpMs: Math.round(metric('largest-contentful-paint')),
          fcpMs: Math.round(metric('first-contentful-paint')),
          tbtMs: Math.round(metric('total-blocking-time')),
          cls: Number(metric('cumulative-layout-shift').toFixed(3)),
          totalBytes: Math.round(metric('total-byte-weight')),
        },
      ]
    })
)

let weights = {}
try {
  weights = JSON.parse(readFileSync('perf/route-weights.json', 'utf8'))
} catch {
  // budgets not run
}

const commit = execSync('git rev-parse --short HEAD').toString().trim()
const summary = {
  measuredAt: new Date().toISOString().slice(0, 10),
  commit,
  tool: `Lighthouse ${lighthouseVersion}, mobile emulation, simulated throttling, median of ${Object.values(routes)[0].runs} runs, local static server (HTTP/1.1)`,
  routes,
  weights,
}
writeFileSync('perf/latest.json', JSON.stringify(summary, null, 2) + '\n')
console.log(
  `perf/latest.json: ${Object.keys(routes).length} routes at ${commit}`
)
