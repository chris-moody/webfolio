import { deepmerge } from '@mui/utils'
import {
  createTheme,
  responsiveFontSizes,
  ThemeOptions,
} from '@mui/material/styles'
import '@fontsource/chivo/300.css'
import '@fontsource/chivo/400.css'
import '@fontsource/chivo/500.css'
import '@fontsource/chivo/700.css'
import '@fontsource/roboto/300.css'
import '@fontsource/roboto/400.css'
import '@fontsource/roboto/500.css'
import '@fontsource/roboto/700.css'
import '@fontsource/fira-sans/300.css'
import '@fontsource/fira-sans/400.css'
import '@fontsource/fira-sans/500.css'
import '@fontsource/fira-sans/700.css'
import '@fontsource/rammetto-one/400.css';

export const useDynamicTheme = (
  options: ThemeOptions = {},
  level: number = 1
) => {

  const defaultPalette = {
    defaultChannel: '12 12 12',
    primary: {
      main: '#256ee0',
    },
    secondary: {
      main: '#00bef5',
    },
    error: {
      main: '#de0c0c',
    },
    warning: {
      main: '#f9e630',
    },
    info: {
      main: '#0474e0',
    },
    success: {
      main: '#07d013',
    },
    divider: 'rgba(137,0,154,0.12)',
    ...options.palette,
  }

  const themeZero = createTheme({ palette: defaultPalette })

  const themeOptions: ThemeOptions = {
    colorSchemes: {
      dark: {
        palette: {
          ...defaultPalette,
        },
      },
      light: {
        palette: {
          ...defaultPalette,
          background: {
            default: '#ddd',
            defaultChannel: '12 12 12',
          },
        },
      },
    },
    typography: {
      h1: {
        fontWeight: 400,
        textDecoration: 'underline',
        textDecorationColor: themeZero.palette.primary.main,
      },
    },
    components: {
      MuiButton: {
        styleOverrides: {
          root: {
            variants: [
              {
                props: { variant: 'text' },
                style: ({ theme }) => [
                  {
                    background: 'rgba(255,255,255,0.75)',
                    '&.active, &:hover, &:focus, &:focus-visible': {
                      background: theme.palette.primary.main,
                      color: theme.palette.text.primary,
                    },
                  },
                  theme.applyStyles('dark', {
                    background: 'rgba(0,0,0,.75)',
                    transition: theme.transitions.create(['transform'], {
                      duration: theme.transitions.duration.standard,
                    }),
                  }),
                ],
              },
            ],
          },
        },
      },
      MuiLink: {
        styleOverrides: {
          root: ({ theme }) => ({
            color: theme.palette.text.primary,
            textDecorationColor: theme.palette.text.primary,
            transition: theme.transitions.create(['color', 'text-decoration'], {
              duration: theme.transitions.duration.standard,
            }),
            '&:hover': {
              color: theme.palette.primary.light,
              textDecorationColor: theme.palette.primary.light,
            },
          })
        }
      }
    },
  }

  const baseTheme = createTheme(themeOptions)

  const flair15: ThemeOptions = {
    colorSchemes: {
      dark: {
        palette: {
          ...defaultPalette,
          background: {
            default: `radial-gradient(${baseTheme.palette.primary.dark}, ${baseTheme.palette.common.black})`,
            defaultChannel: '12 12 12',
          },
        },
      },
      light: {
        palette: {
          ...defaultPalette,
          background: {
            default: `radial-gradient(${baseTheme.palette.common.white}, ${baseTheme.palette.primary.light})`,
            defaultChannel: '12 12 12',
          },
        },
      },
    },
    typography: {
      h1: {
        fontWeight: 400
      },
      fontFamily: 'Fira Sans',
    },
    components: {
      MuiButton: {
        styleOverrides: {
          root: {
            variants: [
              {
                props: { variant: 'text' },
                style: ({ theme }) => [
                  {
                    background: theme.palette.primary.main,
                    color: theme.palette.text.primary,
                    '&.active, &:hover, &:focus, &:focus-visible': {
                      background: theme.palette.primary.light,
                      boxShadow: `inset 0 0 0 2px ${theme.palette.text.primary}`,
                    },
                  },
                  theme.applyStyles('dark', {
                    background: theme.palette.primary.dark,
                    '&.active, &:hover, &:focus, &:focus-visible': {
                      background: theme.palette.primary.main,
                    },
                  }),
                ],
              },
            ],
          },
        },
      },
      MuiLink: themeOptions.components?.MuiLink,
    },
  }

  const flair37: ThemeOptions = {
    colorSchemes: {
      dark: {
        palette: {
          ...defaultPalette,
        },
      },
      light: {
        palette: {
          ...defaultPalette,
        },
      },
    },
    typography: {
      h1: {
        fontFamily: 'Rammetto One',
        fontWeight: 400
      },
      threed: {
        fontSize: baseTheme.typography.h1.fontSize,
        fontFamily: 'Rammetto One',
        fontWeight: 400
      },
      fontFamily: 'Chivo',
    },
    components: {
      MuiButton: {
        styleOverrides: {
          root: {
            variants: [
              {
                props: { variant: 'text' },
                style: ({ theme }) => [
                  {
                    backgroundImage: `repeating-linear-gradient(150deg, ${theme.palette.primary.light}, ${theme.palette.primary.main}, ${theme.palette.primary.light} 10%)`,
                    backgroundSize: '400% 400%',
                    color: theme.palette.text.primary,
                    transition: theme.transitions.create(
                      ['background', 'transform'],
                      {
                        duration: theme.transitions.duration.standard,
                      }
                    ),
                    '@keyframes Gradient': {
                      '0%': {
                        backgroundPosition: '0% 0%',
                      },
                      '100%': {
                        backgroundPosition: '98% 0%',
                      },
                    },
                    '&.active, &:hover': {
                      animation: 'Gradient 3s linear infinite',
                      transform: 'scale(1.2)',
                    },
                    '&:hover, &:focus, &:focus-visible': {
                      outline: 0,
                    },
                  },
                  theme.applyStyles('dark', {
                    backgroundImage: `repeating-linear-gradient(150deg, ${theme.palette.primary.dark}, ${theme.palette.primary.main}, ${theme.palette.primary.light}, ${theme.palette.primary.main}, ${theme.palette.primary.dark} 20%)`,
                  }),
                ],
              },
            ],
          },
        },
      },
      MuiLink: themeOptions.components?.MuiLink,
    },
  }

  const theme = createTheme(
    deepmerge(
      { cssVariables: { colorSchemeSelector: 'class' } },
      level === 15 ? flair15 : level === 37 ? flair37 : themeOptions
    )
  )

  return responsiveFontSizes(theme)
}

declare module '@mui/material/styles' {
  interface TypographyVariants {
    threed: React.CSSProperties;
  }

  // allow configuration using `createTheme()`
  interface TypographyVariantsOptions {
    threed?: React.CSSProperties;
  }
}

// Update the Typography's variant prop options
declare module '@mui/material/Typography' {
  interface TypographyPropsVariantOverrides {
    threed: true;
  }
}