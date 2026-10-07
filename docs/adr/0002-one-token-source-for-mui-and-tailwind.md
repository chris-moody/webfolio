# 0002. One token source for MUI and Tailwind

- Status: Accepted
- Date: 2026-10-06

## Context

The existing UI is MUI (Emotion). New surfaces (the lab demo, case-study layouts) target Tailwind, which matches the stacks of target roles. Two styling systems with two sets of values would drift, and contrast guarantees would have to be proven twice.

## Decision

Design tokens are defined once and compiled to CSS custom properties scoped by `[data-theme][data-mode]`. MUI reads them through a `createTheme` adapter (MUI already runs with `cssVariables`). Tailwind v4 reads them through `@theme`. New surfaces use Tailwind; wizard components migrate when it's worth doing.

## Consequences

- One contrast test suite covers both consumers.
- Two styling runtimes ship on pages that mix them, which is a performance cost to watch. Content routes move to Tailwind first.
- The `/system` page has to explain the bridge and show migration status, so the coexistence reads as deliberate.
