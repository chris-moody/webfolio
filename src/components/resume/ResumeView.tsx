import { FC, ReactNode } from 'react'
import { resume } from '@/content/resume/resume'
import type { ResumeWork } from '@/content/resume/resume.types'
import { formatResumeDate, RESUME_PDF_PATH } from './resume.utils'

// Styled here, not by site.css's base `a` rule: the tour shows this view
// without the site stylesheet.
const link = 'text-accent underline underline-offset-2 hover:text-accent-strong'

type Level = 1 | 2

interface HeadingProps {
  level: 1 | 2 | 3 | 4
  id?: string
  className: string
  children: ReactNode
}

const Heading: FC<HeadingProps> = ({ level, ...props }) => {
  const Tag = `h${level}` as const
  return <Tag {...props} />
}

const Role: FC<{ role: ResumeWork; level: 3 | 4 }> = ({ role, level }) => (
  <article className="break-inside-avoid-page">
    <Heading level={level} className="font-semibold text-fg">
      {role.name} — {role.position}
    </Heading>
    <p className="text-sm text-fg-muted">
      {role.location} ·{' '}
      <time dateTime={role.startDate}>{formatResumeDate(role.startDate)}</time>
      {' – '}
      {role.endDate ? (
        <time dateTime={role.endDate}>{formatResumeDate(role.endDate)}</time>
      ) : (
        'Present'
      )}
    </p>
    {role.note && <p className="text-sm text-fg-muted">{role.note}</p>}
    <ul className="mt-2 list-disc space-y-1 pl-5 text-sm leading-relaxed">
      {role.highlights.map((highlight) => (
        <li key={highlight}>{highlight}</li>
      ))}
    </ul>
  </article>
)

export interface ResumeViewProps {
  /** 1 on the standalone page; 2 inside the tour, which has its own h1. */
  headingLevel?: Level
  /** Adds a panel background and scrolling for use inside the tour. */
  panel?: boolean
}

export const ResumeView: FC<ResumeViewProps> = ({
  headingLevel = 2,
  panel = false,
}) => {
  const { basics, skills, work, earlierExperience, education } = resume
  const section = (headingLevel + 1) as 2 | 3
  const item = (headingLevel + 2) as 3 | 4
  const sectionClass = 'text-lg font-bold uppercase tracking-wide text-accent'

  return (
    <div
      className={`text-left text-fg ${
        panel
          ? 'overflow-auto rounded-lg bg-surface/90 p-4 shadow-sm sm:p-6'
          : ''
      }`}
    >
      <header className="flex flex-wrap items-start justify-between gap-4 border-b border-border pb-6">
        <div>
          <Heading
            level={headingLevel}
            className="text-3xl font-bold tracking-tight"
          >
            {basics.name}
          </Heading>
          <p className="mt-1 text-lg text-fg-muted">{basics.label}</p>
          <address className="mt-2 flex flex-wrap gap-x-3 gap-y-1 text-sm not-italic">
            <span>{basics.location}</span>
            {basics.phone && (
              <a
                className={link}
                href={`tel:+1${basics.phone.replace(/\D/g, '')}`}
              >
                {basics.phone}
              </a>
            )}
            <a className={link} href={`mailto:${basics.email}`}>
              {basics.email}
            </a>
            {basics.profiles.map((profile) => (
              <a key={profile.network} className={link} href={profile.url}>
                {profile.label}
              </a>
            ))}
          </address>
        </div>
        <a
          href={RESUME_PDF_PATH}
          download
          className="rounded-md bg-accent px-4 py-2 text-sm font-semibold text-on-accent no-underline hover:bg-accent-strong hover:text-on-accent print:hidden"
        >
          Download PDF
        </a>
      </header>

      <section aria-labelledby="resume-summary" className="mt-6">
        <Heading level={section} id="resume-summary" className={sectionClass}>
          Summary
        </Heading>
        <p className="mt-2 leading-relaxed">{basics.summary}</p>
      </section>

      <section aria-labelledby="resume-skills" className="mt-6">
        <Heading level={section} id="resume-skills" className={sectionClass}>
          Skills
        </Heading>
        <dl className="mt-2 grid gap-x-4 gap-y-1 text-sm sm:grid-cols-[max-content_1fr]">
          {skills.map((skill) => (
            <div key={skill.name} className="contents">
              <dt className="font-semibold">{skill.name}</dt>
              <dd className="mb-2 sm:mb-0">{skill.keywords.join(', ')}</dd>
            </div>
          ))}
        </dl>
      </section>

      <section aria-labelledby="resume-experience" className="mt-6">
        <Heading
          level={section}
          id="resume-experience"
          className={sectionClass}
        >
          Experience
        </Heading>
        <div className="mt-3 space-y-5">
          {work.map((role) => (
            <Role
              key={`${role.name}-${role.startDate}`}
              role={role}
              level={item}
            />
          ))}
          <article>
            <Heading level={item} className="font-semibold">
              Earlier Experience
            </Heading>
            <ul className="mt-2 list-disc space-y-1 pl-5 text-sm leading-relaxed">
              {earlierExperience.map((entry) => (
                <li key={entry}>{entry}</li>
              ))}
            </ul>
          </article>
        </div>
      </section>

      <section aria-labelledby="resume-education" className="mt-6">
        <Heading level={section} id="resume-education" className={sectionClass}>
          Education
        </Heading>
        {education.map((entry) => (
          <p key={entry.institution} className="mt-2 text-sm">
            {entry.institution}, {entry.studyType} {entry.area}, {entry.endDate}
          </p>
        ))}
      </section>
    </div>
  )
}

/** The tour's resume step: a scrolling panel under the tour's own "Resume" h1. */
export const TourResume: FC = () => <ResumeView headingLevel={2} panel />
