// Build steps that need a browser, run against the prerendered site:
//   - prints /resume to cmoodyResume.pdf, so the PDF comes from the same data
//     as the page and is never committed (ADR 0005)
//   - renders the Open Graph card (og.png) from the resume's name and title
import { chromium } from '@playwright/test'
import { createServer } from 'node:http'
import path from 'node:path'
import handler from 'serve-handler'

const root = path.resolve('build/client')
const server = createServer((request, response) =>
  handler(request, response, { public: root })
)
await new Promise((resolve) => server.listen(0, '127.0.0.1', resolve))
const origin = `http://127.0.0.1:${server.address().port}`

const escape = (text) =>
  text.replace(
    /[&<>"]/g,
    (char) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' })[char]
  )

const browser = await chromium.launch()
try {
  const page = await browser.newPage({ colorScheme: 'light' })
  await page.goto(`${origin}/resume`, { waitUntil: 'networkidle' })

  const { name, label } = await page.evaluate(() => ({
    name: document.querySelector('h1')?.textContent ?? '',
    label: document.querySelector('h1 + p')?.textContent ?? '',
  }))

  await page.emulateMedia({ media: 'print' })
  await page.pdf({
    path: path.join(root, 'cmoodyResume.pdf'),
    format: 'Letter',
    margin: { top: '0.5in', bottom: '0.5in', left: '0.6in', right: '0.6in' },
  })
  console.log('Resume PDF  → build/client/cmoodyResume.pdf')

  const card = await browser.newPage({ viewport: { width: 1200, height: 630 } })
  await card.setContent(`<!doctype html>
    <html><body style="margin:0;width:1200px;height:630px;display:flex;flex-direction:column;justify-content:center;
      padding:0 96px;box-sizing:border-box;background:#0e1116;color:#e7eaef;font-family:system-ui,-apple-system,'Segoe UI',sans-serif">
      <p style="margin:0;font-size:28px;letter-spacing:.12em;text-transform:uppercase;color:#7ea9f4;font-weight:600">${escape(label)}</p>
      <h1 style="margin:16px 0 0;font-size:96px;line-height:1;letter-spacing:-.02em">${escape(name)}</h1>
      <p style="margin:32px 0 0;font-size:34px;color:#a6adb9;max-width:900px;line-height:1.35">
        Design systems, incremental migrations, and high-performance data UIs.</p>
      <p style="margin:56px 0 0;font-size:26px;color:#a6adb9">webfolio.moodydigital.com</p>
    </body></html>`)
  await card.screenshot({ path: path.join(root, 'og.png') })
  console.log('Social card → build/client/og.png')
} finally {
  await browser.close()
  server.close()
}
