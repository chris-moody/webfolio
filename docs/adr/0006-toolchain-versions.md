# 0006. Toolchain versions

- Status: Accepted
- Date: 2026-10-06

## Decision

| Package      | Version | Why not the latest                                                                                                                                                       |
| ------------ | ------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| Vite         | 8       | —                                                                                                                                                                        |
| React        | 19.3    | —                                                                                                                                                                        |
| React Router | 7.18    | v8 (June 2026) is new. Framework-mode prerendering ships on 7.x with the same `@react-router/dev` peer range for Vite 8. Upgrading to v8 is a separate, later migration. |
| TypeScript   | 6.0     | typescript-eslint supports `<6.1`. TS 7 waits for lint support.                                                                                                          |
| MUI          | 6.5     | Phase 3 replaces the theme layer with token adapters, so upgrading MUI before then means doing the theme work twice.                                                     |
| ESLint       | 10      | ESLint 9 is out of support.                                                                                                                                              |

`@gsap/react` moved to 2.1.2. 2.1.1 declared React as a regular dependency, which installed a second copy of React and crashed every route under React 19.3.

## Consequences

The `react-hooks` 7 rules (purity, refs, set-state-in-effect, immutability) are on. Phase 0 fixed the existing violations instead of suppressing them.
