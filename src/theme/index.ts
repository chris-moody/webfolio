import { deepmerge } from '@mui/utils'
import {
  createTheme,
  responsiveFontSizes,
  type ThemeOptions,
} from '@mui/material/styles'
// Latin subsets only: the site's copy is English, and the other subsets'
// @font-face rules were dead weight in the tour's CSS.
import '@fontsource/chivo/latin-300.css'
import '@fontsource/chivo/latin-400.css'
import '@fontsource/chivo/latin-500.css'
import '@fontsource/chivo/latin-700.css'
import '@fontsource/roboto/latin-300.css'
import '@fontsource/roboto/latin-400.css'
import '@fontsource/roboto/latin-500.css'
import '@fontsource/roboto/latin-700.css'
import '@fontsource/fira-sans/latin-300.css'
import '@fontsource/fira-sans/latin-400.css'
import '@fontsource/fira-sans/latin-500.css'
import '@fontsource/fira-sans/latin-700.css'
import '@fontsource/rammetto-one/latin-400.css'
import {
  data,
  type Mode,
  semanticColors,
  themeForFlair,
  withAlpha,
} from '@/tokens'

/**
 * The tour's MUI theme, generated from the design tokens (ADR 0002): the same
 * source that produces the CSS variables Tailwind reads. Colors come from the
 * semantic tier with the visitor's accent resolved for contrast in each mode;
 * type, radius, and backdrop come from the flair level's theme.
 */
export interface TourThemeInput {
  flair: number
  /** The visitor's chosen color (any hex); resolved per mode for contrast. */
  color: string
}

const palette = (mode: Mode, color: string) => {
  const c = semanticColors(mode, color)
  return {
    primary: {
      main: c.accent,
      dark: c.accentStrong,
      light: c.accentSubtle,
      contrastText: c.onAccent,
    },
    secondary: { main: c.accent, contrastText: c.onAccent },
    error: { main: c.negative },
    success: { main: c.positive },
    info: { main: c.accent },
    warning: { main: data.yellow },
    divider: c.border,
    text: { primary: c.fg, secondary: c.fgMuted },
    background: {
      default: c.backdrop,
      paper: c.surface,
      defaultChannel: '12 12 12',
    },
  }
}

export const createTourTheme = ({ flair, color }: TourThemeInput) => {
  const theme = themeForFlair(flair)
  const light = palette('light', color)
  const dark = palette('dark', color)

  // Backdrop treatment per theme. Maximal's conic stripes live in
  // WizardController, where they can animate.
  const backdrops: Partial<Record<Mode, string>> =
    theme.backdrop === 'radial'
      ? {
          light: `radial-gradient(${light.background.paper}, ${light.primary.light})`,
          dark: `radial-gradient(${dark.primary.dark}, ${dark.background.default})`,
        }
      : {}

  const base: NonNullable<Parameters<typeof createTheme>[0]> = {
    // AA text everywhere MUI picks a contrast color (default threshold is 3).
    cssVariables: { colorSchemeSelector: 'class' },
    colorSchemes: {
      light: {
        palette: {
          ...light,
          contrastThreshold: 4.5,
          background: {
            ...light.background,
            default: backdrops.light ?? light.background.default,
          },
        },
      },
      dark: {
        palette: {
          ...dark,
          contrastThreshold: 4.5,
          background: {
            ...dark.background,
            default: backdrops.dark ?? dark.background.default,
          },
        },
      },
    },
    shape: { borderRadius: parseInt(theme.radius, 10) },
    typography: {
      fontFamily: theme.font.body,
      h1: {
        fontFamily: theme.font.display,
        fontWeight: 400,
        ...(theme.name === 'minimal' && {
          textDecoration: 'underline',
          textDecorationColor: 'var(--mui-palette-primary-main)',
        }),
      },
      h4: { lineHeight: 1.1 },
      ...(theme.name === 'maximal' && {
        body1: { fontSize: '1.2rem' },
        threed: {
          fontSize: '6rem',
          fontFamily: theme.font.display,
          fontWeight: 400,
        },
      }),
    },
    components: {
      MuiLink: {
        styleOverrides: {
          root: ({ theme: t }) => ({
            color: t.palette.text.primary,
            textDecorationColor: t.palette.text.primary,
            transition: t.transitions.create(['color', 'text-decoration'], {
              duration: t.transitions.duration.standard,
            }),
            '&:hover': {
              color: t.palette.primary.main,
              textDecorationColor: t.palette.primary.main,
            },
          }),
        },
      },
      MuiButton: {
        styleOverrides: {
          root: {
            variants: [
              { props: { variant: 'text' }, style: buttonStyles(theme.name) },
            ],
          },
        },
      },
    },
  }

  return responsiveFontSizes(createTheme(deepmerge({}, base)))
}

type ButtonStyle = NonNullable<
  NonNullable<
    NonNullable<
      NonNullable<ThemeOptions['components']>['MuiButton']
    >['styleOverrides']
  >['root']
>
type StyleFn = Extract<
  NonNullable<
    Extract<ButtonStyle, { variants?: unknown }>['variants']
  >[number]['style'],
  (...args: never[]) => unknown
>

/** The text button per theme: quiet, filled, or animated gradient. */
const buttonStyles = (name: 'minimal' | 'expressive' | 'maximal'): StyleFn =>
  (({ theme: t }) => {
    const fill = t.palette.primary.main
    const onFill = t.palette.getContrastText(fill)
    if (name === 'minimal') {
      return {
        background: 'var(--surface-overlay)',
        color: t.palette.text.primary,
        '&.active, &:hover, &:focus, &:focus-visible': {
          background: fill,
          color: onFill,
        },
      }
    }
    if (name === 'expressive') {
      return {
        background: fill,
        color: onFill,
        '&.active, &:hover, &:focus, &:focus-visible': {
          background: t.palette.primary.dark,
          color: t.palette.getContrastText(t.palette.primary.dark),
          boxShadow: `inset 0 0 0 2px ${t.palette.text.primary}`,
        },
      }
    }
    return {
      backgroundImage: `repeating-linear-gradient(150deg, ${t.palette.primary.dark}, ${fill}, ${t.palette.primary.dark} 10%)`,
      backgroundSize: '400% 400%',
      color: onFill,
      textShadow: `0 1px 2px ${withAlpha(t.palette.common.black, 0.4)}`,
      transition: t.transitions.create(['background', 'transform'], {
        duration: t.transitions.duration.standard,
      }),
      '@keyframes Gradient': {
        '0%': { backgroundPosition: '0% 0%' },
        '100%': { backgroundPosition: '98% 0%' },
      },
      '&.active, &:hover': {
        animation: 'Gradient 3s linear infinite',
        transform: 'scale(1.2)',
      },
      '&:hover, &:focus, &:focus-visible': { outline: 0 },
      '&.disabled': { pointerEvents: 'none', cursor: 'not-allowed' },
    }
  }) as StyleFn

declare module '@mui/material/styles' {
  interface TypographyVariants {
    threed: React.CSSProperties
  }
  interface TypographyVariantsOptions {
    threed?: React.CSSProperties
  }
  interface TypeBackground {
    defaultChannel: string
  }
}

declare module '@mui/material/Typography' {
  interface TypographyPropsVariantOverrides {
    threed: true
  }
}
