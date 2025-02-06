import { Typography, TypographyProps } from '@mui/material'
import { CSSProperties, FC } from 'react'
import { Text3d, ThreeDProps } from '../text3d/Text3d'
import { useAppSelector } from '@/redux/hooks'
import { selectThemeFlair } from '@/redux/slices/theme/theme.selector'

export type FancyTextProps = TypographyProps & {
  mode?: 'normal' | 'threed'
  fancy?: ThreeDProps
}

export const FancyText: FC<FancyTextProps> = ({
  children,
  fancy,
  mode = 'normal',
  sx,
  ...props
}) => {
  const flair = useAppSelector(selectThemeFlair)
  let styles = sx
  if (Array.isArray(sx)) {
    styles = sx[0]
  }
  const { background: _, ...restSx } = (styles || {}) as CSSProperties
  if (mode === 'threed' || flair === 37) {
    return (
      <Text3d {...fancy} {...props} containerProps={{ sx: restSx }}>
        {children}
      </Text3d>
    )
  }

  return (
    <Typography {...props} sx={sx}>
      {children}
    </Typography>
  )
}
