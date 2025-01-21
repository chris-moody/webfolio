import { createTheme, ThemeOptions } from '@mui/material/styles'

export const useDynamicTheme = (options: ThemeOptions = {}) => {
  const defaultPalette = {
    primary: {
      main: '#753dd6',
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
        },
      },
    },
    components: {
      MuiButton: {
        styleOverrides: {
          root: {
            variants: [
              {
                props: { variant: 'text' },
                style: { background: 'rgba(0,0,0,.75)' },
              },
            ],
          },
        },
      },
    },
  }
  return createTheme(themeOptions, options)
}
