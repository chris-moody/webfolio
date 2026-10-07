import { ListItem, Collapse, List, Box, styled } from '@mui/material'
import { FC, useId, useState } from 'react'
import { NavData } from '../navigation.types'
import { NavLink } from 'react-router'
import { FancyText } from '@/components/fancyText/FancyText'
import { selectThemeFlair } from '@/redux/slices/theme/theme.selector'
import { useAppSelector } from '@/redux/hooks'
import classNames from 'classnames'

const StyledListItem = styled(ListItem)(({ theme }) => ({
  display: 'flex',
  justifyContent: 'space-between',
  '&:hover': {
    '.indicator h4:first-of-type': {
      color: theme.palette.primary.main,
    },
  },
  a: {
    position: 'relative',
    textDecoration: 'none',
    color: 'inherit',
    '&:hover': {
      textDecoration: 'underline',
      textDecorationColor: theme.palette.primary.main,
    },
    '&.hit': {
      position: 'relative',
      width: '100%',
      height: '100%',
    },
    '&.flair-15': {
      '&:hover': {
        textDecoration: 'none',
        textShadow: `0px 0px 8px var(--mui-palette-primary-light),
            2px 2px 8px var(--mui-palette-primary-light),
            -2px -2px 8px var(--mui-palette-primary-light)`,
      },
    },
    '&.flair-37': {
      '&:hover h4:first-of-type': {
        color: theme.palette.primary.main,
      },
    },
  },
  '.hit': {
    position: 'absolute',
    right: 0,
    left: 0,
    top: 0,
    bottom: 0,
    cursor: 'pointer',
  },
  '.indicator': {
    position: 'relative',
    zIndex: 1,
    border: 0,
    background: 'none',
    color: 'inherit',
    font: 'inherit',
    padding: theme.spacing(0, 1),
    cursor: 'pointer',
    borderRadius: theme.spacing(1),
    '&:focus-visible': {
      outline: `3px solid ${theme.palette.primary.main}`,
      outlineOffset: 2,
    },
  },
  '+.nav-collapse .nav-item-link': {
    paddingLeft: theme.spacing(2),
  },
}))

export interface NavItemProps {
  data: NavData
}

export const NavItem: FC<NavItemProps> = ({ data }) => {
  const [open, setOpen] = useState<boolean>(false)
  const { name, path, children } = data
  const flair = useAppSelector(selectThemeFlair)
  const listId = useId()

  const onClick = () => {
    setOpen((prevOpen) => !prevOpen)
  }

  return (
    <>
      <StyledListItem className={`nav-item`}>
        {/* Whole-row click target for pointer users; keyboard users get the button. */}
        {children && (
          <Box onClick={onClick} className="hit" aria-hidden="true" />
        )}
        <NavLink
          aria-label={name}
          to={path}
          className={classNames(`nav-item-link flair-${flair}`, {
            hit: !children?.length,
          })}
        >
          <FancyText
            fancy={{ depth: 7, renderBorder: false }}
            className={`nav-item-link-text`}
            variant="h4"
          >
            {name}
          </FancyText>
        </NavLink>
        {children && (
          <button
            type="button"
            className="indicator"
            aria-expanded={open}
            aria-controls={listId}
            aria-label={`${open ? 'Hide' : 'Show'} ${name} pages`}
            onClick={onClick}
          >
            <FancyText
              fancy={{ depth: 7, renderBorder: false }}
              variant="h4"
              aria-hidden="true"
            >
              {open ? '-' : '+'}
            </FancyText>
          </button>
        )}
      </StyledListItem>
      {children && (
        <Collapse className="nav-collapse" in={open} timeout="auto">
          <List id={listId} className="nav-list" component="div" disablePadding>
            {children.map((childData) => (
              <NavItem key={childData.name} data={childData} />
            ))}
          </List>
        </Collapse>
      )}
    </>
  )
}
