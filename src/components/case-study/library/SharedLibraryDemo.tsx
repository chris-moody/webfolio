import { type ReactNode, useId, useState } from 'react'
import { tokenStyle } from '@/components/system/tokenStyle'
import {
  ACCENT_SAMPLES,
  BRAND_ACCENT,
  type Mode,
  type ThemeName,
  themes,
} from '@/tokens'

// Three small "apps" (synthetic content), rendered two ways. Before: each
// team's hand-rolled components, which disagree with each other and ignore
// the theme. After: the same screens built from one set of components on
// this site's design tokens, so one theme change reaches all three.

type Variant = 'primary' | 'secondary'

interface Kit {
  Button: (props: { variant?: Variant; children: ReactNode }) => ReactNode
  Table: (props: { head: string[]; rows: string[][] }) => ReactNode
  Badge: (props: { children: ReactNode }) => ReactNode
}

/** The shared library: every style comes from tokens. */
const shared: Kit = {
  Button: ({ variant = 'primary', children }) => (
    <button
      type="button"
      className={
        variant === 'primary'
          ? 'rounded-[var(--radius-theme)] bg-button-bg px-3 py-1.5 text-sm font-semibold text-button-fg hover:bg-button-bg-hover'
          : 'rounded-[var(--radius-theme)] border border-border px-3 py-1.5 text-sm font-semibold text-fg hover:border-accent'
      }
    >
      {children}
    </button>
  ),
  Table: ({ head, rows }) => (
    <table className="w-full text-left text-sm [&_td]:border-t [&_td]:border-border [&_td]:py-1.5 [&_th]:pb-1.5 [&_th]:font-semibold">
      <thead>
        <tr>
          {head.map((cell) => (
            <th key={cell} scope="col">
              {cell}
            </th>
          ))}
        </tr>
      </thead>
      <tbody>
        {rows.map((row) => (
          <tr key={row[0]}>
            {row.map((cell, i) => (
              <td key={i}>{cell}</td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  ),
  Badge: ({ children }) => (
    <span className="rounded-[var(--radius-theme)] bg-accent-subtle px-1.5 py-0.5 text-xs font-semibold">
      {children}
    </span>
  ),
}

/** Before: three teams, three ideas of what a button and a table look like. */
const drifted: Kit[] = [
  {
    Button: ({ variant = 'primary', children }) => (
      <button
        type="button"
        className={`px-3 py-1 text-xs tracking-wider uppercase ${variant === 'primary' ? 'bg-fg text-canvas' : 'border border-fg text-fg'}`}
      >
        {children}
      </button>
    ),
    Table: ({ head, rows }) => (
      <table className="w-full text-left text-xs [&_tbody_tr:nth-child(odd)]:bg-canvas [&_td]:px-1 [&_td]:py-1 [&_th]:px-1 [&_th]:uppercase">
        <thead>
          <tr>
            {head.map((cell) => (
              <th key={cell} scope="col">
                {cell}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row) => (
            <tr key={row[0]}>
              {row.map((cell, i) => (
                <td key={i}>{cell}</td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    ),
    Badge: ({ children }) => <span className="text-xs italic">{children}</span>,
  },
  {
    Button: ({ variant = 'primary', children }) => (
      <button
        type="button"
        className={`rounded-full border-2 px-4 py-1 text-sm ${variant === 'primary' ? 'border-accent text-accent' : 'border-border text-fg-muted'}`}
      >
        {children}
      </button>
    ),
    Table: ({ head, rows }) => (
      <table className="w-full border-collapse text-left text-sm [&_td]:border [&_td]:border-border [&_td]:p-1.5 [&_th]:border [&_th]:border-border [&_th]:p-1.5">
        <thead>
          <tr>
            {head.map((cell) => (
              <th key={cell} scope="col">
                {cell}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row) => (
            <tr key={row[0]}>
              {row.map((cell, i) => (
                <td key={i}>{cell}</td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    ),
    Badge: ({ children }) => (
      <span className="rounded-full border border-accent px-2 text-xs text-accent">
        {children}
      </span>
    ),
  },
  {
    Button: ({ variant = 'primary', children }) => (
      <button
        type="button"
        className={`text-sm ${variant === 'primary' ? 'font-bold text-accent underline' : 'text-fg-muted underline'}`}
      >
        {children}
      </button>
    ),
    Table: ({ head, rows }) => (
      <div className="text-sm">
        {rows.map((row) => (
          <p key={row[0]} className="py-0.5">
            {row.map((cell, i) => (
              <span key={i} className="mr-3">
                <span className="text-fg-muted">{head[i]}:</span> {cell}
              </span>
            ))}
          </p>
        ))}
      </div>
    ),
    Badge: ({ children }) => (
      <span className="bg-fg-muted px-1 text-xs text-canvas">{children}</span>
    ),
  },
]

const apps = [
  {
    name: 'Results viewer',
    head: ['Sample', 'Group', 'Status'],
    rows: [
      ['S-0141', 'Control', 'Ready'],
      ['S-0142', 'Treated', 'Ready'],
    ],
    badge: 'Study 12',
    actions: ['Export', 'Share'],
  },
  {
    name: 'Lab operations',
    head: ['Batch', 'Plates', 'Stage'],
    rows: [
      ['B-207', '4', 'Prep'],
      ['B-208', '6', 'Run'],
    ],
    badge: 'Today',
    actions: ['Start run', 'Hold'],
  },
  {
    name: 'Admin console',
    head: ['User', 'Role', 'Team'],
    rows: [
      ['ana', 'Editor', 'A'],
      ['raj', 'Viewer', 'C'],
    ],
    badge: '2 pending',
    actions: ['Invite', 'Audit log'],
  },
]

const App = ({ kit, app }: { kit: Kit; app: (typeof apps)[number] }) => (
  <section
    aria-label={app.name}
    className="rounded-[var(--radius-theme,0.5rem)] border border-border bg-surface p-3"
  >
    <p className="flex items-center justify-between gap-2 font-semibold text-fg">
      {app.name} <kit.Badge>{app.badge}</kit.Badge>
    </p>
    <div className="mt-2">
      <kit.Table head={app.head} rows={app.rows} />
    </div>
    <div className="mt-3 flex flex-wrap items-center gap-2">
      <kit.Button>{app.actions[0]}</kit.Button>
      <kit.Button variant="secondary">{app.actions[1]}</kit.Button>
    </div>
  </section>
)

export const SharedLibraryDemo = () => {
  const [after, setAfter] = useState(true)
  const [theme, setTheme] = useState<ThemeName>('minimal')
  const [mode, setMode] = useState<Mode>('light')
  const [color, setColor] = useState(BRAND_ACCENT)
  const name = useId()

  return (
    <figure className="my-8 rounded-lg border border-border bg-surface p-4">
      <div className="flex flex-wrap gap-x-8 gap-y-3 text-sm">
        <fieldset>
          <legend className="font-semibold">Components</legend>
          <div className="mt-1 flex gap-4">
            {(
              [
                [false, 'Each team’s own'],
                [true, 'Shared library'],
              ] as const
            ).map(([value, label]) => (
              <label key={label} className="flex items-center gap-2">
                <input
                  type="radio"
                  name={`${name}-kit`}
                  checked={after === value}
                  onChange={() => setAfter(value)}
                />
                {label}
              </label>
            ))}
          </div>
        </fieldset>
        <fieldset>
          <legend className="font-semibold">Theme</legend>
          <div className="mt-1 flex gap-4">
            {Object.values(themes).map((definition) => (
              <label key={definition.name} className="flex items-center gap-2">
                <input
                  type="radio"
                  name={`${name}-theme`}
                  checked={theme === definition.name}
                  onChange={() => setTheme(definition.name)}
                />
                {definition.label}
              </label>
            ))}
          </div>
        </fieldset>
        <fieldset>
          <legend className="font-semibold">Mode</legend>
          <div className="mt-1 flex gap-4">
            {(['light', 'dark'] as Mode[]).map((option) => (
              <label
                key={option}
                className="flex items-center gap-2 capitalize"
              >
                <input
                  type="radio"
                  name={`${name}-mode`}
                  checked={mode === option}
                  onChange={() => setMode(option)}
                />
                {option}
              </label>
            ))}
          </div>
        </fieldset>
        <div
          role="group"
          aria-label="Accent color"
          className="flex flex-wrap items-center gap-1.5"
        >
          <span className="font-semibold">Accent</span>
          {ACCENT_SAMPLES.map((preset) => (
            <button
              key={preset.color}
              type="button"
              onClick={() => setColor(preset.color)}
              aria-pressed={color === preset.color}
              className="rounded-md border border-border px-2 py-0.5 text-xs hover:border-accent aria-pressed:border-accent aria-pressed:font-semibold"
            >
              {preset.label}
            </button>
          ))}
        </div>
      </div>

      <div
        style={after ? tokenStyle(mode, color, theme) : undefined}
        className="mt-4 grid gap-3 rounded-lg bg-canvas p-3 text-fg md:grid-cols-3 [font-family:var(--font-body,inherit)]"
      >
        {apps.map((app, i) => (
          <App key={app.name} kit={after ? shared : drifted[i]!} app={app} />
        ))}
      </div>
      <p role="status" className="mt-2 text-sm text-fg-muted">
        {after
          ? 'All three apps use the shared components: the theme, mode, and accent reach every one of them.'
          : 'Each app uses its own components: they disagree with each other, and the theme controls reach none of them.'}
      </p>
      <figcaption className="mt-2 text-sm text-fg-muted">
        Illustrative screens with synthetic content, built for this page. The
        shared version uses this site’s real design tokens and the same
        contrast-checked accent resolution as the{' '}
        <a href="/system">design system page</a>.
      </figcaption>
    </figure>
  )
}
