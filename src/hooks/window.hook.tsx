import { useEffect, useState } from 'react'

export const useWindow: () => Window | undefined = () => {
  const [win, setWin] = useState<Window>()

  useEffect(() => {
    setWin(window)
  }, [])

  return win
}
