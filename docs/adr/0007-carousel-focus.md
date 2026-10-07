# 0007. Carousel focus and announcements

- Status: Accepted
- Date: 2026-10-07

## Context

Avoid moving focus to the new slide's heading on every slide change. For keyboard users that turns "press Next five times" into "press Next, Tab back to Next" five times.

## Decision

Follow the WAI-ARIA APG carousel pattern: keep focus on the control the user activated (Next, Back, or a slide link) and announce the change through a polite live region ("{story}, slide 3 of 5: {title}"). Focus moves to the new slide's heading only when the focused element disappeared with the old slide, such as the in-slide "Next"/"End" link at the end of a story. Then focus is never stranded on `<body>`. Nothing is announced on first page load.

## Consequences

- Screen-reader users hear each slide change once, from the live region.
- The rescue rule depends on `document.activeElement` after render; `e2e/carousel.spec.ts` covers both paths.
