import { FC } from 'react'
import { Box, BoxProps, Typography, useTheme } from '@mui/material'
import classNames from 'classnames'
import { useAppSelector } from '@/redux/hooks'
import { selectThemeFlair } from '@/redux/slices/theme/theme.selector'
import './wizardController.scss'
import { NavMenu } from '../navMenu/NavMenu'

const WizardController: FC<BoxProps> = ({ children }) => {
  const theme = useTheme()
  const flair = useAppSelector(selectThemeFlair)

  return (
    <Box
      className={classNames('wizard-controller', `flair-${flair}`)}
      sx={{
        width: '100vw',
        height: '100vh',
        overflow: 'hidden',
        position: 'absolute',
        top: 0,
        left: 0,
        background: theme.palette.background.default,
      }}
    >
      <NavMenu />
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
  )
}

export default WizardController
