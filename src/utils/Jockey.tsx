import { FC, JSX } from 'react'

export interface JockeyProps<T> {
  Component: FC<T>
}

export const Jockey = <T extends JSX.IntrinsicAttributes>({
  Component,
  ...props
}: JockeyProps<T>) => {

  return <Component {...(props as T)} />
}

//export const useJockey = (Component: FC<T>) => (props: T) => {}
