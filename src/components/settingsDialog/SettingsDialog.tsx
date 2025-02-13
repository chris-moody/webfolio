import {
  Box,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  IconButton,
  Link,
  Typography,
} from '@mui/material'
import classNames from 'classnames'
import { FC, useCallback, useState } from 'react'
import InfoIcon from '@mui/icons-material/Settings'
import { useAppDispatch, useAppSelector } from '@/redux/hooks'
import { selectThemeFlair } from '@/redux/slices/theme/theme.selector'
import { setFlair } from '@/redux/slices/theme/theme.reducer'
import { FancyButton } from '../fancyButton/FancyButton'

export const SettingsDialog: FC = () => {
  const [isOpen, setIsOpen] = useState<boolean>(false)
  const dispatch = useAppDispatch()
  const flair = useAppSelector(selectThemeFlair)
  const handleClick = () => {
    setIsOpen(true)
  }
  const handleClose = () => {
    setIsOpen(false)
  }

  const handleFlair = useCallback(
    (flairVal: number) => () => {
      dispatch(setFlair(flairVal))
    },
    [dispatch]
  )

  return (
    <Box
      className={classNames('nav-menu')}
      sx={{
        position: 'absolute',
        top: 0,
        right: 0,
        zIndex: 1000,
      }}
    >
      <IconButton onClick={handleClick}>
        <InfoIcon />
      </IconButton>
      <Dialog open={isOpen} onClose={handleClose}>
        <DialogTitle variant="h3">What in the world?</DialogTitle>
        <DialogContent>
          <Typography variant="body1" mb={2}>
            I use this space to express myself, have fun and showcase some of
            technical ability. Right now it's built in TypeScript, React, themed
            with MUI, and animated with GSAP and a few CSS animations. The force
            simulation on the home page is powered by d3. I used Vite to package
            it. Checkout of the source code&#32;
            <Link
              target="_blank"
              href="https://github.com/chris-moody/webfolio/tree/develop"
            >
              here!
            </Link>
            .
          </Typography>
          <Typography variant="body1" mb={2}>
            I encourage you to explore, and click all the buttons! If you have
            any questions or feeback, drop me a line at&#32;
            <Link target="_blank" href="mailto:chris@moodydigital.com">
              chris@moodydigital.com
            </Link>
          </Typography>
          {flair === 1 && (
            <Typography variant="body1" mb={2}>
              At a single piece of flair, you're hardly living! Try adding a bit
              more, I doubt you'll regret it.
            </Typography>
          )}
          {flair === 15 && (
            <Typography variant="body1" mb={2}>
              Fifteen pieces of flair! Not bad, but still only the bare minimum.
              Take the next step.
            </Typography>
          )}
          {flair === 37 && (
            <Typography variant="body1" mb={2}>
              Look at all that flair! I bet you've got a great smile!
            </Typography>
          )}
          <Typography variant="body1" mb={2}>
            {flair === 37 && <>Too much? </>}You can adjust your Flair below
            {flair === 1 && <>, a little more can't hurt!</>}!
          </Typography>
        </DialogContent>
        <DialogActions>
          <FancyButton
            className={classNames({ active: flair === 1 })}
            onClick={handleFlair(1)}
          >
            1 piece
          </FancyButton>
          <FancyButton
            className={classNames({ active: flair === 15 })}
            onClick={handleFlair(15)}
          >
            15 pieces
          </FancyButton>
          <FancyButton
            className={classNames({ pressed: flair === 37 })}
            onClick={handleFlair(37)}
          >
            37 pieces
          </FancyButton>
        </DialogActions>
      </Dialog>
    </Box>
  )
}
