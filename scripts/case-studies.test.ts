import { mkdtempSync, writeFileSync } from 'node:fs'
import { tmpdir } from 'node:os'
import path from 'node:path'
import { describe, expect, it } from 'vitest'
import {
  listCaseStudies,
  readCaseStudy,
  shouldIncludeDrafts,
} from './case-studies'

const write = (name: string, body: string) => {
  const dir = mkdtempSync(path.join(tmpdir(), 'case-study-'))
  const file = path.join(dir, name)
  writeFileSync(file, body)
  return file
}

describe('case studies', () => {
  it('reads frontmatter and estimates reading time from prose only', () => {
    const words = Array.from({ length: 460 }, () => 'word').join(' ')
    const file = write(
      'example.mdx',
      `---\ntitle: Example\nsummary: A summary\ndate: 2026-10-07\n---\n\nimport { X } from 'x'\n\n${words}\n\n\`\`\`ts\nconst ignored = code\n\`\`\`\n`
    )
    const entry = readCaseStudy(file)
    expect(entry.slug).toBe('example')
    expect(entry.frontmatter.title).toBe('Example')
    expect(entry.readingMinutes).toBe(2)
  })

  it('leaves drafts out of production builds', () => {
    const published = listCaseStudies({ includeDrafts: false })
    expect(published.every((entry) => !entry.frontmatter.draft)).toBe(true)
    expect(
      listCaseStudies({ includeDrafts: true }).length
    ).toBeGreaterThanOrEqual(published.length)
    expect(shouldIncludeDrafts('development')).toBe(true)
    expect(shouldIncludeDrafts('production')).toBe(
      process.env.INCLUDE_DRAFTS === '1'
    )
  })
})
