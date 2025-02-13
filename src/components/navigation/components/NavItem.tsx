import {
  ListItem,
  Collapse,
  List,
  Box,
  styled,
} from '@mui/material'
import { FC, useState } from 'react'
import { NavData } from '../navigation.types'
import { NavLink } from 'react-router'
import { FancyText } from '@/components/fancyText/FancyText'
import { selectThemeFlair } from '@/redux/slices/theme/theme.selector'
import { useAppSelector } from '@/redux/hooks'
import classNames from 'classnames'

const StyledListItem = styled(ListItem)(({ theme }) => ({
  display: 'flex',
  justifyContent: 'space-between',
  a: {
    position: 'relative',
    textDecoration: 'none',
    color: 'inherit',
    '&:hover': {
      textDecoration: 'underline',
      textDecorationColor: theme.palette.primary.main,
    },
    '&.hit': {
      position : 'relative',
      width: '100%',
      height: '100%'
    },
    '&.flair-15': {
      '&:hover': {
        textDecoration: 'none',
        textShadow: `0px 0px 8px var(--mui-palette-primary-light),
            2px 2px 8px var(--mui-palette-primary-light),
            -2px -2px 8px var(--mui-palette-primary-light)`
      }
    },
    '&.flair-37': {
      '&:hover h4': {
        color: theme.palette.primary.main,
      }
    }
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
    pointerEvents: 'none',
  },
  '+.nav-collapse .nav-item-link': {
    paddingLeft: theme.spacing(2),
  }
}))

export interface NavItemProps {
  data: NavData
}

export const NavItem: FC<NavItemProps> = ({ data }) => {
  const [open, setOpen] = useState<boolean>(false)
  const { name, path, children } = data
  const flair = useAppSelector(selectThemeFlair)

  const onClick = () => {
    setOpen((prevOpen) => !prevOpen)
  }

  return (
    <>
      <StyledListItem className={`nav-item`}>
        <Box onClick={onClick} className="hit" />
        <NavLink to={path} className={classNames(`nav-item-link flair-${flair}`, { hit: !children?.length })} >
          <FancyText className={`nav-item-link-text`} variant="h4">{name}</FancyText>
        </NavLink>
        {children && <FancyText className="indicator" variant="h4">{open ? '-' : '+'}</FancyText>}
      </StyledListItem>
      {children && (
        <Collapse className="nav-collapse" in={open} timeout="auto">
          <List className="nav-list" component="div" disablePadding>
            {children.map((childData) => (
              <NavItem key={childData.name} data={childData} />
            ))}
          </List>
        </Collapse>
      )}
    </>
  )
}
