# 0001. Prerender with React Router framework mode

- Status: Accepted
- Date: 2026-10-06

## Context

The site is a client-only SPA. Every route ships an empty `<div id="root">`, so crawlers, link unfurlers, and visitors without JavaScript see nothing, and first paint waits for a 1.1 MB entry chunk. The site already uses React Router 7 in library mode.

## Decision

Move to React Router framework mode with `ssr: false` and a `prerender()` list built from the route config. Netlify serves the output as static files.

## Alternatives considered

- **Rebuild on Next.js.** A stronger server-components signal, but a rewrite of ~5k lines that proves little beyond "knows Next." Rejected unless target roles require Next.js.
- **A hand-rolled prerender script** (render each route with `renderToString` at build time). Less dependency surface, but it re-implements route discovery, data loading, and asset manifests that framework mode already provides.

## Consequences

- Module-scope browser access (`localStorage`, `CSS.registerProperty`, `ResizeObserver`) has to move into effects. Phase 0 did this.
- MUI's Emotion styles need server extraction during prerender.
- Pixi, d3, and GSAP surfaces render behind client-only boundaries with static fallbacks.
- The migration is done incrementally and becomes source material for case study B.
