import InitColorSchemeScript from '@mui/material/InitColorSchemeScript'
import {
  isRouteErrorResponse,
  Links,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
} from 'react-router'
import type { Route } from './+types/root'
import { SITE } from './site'

export const links: Route.LinksFunction = () => [
  { rel: 'icon', type: 'image/svg+xml', href: '/favicon.svg' },
]

export function Layout({ children }: { children: React.ReactNode }) {
  return (
    // The color-scheme script sets the `light`/`dark` class before hydration.
    <html lang="en" suppressHydrationWarning>
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="theme-color" content={SITE.themeColor} />
        <Meta />
        <Links />
        {/* Emotion's prerendered styles are inserted after this tag (entry.server.tsx). */}
        <meta name="emotion-insertion-point" content="" />
      </head>
      <body>
        <InitColorSchemeScript attribute="class" />
        {children}
        <ScrollRestoration />
        <Scripts />
      </body>
    </html>
  )
}

export default function App() {
  return <Outlet />
}

export function ErrorBoundary({ error }: Route.ErrorBoundaryProps) {
  const title = isRouteErrorResponse(error)
    ? `${error.status} ${error.statusText}`
    : 'Something went wrong'
  return (
    <main
      style={{
        padding: '4rem 1rem',
        textAlign: 'center',
        fontFamily: 'system-ui, sans-serif',
      }}
    >
      <h1>{title}</h1>
      <p>
        <a href="/">Go home</a>
      </p>
    </main>
  )
}
