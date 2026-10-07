import { FC } from 'react'
import {
  Box,
  BoxProps,
  darken,
  lighten,
  styled,
  Typography,
  useTheme,
} from '@mui/material'
import classNames from 'classnames'
import { useAppSelector } from '@/redux/hooks'
import { selectThemeFlair } from '@/redux/slices/theme/theme.selector'
import './wizardController.scss'
import { SettingsDialog } from '../settingsDialog/SettingsDialog'
import { FolioNav } from '@/containers/folioNav/FolioNav'
import { MotionToggle } from '../motionToggle/MotionToggle'

// Short landscape screens scroll instead of rotating the app (WCAG 1.3.4).
const shortScreen = '@media (max-height: 520px)'
const StyledController = styled(Box)(({ theme }) => [
  {
    '@keyframes spinner': {
      '0%': {
        '--spin-angle': '0deg',
      },
      '100%': {
        '--spin-angle': '360deg',
      },
    },
    position: 'absolute',
    minWidth: '320px',
    width: '100vw',
    height: '100%',
    top: 0,
    left: 0,

    '.controller-content': {
      background: theme.palette.background.default,
      width: '100%',
      height: '100%',
      overflow: 'hidden',
      position: 'absolute',
      top: 0,
      left: 0,
      '&.flair-37': {
        background: `repeating-conic-gradient(
        from var(--spin-angle),
          ${lighten(theme.palette.primary.main, 0.1)} 0deg 9deg,
          ${lighten(theme.palette.primary.main, 0.35)} 9deg 18deg,
          ${lighten(theme.palette.primary.main, 0.6)} 18deg 27deg,
          ${lighten(theme.palette.primary.main, 0.85)} 27deg 36deg
      )`,
        animation: 'spinner 300s linear infinite',
      },
    },
    [shortScreen]: {
      position: 'relative',
      height: 'auto',
      minHeight: '100dvh',
      '.controller-content': {
        position: 'relative',
        height: 'auto',
        minHeight: '100%',
        overflow: 'visible',
        paddingBottom: theme.spacing(4),
      },
    },
  },
  theme.applyStyles('dark', {
    '.controller-content': {
      '&.flair-37': {
        background: `repeating-conic-gradient(
          from var(--spin-angle),
          ${darken(theme.palette.primary.main, 0.1)} 0deg 9deg,
          ${darken(theme.palette.primary.main, 0.35)} 9deg 18deg,
          ${darken(theme.palette.primary.main, 0.6)} 18deg 27deg,
          ${darken(theme.palette.primary.main, 0.85)} 27deg 36deg
        )`,
      },
    },
  }),
])
const WizardController: FC<BoxProps> = ({ children }) => {
  const theme = useTheme()
  const flair = useAppSelector(selectThemeFlair)
  return (
    <StyledController className="wizard-controller">
      <Box className={classNames('controller-content', `flair-${flair}`)}>
        <FolioNav />
        <MotionToggle />
        <SettingsDialog />
        {children}
        <Typography
          variant="caption"
          component="p"
          sx={{
            position: 'absolute',
            bottom: theme.spacing(1),
            width: '100%',
            mx: 'auto',
          }}
        >
          &copy; {new Date().getFullYear()} Christopher C. Moody
        </Typography>
      </Box>
    </StyledController>
  )
}

export default WizardController
