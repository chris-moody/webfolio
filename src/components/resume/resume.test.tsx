import { describe, expect, it } from 'vitest'
import { render, screen } from '@testing-library/react'
import { ResumeView } from './ResumeView'
import { formatResumeDate } from './resume.utils'
import { resume } from '@/content/resume/resume'

describe('formatResumeDate', () => {
  it('formats months and years', () => {
    expect(formatResumeDate('2017-08')).toBe('Aug 2017')
    expect(formatResumeDate('2007')).toBe('2007')
    expect(formatResumeDate()).toBe('Present')
  })
})

describe('ResumeView', () => {
  it('renders every role as a heading with its dates', () => {
    render(<ResumeView headingLevel={1} />)
    expect(
      screen.getByRole('heading', { level: 1, name: resume.basics.name })
    ).toBeInTheDocument()
    for (const role of resume.work) {
      expect(
        screen.getByRole('heading', {
          level: 3,
          name: `${role.name} — ${role.position}`,
        })
      ).toBeInTheDocument()
    }
    expect(screen.getByRole('link', { name: /download pdf/i })).toHaveAttribute(
      'href',
      '/cmoodyResume.pdf'
    )
  })
})
