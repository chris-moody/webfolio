import { readdirSync, readFileSync } from 'node:fs'
import path from 'node:path'
import { parse } from 'yaml'

// Case studies are MDX files in src/content/work/. This module runs at build
// time (Vite plugin and react-router.config.ts) and decides which ones ship:
// drafts are left out of production builds entirely, so unfinished writing
// never reaches the site, not even inside a JS chunk.

export const CONTENT_DIR = path.resolve(
  import.meta.dirname,
  '../src/content/work'
)

export interface CaseStudyFrontmatter {
  title: string
  summary: string
  /** ISO date the case study was published or last revised. */
  date: string
  draft?: boolean
  /** Sort position on /work (lower first). */
  order?: number
}

export interface CaseStudyEntry {
  slug: string
  file: string
  frontmatter: CaseStudyFrontmatter
  readingMinutes: number
}

const FRONTMATTER = /^---\n([\s\S]*?)\n---\n/

export const readCaseStudy = (file: string): CaseStudyEntry => {
  const source = readFileSync(file, 'utf8')
  const match = FRONTMATTER.exec(source)
  if (!match?.[1]) throw new Error(`${file}: missing frontmatter`)
  const frontmatter = parse(match[1]) as CaseStudyFrontmatter
  for (const key of ['title', 'summary', 'date'] as const) {
    if (!frontmatter[key])
      throw new Error(`${file}: frontmatter needs "${key}"`)
  }
  // Prose words only: drop frontmatter, imports/exports, JSX tags, and code fences.
  const prose = source
    .slice(match[0].length)
    .replace(/```[\s\S]*?```/g, ' ')
    .replace(/^(import|export) .*$/gm, ' ')
    .replace(/<[^>]+>/g, ' ')
  const words = prose.split(/\s+/).filter((word) => /[a-z]/i.test(word)).length
  return {
    slug: path.basename(file, '.mdx'),
    file,
    frontmatter,
    readingMinutes: Math.max(1, Math.round(words / 230)),
  }
}

export const listCaseStudies = ({
  includeDrafts,
}: {
  includeDrafts: boolean
}): CaseStudyEntry[] =>
  readdirSync(CONTENT_DIR)
    .filter((name) => name.endsWith('.mdx'))
    .map((name) => readCaseStudy(path.join(CONTENT_DIR, name)))
    .filter((entry) => includeDrafts || !entry.frontmatter.draft)
    .sort((a, b) => (a.frontmatter.order ?? 99) - (b.frontmatter.order ?? 99))

/** Drafts ship only in dev, or when a preview build sets INCLUDE_DRAFTS=1. */
export const shouldIncludeDrafts = (mode: string) =>
  mode === 'development' || process.env.INCLUDE_DRAFTS === '1'
