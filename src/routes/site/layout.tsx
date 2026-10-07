import { NavLink, Outlet } from 'react-router'
import { tourPath, TOUR_START } from '@/data/tour.manifest'
import { resume } from '@/content/resume/resume'
import { SITE } from '@/site'
import '@/styles/site.css'

const nav = [
  { to: '/', label: 'Home', end: true },
  { to: '/resume', label: 'Resume', end: false },
  {
    to: tourPath(TOUR_START.wizard, TOUR_START.step),
    label: 'Tour',
    end: false,
  },
]

export default function SiteLayout() {
  return (
    <div className="flex min-h-dvh flex-col">
      <a
        href="#main"
        className="sr-only z-50 rounded-md print:hidden bg-accent px-4 py-2 text-on-accent no-underline focus:not-sr-only focus:fixed focus:top-3 focus:left-3"
      >
        Skip to content
      </a>
      <header className="border-b border-border bg-surface print:hidden">
        <div className="mx-auto flex max-w-5xl flex-wrap items-center justify-between gap-x-6 gap-y-2 px-4 py-3">
          <NavLink
            to="/"
            className="font-semibold text-fg no-underline hover:text-accent"
          >
            {resume.basics.name}
          </NavLink>
          <nav aria-label="Main">
            <ul className="flex gap-1">
              {nav.map((item) => (
                <li key={item.to}>
                  <NavLink
                    to={item.to}
                    end={item.end}
                    className={({ isActive }) =>
                      `inline-block rounded-md px-3 py-2 text-sm font-medium no-underline ${
                        isActive
                          ? 'bg-accent text-on-accent hover:text-on-accent'
                          : 'text-fg hover:bg-canvas'
                      }`
                    }
                  >
                    {item.label}
                  </NavLink>
                </li>
              ))}
            </ul>
          </nav>
        </div>
      </header>
      <main
        id="main"
        tabIndex={-1}
        className="mx-auto w-full max-w-5xl flex-1 px-4 py-10 focus:outline-none print:max-w-none print:p-0"
      >
        <Outlet />
      </main>
      <footer className="border-t border-border print:hidden">
        <div className="mx-auto flex max-w-5xl flex-wrap justify-between gap-2 px-4 py-6 text-sm text-fg-muted">
          <p>
            © {new Date().getFullYear()} {resume.basics.name}
          </p>
          <p>
            <a href={SITE.repo}>Source on GitHub</a>
          </p>
        </div>
      </footer>
    </div>
  )
}
