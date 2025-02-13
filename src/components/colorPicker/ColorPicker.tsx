import React, { useState } from 'react'
import { HexColorPicker, HexColorInput } from 'react-colorful'
import { closest, isDark } from 'color-2-name'
import { Box, Typography } from '@mui/material'

export interface ColorPickerProps {
  defaultColor?: string
  onSelect: (color: string) => void
}

export const ColorPicker: React.FC<ColorPickerProps> = ({ defaultColor = '#aabbcc', onSelect }) => {
  const [color, setColor] = useState<string>(defaultColor)

  const handleColorChange = (newColor: string) => {
    setColor(newColor)
    onSelect(newColor)
  }

  return (
    <Box bgcolor={color} sx={{
      borderRadius: 3,
      p: 0,
      '.react-colorful': {
        width: '80%',
        mx: 'auto',
        mb: 2,
        height: 100,
        borderRadius: 3,
      },
      'input': {
        width: 'auto'
      }
    }}>
      <Typography mb={2} color={isDark(color) ? 'white' : 'black'}>
        {closest(color)?.name || 'Unknown Color'}
      </Typography>
      <HexColorPicker color={color} onChange={handleColorChange} />
      <HexColorInput aria-label="Color" prefixed color={color} onChange={handleColorChange} />
    </Box>
  )
}

export default ColorPicker
