import type { Plugin } from 'vite'
import {
  CONTENT_DIR,
  listCaseStudies,
  shouldIncludeDrafts,
} from './case-studies.ts'

const CONTENT_ID = 'virtual:case-studies'
const INDEX_ID = 'virtual:case-studies/index'

/**
 * Two virtual modules:
 * - `virtual:case-studies/index`: metadata only, for nav and listings
 * - `virtual:case-studies`: metadata plus the compiled MDX components,
 *   imported only by the case-study route
 * Both contain only the case studies this build includes (see case-studies.ts).
 */
export const caseStudiesPlugin = (): Plugin => {
  let includeDrafts = false
  return {
    name: 'case-studies',
    configResolved(config) {
      includeDrafts = shouldIncludeDrafts(config.mode)
    },
    resolveId(id) {
      if (id === CONTENT_ID || id === INDEX_ID) return `\0${id}`
    },
    load(id) {
      if (id !== `\0${CONTENT_ID}` && id !== `\0${INDEX_ID}`) return
      const entries = listCaseStudies({ includeDrafts })
      const meta = entries.map(({ slug, frontmatter, readingMinutes }) => ({
        slug,
        frontmatter,
        readingMinutes,
      }))
      if (id === `\0${INDEX_ID}`)
        return `export const caseStudyIndex = ${JSON.stringify(meta)}`
      const imports = entries
        .map(
          (entry, i) => `import Content${i} from ${JSON.stringify(entry.file)}`
        )
        .join('\n')
      const list = meta
        .map(
          (item, i) => `{ ...${JSON.stringify(item)}, Content: Content${i} }`
        )
        .join(',\n')
      return `${imports}\nexport const caseStudies = [${list}]`
    },
    // Watch the content directory through the dev server's watcher. (Passing a
    // directory to addWatchFile makes it an import dependency, which fails to
    // resolve in dev.) Any add, change, or removal rebuilds both modules.
    configureServer(server) {
      server.watcher.add(CONTENT_DIR)
      const refresh = (file: string) => {
        if (!file.startsWith(CONTENT_DIR)) return
        for (const id of [CONTENT_ID, INDEX_ID]) {
          const module = server.moduleGraph.getModuleById(`\0${id}`)
          if (module) server.moduleGraph.invalidateModule(module)
        }
        server.ws.send({ type: 'full-reload' })
      }
      server.watcher.on('add', refresh)
      server.watcher.on('unlink', refresh)
      server.watcher.on('change', (file) => {
        // Frontmatter (title, draft, order) feeds the virtual modules, so an
        // MDX edit reloads the page rather than hot-updating it.
        if (file.endsWith('.mdx')) refresh(file)
      })
    },
  }
}
