import { FC, useCallback, useRef, useState } from 'react'
import { WizardStep, WizardStepProps } from './components/wizardStep'
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
  title?: React.ReactNode | string
  defaultStep?: WizardValue
  onBack?: () => void
  onComplete?: (value: WizardResult) => void
  i?: (
    wizard: WizardProps,
    onComplete: (value: WizardResult) => void,
    active: boolean
  ) => React.ReactNode
  renderer?: (
    wizard: WizardProps,
    onComplete: (value: WizardResult) => void,
    active: boolean
  ) => React.ReactNode
}

export const Wizard: FC<WizardProps> = ({
  id,
  next,
  active,
  className,
  defaultStep = 0,
  stepData,
  title,
  onBack,
  onComplete,
  ...props
}) => {
  const container = useRef<HTMLDivElement>()
  const [currentStep, setCurrentStep] = useState<WizardValue>(defaultStep)
  const [history, setHistory] = useState<WizardValue[]>([])

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

  const onStepBack = useCallback(
    () => () => {
      //go to the prvious step
      const stepHistory = [...history]
      const prevStep = stepHistory.pop()
      if (prevStep) {
        setCurrentStep(prevStep)
        setHistory(stepHistory)
      }
      else if (onBack) onBack()
    },
    [history, onBack]
  )

  //works if wizardStep.next is undefined
  //each wizardStep links to the next via next property
  //wizardStep.next === 'complete' will trigger the onComplete handler

  //receives data from the step selection when the complete button is hit
  const onStepNext = useCallback(
    (step: WizardStepProps) => (result: WizardResult) => {
      if (!step.next) {
        completeHandler(result)
        return
      }
      //go to the next step
      setHistory((history) => [...history, step.id])
      setCurrentStep(result.next || defaultStep)
    },
    [defaultStep, completeHandler]
  )

  const onStepSelect = (step: WizardStepProps) => (value: WizardResult) => {
    //setCurrentStep(value.next)
  }

  return (
    <Box
      id={`wizard-${id}`}
      ref={container}
      className={classNames('wizard', className)}
      {...props}
    >
      <Typography variant="h1">{title}</Typography>
      {stepData.map((step) => (
        <WizardStep
        onBack={onStepBack(step)}
        onNext={onStepNext(step)}
        onSelect={onStepSelect(step)}
        active={step.id === currentStep}
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
      )}
    </Box>
  )
}

export default Wizard
