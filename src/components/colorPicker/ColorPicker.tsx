import React, { useState } from 'react'
import { HexColorPicker, HexColorInput } from 'react-colorful'
import { closest } from 'color-2-name'
import { Box, Typography } from '@mui/material'
import {
  BRAND_ACCENT,
  contrast,
  type Mode,
  neutral,
  resolveAccent,
} from '@/tokens'

export interface ColorPickerProps {
  defaultColor?: string
  onSelect: (color: string) => void
}

/** Black or white, whichever reads better on the swatch. */
const labelOn = (color: string) =>
  contrast(neutral[0], color) >= contrast(neutral[1000], color)
    ? neutral[0]
    : neutral[1000]

const ratio = (value: number) => `${value.toFixed(1)}:1`

/**
 * The tour's color step. Any color can be picked; the site then uses the
 * nearest AA-safe version of it in each mode (resolveAccent), and this shows
 * exactly what changed and why.
 */
export const ColorPicker: React.FC<ColorPickerProps> = ({
  defaultColor = BRAND_ACCENT,
  onSelect,
}) => {
  const [color, setColor] = useState<string>(defaultColor)

  const handleColorChange = (newColor: string) => {
    setColor(newColor)
    onSelect(newColor)
  }

  const resolved = {
    light: resolveAccent(color, 'light'),
    dark: resolveAccent(color, 'dark'),
  }
  const adjusted = (['light', 'dark'] as Mode[]).filter(
    (mode) => resolved[mode].adjusted
  )

  return (
    <Box
      sx={{
        borderRadius: 3,
        p: 0,
        background: 'var(--surface-overlay)',
        '.react-colorful': {
          width: '80%',
          mx: 'auto',
          mb: 2,
          height: 100,
          borderRadius: 3,
        },
        input: { width: 'auto' },
      }}
    >
      <Typography
        mb={2}
        py={1}
        sx={{
          bgcolor: color,
          color: labelOn(color),
          borderRadius: '12px 12px 0 0',
        }}
      >
        {closest(color)?.name || 'Unknown Color'}
      </Typography>
      <HexColorPicker color={color} onChange={handleColorChange} />
      <HexColorInput
        aria-label="Color"
        prefixed
        color={color}
        onChange={handleColorChange}
      />

      <Box
        component="dl"
        sx={{
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          gap: 1,
          m: 0,
          p: 2,
          textAlign: 'left',
        }}
      >
        {(['light', 'dark'] as Mode[]).map((mode) => {
          const accent = resolved[mode]
          return (
            <Box key={mode}>
              <Typography
                component="dt"
                variant="body2"
                fontWeight={600}
                sx={{ textTransform: 'capitalize' }}
              >
                {mode} mode
              </Typography>
              <Typography
                component="dd"
                variant="body2"
                sx={{ m: 0, display: 'flex', alignItems: 'center', gap: 1 }}
              >
                <Box
                  component="span"
                  aria-hidden="true"
                  sx={{
                    width: 16,
                    height: 16,
                    borderRadius: 1,
                    bgcolor: accent.accent,
                    border: 1,
                    borderColor: 'divider',
                  }}
                />
                <span>
                  {accent.accent} · text {ratio(accent.ratios.onCanvas)} ·
                  button {ratio(accent.ratios.withOnAccent)}
                </span>
              </Typography>
            </Box>
          )
        })}
      </Box>
      <Typography
        role="status"
        variant="body2"
        sx={{ px: 2, pb: 2, textAlign: 'left' }}
      >
        {adjusted.length
          ? `Adjusted for contrast in ${adjusted.join(' and ')} mode, so text and buttons stay readable (WCAG AA, 4.5:1).`
          : 'Your color meets WCAG AA contrast as-is.'}
      </Typography>
    </Box>
  )
}

export default ColorPicker
