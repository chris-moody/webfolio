# Tape: architecture and measurements

Tape is a real-time market grid: up to 50,000 symbols and 50,000 trades per second, simulated, decoded, sorted, and filtered off the main thread, then rendered through a virtualized TanStack Table at the display's frame rate. It lives at [`/lab/tape`](https://webfolio.moodydigital.com/lab/tape). This folder is self-contained: nothing here imports from the rest of the site, apart from design tokens.

## Data flow

```
┌──────────────── Worker (tape.worker.ts) ─────────────────┐            ┌──────────────── Main thread ────────────────────┐
│ every 50 ms: a feed packet                              │            │ requestAnimationFrame loop (store.ts)            │
│   simulateFeed → N JSON trade messages ("the exchange") │   pull     │   one pull in flight at a time (backpressure)    │
│   ingest       → JSON.parse each, update SoA arrays     │ ◀───────── │   skips frames whose version hasn't changed      │
│ on sort/filter change, or every 250 ms if sorted by a   │            │ useSyncExternalStore → TapeDemo → TapeGrid       │
│   moving value: computeOrder over typed-array keys      │   frame    │   TanStack Table (manualSorting: window only)    │
│ on pull: copy only rows [start, end) into typed arrays  │ ─────────▶ │   TanStack Virtual (rows), memoized GridRow       │
│   and transfer them (no structured clone of row data)   │ transfer   │   SVG sparklines, CSS flash keyed by sequence     │
└──────────────────────────────────────────────────────────┘            │ FrameMeter: own rAF + PerformanceObserver (LoAF) │
                                                                        └──────────────────────────────────────────────────┘
```

- **Engine** (`engine/`): plain TypeScript, no DOM or React, so the worker and the main-thread comparison mode run identical code. Market state is struct-of-arrays (`Float64Array` per field), so nothing is allocated per trade. Prices follow geometric Brownian motion with per-symbol volatility, and everything is seeded, so a seed always produces the same market.
- **Feed**: trades are encoded as one JSON message each and decoded on the engine's thread. Real clients pay that decode cost per message, so it's the work worth moving. Only decode and apply count toward the engine's `tickMs`; the simulated exchange's encoding doesn't.
- **Pull, don't push.** The page asks for the visible window each animation frame and never has more than one request outstanding. A slow consumer lowers its own update rate instead of building a queue, and the worker never sends rows nobody can see. At the default load a frame is about 16 KB.
- **Sorting and filtering happen in the engine** over the full dataset. Sort keys are extracted into a typed array first, so the comparator does no lookups. Value sorts refresh at most every 250 ms, the conflation interval a trader can actually read. TanStack Table runs with `manualSorting`: it owns sort _state_ and header semantics, and the engine owns sort _processing_, the "server owns processing" split from the Table v9 docs.
- **Reference data** (names, sectors) comes from TanStack Query: a simulated REST call with latency, cached per seed and size. That's the normal shape of a trading UI, with slow-changing reference data joined to fast-moving quotes.

## Rendering decisions

| Decision                                                                              | Why                                                                                                                                                |
| ------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------- |
| Skip publishing frames whose `version` (trade count + sort generation) hasn't changed | Packets arrive every 50 ms, but rAF fires every 16.7 ms. Two of every three frames carried no new data and still re-rendered the grid.             |
| `GridRow` memoized on symbol, sequence number, position, layout, and focus            | At 5k trades/s across 10k symbols, a few percent of visible rows change per packet. The rest skip rendering entirely.                              |
| Rows positioned with `top`, not `transform`                                           | Per-row transforms (with containment) made each row a compositing layer. Layerizing ~40 layers cost ~9 ms per scrolled frame at 4× CPU throttling. |
| SVG sparklines, not one `<canvas>` per row                                            | Accelerated canvases are layers too. Removing them cut ~12 ms per scrolled frame at 4×.                                                            |
| Theme colors cached per color mode                                                    | `getComputedStyle` in each sparkline forced a document-wide style recalc whenever rows mounted while scrolling.                                    |
| Change flash = CSS animation on a span keyed by sequence number                       | A new trade remounts the span and restarts the animation. No timers, no extra renders, and `prefers-reduced-motion` turns it off.                  |
| The frame meter lives outside React                                                   | It owns its DOM and its own rAF loop, so measuring adds no renders to what it measures.                                                            |

## Accessibility

