import { chromium } from '@playwright/test'
const b = await chromium.launch()
const ctx = await b.newContext({ viewport: { width: 1280, height: 900 } })
for (const path of ['/lab/tape', '/work/migrating-without-freezing']) {
  const p = await ctx.newPage()
  const logs = []
  p.on('console', (m) => {
    if (['error', 'warning'].includes(m.type()))
      logs.push(m.type() + ': ' + m.text().slice(0, 300))
  })
  p.on('pageerror', (e) => logs.push('pageerror: ' + e.message.slice(0, 300)))
  p.on('requestfailed', (r) => logs.push('failed: ' + r.url()))
  await p.goto('http://localhost:3100' + path)
  await p.waitForTimeout(6000)
  const info = await p.evaluate(() => ({
    h1: document.querySelector('h1')?.textContent,
    rows: document.querySelectorAll('[role=row]').length,
    firstRow: document
      .querySelectorAll('[role=row]')[1]
      ?.textContent?.slice(0, 60),
    stats: window.__tapeStats?.ticksPerSecond,
  }))
  console.log(path, JSON.stringify(info))
  for (const l of logs.slice(0, 8)) console.log('   ', l)
  await p.close()
}
await b.close()
