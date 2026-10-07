import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { useState } from 'react'
import { Link } from 'react-router'
import { TapeDemo } from '@/lab/tape/components/TapeDemo'
import { pageMeta, SITE } from '@/site'
import type { Route } from './+types/lab.tape'

export const meta: Route.MetaFunction = () =>
  pageMeta({
    title: 'Tape: a real-time market grid · Lab',
    description:
      'A virtualized market grid fed by a simulated trade stream in a Web Worker, with a live frame-time meter. TypeScript, React, TanStack Table, Virtual, and Query, Tailwind.',
    path: '/lab/tape',
  })

export default function TapePage() {
  const [queryClient] = useState(() => new QueryClient())
  return (
    <QueryClientProvider client={queryClient}>
      <p className="text-sm">
        <Link to="/lab">← Lab</Link>
      </p>
      <h1 className="mt-2 text-4xl font-bold tracking-tight">Tape</h1>
      <div className="mt-4 max-w-prose space-y-3 text-fg-muted">
        <p>
          A simulated market streams thousands of trades a second. A Web Worker
          applies them, keeps the sort and filter current, and hands the page
          only the rows on screen, once per frame, as transferred typed arrays.
          The grid is TanStack Table on TanStack Virtual; reference data comes
          through TanStack Query.
        </p>
        <p>
          <strong className="text-fg">Try it:</strong> raise the trade rate,
          then switch the engine to the main thread and scroll. The frame meter
          shows the difference. Everything is keyboard operable: focus the grid
          and use the arrow keys, Page Up/Down, and Home/End.
        </p>
      </div>
      <div className="mt-8">
        <TapeDemo />
      </div>
      <p className="mt-6 text-sm text-fg-muted">
        How it works:{' '}
        <a href={`${SITE.repo}/blob/develop/src/lab/tape/ARCHITECTURE.md`}>
          architecture notes and measurements
        </a>
        .
      </p>
    </QueryClientProvider>
  )
}
