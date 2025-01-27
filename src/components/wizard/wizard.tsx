import { FC, useCallback, useRef, useState } from 'react'
import { WizardStep, WizardStepProps } from './components/wizardStep/WizardStep'
import { Box, BoxProps, IconButton, Stack, useTheme } from '@mui/material'
import classNames from 'classnames'
import CloseIcon from '@mui/icons-material/Close'
import gsap from 'gsap'
import { useGSAP } from '@gsap/react'
import { WizardResult, WizardValue } from './wizard.types'
import { WizardDot } from './components/WizardDot'
import { FancyText } from '../fancyText/FancyText'
import { wizardOff, wizardOn, wizardStepOff, wizardStepOn } from './wizard.transitions'
gsap.registerPlugin(useGSAP)

export type WizardProps = Omit<BoxProps, 'id'> & {
  id: WizardValue
  next: WizardValue
  stepData?: WizardStepProps[]
  active?: boolean
  renderClose?: boolean
  header?: React.ReactNode
  body?: React.ReactNode
  bodyComponent?: FC
  defaultStep?: WizardValue
  onBack?: () => void
  onComplete?: (value: WizardResult) => void
  i?: (
    wizard: WizardProps,
    onComplete: (value: WizardResult) => void,
    active: boolean
  ) => React.ReactNode
  renderer?: FC<WizardProps>
}

export const Wizard: FC<WizardProps> = ({
  id,
  next,
  active,
  className,
  defaultStep = 0,
  renderClose = true,
  stepData = [],
  header,
  body,
  bodyComponent,
  onBack,
  onComplete,
  ...props
}) => {
  const theme = useTheme()
  const container = useRef<HTMLDivElement>()
  const [startStep, setStartStep] = useState<WizardValue>(defaultStep)
  const [currentStep, setCurrentStep] = useState<WizardValue>()
  const [prevStep, setPrevStep] = useState<WizardValue>()
  const [history, setHistory] = useState<WizardValue[]>([])

  useGSAP(
    () => {
      const target = container.current
      if (!target) return
      if (active) {
        wizardOn({
          target,
          stepCount: stepData.length,
          onComplete: () => {
            setCurrentStep(startStep || defaultStep)
          },
        })
      }
    },
    {
      dependencies: [active, startStep, defaultStep, stepData],
      scope: container,
    }
  )

  useGSAP(
    () => {
      const target = container.current
      if (!target || active) return
      wizardOff({
        target,
        stepCount: stepData.length,
        onComplete: () => {
          setStartStep(currentStep || defaultStep)
          setCurrentStep(undefined)
        },
      })
    },
    {
      dependencies: [active, currentStep, defaultStep, stepData],
      scope: container,
    }
  )

  useGSAP(
    () => {
      if (startStep) gsap.set(`#wizard-step-${startStep}`, { xPercent: '0' })
      if (stepData.length > 1)
        gsap.to(`.wizard-step:not(#wizard-step-${startStep})`, {
          xPercent: -200,
        })
    },
    { dependencies: [startStep, stepData], scope: container }
  )

  useGSAP(
    () => {
      if (currentStep === defaultStep && !prevStep) return
      const delta =
        stepData.findIndex((step) => step.id === currentStep) -
        stepData.findIndex((step) => step.id === prevStep)
      const dir = delta / Math.abs(delta)

      if (currentStep)
        wizardStepOn(currentStep, dir)
      if (prevStep)
        wizardStepOff(prevStep, dir)
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
    (result: WizardResult) => {
      if (onComplete) {
        onComplete({ ...result, id, next: result.next || next })
      }
    },
    [id, next, onComplete]
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
      if (!currentStep) return
      setHistory((history) => [...history, currentStep])
      updateStep(stepId)
    },
    [currentStep, updateStep]
  )
  const BodyComponent = bodyComponent
  const wizardBody = BodyComponent ? <BodyComponent /> : body
  return (
    <Box
      id={`wizard-${id}`}
      ref={container}
      className={classNames('wizard', { active }, className)}
      sx={{
        flexDirection: 'column',
        display: 'flex',
        position: 'absolute',
        overflow: 'hidden',
        width: '100%',
        height: '100%',
        top: 0,
        left: 0,
        p: 2,
      }}
      {...props}
    >
      {renderClose && (
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
      )}
      {header && <FancyText
        fancy={{ animate: true, renderBorder: true }}
        variant="h1"
        zIndex={1}
      >
        {header}
      </FancyText>}
      {wizardBody}
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'center',
          position: 'relative',
          flex: 1,
        }}
      >
        {stepData.map((step) => (
          <WizardStep
            onBack={onStepBack()}
            onNext={onStepNext(step)}
            active={active && step.id === currentStep}
            key={step.id}
            {...step}
          />
        ))}
      </Box>
      {stepData.length > 1 && (
        <Stack
          className="wizard-dots"
          direction="row"
          spacing={1}
          sx={[
            {
              zIndex: 1,
              justifyContent: 'center',
              width: 'fit-content',
              mb: 2,
              mx: 'auto',
              p: 1,
              background: 'rgba(255,255,255,.75)',
              borderRadius: 3,
              opacity: 0,
            },
            theme.applyStyles('dark', { background: 'rgba(0,0,0,.5)' }),
          ]}
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
