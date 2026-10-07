import { FC, Suspense, useState } from 'react'
import { NavData } from './navigation.types'
import { IconButton } from '@mui/material'
import MenuIcon from '@mui/icons-material/Menu'
import { useLocation } from 'react-router'
import { onDemand } from '@/utils/onDemand'

// The drawer (MUI Drawer, Modal, Slide, List) loads on first use.
const drawer = onDemand(() =>
  import('./NavigationDrawer').then((m) => m.NavigationDrawer)
)

export interface NavigationProps {
  data: NavData[]
}

export const Navigation: FC<NavigationProps> = ({ data }) => {
  const location = useLocation()
  // The drawer belongs to the path it was opened on, so navigating closes it.
  const [openOnPath, setOpenOnPath] = useState<string | null>(null)
  const open = openOnPath === location.pathname
  // Mounted from the first open on, so later closes can animate.
  const [used, setUsed] = useState(false)

  const onClick = () => {
    setUsed(true)
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
        onPointerEnter={drawer.prefetch}
        onFocus={drawer.prefetch}
      >
        <MenuIcon />
      </IconButton>
      {used && (
        <Suspense fallback={null}>
          <drawer.Component data={data} open={open} onClose={onClose} />
        </Suspense>
      )}
    </>
  )
}
