import { FC } from 'react'
import { Drawer } from '@mui/material'
import { NavList } from './components/NavList'
import { NavData } from './navigation.types'

export interface NavigationDrawerProps {
  data: NavData[]
  open: boolean
  onClose: () => void
}

/** The menu drawer, loaded the first time the menu is opened. */
export const NavigationDrawer: FC<NavigationDrawerProps> = ({
  data,
  open,
  onClose,
}) => (
  <Drawer anchor="left" open={open} onClose={onClose}>
    <NavList data={data} />
  </Drawer>
)
