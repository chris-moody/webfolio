import { Link } from 'react-router'
import { caseStudies } from 'virtual:case-studies'
import { proseComponents } from '@/components/case-study/prose'
import { NotFound } from '@/components/notFound/NotFound'
import { resume } from '@/content/resume/resume'
import { pageMeta, SITE } from '@/site'
import type { Route } from './+types/work.$slug'

const findStudy = (slug: string | undefined) =>
  caseStudies.find((study) => study.slug === slug)

const dateFormat = new Intl.DateTimeFormat('en-US', {
  year: 'numeric',
  month: 'long',
  timeZone: 'UTC',
})

export const meta: Route.MetaFunction = ({ params }) => {
  const study = findStudy(params.slug)
  if (!study) return [{ title: `Page not found · ${SITE.name}` }]
  const { title, summary, date, draft } = study.frontmatter
  return [
    ...pageMeta({
      title: `${title} · ${SITE.name}`,
      description: summary,
      path: `/work/${study.slug}`,
    }),
    ...(draft ? [{ name: 'robots', content: 'noindex' }] : []),
    {
      'script:ld+json': {
        '@context': 'https://schema.org',
        '@type': 'Article',
        headline: title,
        description: summary,
        datePublished: date,
        author: { '@type': 'Person', name: resume.basics.name, url: SITE.url },
      },
    },
  ]
}

export default function CaseStudy({ params }: Route.ComponentProps) {
  const study = findStudy(params.slug)
  if (!study) return <NotFound />
  const { Content, frontmatter, readingMinutes } = study
  return (
    <article className="mx-auto max-w-3xl">
      <p className="text-sm">
        <Link to="/work">← Work</Link>
      </p>
      {frontmatter.draft && (
        <p className="mt-4 rounded-md border border-dashed border-negative px-3 py-2 text-sm text-negative">
          Draft: not published. Only dev and preview builds include it.
        </p>
      )}
      <header className="mt-4">
        <h1 className="text-4xl font-bold tracking-tight text-balance">
          {frontmatter.title}
        </h1>
        <p className="mt-4 text-lg text-fg-muted">{frontmatter.summary}</p>
        <p className="mt-3 text-sm text-fg-muted">
          <time dateTime={frontmatter.date}>
            {dateFormat.format(new Date(frontmatter.date))}
          </time>{' '}
          · {readingMinutes} min read
        </p>
      </header>
      <div className="mt-8 text-fg">
        <Content components={proseComponents} />
      </div>
    </article>
  )
}
