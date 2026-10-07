#!/usr/bin/env node
// Serves build/client over HTTP/2 + TLS for Lighthouse CI, the way Netlify
// serves it: one multiplexed connection, Brotli (or gzip) for text, and the
// prerendered 404.html with a real 404 status.
//
// Lighthouse's simulator models the protocol it observes. Over HTTP/1.1 it
// queues requests on six connections per origin, which cost the tour about
// 7 points that production visitors never pay.
//
//   node scripts/serve-h2.mjs [--port 4443] [--root build/client]
//
// The certificate is self-signed and generated on first use (needs openssl);
// Chrome is started with --ignore-certificate-errors (lighthouserc.cjs).
import { execFileSync } from 'node:child_process'
import { existsSync, mkdirSync, readFileSync, statSync } from 'node:fs'
import http2 from 'node:http2'
import { tmpdir } from 'node:os'
import path from 'node:path'
import { brotliCompressSync, constants, gzipSync } from 'node:zlib'

const arg = (name, fallback) => {
  const index = process.argv.indexOf(`--${name}`)
  return index > -1 ? process.argv[index + 1] : fallback
}
const port = Number(arg('port', 4443))
const root = path.resolve(arg('root', 'build/client'))

const certDir = path.join(tmpdir(), 'folio-serve-h2')
const keyFile = path.join(certDir, 'key.pem')
const certFile = path.join(certDir, 'cert.pem')
if (!existsSync(keyFile) || !existsSync(certFile)) {
  mkdirSync(certDir, { recursive: true })
  execFileSync(
    'openssl',
    [
      'req',
      '-x509',
      '-newkey',
      'rsa:2048',
      '-nodes',
      '-days',
      '30',
      '-subj',
      '/CN=localhost',
      '-keyout',
      keyFile,
      '-out',
      certFile,
    ],
    { stdio: 'ignore' }
  )
}

const types = {
  '.html': 'text/html; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.mjs': 'text/javascript; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.json': 'application/json',
  '.data': 'text/x-script',
  '.svg': 'image/svg+xml',
  '.xml': 'application/xml',
  '.txt': 'text/plain; charset=utf-8',
  '.woff2': 'font/woff2',
  '.woff': 'font/woff',
  '.webp': 'image/webp',
  '.avif': 'image/avif',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.gif': 'image/gif',
  '.ico': 'image/x-icon',
  '.mp4': 'video/mp4',
  '.webm': 'video/webm',
  '.pdf': 'application/pdf',
}
const compressible = /^(text\/|application\/(json|xml)|image\/svg)/

const resolve = (pathname) => {
  const file = path.join(root, pathname)
  if (!file.startsWith(root)) return null
  if (existsSync(file) && statSync(file).isFile()) return file
  const index = path.join(file, 'index.html')
  if (existsSync(index)) return index
  return null
}

const cache = new Map()
const encoded = (file, encoding) => {
  const key = `${encoding}:${file}`
  if (!cache.has(key)) {
    const raw = readFileSync(file)
    cache.set(
      key,
      encoding === 'br'
        ? brotliCompressSync(raw, {
            params: { [constants.BROTLI_PARAM_QUALITY]: 11 },
          })
        : encoding === 'gzip'
          ? gzipSync(raw, { level: 9 })
          : raw
    )
  }
  return cache.get(key)
}

const server = http2.createSecureServer(
  {
    key: readFileSync(keyFile),
    cert: readFileSync(certFile),
    allowHTTP1: true,
  },
  (req, res) => {
    const { pathname } = new URL(req.url, 'https://localhost')
    let file = resolve(decodeURIComponent(pathname))
    let status = 200
    if (!file) {
      file = path.join(root, '404.html')
      status = 404
    }
    const type = types[path.extname(file)] ?? 'application/octet-stream'
    const accepts = String(req.headers['accept-encoding'] ?? '')
    const encoding = !compressible.test(type)
      ? 'identity'
      : accepts.includes('br')
        ? 'br'
        : accepts.includes('gzip')
          ? 'gzip'
          : 'identity'
    const headers = { 'content-type': type, vary: 'accept-encoding' }
    if (encoding !== 'identity') headers['content-encoding'] = encoding
    res.writeHead(status, headers)
    res.end(encoded(file, encoding))
  }
)

server.listen(port, () => {
  // lighthouserc.cjs waits for this line.
  console.log(`Accepting connections at https://localhost:${port} (HTTP/2)`)
})
