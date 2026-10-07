import { Link } from 'react-router'
import { caseStudyIndex } from 'virtual:case-studies/index'
import { pageMeta } from '@/site'
import type { Route } from './+types/work'

export const meta: Route.MetaFunction = () =>
  pageMeta({
    title: 'Work · Christopher Moody',
    description:
      'Case studies: the problem, the constraints, the approach, the tradeoffs, and the result.',
    path: '/work',
  })

export default function Work() {
  return (
    <>
      <h1 className="text-4xl font-bold tracking-tight">Work</h1>
      <p className="mt-4 max-w-prose text-lg text-fg-muted">
        Case studies from shipping software: the problem, the constraints, what
        I chose not to do, and what it changed. Visuals use public or synthetic
        data; no proprietary code.
      </p>
      <ul className="mt-8 space-y-4">
        {caseStudyIndex.map((study) => (
          <li
            key={study.slug}
            className="rounded-lg border border-border bg-surface p-5"
          >
            <h2 className="text-xl font-semibold">
              <Link to={`/work/${study.slug}`}>{study.frontmatter.title}</Link>
            </h2>
            <p className="mt-2 text-fg-muted">{study.frontmatter.summary}</p>
            <p className="mt-2 text-sm text-fg-muted">
              {study.readingMinutes} min read
              {study.frontmatter.draft ? ' · Draft' : ''}
            </p>
          </li>
        ))}
      </ul>
    </>
  )
}
