# 0004. Confidentiality of case studies

- Status: Accepted
- Date: 2026-10-06

## Decision

- **Current employer (Unanet):** nothing employer-specific is published. Only high-level, publicly known facts: the role, the dates, and generic techniques ("incremental modernization behind feature flags", "RTK Query → TanStack Query"). No product details, architecture, screenshots, internal names, or numbers.
- **Previous employers:** no code, screenshots, or internal names. Visuals use public or synthetic data, and all code is written fresh.
- **No unmeasured numbers.** The "~30% less duplicated UI work" figure is retired. It was an estimate based on code removed and future duplicated code avoided. Impact is described qualitatively, and a unit test fails if a percentage appears in the resume data.

## Consequences

Case study B draws its depth from Metabolon and from this site's own public migration (ADR 0001). Unanet appears as a single line of public context.
