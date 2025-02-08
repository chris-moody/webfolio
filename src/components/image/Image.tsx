import { styled } from "@mui/material"
import { FC, ImgHTMLAttributes } from "react"

export const StyledImage = styled('img')({
  width: '100%',
  height: 'auto',
  margin: '0 auto'
})

export type ImageProps = ImgHTMLAttributes<HTMLImageElement>

export const Image: FC<ImgHTMLAttributes<HTMLImageElement>> = (props) => {
  return <StyledImage {...props}  />
}