// Route-level weight budgets. For each prerendered
// page, measures the gzipped JS and CSS that page actually loads: entry
// scripts, modulepreloads, and stylesheets referenced from its HTML.
// Writes perf/route-weights.json and fails when a budget is exceeded.
import { readFile, writeFile } from 'node:fs/promises'
import path from 'node:path'
import { gzipSync } from 'node:zlib'

const root = path.resolve('build/client')

// Budgets in kB (gzipped).
// Content routes: ≤ 120 kB JS (§1). React DOM (~64 kB) + React Router (~42 kB)
// are a ~106 kB floor, so app code on content routes has ~14 kB to work with.
// Tour routes: MUI + GSAP shell; Pixi, React Flow, d3, the marquees, and the
// flair videos are split out per slide (Phase 4: 427 → ~256 kB).
const budgets = {
  '/': { js: 120, css: 10 },
  '/resume': { js: 120, css: 10 },
  '/404': { js: 120, css: 10 },
  '/lab': { js: 120, css: 10 },
  '/system': { js: 130, css: 10 },
  '/colophon': { js: 120, css: 10 },
  // Tape adds TanStack Table, Virtual, and Query; the worker is a separate file.
  '/lab/tape': { js: 165, css: 10 },
  '/tour/home/flair': { js: 210, css: 10 },
  '/tour/about/0': { js: 210, css: 10 },
}

const htmlFile = (route) =>
  route === '/' ? 'index.html' : path.join(route.slice(1), 'index.html')

// React Router suffixes a stylesheet with "#" when a lazy chunk imports it too.
const gzipKb = async (assetPath) =>
  gzipSync(await readFile(path.join(root, assetPath.replace(/[#?].*$/, ''))), {
    level: 9,
  }).length / 1024

const assets = (html) => {
  const js = new Set()
  const css = new Set()
  for (const [, href] of html.matchAll(
    /<link[^>]+rel="modulepreload"[^>]+href="([^"]+)"/g
  ))
    js.add(href)
  for (const [, href] of html.matchAll(
    /<link[^>]+href="([^"]+)"[^>]+rel="modulepreload"/g
  ))
    js.add(href)
  for (const [, src] of html.matchAll(/<script[^>]+src="([^"]+)"/g)) js.add(src)
  for (const [, src] of html.matchAll(/import\("([^"]+\.js)"\)/g)) js.add(src)
  for (const [, href] of html.matchAll(
    /<link[^>]+rel="stylesheet"[^>]+href="([^"]+)"/g
  ))
    css.add(href)
  for (const [, href] of html.matchAll(
    /<link[^>]+href="([^"]+\.css)"[^>]+rel="stylesheet"/g
  ))
    css.add(href)
  return { js: [...js], css: [...css] }
}

let failed = false
const report = {}
for (const [route, budget] of Object.entries(budgets)) {
  const html = await readFile(path.join(root, htmlFile(route)), 'utf8')
  const { js, css } = assets(html)
  const jsKb = (await Promise.all(js.map(gzipKb))).reduce((a, b) => a + b, 0)
  const cssKb = (await Promise.all(css.map(gzipKb))).reduce((a, b) => a + b, 0)
  const htmlKb = gzipSync(html, { level: 9 }).length / 1024
  report[route] = {
    jsKb: +jsKb.toFixed(1),
    cssKb: +cssKb.toFixed(1),
    htmlKb: +htmlKb.toFixed(1),
    jsFiles: js.length,
    budget,
  }
  const ok = jsKb <= budget.js && cssKb <= budget.css
  failed ||= !ok
  console.log(
    `${ok ? '✔' : '✘'} ${route.padEnd(18)} JS ${jsKb.toFixed(1).padStart(6)} / ${budget.js} kB   CSS ${cssKb
      .toFixed(1)
      .padStart(5)} / ${budget.css} kB   HTML ${htmlKb.toFixed(1)} kB`
  )
}

await writeFile(
  'perf/route-weights.json',
  JSON.stringify(report, null, 2) + '\n'
)
if (failed) {
  console.error('\nRoute budget exceeded. See perf/route-weights.json.')
  process.exit(1)
}
