import {
  List,
  ListProps,
} from '@mui/material'
import { FC } from 'react'
import { NavItem } from './NavItem'
import { NavData } from '../navigation.types'

export interface NavListProps extends ListProps {
  data: NavData[]
}

export const NavList: FC<NavListProps> = ({ data, ...props }) => {

  return (
    <List {...props}>
      {data.map((navItem) => (
        <NavItem key={navItem.name} data={navItem} />
      ))}
    </List>
  )
}
