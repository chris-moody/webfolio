// Lighthouse CI. Phase 0 assertions are a regression floor; Phase 4 raises
// them to the published targets (100s on content routes, LCP ≤ 1.5 s) and
// points collection at Netlify deploy previews.
//
// The local server speaks HTTP/1.1, and Lighthouse's simulator models its
// six-connections-per-origin limit, so FCP here runs ~0.5 s slower than the
// same build on Netlify (HTTP/2). Thresholds are set against the local
// numbers, so they hold (with margin) on Netlify too.
module.exports = {
  ci: {
    collect: {
      startServerCommand: 'yarn serve:dist',
      startServerReadyPattern: 'Accepting connections',
      url: [
        'http://localhost:4173/',
        'http://localhost:4173/resume',
        'http://localhost:4173/tour/about/0',
      ],
      numberOfRuns: 5,
    },
    assert: {
      assertMatrix: [
        {
          // Content routes: prerendered, Tailwind only. Measured 2026-10-06:
          // 98 / 100 / 100 / 100 on the local server.
          matchingUrlPattern: 'localhost:4173/(resume)?$',
          aggregationMethod: 'median-run',
          assertions: {
            'categories:performance': ['error', { minScore: 0.95 }],
            'categories:accessibility': ['error', { minScore: 1 }],
            'categories:best-practices': ['error', { minScore: 1 }],
            'categories:seo': ['error', { minScore: 1 }],
            'largest-contentful-paint': ['error', { maxNumericValue: 2500 }],
            'cumulative-layout-shift': ['error', { maxNumericValue: 0.02 }],
          },
        },
        {
          // The tour: MUI, GSAP, Pixi, and four font families. Phase 4 raises this.
          matchingUrlPattern: 'localhost:4173/tour/',
          aggregationMethod: 'median-run',
          assertions: {
            'categories:performance': ['error', { minScore: 0.7 }],
            'categories:accessibility': ['error', { minScore: 0.95 }],
            'categories:best-practices': ['error', { minScore: 0.95 }],
            'categories:seo': ['error', { minScore: 0.9 }],
            'cumulative-layout-shift': ['error', { maxNumericValue: 0.1 }],
          },
        },
      ],
    },
    upload: { target: 'filesystem', outputDir: '.lighthouseci/reports' },
  },
}
