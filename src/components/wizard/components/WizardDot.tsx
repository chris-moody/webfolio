import { FC, useCallback } from 'react'
import { Box, BoxProps, styled } from '@mui/material'
import classNames from 'classnames'
import { NavLink } from 'react-router'

export type WizardDotProps = Omit<BoxProps, 'onClick' | 'id'> & {
  id: string
  onClick?: (value: string) => void
}

const StyledLink = styled(NavLink)(({ theme }) => ({
  padding: theme.spacing(0.75),
  '.dot': {
    width: theme.spacing(1.5),
    height: theme.spacing(1.5),
    borderRadius: '50%',
    border: '1px solid black',
    cursor: 'pointer',
  },
  '&.active': {
    pointerEvents: 'none',
    '.dot': {
      backgroundColor: theme.palette.primary.main,
      borderColor: theme.palette.getContrastText(theme.palette.primary.main),
    },
  },
}))
export const WizardDot: FC<WizardDotProps> = ({ onClick, className, id }) => {
  const clickHandler = useCallback(() => {
    if (onClick) {
      onClick(id)
    }
  }, [id, onClick])

  return (
    <StyledLink
      to={id}
      id={`wizard-dot-${id}`}
      aria-label={`page ${id}`}
      className={({ isActive }) =>
        classNames(`wizard-dot`, { active: isActive }, className)
      }
      onClick={clickHandler}
      viewTransition
    >
      <Box className="dot" />
    </StyledLink>
  )
}
