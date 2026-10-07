# webfolio.moodydigital.com

[![CI](https://github.com/chris-moody/webfolio/actions/workflows/ci.yml/badge.svg?branch=main)](https://github.com/chris-moody/webfolio/actions/workflows/ci.yml)

The personal site of Chris Moody, a front-end engineer focused on design systems, incremental migrations, and high-performance data UIs. The site is meant to be read as a code sample. It's tested, budgeted, and accessible.

## Stack

React 19 · TypeScript 6 (strict, `noUncheckedIndexedAccess`) · Vite 8 · React Router 7 (framework mode, static prerendering) · Tailwind 4 · TanStack Table 9, Virtual, Query (lab) · Web Workers · MUI 6 (tour only) · Redux Toolkit · GSAP, d3, PixiJS · Vitest · Playwright + axe · Lighthouse CI · Netlify

## Architecture

Every page is prerendered to static HTML at build time (ADR 0001), and React hydrates it in the browser. There are two layouts:

- **Site** (`/`, `/resume`, `/lab`, 404): Tailwind on a small token layer. No MUI, Emotion, or animation libraries load, which keeps initial JS at ~116 kB gzipped, most of it React and React Router.
- **Tour** (`/tour/*`): the original guided experience, with MUI, GSAP, PixiJS, and d3. Its critical Emotion CSS is extracted per page during prerendering.

```
src/
├── root.tsx, routes.ts     Document shell and route table
├── entry.server.tsx        Build-time renderer: full render + Emotion CSS extraction
├── routes/site/            Home, resume, lab, 404 (Tailwind)
├── lab/tape/               Real-time market grid demo: worker engine, TanStack grid, frame meter (see its ARCHITECTURE.md)
├── routes/tour/            Tour layout (Redux + MUI theme) and wizard/step routes
├── content/resume/         Resume data, the single source for the page and the PDF (ADR 0005)
├── content/work/           Case studies (MDX); drafts never ship in production builds
├── components/case-study/  Case-study building blocks, including the RTK Query ↔ TanStack Query sandbox
├── data/                   Tour manifest (route structure) and wizard content
├── styles/                 Design tokens (light/dark) and Tailwind entry points
├── components/, containers/, hooks/, redux/, theme/, utils/
react-router.config.ts      Prerender list; writes 404.html, _redirects, sitemap, robots
scripts/                    postbuild (resume PDF + social card), route budgets, resume history tooling
e2e/                        Playwright: smoke, no-JS content, hydration, axe (light/dark × desktop/mobile), Tape behavior, frame-time smoke budget
docs/adr/                   Architecture decision records
perf/                       Pre-rework baseline and per-route weights
```

## Running it

```sh
yarn            # Node 24 (see .nvmrc); installs a pre-commit hook (ESLint + Prettier on staged files)
yarn dev        # http://localhost:3000
yarn build      # prerender to build/client, then print the resume PDF and social card (needs Playwright's Chromium)
yarn serve:dist # serve build/client with compression on :4173
```

## Quality gates

Every pull request runs these in CI ([`.github/workflows/ci.yml`](.github/workflows/ci.yml)):

| Gate                | Command                     | Budget                                                                                                                                                |
| ------------------- | --------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------- |
| Types               | `yarn typecheck`            | 0 errors, no `.js` sources                                                                                                                            |
| Lint                | `yarn lint`                 | 0 warnings, including React Compiler–era hooks rules                                                                                                  |
| Unit                | `yarn test`                 | Vitest + Testing Library, including WCAG AA contrast for every token pair                                                                             |
| Resume history      | `yarn check:resume-history` | ≤ 1 commit touches `src/content/resume/` (ADR 0005)                                                                                                   |
| Route budgets       | `yarn size`                 | Gzipped JS/CSS each prerendered page loads: ≤ 120 kB JS on content routes ([`scripts/check-budgets.mjs`](scripts/check-budgets.mjs))                  |
| E2E + accessibility | `yarn e2e`                  | Content is in the HTML without JS; pages hydrate; unknown URLs return 404; 0 axe WCAG 2.2 AA violations in light and dark mode, on desktop and mobile |
| Lighthouse          | `yarn lhci`                 | Median of 5 mobile runs. Content routes: Performance ≥ 95, the rest 100, LCP ≤ 2.5 s. Tour: floor until Phase 4                                       |

## Writing case studies

Case studies are MDX files in `src/content/work/` with frontmatter (`title`, `summary`, `date`, `draft`, `order`). Drafts appear in `yarn dev` and in preview builds (`INCLUDE_DRAFTS=1 yarn build`) only.

## Updating the resume

Resume content is the only part of the repo whose history is rewritten. See [ADR 0005](docs/adr/0005-resume-has-a-single-public-revision.md).

```sh
# edit src/content/resume/ only, then:
git commit -m "Resume" -- src/content/resume
yarn resume:squash                      # backs up, then collapses resume history to the current version
git fetch origin && git push --force-with-lease origin develop main
```

## Decisions

See [docs/adr](docs/adr/README.md).
