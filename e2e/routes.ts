/** Every prerendered page, with the h1 that proves it rendered. */
export const contentRoutes = [
  { path: '/', heading: /christopher moody/i },
  { path: '/resume', heading: /christopher moody/i },
] as const

/**
 * Tour pages. Step titles aren't headings yet (Phase 2 adds slide titles), so
 * these check the wizard's h1.
 */
export const tourRoutes = [
  { path: '/tour/home/flair', heading: /welcome/i },
  { path: '/tour/home/color', heading: /welcome/i },
  { path: '/tour/purpose/why', heading: /state your purpose/i },
  { path: '/tour/about/0', heading: /about me/i },
  { path: '/tour/storytime/story-selection', heading: /story time/i },
  { path: '/tour/fun/0', heading: /add some flair/i },
  { path: '/tour/work/0', heading: /make it bad/i },
  { path: '/tour/beta/0', heading: /beta the game/i },
  { path: '/tour/resume', heading: /^resume$/i },
] as const

export const routes = [...contentRoutes, ...tourRoutes]
