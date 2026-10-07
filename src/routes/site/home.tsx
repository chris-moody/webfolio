import { Link } from 'react-router'
import { resume } from '@/content/resume/resume'
import { formatResumeDate } from '@/components/resume/resume.utils'
import { tourPath, TOUR_START } from '@/data/tour.manifest'
import { pageMeta, SITE } from '@/site'
import type { Route } from './+types/home'

const { basics, work } = resume

export const meta: Route.MetaFunction = () => [
  ...pageMeta({
    title: `${basics.name} · ${basics.label}`,
    description:
      'Front-end engineer with nearly 20 years of experience: design systems, incremental migrations, and high-performance data UIs.',
    path: '/',
  }),
  {
    'script:ld+json': {
      '@context': 'https://schema.org',
      '@type': 'Person',
      name: basics.name,
      jobTitle: basics.label,
      url: SITE.url,
      email: `mailto:${basics.email}`,
      address: {
        '@type': 'PostalAddress',
        addressLocality: 'Cary',
        addressRegion: 'NC',
      },
      sameAs: basics.profiles.map((profile) => profile.url),
      alumniOf: resume.education.map((entry) => ({
        '@type': 'CollegeOrUniversity',
        name: entry.institution,
      })),
    },
  },
]

const focusAreas = [
  {
    title: 'Design systems and shared UI',
    body: 'A shared component library adopted across three engineering teams at Metabolon, and purpose-built UI frameworks used by both AI agents and human developers.',
  },
  {
    title: 'Modernizing without freezing',
    body: 'Class components to hooks, Thunk to RTK Query, CRA to Vite: large codebases moved forward incrementally while product work kept shipping.',
  },
  {
    title: 'Data-heavy interfaces',
    body: 'd3 and Cytoscape.js visualizations of large scientific datasets, with web workers and virtualization keeping the main thread free.',
  },
]

export default function Home() {
  return (
    <>
      <section aria-labelledby="intro" className="max-w-3xl">
        <p className="text-sm font-semibold uppercase tracking-widest text-accent">
          {basics.label}
        </p>
        <h1
          id="intro"
          className="mt-2 text-4xl font-bold tracking-tight text-fg sm:text-5xl"
        >
          {basics.name}
        </h1>
        <p className="mt-5 text-lg leading-relaxed text-fg-muted">
          {basics.summary}
        </p>
        <div className="mt-8 flex flex-wrap gap-3">
          <Link
            to="/resume"
            className="rounded-md bg-accent px-5 py-2.5 font-semibold text-on-accent no-underline hover:bg-accent-strong hover:text-on-accent"
          >
            Read the resume
          </Link>
          <Link
            to={tourPath(TOUR_START.wizard, TOUR_START.step)}
            className="rounded-md border border-border bg-surface px-5 py-2.5 font-semibold text-fg no-underline hover:border-accent hover:text-accent"
          >
            Take the tour →
          </Link>
        </div>
      </section>

      <section aria-labelledby="focus" className="mt-16">
        <h2 id="focus" className="text-2xl font-bold text-fg">
          What I do
        </h2>
        <ul className="mt-6 grid gap-4 sm:grid-cols-3">
          {focusAreas.map((area) => (
            <li
              key={area.title}
              className="rounded-lg border border-border bg-surface p-5"
            >
              <h3 className="font-semibold text-fg">{area.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-fg-muted">
                {area.body}
              </p>
            </li>
          ))}
        </ul>
      </section>

      <section aria-labelledby="experience" className="mt-16">
        <h2 id="experience" className="text-2xl font-bold text-fg">
          Recent experience
        </h2>
        <ol className="mt-6 divide-y divide-border rounded-lg border border-border bg-surface">
          {work.slice(0, 3).map((role) => (
            <li
              key={role.name}
              className="flex flex-wrap justify-between gap-x-4 gap-y-1 p-5"
            >
              <div>
                <h3 className="font-semibold text-fg">{role.name}</h3>
                <p className="text-sm text-fg-muted">{role.position}</p>
              </div>
              <p className="text-sm text-fg-muted">
                {formatResumeDate(role.startDate)} –{' '}
                {formatResumeDate(role.endDate)}
              </p>
            </li>
          ))}
        </ol>
        <p className="mt-4">
          <Link to="/resume">Full resume</Link>
        </p>
      </section>

      <section aria-labelledby="contact" className="mt-16">
        <h2 id="contact" className="text-2xl font-bold text-fg">
          Get in touch
        </h2>
        <ul className="mt-4 flex flex-wrap gap-x-6 gap-y-2">
          <li>
            <a href={`mailto:${basics.email}`}>{basics.email}</a>
          </li>
          {basics.profiles.map((profile) => (
            <li key={profile.network}>
              <a href={profile.url}>{profile.network}</a>
            </li>
          ))}
        </ul>
      </section>
    </>
  )
}
