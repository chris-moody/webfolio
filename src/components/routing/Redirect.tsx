import { Typography } from '@mui/material'
import { FC, useEffect } from 'react'
import { useNavigate } from 'react-router'

export interface RedirectProps {
  to?: string
}

export const Redirect: FC<RedirectProps> = ({ to = '/' }) => {
  const navigate = useNavigate()
  useEffect(() => {
    navigate(to)
  }, [navigate, to])
  
  return <Typography>Redirecting...</Typography>
}
