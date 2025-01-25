import { Box, Button, ButtonProps } from '@mui/material'
import { FC } from 'react'
import styles from './fancyButton.module.scss'
import classNames from 'classnames'
import { useAppSelector } from '@/redux/hooks'
import { selectThemeFlair } from '@/redux/slices/theme/theme.selector'

//export interface FancyButtonProps extends ButtonProps {}

export const FancyButton: FC<ButtonProps> = ({ className, children, ...props }) => {
  const flair = useAppSelector(selectThemeFlair)

  if (flair === 37) {
    return (
      <Box component="button" className={classNames(styles.button, className)} {...props}>
        <span className={styles.shadow} />
        <span className={styles.wall} />
        <span className={styles.face}>{children}</span>
      </Box>
    )
  }

  return <Button className={className} {...props}>{children}</Button>
}
