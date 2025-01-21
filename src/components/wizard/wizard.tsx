import { FC, useCallback, useRef, useState } from 'react'
import { WizardStep, WizardStepProps } from './components/wizardStep'
import {
  Box,
  BoxProps,
  IconButton,
  Stack,
  Typography,
  useTheme,
} from '@mui/material'
import classNames from 'classnames'
import CloseIcon from '@mui/icons-material/Close'
import gsap from 'gsap'
import { useGSAP } from '@gsap/react'
import { WizardResult, WizardValue } from './wizard.types'
import { WizardDot } from './components/WizardDot'
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
  active,
  className,
  defaultStep = 0,
  stepData,
  title,
  onBack,
  onComplete,
  ...props
}) => {
  const theme = useTheme()
  const container = useRef<HTMLDivElement>()
  const [currentStep, setCurrentStep] = useState<WizardValue>(defaultStep)
  const [prevStep, setPrevStep] = useState<WizardValue>()
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

  useGSAP(
    () => {
      if (defaultStep)
        gsap.set(`#wizard-step-${defaultStep}`, { xPercent: '0' })
      if (stepData.length > 1)
        gsap.to(`.wizard-step:not(#wizard-step-${defaultStep})`, {
          xPercent: -200,
        })
    },
    { dependencies: [defaultStep, stepData], scope: container }
  )

  useGSAP(
    () => {
      if (currentStep === defaultStep && !prevStep) return
      const delta =
        stepData.findIndex((step) => step.id === currentStep) -
        stepData.findIndex((step) => step.id === prevStep)
      const dir = delta / Math.abs(delta)

      if (currentStep)
        gsap.fromTo(
          `#wizard-step-${currentStep}`,
          { xPercent: dir * 200 },
          { xPercent: '0' }
        )
      if (prevStep)
        gsap.to(`#wizard-step-${prevStep}`, { xPercent: -dir * 200 })
    },
    {
      dependencies: [currentStep, defaultStep, prevStep, stepData],
      scope: container,
    }
  )

  const updateStep = useCallback(
    (step: WizardValue) => {
      setPrevStep(currentStep)
      setCurrentStep(step)
    },
    [currentStep]
  )

  const closeHandler = useCallback(() => {
    if (onBack) onBack()
  }, [onBack])

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
      const stepHistory = [...history]
      const prevStep = stepHistory.pop()
      if (prevStep) {
        updateStep(prevStep)
        setHistory(stepHistory)
      } else if (onBack) onBack()
    },
    [history, onBack, updateStep]
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
      setHistory((history) => [...history, step.id])
      updateStep(result.next || defaultStep)
    },
    [defaultStep, completeHandler, updateStep]
  )

  const onStepSelect = useCallback(
    (stepId: WizardValue) => {
      setHistory((history) => [...history, currentStep])
      updateStep(stepId)
    },
    [currentStep, updateStep]
  )

  return (
    <Box
      id={`wizard-${id}`}
      ref={container}
      className={classNames('wizard', className)}
      sx={{
        flexDirection: 'column',
        display: 'flex',
        position: 'absolute',
        overflow: 'hidden',
        width: '100%',
        height: '100%',
        top: 0,
        left: 0,
      }}
      {...props}
    >
      <IconButton
        onClick={closeHandler}
        sx={{
          position: 'absolute',
          top: theme.spacing(1),
          right: theme.spacing(1),
          zIndex: 2,
        }}
      >
        <CloseIcon />
      </IconButton>
      <Typography variant="h1" zIndex={1}>
        {title}
      </Typography>
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'center',
          flex: 0.8,
        }}
      >
        {stepData.map((step) => (
          <WizardStep
            onBack={onStepBack()}
            onNext={onStepNext(step)}
            //onSelect={onStepSelect(step)}
            active={step.id === currentStep}
            key={step.id}
            {...step}
          />
        ))}
      </Box>
      {stepData.length > 1 && (
        <Stack
          direction="row"
          spacing={1}
          sx={{
            zIndex: 1,
            justifyContent: 'center',
            width: 'fit-content',
            margin: '0 auto',
            p: 1,
            background: 'rgb(0,0,0,.5)',
            borderRadius: 3,
          }}
        >
          {stepData.map((step) => (
            <WizardDot
              key={step.id}
              active={step.id === currentStep}
              onClick={onStepSelect}
              id={step.id}
            />
          ))}
        </Stack>
      )}
    </Box>
  )
}

export default Wizard
