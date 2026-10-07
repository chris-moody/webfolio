import { Link } from 'react-router'

/** Shared "not found" content: the 404 route and unknown tour wizards both render it. */
export const NotFound = () => (
  <section
    aria-labelledby="not-found-title"
    className="mx-auto max-w-prose py-16 text-center"
  >
    <p className="text-sm font-semibold uppercase tracking-widest text-accent">
      404
    </p>
    <h1 id="not-found-title" className="mt-2 text-4xl font-bold text-fg">
      This page doesn’t exist
    </h1>
    <p className="mt-4 text-fg-muted">
      I’m not sure what you’re trying to do, but I’ve heard that there’s no
      place like home.
    </p>
    <Link
      to="/"
      className="mt-8 inline-block rounded-md bg-accent px-5 py-2.5 font-semibold text-on-accent no-underline hover:bg-accent-strong"
    >
      Go home
    </Link>
  </section>
)
