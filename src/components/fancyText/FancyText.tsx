import { Typography, TypographyProps } from '@mui/material'
import { FC } from 'react'
import { Text3d, ThreeDProps } from '../text3d/Text3d'
import { useAppSelector } from '@/redux/hooks'
import { selectThemeFlair } from '@/redux/slices/theme/theme.selector'

export type FancyTextProps = TypographyProps & {
  mode?: 'normal' | 'threed'
  fancy?: ThreeDProps
}

export const FancyText: FC<FancyTextProps> = ({ children, fancy, mode = 'normal', ...props }) => {
  const flair = useAppSelector(selectThemeFlair)

  if (mode === 'threed' || flair === 37) {
    return (
      <Text3d {...fancy} {...props}>{children}</Text3d>
    )
  }

  return <Typography {...props}>{children}</Typography>
}
