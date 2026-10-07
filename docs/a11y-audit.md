# Accessibility audit: the tour carousel

Scope: the guided tour (`/tour/*`), rebuilt in Phase 2 as an accessible carousel. Last updated 2026-10-07.

## What's automated (runs in CI)

| Check                      | Where                                             | Covers                                                                                                                                 |
| -------------------------- | ------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------- |
| axe, WCAG 2.2 AA           | `e2e/a11y.spec.ts`                                | Every page, light and dark mode, desktop and mobile                                                                                    |
| axe, theme × motion matrix | `e2e/tour-a11y.spec.ts`                           | Every tour page at flair 1, 15, and 37, with reduced and full motion, across light and dark                                            |
| Carousel semantics         | `e2e/carousel.spec.ts`                            | Carousel and slide roles and labels; the slide picker's names, `aria-current`, and 24 × 24 px targets; Back as an `aria-disabled` link |
| Keyboard-only completion   | `e2e/carousel.spec.ts`                            | Every multi-slide story, tabbing to Next and pressing Enter; focus stays on Next; each slide is announced                              |
| Arrow keys, Home, End      | `e2e/carousel.spec.ts`                            | Slide movement; never hijacked inside the color picker                                                                                 |
| Focus rescue               | `e2e/carousel.spec.ts`                            | When the focused control leaves with its slide, focus goes to the new slide's heading                                                  |
| No-JS navigation           | `e2e/carousel.spec.ts`                            | Back and Next work as plain links before hydration                                                                                     |
| 3D text duplication        | `e2e/carousel.spec.ts`                            | Flair 37's layered text exposes each link and heading once                                                                             |
| Motion                     | `e2e/motion.spec.ts`, `src/motion/motion.test.ts` | The system preference applies before hydration; static alternatives replace animation; the pause control; the Settings choice persists |

## Decisions

- **Focus stays on the control you used.** Pressing Next keeps focus on Next, and a polite live region announces "{story}, slide 3 of 5: {title}". This follows the WAI-ARIA APG carousel pattern. Focus moves to the heading **only** when the focused element disappeared with the old slide. See [ADR 0007](adr/0007-carousel-focus.md).
- **No announcement on first load.** The page is being read then; an extra announcement would interrupt it.
- **Slides are routes.** Every slide has a URL, and Back, Next, and the slide picker are links, so they work without JavaScript and can be bookmarked and shared.
- **"Stop animations" is the pause mechanism** (WCAG 2.2.2) for every effect that runs longer than five seconds: the marquees, 3D wobble, conic background, socket-diagram signals, water text, and color cycling. It switches the site to reduced motion, which swaps each effect for a static version. Settings offers System, Reduce, and Full.
- **No rotation in landscape.** The old −90° rotation locked orientation (WCAG 1.3.4). Short landscape screens now scroll.

## Issues found and fixed while building this

| Issue                                                                                                                                 | WCAG         | Fix                                                   |
| ------------------------------------------------------------------------------------------------------------------------------------- | ------------ | ----------------------------------------------------- |
| At flair 37, each 3D text block rendered its content 8 times: 8 focusable copies of the in-slide Next, and every heading read 8 times | 1.3.1, 2.4.3 | Decorative layers are `inert` and `aria-hidden`       |
| That duplication also produced a color-contrast failure (axe measured the stacked copies)                                             | 1.4.3        | Resolved by the same change                           |
| In-slide "End" button had the accessible name "Next"                                                                                  | 2.5.3        | Removed the mismatched `aria-label`                   |
| Dots were labelled "page 0", "page 1", with no current marker and 18 px targets                                                       | 1.3.1, 2.5.8 | Labelled links, `aria-current="step"`, 24 px targets  |
| Mouse drags navigated slides (breaking text selection)                                                                                | —            | Swipe is touch-only                                   |
| Overflowing slide text couldn't be scrolled by keyboard                                                                               | 2.1.1        | The scroll region becomes focusable when it overflows |
| Fast repeated arrow keys used the previous slide's targets                                                                            | —            | Targets are computed from the URL at key-press time   |
| Prerendered Next links were wrong until an effect ran                                                                                 | —            | Links are computed from the wizard data during render |

## Manual screen-reader pass: **not yet performed**

Automated tools can't judge whether announcements make sense when heard. Run this before calling Phase 2 done.

**VoiceOver + Safari (macOS)** and **NVDA + Firefox (Windows)**. For each:

1. Open `/tour/about/0`. Confirm the page title and "About Me" are read, with no slide announcement.
2. Navigate to Next with Tab and activate it. Expect "About Me, slide 2 of 5: What I build", with focus remaining on Next.
3. Activate Next three more times. Each slide is announced once, with no duplicates.
4. Use the rotor or elements list (VoiceOver) or headings list (NVDA, H). Expect one h1 ("About Me") and one h2 ("Slide n of 5 · …"); nothing repeated.
5. Open the "Slides" navigation. Each link reads "Go to slide n of 5: {title}", and the current one is reported as "current step".
6. Set Settings → Flair to 37 and repeat steps 2–4. Text must not be read more than once.
7. On `/tour/fun/3`, activate the in-slide "End" link. Expect "Story Time" announced, with focus on the "Pick a story" heading.
8. Activate "Stop animations". The button should now read "Play animations", and the marquees on `/tour/about/3` should become a list.

Record results here:

| Step | VoiceOver + Safari | NVDA + Firefox |
| ---- | ------------------ | -------------- |
| 1–8  | _pending_          | _pending_      |
