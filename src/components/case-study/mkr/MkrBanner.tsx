import { useEffect, useRef, useState } from 'react'
import gsapUrl from 'gsap/dist/gsap.min.js?url&no-inline'
import scrollToUrl from 'gsap/dist/ScrollToPlugin.min.js?url&no-inline'
import textUrl from 'gsap/dist/TextPlugin.min.js?url&no-inline'
import mkrUrl from 'mkrjs/dist/mkr.min.js?url&no-inline'
import signalsUrl from 'signals/dist/signals.min.js?url&no-inline'
import bannerSource from './banner.demo.js?raw'
import bannerUrl from './banner.demo.js?url&no-inline'
import { isReducedMotion } from '@/motion/motion'

// The demo loads mkr exactly as an ad would: as plain scripts in its own
// document (an iframe), with GSAP and js-signals as globals. That also keeps
// mkr.reveal, which resizes every ancestor of the panel, inside the ad.

const TOKENS = ['surface', 'fg', 'fg-muted', 'border', 'accent', 'on-accent']
const AD_HEIGHT = 250

const AD_DOCUMENT = `<!doctype html><html lang="en"><head><meta charset="utf-8"><title>Sample banner</title></head><body>${[
  gsapUrl,
  textUrl,
  scrollToUrl,
  signalsUrl,
  mkrUrl,
  bannerUrl,
]
  .map((src) => `<script src="${src}"></script>`)
  .join('')}</body></html>`

interface Banner {
  play: () => void
  pause: () => void
  settle: () => void
  reveal: () => number
}

type BannerWindow = Window & { banner?: { build: () => Banner } }

export const MkrBanner = () => {
  const frame = useRef<HTMLIFrameElement>(null)
  const banner = useRef<Banner | null>(null)
  // Bumped by Replay: a changed srcdoc reloads the ad from scratch.
  const [run, setRun] = useState(0)
  const [playing, setPlaying] = useState(false)
  const [capture, setCapture] = useState(false)
  const [height, setHeight] = useState(AD_HEIGHT)

  useEffect(() => {
    const element = frame.current
    if (!element) return

    // The page's token values, copied into the ad's document.
    const applyTokens = () => {
      const doc = element.contentDocument
      if (!doc?.body) return
      const styles = getComputedStyle(document.documentElement)
      for (const token of TOKENS)
        doc.documentElement.style.setProperty(
          `--${token}`,
          styles.getPropertyValue(`--${token}`)
        )
      doc.documentElement.style.colorScheme = styles.colorScheme
      doc.body.style.margin = '0'
      doc.body.style.fontFamily = styles.fontFamily
    }

    const start = () => {
      const win = element.contentWindow as BannerWindow | null
      if (!win?.banner) return
      applyTokens()
      banner.current = win.banner.build()
      const reduced = isReducedMotion()
      if (reduced) banner.current.settle()
      else banner.current.play()
      setPlaying(!reduced)
    }

    element.addEventListener('load', start)
    // The prerendered iframe may have loaded before hydration.
    if (element.contentDocument?.readyState === 'complete')
      queueMicrotask(start)

    // Follow light/dark switches on the page.
    const observer = new MutationObserver(applyTokens)
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ['class', 'style'],
    })
    return () => {
      element.removeEventListener('load', start)
      observer.disconnect()
    }
  }, [])

  const restart = () => {
    banner.current = null
    setCapture(false)
    setPlaying(false)
    setHeight(AD_HEIGHT)
    setRun((value) => value + 1)
  }

  const togglePlaying = () => {
    if (!banner.current || capture) return
    if (playing) banner.current.pause()
    else banner.current.play()
    setPlaying(!playing)
  }

  const toggleCapture = () => {
    if (capture) return restart()
    if (!banner.current) return
    setHeight(banner.current.reveal())
    setPlaying(false)
    setCapture(true)
  }

  return (
    <figure
      id="mkr-demo"
      className="my-8 rounded-lg border border-border bg-surface p-4"
    >
      <div className="flex flex-wrap gap-2 text-sm">
        <button
          type="button"
          onClick={togglePlaying}
          disabled={capture}
          className="rounded-md border border-border bg-canvas px-3 py-1 font-semibold hover:border-accent disabled:opacity-50"
        >
          {playing ? 'Pause' : 'Play'}
        </button>
        <button
          type="button"
          onClick={restart}
          className="rounded-md border border-border bg-canvas px-3 py-1 font-semibold hover:border-accent"
        >
          Replay
        </button>
        <button
          type="button"
          onClick={toggleCapture}
          aria-pressed={capture}
          className="rounded-md border border-border bg-canvas px-3 py-1 font-semibold hover:border-accent aria-pressed:border-accent"
        >
          Screen-capture mode
        </button>
      </div>
      <div className="mt-4 grid gap-4 lg:grid-cols-[300px_1fr]">
        <iframe
          ref={frame}
          title="Sample banner ad built with mkr"
          srcDoc={run ? `${AD_DOCUMENT}<!-- run ${run} -->` : AD_DOCUMENT}
          width={300}
          height={height}
          className="block max-w-full rounded border-0 bg-canvas"
        />
        <pre
          tabIndex={0}
          aria-label="The banner's source code"
          className="max-h-96 overflow-auto rounded-lg border border-border bg-canvas p-3 font-mono text-xs leading-relaxed"
        >
          <code>{bannerSource}</code>
        </pre>
      </div>
      <figcaption className="mt-3 text-sm text-fg-muted">
        The real mkr 0.6.2 from npm, running on this site’s GSAP 3 through its
        compatibility names. The code on the right is the file that runs; the ad
        has no HTML or CSS of its own. Screen-capture mode uses{' '}
        <code className="font-mono">mkr.reveal</code> to lay out the full safety
        text.
      </figcaption>
    </figure>
  )
}
