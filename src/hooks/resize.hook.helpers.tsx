import { Box, styled } from "@mui/material"

export const StyledObserver = styled(Box)({
  position: 'absolute',
  top: 0,
  left: 0,
  bottom: 0,
  right: 0,
  width: '100%',
  height: '100%',
  pointerEvents: 'none',
  visibility: 'hidden',
  userSelect: 'none',
})