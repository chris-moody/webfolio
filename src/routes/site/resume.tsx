import { ResumeView } from '@/components/resume/ResumeView'
import { resume } from '@/content/resume/resume'
import { pageMeta } from '@/site'
import type { Route } from './+types/resume'

export const meta: Route.MetaFunction = () =>
  pageMeta({
    title: `Resume · ${resume.basics.name}`,
    description: `${resume.basics.name}, ${resume.basics.label}. Experience, skills, and education.`,
    path: '/resume',
  })

export default function ResumePage() {
  return <ResumeView headingLevel={1} />
}
