import { FC, useState } from 'react'
import { NavData } from './navigation.types'
import { Drawer, IconButton } from '@mui/material'
import MenuIcon from '@mui/icons-material/Menu'
import { NavList } from './components/NavList'
import { useLocation } from 'react-router'

export interface NavigationProps {
  data: NavData[]
}

export const Navigation: FC<NavigationProps> = ({ data }) => {
  const location = useLocation()
  // The drawer belongs to the path it was opened on, so navigating closes it.
  const [openOnPath, setOpenOnPath] = useState<string | null>(null)
  const open = openOnPath === location.pathname

  const onClick = () => {
    setOpenOnPath(open ? null : location.pathname)
  }

  const onClose = () => {
    setOpenOnPath(null)
  }

  return (
    <>
      <IconButton
        aria-label="Navigation"
        sx={{ position: 'absolute', top: 0, left: 0, zIndex: 100 }}
        onClick={onClick}
      >
        <MenuIcon />
      </IconButton>
      <Drawer anchor="left" open={open} onClose={onClose}>
        <NavList data={data} />
      </Drawer>
    </>
  )
}
