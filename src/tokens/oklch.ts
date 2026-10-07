/**
 * OKLCH color math, dependency-free: OKLCH ↔ OKLab ↔ linear sRGB ↔ sRGB hex,
 * gamut mapping by chroma reduction, and WCAG 2.x contrast.
 * Conversion matrices from Björn Ottosson, "A perceptual color space for
 * image processing" (2020).
 */

export interface Oklch {
  /** Perceptual lightness, 0–1. */
  l: number
  /** Chroma, 0 to ~0.37 for sRGB colors. */
  c: number
  /** Hue in degrees. */
  h: number
}

type Rgb = [number, number, number]

const toLinear = (channel: number) =>
  channel <= 0.04045 ? channel / 12.92 : ((channel + 0.055) / 1.055) ** 2.4
const toGamma = (channel: number) =>
  channel <= 0.0031308 ? channel * 12.92 : 1.055 * channel ** (1 / 2.4) - 0.055

const oklchToLinearRgb = ({ l, c, h }: Oklch): Rgb => {
  const hue = (h * Math.PI) / 180
  const a = c * Math.cos(hue)
  const b = c * Math.sin(hue)
  const l_ = (l + 0.3963377774 * a + 0.2158037573 * b) ** 3
  const m_ = (l - 0.1055613458 * a - 0.0638541728 * b) ** 3
  const s_ = (l - 0.0894841775 * a - 1.291485548 * b) ** 3
  return [
    4.0767416621 * l_ - 3.3077115913 * m_ + 0.2309699292 * s_,
    -1.2684380046 * l_ + 2.6097574011 * m_ - 0.3413193965 * s_,
    -0.0041960863 * l_ - 0.7034186147 * m_ + 1.707614701 * s_,
  ]
}

const inGamut = (rgb: Rgb) =>
  rgb.every((channel) => channel >= -1e-6 && channel <= 1 + 1e-6)

/**
 * Maps an OKLCH color into sRGB by reducing chroma (hue and lightness are
 * kept), so ramps stay perceptually even instead of clipping channels.
 */
export const toGamut = (color: Oklch): Oklch => {
  if (inGamut(oklchToLinearRgb(color))) return color
  let low = 0
  let high = color.c
  for (let i = 0; i < 24; i++) {
    const mid = (low + high) / 2
    if (inGamut(oklchToLinearRgb({ ...color, c: mid }))) low = mid
    else high = mid
  }
  return { ...color, c: low }
}

const clamp01 = (value: number) => Math.min(1, Math.max(0, value))

export const oklchToHex = (color: Oklch): string => {
  const rgb = oklchToLinearRgb(toGamut(color))
  return `#${rgb
    .map((channel) =>
      Math.round(clamp01(toGamma(clamp01(channel))) * 255)
        .toString(16)
        .padStart(2, '0')
    )
    .join('')}`
}

export const hexToRgb = (hex: string): Rgb => {
  const value = hex.replace('#', '')
  const full =
    value.length === 3 ? [...value].map((char) => char + char).join('') : value
  return [0, 2, 4].map(
    (offset) => parseInt(full.slice(offset, offset + 2), 16) / 255
  ) as Rgb
}

export const hexToOklch = (hex: string): Oklch => {
  const [r, g, b] = hexToRgb(hex).map(toLinear) as Rgb
  const l = Math.cbrt(0.4122214708 * r + 0.5363325363 * g + 0.0514459929 * b)
  const m = Math.cbrt(0.2119034982 * r + 0.6806995451 * g + 0.1073969566 * b)
  const s = Math.cbrt(0.0883024619 * r + 0.2817188376 * g + 0.6299787005 * b)
  const L = 0.2104542553 * l + 0.793617785 * m - 0.0040720468 * s
  const A = 1.9779984951 * l - 2.428592205 * m + 0.4505937099 * s
  const B = 0.0259040371 * l + 0.7827717662 * m - 0.808675766 * s
  const c = Math.hypot(A, B)
  const h = c < 1e-4 ? 0 : ((Math.atan2(B, A) * 180) / Math.PI + 360) % 360
  return { l: L, c, h }
}

/** WCAG 2.x relative luminance of an sRGB hex color. */
export const luminance = (hex: string) => {
  const [r, g, b] = hexToRgb(hex).map(toLinear) as Rgb
  return 0.2126 * r + 0.7152 * g + 0.0722 * b
}

/** WCAG 2.x contrast ratio, 1–21. */
export const contrast = (a: string, b: string) => {
  const [hi, lo] = [luminance(a), luminance(b)].sort((x, y) => y - x) as [
    number,
    number,
  ]
  return (hi + 0.05) / (lo + 0.05)
}

/** Composites a translucent color over an opaque one (both hex; alpha 0–1). */
export const composite = (top: string, alpha: number, bottom: string) => {
  const t = hexToRgb(top)
  const u = hexToRgb(bottom)
  return `#${t
    .map((channel, i) =>
      Math.round((channel * alpha + u[i]! * (1 - alpha)) * 255)
        .toString(16)
        .padStart(2, '0')
    )
    .join('')}`
}

/** An rgba() string for a hex color, for overlays and shadows. */
export const withAlpha = (hex: string, alpha: number) => {
  const [r, g, b] = hexToRgb(hex).map((channel) => Math.round(channel * 255))
  return `rgba(${r}, ${g}, ${b}, ${alpha})`
}
