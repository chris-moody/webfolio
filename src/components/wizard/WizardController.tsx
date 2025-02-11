import { FC } from 'react'
import { Box, BoxProps, styled, Typography, useMediaQuery, useTheme } from '@mui/material'
import classNames from 'classnames'
import { useAppSelector } from '@/redux/hooks'
import { selectThemeFlair } from '@/redux/slices/theme/theme.selector'
import './wizardController.scss'
import { NavMenu } from '../navMenu/NavMenu'
import { useResize } from '@/hooks/resize.hook'
import { FolioNav } from '@/containers/folioNav/FolioNav'

const StyledController = styled(Box)(({ theme }) => ({
  position: 'absolute',
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
  },
  ['@media screen and (min-width: 320px) and (max-width: 992px) and (orientation: landscape)']:
    {
      '.controller-content': {
        transform: 'rotate(-90deg)',
        transformOrigin: 'left top',
        overflowX: 'hidden',
        position: 'absolute',
        top: '100%',
        left: 0,
      },
    },
}))
const WizardController: FC<BoxProps> = ({ children }) => {
  const theme = useTheme()
  const flair = useAppSelector(selectThemeFlair)
  const [monitor, size] = useResize()
  const isFlipped = useMediaQuery('@media screen and (min-width: 320px) and (max-width: 992px) and (orientation: landscape)')
  return (
    <StyledController className="wizard-controller">
      {monitor}
      <Box 
        className={classNames('controller-content', `flair-${flair}`)}
        sx={{
          ...(isFlipped &&
            {
              width: `${size.height}px !important`,
              height: `${size.width}px !important`,
            }),
        }}
      > 
        <FolioNav />
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
    </StyledController>
  )
}

export default WizardController
