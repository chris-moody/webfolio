import React, { useCallback, useState } from 'react'
import { Box } from '@mui/material'
import classNames from 'classnames'
import { Wizard, WizardProps } from './wizard'
import { WizardResult, WizardValue } from './wizard.types'

interface WizardControllerProps {
  defaultWizard: string
  wizards: WizardProps[]
}

const WizardController: React.FC<WizardControllerProps> = ({
  defaultWizard,
  wizards,
}) => {
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
  const onWizardComplete = (id: WizardValue, next: WizardValue) => (value: WizardResult) => {
    setCurrent(value.next || next)
    setHistory((history) => [...history, id])
  }

  return (
    <Box
      className={classNames('wizard-controller')}
      sx={{
        width: '100vw',
        height: '100vh',
        overflow: 'hidden',
        position: 'relative',
      }}
    >
      {wizards.map((wizard) => {
        const active = wizard.id === current
        const onComplete = onWizardComplete(wizard.id, wizard.next)
        const { renderer, ...wizardProps } = wizard
        if (renderer) return renderer(wizard, onComplete, active)
        return (
          <Wizard
            {...wizardProps}
            sx={{
              position: 'absolute',
              overflow: 'hidden',
              width: '100vw',
              height: '100vh',
              top: 0,
              left: 0,
            }}
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
