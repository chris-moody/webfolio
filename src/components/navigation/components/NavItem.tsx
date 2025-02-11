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
    }
  },
  ['.hit']: {
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
  '.nav-item': {
    marginLeft: theme.spacing(.5),
  }
}))

export interface NavItemProps {
  data: NavData
}

export const NavItem: FC<NavItemProps> = ({ data }) => {
  const [open, setOpen] = useState<boolean>(false)
  const { name, path, children } = data

  const onClick = () => {
    setOpen((prevOpen) => !prevOpen)
  }

  return (
    <>
      <StyledListItem className="nav-item">
        <Box onClick={onClick} className="hit" />
        <NavLink to={path}>
          <FancyText variant="h4">{name}</FancyText>
        </NavLink>
        {children && <FancyText className="indicator" variant="h4">{open ? '-' : '+'}</FancyText>}
      </StyledListItem>
      {children && (
        <Collapse in={open} timeout="auto">
          <List component="div" disablePadding>
            {children.map((childData) => (
              <NavItem key={childData.name} data={childData} />
            ))}
          </List>
        </Collapse>
      )}
    </>
  )
}
