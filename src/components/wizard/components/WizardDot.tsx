import { FC, useCallback } from 'react'
import { Box, BoxProps, useTheme } from '@mui/material'
import classNames from 'classnames'
import { WizardValue } from '../wizard.types'

export type WizardDotProps = Omit<BoxProps, 'onClick' | 'id'> & {
  id: WizardValue
  onClick?: (value: WizardValue) => void
  active?: boolean
}

export const WizardDot: FC<WizardDotProps> = ({
  active,
  onClick,
  className,
  id,
}) => {
  const theme = useTheme()
  const clickHandler = useCallback(() => {
    if (onClick) {
      onClick(id)
    }
  }, [id, onClick])

  return (
    <Box
      id={`wizard-dot-${id}`}
      className={classNames(`wizard-dot`, { active }, className)}
      onClick={clickHandler}
      sx={[
        {
        width: theme.spacing(1.5),
        height: theme.spacing(1.5),
        borderRadius: '50%',
        border: '1px solid black',
        cursor: 'pointer',
        '&.active': {
          backgroundColor: 'primary.main',
        },
      },
      theme.applyStyles('dark', {
        borderColor: 'white'
      })
    ]}
    />
  )
}
