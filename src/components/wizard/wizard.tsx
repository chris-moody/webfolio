import React, { useCallback, useState } from 'react'
import {
  WizardStep,
  WizardStepProps,
} from './components/wizardStep'
import { Box, BoxProps, Typography } from '@mui/material'
import classNames from 'classnames'
import gsap from 'gsap'
import { useGSAP } from '@gsap/react'
import { WizardResult, WizardValue } from './wizard.types'
gsap.registerPlugin(useGSAP)

export type WizardProps = Omit<BoxProps, 'id'> & {
  id: WizardValue
  next: WizardValue
  stepData: WizardStepProps[]
  active?: boolean
  defaultStep?: WizardValue
  onComplete?: (value: WizardResult) => void
  i?: (
    wizard: WizardProps,
    onComplete: (value: WizardResult) => void,
    active: boolean
  ) => React.ReactNode
}

export const Wizard: React.FC<WizardProps> = ({
  id,
  next,
  active,
  className,
  defaultStep = 0,
  stepData,
  title,
  onComplete,
  ...props
}) => {
  const container = React.useRef<HTMLDivElement>()
  const [currentStep, setCurrentStep] = useState<WizardValue>(defaultStep)

  useGSAP(
    () => {
      const target = container.current
      if (!target) return
      gsap.set(target, { alpha: '0', top: '100%' })
      if (active) {
        gsap.to(target, { alpha: '100', top: '0%' })
      } else {
        gsap.to(target, { alpha: '0', top: '-100%' })
      }
    },
    { dependencies: [active], scope: container }
  )

  const completeHandler = useCallback(
    (value: WizardResult) => {
      if (onComplete) {
        onComplete({ ...value, id })
      }
    },
    [id, onComplete]
  )

  //works if wizardStep.next is undefined
  //each wizardStep links to the next via next property
  //wizardStep.next === 'complete' will trigger the onComplete handler

  //receives data from the step selection when the complete button is hit
  const onStepComplete = useCallback(
    (step: WizardStepProps) => (result: WizardResult) => {
      console.log('onStepComplete', result, step)
      if (!step.next) {
        completeHandler(result)
        return
      }
      //go to the next step
      setCurrentStep(result.next || defaultStep)
    },
    [defaultStep, completeHandler]
  )

  const onStepSelect = (step: WizardStepProps) => (value: WizardResult) => {
    //setCurrentStep(value.next)
  }

  const renderStep = (
    step: WizardStepProps,
    onComplete: (value: WizardResult) => void,
    onSelect: (value: WizardResult) => void,
    active: boolean
  ) => {
    //if (renderer) return renderer(step, onComplete, onSelect)
    return (
      <WizardStep
        onComplete={onComplete}
        onSelect={onSelect}
        active={active}
        key={step.id}
        sx={{
          width: '100vw',
          position: 'absolute',
          top: '50%',
          left: 0,
          transform: 'translateY(-50%)',
        }}
        {...step}
      />
    )
  }

  return (
    <Box id={`wizard-${id}`} ref={container} className={classNames('wizard', className)} {...props}>
      <Typography variant="h1">{title}</Typography>
      {stepData.map((step) => renderStep(step, onStepComplete(step), onStepSelect(step), step.id === currentStep))}
    </Box>
  )
}

export default Wizard
