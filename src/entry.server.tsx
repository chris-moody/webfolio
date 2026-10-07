import createCache from '@emotion/cache'
import { CacheProvider } from '@emotion/react'
import createEmotionServer from '@emotion/server/create-instance'
import { PassThrough } from 'node:stream'
import { renderToPipeableStream } from 'react-dom/server'
import type { EntryContext } from 'react-router'
import { ServerRouter } from 'react-router'
import { EMOTION_CACHE_KEY } from './emotion'

const INSERTION_POINT = '<meta name="emotion-insertion-point" content=""/>'

// Runs at build time only (ssr: false + prerender). Each page is rendered to
// completion (onAllReady), so React Router's streamed hydration data is in the
// HTML. Then the critical Emotion (MUI) CSS is extracted and inlined in <head>;
// the tour's client-side cache adopts those styles on hydration.
export default function handleRequest(
  request: Request,
  responseStatusCode: number,
  responseHeaders: Headers,
  routerContext: EntryContext
) {
  const cache = createCache({ key: EMOTION_CACHE_KEY })
  const { extractCriticalToChunks, constructStyleTagsFromChunks } =
    createEmotionServer(cache)

  return new Promise<Response>((resolve, reject) => {
    let status = responseStatusCode
    const { pipe, abort } = renderToPipeableStream(
      <CacheProvider value={cache}>
        <ServerRouter context={routerContext} url={request.url} />
      </CacheProvider>,
      {
        onAllReady() {
          const chunks: Buffer[] = []
          const body = new PassThrough()
          body.on('data', (chunk: Buffer) => chunks.push(chunk))
          body.on('error', reject)
          body.on('end', () => {
            const html = Buffer.concat(chunks).toString('utf8')
            // Pages without MUI (the content routes) get no Emotion tags at all.
            const { styles } = extractCriticalToChunks(html)
            const styleTags = constructStyleTagsFromChunks({
              html,
              styles: styles.filter((chunk) => chunk.css),
            })
            responseHeaders.set('Content-Type', 'text/html; charset=utf-8')
            resolve(
              new Response(
                html.replace(INSERTION_POINT, `${INSERTION_POINT}${styleTags}`),
                {
                  status,
                  headers: responseHeaders,
                }
              )
            )
          })
          pipe(body)
        },
        onShellError: reject,
        onError(error) {
          status = 500
          console.error(error)
        },
      }
    )
    setTimeout(abort, 10_000)
  })
}
