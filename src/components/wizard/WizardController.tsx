import { FC } from 'react'
import {
  Box,
  BoxProps,
  darken,
  lighten,
  styled,
  Typography,
  useMediaQuery,
  useTheme,
} from '@mui/material'
import classNames from 'classnames'
import { useAppSelector } from '@/redux/hooks'
import { selectThemeFlair } from '@/redux/slices/theme/theme.selector'
import './wizardController.scss'
import { SettingsDialog } from '../settingsDialog/SettingsDialog'
import { useResize } from '@/hooks/resize.hook'
import { FolioNav } from '@/containers/folioNav/FolioNav'

const landscapeQuery =
  '@media only screen and (min-width: 320px) and (max-width: 992px) and (orientation: landscape)'
CSS.registerProperty({ name: '--spin-angle', syntax: '<angle>', inherits: false, initialValue: '0deg' })
const StyledController = styled(Box)(({ theme }) => [
  {
    '@keyframes spinner': {
      '0%': {
        '--spin-angle': '0deg'
      },
      '100%': {
        '--spin-angle': '360deg'
      }
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
          ${lighten(theme.palette.primary.main, .1)} 0deg 9deg,
          ${lighten(theme.palette.primary.main, .35)} 9deg 18deg,
          ${lighten(theme.palette.primary.main, .6)} 18deg 27deg,
          ${lighten(theme.palette.primary.main, .85)} 27deg 36deg
      )`,
        animation: 'spinner 300s linear infinite',
      },
    },
    [landscapeQuery]: {
      '.controller-content': {
        transform: 'rotate(-90deg)',
        transformOrigin: 'left top',
        overflowX: 'hidden',
        position: 'absolute',
        top: '100%',
        left: 0,
      },
    },
  },
  theme.applyStyles('dark', {
    '.controller-content': {
      '&.flair-37': {
        background: `repeating-conic-gradient(
          from var(--spin-angle),
          ${darken(theme.palette.primary.main,  .1)} 0deg 9deg,
          ${darken(theme.palette.primary.main,  .35)} 9deg 18deg,
          ${darken(theme.palette.primary.main,  .6)} 18deg 27deg,
          ${darken(theme.palette.primary.main, .85)} 27deg 36deg
        )`,
      }
    },
  }),
])
const WizardController: FC<BoxProps> = ({ children }) => {
  const theme = useTheme()
  const flair = useAppSelector(selectThemeFlair)
  const [monitor, size] = useResize()
  const isFlipped = useMediaQuery(landscapeQuery)
  return (
    <StyledController className="wizard-controller">
      {monitor}
      <Box
        className={classNames('controller-content', `flair-${flair}`)}
        sx={{
          ...(isFlipped && {
            width: `${size.height}px !important`,
            height: `${size.width}px !important`,
          }),
        }}
      >
        <FolioNav />
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
          &copy; 2025 Christopher C. Moody
        </Typography>
      </Box>
    </StyledController>
  )
}

export default WizardController
