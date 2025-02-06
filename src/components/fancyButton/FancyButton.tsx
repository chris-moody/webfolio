import { Button, ButtonProps, styled, SxProps, Theme, Typography, useTheme } from '@mui/material'
import { FC, ReactNode } from 'react'
import './fancyButton.scss'
import classNames from 'classnames'
import { useAppSelector } from '@/redux/hooks'
import { selectThemeFlair } from '@/redux/slices/theme/theme.selector'
import { NavLink, NavLinkProps } from 'react-router'


const FancyStyles = ({ theme }: { theme: Theme }) => `
  position: relative;
  border: none;
  text-decoration: none;
  background: transparent;
  padding: 0;
  cursor: pointer;
  outline-offset: 4px;
  transition: filter 250ms;
  &:not(.active, .disabled) {
    &:hover, &.pressed {
      filter: brightness(120%);
      .face {
        transform: translateY(-6px);
        transition: transform 250ms cubic-bezier(0.3, 0.7, 0.4, 1.5);
      }
      .shadow {
        transform: translateY(4px);
        transition: transform 250ms cubic-bezier(0.3, 0.7, 0.4, 1.5);
      }
    }
    &:active {
      filter: brightness(120%);
      .face {
        transform: translateY(-2px);
        transition: transform 34ms;
      }
      .shadow {
        transform: translateY(1px);
        transition: transform 34ms;
      }
    }
  }
  &.active {
    filter: brightness(120%);
    animation: wave 1s ease infinite;
    transform: rotate(var(--wave-angle)) scale(1.1);
  }
  &:focus {
    &:not(:focus-visible) {
      outline: none;
    }
  }
  &.disabled {
    pointer-events: none;
    cursor: default;
    filter: grayscale(1);
  }
  .shadow {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    border-radius: 12px;
    background: hsl(0deg 0% 0% / 0.25);
    will-change: transform;
    transform: translateY(2px);
    transition: transform 600ms cubic-bezier(0.3, 0.7, 0.4, 1);
  }
  .wall {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    border-radius: 12px;
    background: linear-gradient(
      to left,
      ${theme.palette.primary.dark},
      ${theme.palette.primary.light},
      ${theme.palette.primary.light},
      ${theme.palette.primary.dark}
    );
  }
  .face {
    display: block;
    position: relative;
    padding: 8px 16px;
    border-radius: 12px;
    background: ${theme.palette.primary.main};
    will-change: transform;
    transform: translateY(-4px);
    transition: transform 600ms cubic-bezier(0.3, 0.7, 0.4, 1);
  }
`
export const StyledFancyButton = styled('button')(FancyStyles);

export const FancyButton: FC<ButtonProps> = ({
  className,
  children,
  ...props
}) => {
  const flair = useAppSelector(selectThemeFlair)
  const theme = useTheme()

  if (flair === 37) {
    return (
      <StyledFancyButton
        component="button"
        className={classNames('button', className, { disabled: props.disabled })}
        {...props}
      >
        <span className={'shadow'} />
        <span className={'wall'} />
        <Typography
          component="span"
          color={theme.palette.getContrastText(theme.palette.primary.main)}
          className={'face'}
        >
          {children}
        </Typography>
      </StyledFancyButton>
    )
  }

  return (
    <Button className={className} {...props}>
      {children}
    </Button>
  )
}


export const StyledFancyLink = styled(NavLink)<NavLinkProps>(FancyStyles);

type FancyNavButtonProps = Omit<NavLinkProps, "children"> & {
  to: string
  disabled?: boolean
  sx?: SxProps
  children?: ReactNode
  className?: string
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
      <StyledFancyLink
        to={to}
        viewTransition
        className={classNames('button', className, { disabled: props.disabled })}
        {...props}
      >
        <span className={'shadow'} />
        <span className={'wall'} />
        <Typography
          component="span"
          color={theme.palette.getContrastText(theme.palette.primary.main)}
          className={'face'}
        >
          {children}
        </Typography>
      </StyledFancyLink>
    )
  }

  return (
    <Button viewTransition component={NavLink} to={to} className={className}>
      {children}
    </Button>
  )
}
