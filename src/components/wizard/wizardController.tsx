import React from 'react'
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
  const [current, setCurrent] = React.useState<WizardValue>(defaultWizard)

  //receives data from the step selection when the complete button is hit
  const onWizardComplete =  (next: WizardValue) => (value: WizardResult) => {
    console.log('onWizardComplete', value.next, next)
    setCurrent(value.next || next)
  }

  const renderWizard = (
    { renderer, ...wizard }: WizardProps,
    onComplete: (value: WizardResult) => void,
    active: boolean
  ) => {
    //console.log('renderWizard', wizard.id, active)
    if (renderer) return renderer(wizard, onComplete, active)
    return (
      <Wizard
        {...wizard}
        sx={{
          position: 'absolute',
          overflow: 'hidden',
          width: '100vw',
          height: '100vh',
          top: 0,
          left: 0,
        }}
        onComplete={onComplete}
        active={active}
        key={wizard.id}
      />
    )
  }

  return (
    <Box
      className={classNames('wizard-controller')}
      sx={{
        width: '100vw',
        height: '100vh',
        overflow: 'hidden',
        position: 'relative'
      }}
    >
      {wizards.map((wizard) =>
        renderWizard(wizard, onWizardComplete(wizard.next), wizard.id === current)
      )}
    </Box>
  )
}

export default WizardController
