import { NotFound } from '@/components/notFound/NotFound'
import { SITE } from '@/site'

export const meta = () => [
  { title: `Page not found · ${SITE.name}` },
  { name: 'robots', content: 'noindex' },
]

export default function NotFoundPage() {
  return <NotFound />
}
