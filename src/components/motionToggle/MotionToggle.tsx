import { IconButton } from '@mui/material'
import PauseIcon from '@mui/icons-material/PauseCircleOutline'
import PlayIcon from '@mui/icons-material/PlayCircleOutline'
import { useMotionPreference } from '@/motion/motion'

/**
 * The tour's pause control (WCAG 2.2.2). Several tour effects loop for longer
 * than five seconds; this stops all of them at once by switching the site to
 * reduced motion, and switches back. The full System / Reduce / Full choice
 * lives in Settings.
 */
export const MotionToggle = () => {
  const { reduced, setSetting } = useMotionPreference()
  const label = reduced ? 'Play animations' : 'Stop animations'
  return (
    // A native title is enough of a hint for mouse users; MUI's Tooltip
    // would pull Popper into the tour bundle for one icon.
    <IconButton
      aria-label={label}
      title={label}
      onClick={() => setSetting(reduced ? 'full' : 'reduce')}
      sx={{ position: 'absolute', top: 0, right: 40, zIndex: 1000 }}
    >
      {reduced ? <PlayIcon /> : <PauseIcon />}
    </IconButton>
  )
}
