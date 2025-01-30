import { Box, Button, ButtonProps, Typography, useTheme } from '@mui/material'
import { FC } from 'react'
import styles from './fancyButton.module.scss'
import classNames from 'classnames'
import { useAppSelector } from '@/redux/hooks'
import { selectThemeFlair } from '@/redux/slices/theme/theme.selector'
import { NavLink } from 'react-router'

//export interface FancyButtonProps extends ButtonProps {}

export const FancyButton: FC<ButtonProps> = ({
  className,
  children,
  ...props
}) => {
  const flair = useAppSelector(selectThemeFlair)
  const theme = useTheme()

  if (flair === 37) {
    return (
      <Box
        component="button"
        className={classNames(styles.button, className, { disabled: props.disabled })}
        {...props}
      >
        <span className={styles.shadow} />
        <span className={styles.wall} />
        <Typography
          component="span"
          color={theme.palette.getContrastText(theme.palette.primary.main)}
          className={styles.face}
        >
          {children}
        </Typography>
      </Box>
    )
  }

  return (
    <Button className={className} {...props}>
      {children}
    </Button>
  )
}

type FancyNavButtonProps = ButtonProps & {
  to: string
}
export const FancyNavButton: FC<FancyNavButtonProps> = ({
  className,
  children,
  to,
  ...props
}) => {
  const flair = useAppSelector(selectThemeFlair)
  const theme = useTheme()

  if (flair === 37) {
    return (
      <Box
        to={to}
        component={NavLink}
        className={classNames(styles.button, className, { disabled: props.disabled })}
        {...props}
      >
        <span className={styles.shadow} />
        <span className={styles.wall} />
        <Typography
          component="span"
          color={theme.palette.getContrastText(theme.palette.primary.main)}
          className={styles.face}
        >
          {children}
        </Typography>
      </Box>
    )
  }

  return (
    <Button component={NavLink} to={to} className={className} {...props}>
      {children}
    </Button>
  )
}