- `role="grid"` with `aria-rowcount`/`aria-colcount` for the full dataset and `aria-rowindex` on virtual rows, so assistive tech knows where it is in 10,000 rows while only ~40 exist in the DOM.
- Keyboard: the grid keeps focus and points at the active cell with `aria-activedescendant`, so rows can mount and unmount under the cursor. Arrows, Page Up/Down, Home/End, and Ctrl+Home/End move the cursor, scrolling it into view.
- Sortable headers are real buttons with `aria-sort` on the header cell.
- Live updates are **not** announced by default. The opt-in announces the focused row's price at most every 5 seconds through a polite status region. A screen reader can't consume a stream, and shouldn't be asked to.
- Price direction is shown by sign and color, never color alone. Token pairs for up/down text pass WCAG AA in both modes (`src/styles/tokens.test.ts`).

## Measurements

All numbers are from headless Chromium on an Apple Silicon laptop, 2026-10-07. Frame time comes from the on-page meter (rolling 300 frames). Throttling uses DevTools CPU emulation. "Scroll" means the grid scrolls 40 px every frame for 5 s; "idle" means streaming with no interaction.

**Final build**

| Load (symbols / trades per s) | Mode        | CPU | Idle p95 | Scroll p95 | Long frames |
| ----------------------------- | ----------- | --- | -------- | ---------- | ----------- |
| 10k / 5k (default)            | Worker      | 1×  | 16.7 ms  | 16.7 ms    | 0           |
| 10k / 5k                      | Main thread | 1×  | 16.7 ms  | 16.7 ms    | 0           |
| 50k / 50k                     | Worker      | 1×  | 16.8 ms  | 16.8 ms    | 0           |
| 50k / 50k                     | Main thread | 1×  | 16.7 ms  | 16.8 ms    | 0           |
| 10k / 5k                      | Worker      | 4×  | 16.7 ms  | 33.4 ms    | 0–1         |
| 50k / 50k                     | Main thread | 4×  | 16.8 ms  | 50.0 ms    | 1 (58 ms)   |

**The honest finding:** on a fast laptop, moving the engine to the main thread costs nothing visible, even at 50k trades/s, because decoding a 2,500-message packet takes a millisecond or two. The worker earns its keep on slower CPUs and at high load. At 4× throttling, main-thread mode at 50k/50k is where the frame meter shows the long frames. The toggle is there so you can see that for yourself rather than take a slogan on faith.

**What the optimizations bought** (4× CPU throttling, worker mode, 10k / 5k)

| Version                                                                        | Idle p95                         | Scroll p50 |
| ------------------------------------------------------------------------------ | -------------------------------- | ---------- |
| First working build (re-render every rAF, `transform` rows, canvas sparklines) | 50.0 ms (130/300 frames dropped) | ~41 ms     |
| + skip unchanged frames, memoized rows                                         | **16.7 ms (0 dropped)**          | ~37 ms     |
| + `top` instead of `transform`                                                 | 16.7 ms                          | ~37 ms     |
| + SVG sparklines, cached theme colors                                          | 16.7 ms                          | **~30 ms** |
| Reference: static page, same scroll loop                                       | —                                | 16.7 ms    |

The remaining scroll cost at 4× is split between React work for rows entering the viewport and paint. A next step would be recycling row elements instead of mounting new ones.

**CI checks** (`e2e/tape.spec.ts`, `e2e/perf.spec.ts`)

- Functional: data streams in; only a window of rows is in the DOM; engine-side sort sets `aria-sort`; prefix filter; keyboard cursor reaches row 10,000; engine mode switches.
- Performance smoke: at the default load, after warm-up, p95 ≤ 34 ms and zero long animation frames. It runs in its own Playwright project after all other tests, with tracing off, because parallel tests and trace recording both showed up in the numbers. It's a regression tripwire, not a benchmark.
- Lighthouse on `/lab/tape` (median of 5, mobile, local server): 97 / 100 / 100 / 100, CLS 0, TBT 16 ms. Route JS: 152 kB gzipped (budget 165 kB), plus a 5.6 kB worker.

## Not done (yet)

- **SharedArrayBuffer mode** (zero-copy reads with an `Atomics` sequence counter). It needs COOP/COEP headers on `/lab/*`, and transfer already keeps frames to ~16 KB.
- Column virtualization (12 columns don't need it), column resizing, and row recycling (see above).
