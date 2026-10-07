import { Box, IconButton } from '@mui/material'
import classNames from 'classnames'
import { FC, Suspense, useState } from 'react'
import InfoIcon from '@mui/icons-material/Settings'
import { onDemand } from '@/utils/onDemand'

// The dialog (MUI Dialog, Modal, focus trap, radios) isn't needed for first
// paint: it loads on first open, or on hover/focus of the button.
const panel = onDemand(() =>
  import('./SettingsPanel').then((m) => m.SettingsPanel)
)

export const SettingsDialog: FC = () => {
  // null until first opened: nothing loads or mounts before then. After that
  // it stays mounted so the close transition can run.
  const [isOpen, setIsOpen] = useState<boolean | null>(null)

  return (
    <Box
      className={classNames('nav-menu')}
      sx={{
        position: 'absolute',
        top: 0,
        right: 0,
        zIndex: 1000,
      }}
    >
      <IconButton
        aria-label="Settings"
        aria-haspopup="dialog"
        onClick={() => setIsOpen(true)}
        onPointerEnter={panel.prefetch}
        onFocus={panel.prefetch}
      >
        <InfoIcon />
      </IconButton>
      {isOpen !== null && (
        <Suspense fallback={null}>
          <panel.Component open={isOpen} onClose={() => setIsOpen(false)} />
        </Suspense>
      )}
    </Box>
  )
}
