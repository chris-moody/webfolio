import { findTourWizard } from '@/data/tour.manifest'
import { SITE, pageMeta } from '@/site'
import type { Route } from './+types/wizard'

export { default } from '@/components/wizard/Wizard'

export const meta: Route.MetaFunction = ({ params, location }) => {
  const wizard = findTourWizard(params.wizardId)
  return pageMeta({
    title: `${wizard?.title ?? 'Tour'} · The tour · ${SITE.name}`,
    description:
      'An interactive, personality-forward tour: stories, projects, and a little flair.',
    path: location.pathname,
  })
}
