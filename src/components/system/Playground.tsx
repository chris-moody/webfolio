import { type CSSProperties, useId, useState } from 'react'
import {
  ACCENT_SAMPLES,
  BRAND_ACCENT,
  colorDeclarations,
  type Mode,
  resolveAccent,
  type ThemeName,
  themes,
} from '@/tokens'

/** CSS custom properties for a mode and accent, as an inline style object. */
const tokenStyle = (
  mode: Mode,
  color: string,
  theme: ThemeName
): CSSProperties => {
  const vars: Record<string, string> = {}
  for (const line of colorDeclarations(mode, color)) {
    const [name, value] = line
      .trim()
      .replace(/;$/, '')
      .split(/:\s(.+)/)
    if (name && value) vars[name] = value
  }
  const definition = themes[theme]
  vars['--font-body'] = definition.font.body
  vars['--font-display'] = definition.font.display
  vars['--radius-theme'] = definition.radius
  vars['colorScheme'] = mode
  return vars as CSSProperties
}

const ratio = (value: number) => `${value.toFixed(2)}:1`

/**
 * Pick a theme, a mode, and any color: the preview is styled only by token
 * variables, computed in the browser by the same functions the build and the
 * contrast suite use.
 */
export const Playground = () => {
  const [theme, setTheme] = useState<ThemeName>('minimal')
  const [mode, setMode] = useState<Mode>('light')
  const [color, setColor] = useState(BRAND_ACCENT)
  const resolved = resolveAccent(color, mode)
  const ids = { color: useId() }

  return (
    <div className="my-6 grid gap-4 lg:grid-cols-[18rem_1fr]">
      <div className="space-y-4 rounded-lg border border-border bg-surface p-4 text-sm">
        <fieldset>
          <legend className="font-semibold">Theme</legend>
          <div className="mt-1 space-y-1">
            {Object.values(themes).map((definition) => (
              <label key={definition.name} className="flex items-center gap-2">
                <input
                  type="radio"
                  name="playground-theme"
                  checked={theme === definition.name}
                  onChange={() => setTheme(definition.name)}
                />
                {definition.label}{' '}
                <span className="text-fg-muted">
                  (flair {definition.flair})
                </span>
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
                  name="playground-mode"
                  checked={mode === option}
                  onChange={() => setMode(option)}
                />
                {option}
              </label>
            ))}
          </div>
        </fieldset>
        <div>
          <label htmlFor={ids.color} className="font-semibold">
            Accent color
          </label>
          <div className="mt-1 flex items-center gap-2">
            <input
              id={ids.color}
              type="color"
              value={color}
              onChange={(event) => setColor(event.target.value)}
              className="h-9 w-14"
            />
            <code className="font-mono">{color}</code>
          </div>
          <div
            className="mt-2 flex flex-wrap gap-1.5"
            role="group"
            aria-label="Try a preset"
          >
            {ACCENT_SAMPLES.map((preset) => (
              <button
                key={preset.color}
                type="button"
                onClick={() => setColor(preset.color)}
                aria-pressed={color === preset.color}
                className="rounded-md border border-border px-2 py-1 text-xs hover:border-accent aria-pressed:border-accent aria-pressed:font-semibold"
              >
                {preset.label}
              </button>
            ))}
          </div>
        </div>
        <div role="status" className="rounded-md bg-canvas p-3">
          <p>
            Resolved accent:{' '}
            <code className="font-mono">{resolved.accent}</code>
          </p>
          <p className="mt-1 text-fg-muted">
            Text on canvas {ratio(resolved.ratios.onCanvas)} · button text{' '}
            {ratio(resolved.ratios.withOnAccent)}
          </p>
          <p className="mt-1">
            {resolved.adjusted
              ? `Adjusted for contrast: lightness moved so it passes AA in ${mode} mode.`
              : 'Passes AA as picked.'}
          </p>
        </div>
      </div>

      <div
        style={tokenStyle(mode, color, theme)}
        className="rounded-lg border border-border bg-canvas p-6 text-fg [font-family:var(--font-body)]"
      >
        <p className="text-sm font-semibold uppercase tracking-widest text-accent">
          Preview
        </p>
        <h3 className="mt-1 text-3xl [font-family:var(--font-display)]">
          {themes[theme].label}
        </h3>
        <p className="mt-2 max-w-prose text-fg-muted">
          {themes[theme].description}
        </p>
        <div className="mt-5 rounded-[var(--radius-theme)] border border-border bg-surface p-5">
          <p>
            Body text with an <a href="#playground">inline link</a> and{' '}
            <span className="rounded-[var(--radius-theme)] bg-accent-subtle px-1.5 py-0.5">
              a tinted badge
            </span>
            .
          </p>
          <p className="mt-2 text-sm">
            <span className="text-positive">+2.14 (1.79%)</span> ·{' '}
            <span className="text-negative">−0.72 (−1.69%)</span>
          </p>
          <div className="mt-4 flex flex-wrap gap-3">
            <button
              type="button"
              className="rounded-[var(--radius-theme)] bg-button-bg px-4 py-2 font-semibold text-button-fg hover:bg-button-bg-hover"
            >
              Primary action
            </button>
            <button
              type="button"
              className="rounded-[var(--radius-theme)] border border-border px-4 py-2 font-semibold text-fg hover:border-accent"
            >
              Secondary
            </button>
            <span className="rounded-[var(--radius-theme)] px-4 py-2 outline-3 outline-offset-2 outline-focus-ring">
              Focus ring
            </span>
          </div>
        </div>
      </div>
    </div>
  )
}
