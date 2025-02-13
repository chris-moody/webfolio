import { FC, useEffect, useState } from "react";
import { NavData } from "./navigation.types";
import { Drawer, IconButton } from "@mui/material";
import MenuIcon from '@mui/icons-material/Menu';
import { NavList } from "./components/NavList";
import { useLocation } from "react-router";

export interface NavigationProps {
  data: NavData[]
}

export const Navigation: FC<NavigationProps> = ({ data }) => {
  const location = useLocation()
  const [open, setOpen] = useState<boolean>(false)

  const onClick = () => {
    setOpen((prevOpen) => !prevOpen)
  }

  const onClose = () => {
    setOpen(false)
  }

  useEffect(() => {
    setOpen(false)
  }, [location.pathname])

  return (
    <>
      <IconButton aria-label="Navigation" sx={{ position: 'absolute', top: 0, left: 0, zIndex: 100 }} onClick={onClick}>
        <MenuIcon />
      </IconButton>
      <Drawer
        anchor="left"
        open={open}
        onClose={onClose}
      >
        <NavList data={data} />
      </Drawer>
    </>
  )
}