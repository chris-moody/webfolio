// Lighthouse CI against the prerendered build, served over HTTP/2 + TLS by
// scripts/serve-h2.mjs, as Netlify serves it. Lighthouse's simulator models
// the protocol it observes: over a local HTTP/1.1 server it queued requests
// on six connections and scored the tour about 7 points below production.
//
// Still local, not Netlify deploy previews (that needs a Netlify token in CI):
// no CDN, and Brotli/gzip from a Node server.
module.exports = {
  ci: {
    collect: {
      startServerCommand: 'node scripts/serve-h2.mjs --port 4443',
      startServerReadyPattern: 'Accepting connections',
      // The server's certificate is self-signed.
      settings: { chromeFlags: '--ignore-certificate-errors' },
      url: [
        'https://localhost:4443/',
        'https://localhost:4443/resume',
        'https://localhost:4443/lab/tape',
        'https://localhost:4443/system',
        'https://localhost:4443/tour/about/0',
        'https://localhost:4443/tour/about/4',
      ],
      numberOfRuns: 5,
    },
    assert: {
      assertMatrix: [
        {
          // Content routes: prerendered, Tailwind only. Measured 2026-10-07:
          // 100 / 100 / 100 / 100, LCP 1.4–1.5 s.
          matchingUrlPattern: 'localhost:4443/(resume|system)?$',
          aggregationMethod: 'median-run',
          assertions: {
            'categories:performance': ['error', { minScore: 0.97 }],
            'categories:accessibility': ['error', { minScore: 1 }],
            'categories:best-practices': ['error', { minScore: 1 }],
            'categories:seo': ['error', { minScore: 1 }],
            'largest-contentful-paint': ['error', { maxNumericValue: 2000 }],
            'cumulative-layout-shift': ['error', { maxNumericValue: 0.02 }],
          },
        },
        {
          // Tape streams data continuously; layout must stay stable while it
          // does. Measured 98–99.
          matchingUrlPattern: 'localhost:4443/lab/tape$',
          aggregationMethod: 'median-run',
          assertions: {
            'categories:performance': ['error', { minScore: 0.95 }],
            'categories:accessibility': ['error', { minScore: 1 }],
            'categories:best-practices': ['error', { minScore: 1 }],
            'categories:seo': ['error', { minScore: 1 }],
            'cumulative-layout-shift': ['error', { maxNumericValue: 0.02 }],
            'total-blocking-time': ['error', { maxNumericValue: 200 }],
          },
        },
        {
          // The tour: MUI shell, with GSAP, Pixi, React Flow, d3, and the
          // marquees loaded per slide or after paint. Measured 96–97.
          matchingUrlPattern: 'localhost:4443/tour/',
          aggregationMethod: 'median-run',
          assertions: {
            'categories:performance': ['error', { minScore: 0.9 }],
            'categories:accessibility': ['error', { minScore: 1 }],
            'categories:best-practices': ['error', { minScore: 1 }],
            'categories:seo': ['error', { minScore: 1 }],
            'cumulative-layout-shift': ['error', { maxNumericValue: 0.1 }],
          },
        },
      ],
    },
    upload: { target: 'filesystem', outputDir: '.lighthouseci/reports' },
  },
}
