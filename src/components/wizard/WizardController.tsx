import { FC } from 'react'
import { Box, BoxProps, styled, Typography, useTheme } from '@mui/material'
import classNames from 'classnames'
import { useAppSelector } from '@/redux/hooks'
import { selectThemeFlair } from '@/redux/slices/theme/theme.selector'
import './wizardController.scss'
import { NavMenu } from '../navMenu/NavMenu'

const StyledController = styled(Box)(({ theme }) => ({
  background: theme.palette.background.default
}))
const WizardController: FC<BoxProps> = ({ children }) => {
  const theme = useTheme()
  const flair = useAppSelector(selectThemeFlair)

  return (
    <StyledController
      className={classNames('wizard-controller', `flair-${flair}`)}
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
    </StyledController>
  )
}

export default WizardController
