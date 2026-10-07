declare module 'virtual:case-studies/index' {
  export interface CaseStudyMeta {
    slug: string
    frontmatter: {
      title: string
      summary: string
      date: string
      draft?: boolean
      order?: number
    }
    readingMinutes: number
  }
  export const caseStudyIndex: CaseStudyMeta[]
}

declare module 'virtual:case-studies' {
  import type { CaseStudyMeta } from 'virtual:case-studies/index'
  import type { MDXContent } from 'mdx/types'
  export const caseStudies: (CaseStudyMeta & { Content: MDXContent })[]
}
