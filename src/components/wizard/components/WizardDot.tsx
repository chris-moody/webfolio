import { FC, useCallback } from 'react'
import { Box, BoxProps, styled, useTheme } from '@mui/material'
import classNames from 'classnames'
import { NavLink } from 'react-router'

export type WizardDotProps = Omit<BoxProps, 'onClick' | 'id'> & {
  id: string
  onClick?: (value: string) => void
}

const StyledLink = styled(NavLink)(({ theme }) => ({
  '&.active': {
    pointerEvents: 'none',
    '.dot': {
      backgroundColor: theme.palette.primary.main,
    }
  },
}))
export const WizardDot: FC<WizardDotProps> = ({
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
    <StyledLink
      to={id}
      id={`wizard-dot-${id}`}
      className={({ isActive }) =>
        classNames(`wizard-dot`, { active: isActive }, className)
      }
      onClick={clickHandler}
      viewTransition
    >
      <Box
      className="dot"
        sx={[
          {
            width: theme.spacing(1.5),
            height: theme.spacing(1.5),
            borderRadius: '50%',
            border: '1px solid black',
            cursor: 'pointer',
          },
          theme.applyStyles('dark', {
            borderColor: 'white',
          }),
        ]}
      />
    </StyledLink>
  )
}
