// Route structure of the guided tour, as plain data. The build config imports
// this to list prerender paths and redirects, so it can't import components.
// `src/data/wizards.tsx` holds the content and must match (see tour.test.ts).

export const TOUR_BASE = '/tour'

export interface TourWizardManifest {
  id: string
  title: string
  /** Step ids in order. Empty for single-page wizards. */
  steps: string[]
}

export const tourManifest: TourWizardManifest[] = [
  { id: 'home', title: 'Welcome', steps: ['flair', 'color'] },
  { id: 'purpose', title: 'State Your Purpose', steps: ['why'] },
  { id: 'storytime', title: 'Story Time', steps: ['story-selection'] },
  { id: 'about', title: 'About Me', steps: ['0', '1', '2', '3', '4'] },
  { id: 'resume', title: 'Resume', steps: [] },
  { id: 'fun', title: 'Add Some Flair', steps: ['0', '1', '2', '3'] },
  { id: 'work', title: 'Make it Bad', steps: ['0', '1', '2', '3', '4'] },
  { id: 'beta', title: 'Beta the Game', steps: ['0', '1', '2', '3', '4'] },
]

/** Looks up a wizard by id. */
export const findTourWizard = (id: string | undefined) =>
  tourManifest.find((wizard) => wizard.id === id)

/** The tour's entry point. */
export const TOUR_START = { wizard: 'home', step: 'flair' } as const

/** Absolute path inside the tour: `tourPath('about', '2')` → `/tour/about/2`. */
export const tourPath = (...segments: (string | undefined)[]) =>
  [
    TOUR_BASE,
    ...segments.filter((segment): segment is string => !!segment),
  ].join('/')

/** Every URL the tour can render, for prerendering. */
export const tourPaths = () =>
  tourManifest.flatMap((wizard) =>
    wizard.steps.length === 0
      ? [tourPath(wizard.id)]
      : wizard.steps.map((step) => tourPath(wizard.id, step))
  )

/**
 * Redirects for URLs that have no page of their own: the tour root, wizards
 * without a step, and the pre-2026 tour URLs (which lived at the site root).
 */
export const tourRedirects = (): [
  from: string,
  to: string,
  status: number,
][] => {
  const start = tourPath(TOUR_START.wizard, TOUR_START.step)
  const redirects: [string, string, number][] = [[TOUR_BASE, start, 302]]
  for (const wizard of tourManifest) {
    const first = wizard.steps[0]
    if (first)
      redirects.push([tourPath(wizard.id), tourPath(wizard.id, first), 302])
    // Legacy: /about/2 → /tour/about/2. `/resume` and `/work` are new pages, so
    // only their old step URLs redirect.
    if (wizard.id === 'resume') continue
    if (wizard.id !== 'work')
      redirects.push([`/${wizard.id}`, tourPath(wizard.id, first), 301])
    for (const step of wizard.steps) {
      redirects.push([`/${wizard.id}/${step}`, tourPath(wizard.id, step), 301])
    }
  }
  redirects.push(['/404/notfound', '/404', 301])
  return redirects
}
