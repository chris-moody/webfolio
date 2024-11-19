import { useState, useEffect, Dispatch } from "react"



export function useDebounce<T>(val: T, delay = 250): [T, Dispatch<T>, T] {
  const [value, setValue] = useState<T>(val)

  useEffect(() => {
    const timeout = setTimeout(() => {
      setValue(val)
    }, delay)
    return () => clearTimeout(timeout)
  }, [val, delay])

  return [value, setValue, val]
}