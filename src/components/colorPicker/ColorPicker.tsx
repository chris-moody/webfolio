import React, { useState } from 'react'
import { HexColorPicker, HexColorInput } from 'react-colorful'
import { closest, isDark } from 'color-2-name'
import { Box, Typography } from '@mui/material'

export interface ColorPickerProps {
  onSelect: (color: string) => void
}

export const ColorPicker: React.FC<ColorPickerProps> = ({ onSelect }) => {
  const [color, setColor] = useState<string>('#aabbcc')

  const handleColorChange = (newColor: string) => {
    setColor(newColor)
    onSelect(newColor)
  }

  return (
    <Box bgcolor={color} sx={{
      '.react-colorful': {
        width: '80%',
        mx: 'auto',
        borderRadius: '0 !important',
      },
    }}>
      <Typography color={isDark(color) ? 'white' : 'black'}>
        {closest(color)?.name || 'Unknown Color'}
      </Typography>
      <HexColorPicker color={color} onChange={handleColorChange} />
      <HexColorInput prefixed color={color} onChange={handleColorChange} />
    </Box>
  )
}

export default ColorPicker
