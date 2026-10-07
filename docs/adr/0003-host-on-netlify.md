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
- Local Lighthouse runs use an HTTP/1.1 server and score below the HTTP/2 CDN. The CI floor accounts for this until LHCI targets deploy previews (Phase 4).
