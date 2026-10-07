# 0003. Host on Netlify

- Status: Accepted
- Date: 2026-10-06

## Context

The repo had both `netlify.toml` and `vercel.json`. The live site and recent routing work are on Netlify.

## Decision

Host on Netlify and delete `vercel.json`. `netlify.toml` owns redirects and headers:

- Immutable caching for fingerprinted `/assets/*`.
- Security headers, with CSP in report-only mode until a deploy preview is clean.
- After prerendering, prerendered routes are served as files and the fallback becomes `/* /404.html 404`.
- COOP/COEP on `/lab/*` if the demo ships a `SharedArrayBuffer` mode.

Field Core Web Vitals go to a Netlify Function backed by Netlify Blobs.

## Consequences

- Field metrics need a small function instead of a built-in product (Vercel Speed Insights).
- Local Lighthouse runs use an HTTP/2 + Brotli server (`scripts/serve-h2.mjs`) so the simulator models the same protocol as the CDN. An HTTP/1.1 server scored the tour about 7 points lower. Deploy previews would also include the CDN; that needs a Netlify token in CI.
