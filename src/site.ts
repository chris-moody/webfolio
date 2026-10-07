import { RESOLVED } from './tokens/generated.ts'

export const SITE = {
  name: 'Christopher Moody',
  url: 'https://webfolio.moodydigital.com',
  themeColor: RESOLVED.light.accent,
  repo: 'https://github.com/chris-moody/webfolio',
} as const

/** Builds a page's meta tags: title, description, canonical URL, and Open Graph. */
export const pageMeta = ({
  title,
  description,
  path,
}: {
  title: string
  description: string
  path: string
}) => {
  const url = new URL(path, SITE.url).toString()
  return [
    { title },
    { name: 'description', content: description },
    { tagName: 'link', rel: 'canonical', href: url },
    { property: 'og:type', content: 'website' },
    { property: 'og:site_name', content: SITE.name },
    { property: 'og:title', content: title },
    { property: 'og:description', content: description },
    { property: 'og:url', content: url },
    { property: 'og:image', content: new URL('/og.png', SITE.url).toString() },
    { property: 'og:image:width', content: '1200' },
    { property: 'og:image:height', content: '630' },
    { name: 'twitter:card', content: 'summary_large_image' },
  ]
}
