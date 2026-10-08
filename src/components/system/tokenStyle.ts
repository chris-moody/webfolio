import type { CSSProperties } from 'react'
import { colorDeclarations, type Mode, type ThemeName, themes } from '@/tokens'

/**
 * CSS custom properties for a theme, mode, and accent, as an inline style
 * object: anything inside the element renders in that theme. Used by the
 * /system playground and the shared-library case study.
 */
export const tokenStyle = (
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
