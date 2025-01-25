import React, { useCallback, useState } from 'react'
import { Box, useTheme } from '@mui/material'
import classNames from 'classnames'
import { Wizard, WizardProps } from './wizard'
import { WizardResult, WizardValue } from './wizard.types'
import { useAppSelector } from '@/redux/hooks'
import { selectThemeFlair } from '@/redux/slices/theme/theme.selector'
import './wizardController.scss'

interface WizardControllerProps {
  defaultWizard: string
  wizards: WizardProps[]
}

const WizardController: React.FC<WizardControllerProps> = ({
  defaultWizard,
  wizards,
}) => {
  const theme = useTheme()
  const flair = useAppSelector(selectThemeFlair)
  const [current, setCurrent] = useState<WizardValue>(defaultWizard)
  const [history, setHistory] = useState<WizardValue[]>([])

  const onWizardBack = useCallback(
    () => () => {
      const wizardHistory = [...history]
      const prev = wizardHistory.pop()
      if (prev) {
        setCurrent(prev)
        setHistory(wizardHistory)
      }
    },
    [history]
  )

  //receives data from the step selection when the complete button is hit
  const onWizardComplete =
    (id: WizardValue) => (value: WizardResult) => {
      setCurrent(value.next)
      setHistory((history) => [...history, id])
    }

  return (
    <Box
      className={classNames('wizard-controller', `flair-${flair}`)}
      sx={{
        width: '100vw',
        height: '100vh',
        overflow: 'hidden',
        position: 'absolute',
        top: 0,
        left: 0,
        background: theme.palette.background.default,
      }}
    >
      {wizards.map((wizard, index) => {
        const active = wizard.id === current
        const onComplete = onWizardComplete(wizard.id)
        const { renderer, ...wizardProps } = wizard
        if (renderer) return renderer(wizard, onComplete, active)
        return (
          <Wizard
            {...wizardProps}
            renderClose={index !== 0}
            onComplete={onComplete}
            onBack={onWizardBack()}
            active={active}
            key={wizard.id}
          />
        )
      })}
    </Box>
  )
}

export default WizardController
