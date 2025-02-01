import { FC } from 'react'
import {
  Box,
  FormControl,
  FormControlLabel,
  FormLabel,
  Radio,
  RadioGroup,
  useColorScheme,
} from '@mui/material'

export const WizardColorSchemeSwitch: FC = () => {
  const { mode, setMode } = useColorScheme()

  if (!mode) {
    return null
  }
  return (
    <Box
      className="content"
      sx={[
        {
          display: 'flex',
          width: '100%',
          alignItems: 'center',
          justifyContent: 'center',
          color: 'text.primary',
          p: 1,
          mb: 2,
          minHeight: '56px',
          background: 'rgba(255,255,255,.75)',
          borderRadius: 3,
        },
        (theme) => theme.applyStyles('dark', { background: 'rgba(0,0,0,.5)' }),
      ]}
    >
      <FormControl>
        <FormLabel id="color-scheme-toggle">Color Scheme</FormLabel>
        <RadioGroup
          aria-labelledby="color-scheme-toggle"
          name="color-scheme-toggle"
          row
          value={mode}
          onChange={(event) =>
            setMode(event.target.value as 'system' | 'light' | 'dark')
          }
        >
          <FormControlLabel value="system" control={<Radio />} label="System" />
          <FormControlLabel value="light" control={<Radio />} label="Light" />
          <FormControlLabel value="dark" control={<Radio />} label="Dark" />
        </RadioGroup>
      </FormControl>
    </Box>
  )
}
