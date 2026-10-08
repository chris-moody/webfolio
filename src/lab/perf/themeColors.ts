/**
 * Token colors for canvas drawing. getComputedStyle forces a style recalc,
 * which is expensive when dozens of sparklines mount while scrolling, so
 * values are cached per color mode (the class on <html>).
 */
let cache: { mode: string; colors: Record<string, string> } | null = null

export const themeColor = (token: string, fallback: string) => {
  const mode = document.documentElement.className
  if (!cache || cache.mode !== mode) cache = { mode, colors: {} }
  let value = cache.colors[token]
  if (value === undefined) {
    value =
      getComputedStyle(document.documentElement)
        .getPropertyValue(`--${token}`)
        .trim() || fallback
    cache.colors[token] = value
  }
  return value
}
