import { Link } from 'react-router'
import { pageMeta } from '@/site'
import type { Route } from './+types/lab'

export const meta: Route.MetaFunction = () =>
  pageMeta({
    title: 'Lab · Christopher Moody',
    description: 'Live demos of front-end performance and platform work.',
    path: '/lab',
  })

export default function Lab() {
  return (
    <>
      <h1 className="text-4xl font-bold tracking-tight">Lab</h1>
      <p className="mt-4 max-w-prose text-lg text-fg-muted">
        Working demos, built from scratch with public tools and synthetic data.
        Each one shows its own numbers.
      </p>
      <ul className="mt-8 grid gap-4 sm:grid-cols-2">
        <li className="rounded-lg border border-border bg-surface p-5">
          <h2 className="text-lg font-semibold">
            <Link to="/lab/tape">Tape: a real-time market grid</Link>
          </h2>
          <p className="mt-2 text-sm text-fg-muted">
            Up to 50,000 symbols and 50,000 trades per second, simulated in a
            Web Worker and rendered through a virtualized TanStack Table, with a
            frame meter and a switch to run the same work on the main thread.
          </p>
        </li>
      </ul>
    </>
  )
}
