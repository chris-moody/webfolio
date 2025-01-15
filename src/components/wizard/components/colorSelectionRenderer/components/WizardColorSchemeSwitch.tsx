import { FC } from 'react'
import { Box, FormControl, FormControlLabel, FormLabel, Radio, RadioGroup, useColorScheme } from '@mui/material'

export const WizardColorSchemeSwitch: FC = () => {
  const { mode, setMode } = useColorScheme();
  
  if (!mode) {
    return null;
  }
  return (
    <Box
      sx={{
        display: 'flex',
        width: '100%',
        alignItems: 'center',
        justifyContent: 'center',
        bgcolor: 'background.default',
        color: 'text.primary',
        borderRadius: 1,
        p: 3,
        minHeight: '56px',
      }}
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
  );
}
