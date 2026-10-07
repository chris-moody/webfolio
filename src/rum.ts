import { SITE } from './site'

/**
 * Field Core Web Vitals, sent to /api/vitals (netlify/functions/vitals.mts).
 * Production hostname only, so local and preview traffic doesn't skew the
 * numbers. web-vitals loads as its own chunk after the page is up; a beacon
 * carries just the metric, its value and rating, and the path.
 */
export const startRum = () => {
  if (window.location.hostname !== new URL(SITE.url).hostname) return
  void import('web-vitals').then(({ onCLS, onFCP, onINP, onLCP, onTTFB }) => {
    const send = (metric: {
      name: string
      value: number
      rating: string
      navigationType: string
    }) => {
      const body = JSON.stringify({
        name: metric.name,
        value: metric.value,
        rating: metric.rating,
        path: window.location.pathname,
        navigationType: metric.navigationType,
      })
      const blob = new Blob([body], { type: 'application/json' })
      if (!navigator.sendBeacon?.('/api/vitals', blob)) {
        void fetch('/api/vitals', {
          method: 'POST',
          body,
          keepalive: true,
          headers: { 'Content-Type': 'application/json' },
        })
      }
    }
    onLCP(send)
    onINP(send)
    onCLS(send)
    onTTFB(send)
    onFCP(send)
  })
}
