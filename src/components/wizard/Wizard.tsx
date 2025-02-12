import { FC, useCallback, useEffect, useMemo } from 'react'
import { WizardStepConfig } from './components/wizardStep/WizardStep'
import {
  Box,
  BoxProps,
  IconButton,
  Stack,
  styled,
  useTheme,
} from '@mui/material'
import classNames from 'classnames'
import CloseIcon from '@mui/icons-material/Close'
import gsap from 'gsap'
import { TextPlugin } from 'gsap/TextPlugin'
import { MotionPathPlugin } from 'gsap/MotionPathPlugin'
import { useGSAP } from '@gsap/react'
import { WizardResult } from './wizard.types'
import { WizardDot } from './components/WizardDot'
import { FancyText } from '../fancyText/FancyText'
import { useWizard } from '@/data/wizards'
import { NavLink, Outlet, useNavigate, useParams } from 'react-router'
import { FancyNavButton } from '../fancyButton/FancyButton'
import { useAppSelector } from '@/redux/hooks'
import {
  selectWizardSelection,
  selectWizardStep,
} from '@/redux/slices/wizard/wizard.selector'
import { Redirect } from '../routing/Redirect'
import { useSwipeable } from 'react-swipeable'
gsap.registerPlugin(useGSAP, TextPlugin, MotionPathPlugin)

export interface WizardConfig {
  id: string
  next?: string
  prev?: string
  stepData?: WizardStepConfig[]
  active?: boolean
  renderClose?: boolean
  header?: React.ReactNode
  body?: React.ReactNode
  showNav?: boolean
  bodyComponent?: FC
  defaultStep?: string
  i?: (
    wizard: WizardConfig,
    onComplete: (value: WizardResult) => void,
    active: boolean
  ) => React.ReactNode
  renderer?: FC<WizardProps>
}

export type WizardProps = Omit<BoxProps, 'id'>

const StyledWizard = styled(Box)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  position: 'absolute',
  overflow: 'hidden',
  width: `100%`,
  height: '100%',
  top: 0,
  left: 0,
  padding: theme.spacing(2),
  viewTransitionName: 'wizard',
  '> h1': {
    viewTransitionName: 'wizard-title',
  },
}))

export const Wizard: FC<WizardProps> = ({ className, ...props }) => {
  const { wizardId: id = 'home', stepId } = useParams()
  const stepConfig = useAppSelector(selectWizardStep)
  const selection = useAppSelector(selectWizardSelection)

  const theme = useTheme()
  const navigate = useNavigate()

  const wizardData = useWizard(id)
  const {
    showNav = true,
    active = true,
    defaultStep = '',
    renderClose = false,
    stepData = [],
    header,
    body,
    next,
    prev = next,
    bodyComponent,
  } = wizardData || {}
  const wizardId = useMemo(() => wizardData?.id, [wizardData])
  const stepIndex = stepData.findIndex((step) => step.id === stepId)
  const { stepPrev } = useMemo(() => {
    return {
      stepNext: stepData[stepIndex + 1]?.id || '',
      stepPrev: stepData[stepIndex - 1]?.id || '',
    }
  }, [stepData, stepIndex])
  const prevLink = useMemo(() => stepPrev || (prev ? '/' + prev : null), [prev, stepPrev])
  const nextLink = useMemo(
    () =>
      !showNav ? null :
      stepConfig.next ||
      (next && '/' + next) ||
      (selection.next && '/' + selection.next) ||
      '',
    [next, selection, stepConfig, showNav]
  )

  useEffect(() => {
    if (wizardId && stepIndex < 0 && defaultStep)
      navigate('/' + wizardId + '/' + defaultStep)
  }, [defaultStep, id, navigate, stepIndex, wizardId])

  if (!wizardData || !wizardData.id) {
    return <Redirect to="/404/notfound" />
  }

  const onPrev = useCallback(() => {
    if (prevLink) navigate(prevLink)
  }, [prevLink])

  const onNext = useCallback(() => {
    if (nextLink) navigate(nextLink)
  }, [nextLink])

  const handlers = useSwipeable({
    onSwipedLeft: onNext,
    onSwipedRight: onPrev,
    swipeDuration: 450,
    preventScrollOnSwipe: true,
    trackMouse: true,
  })
  const BodyComponent = bodyComponent
  const wizardBody = BodyComponent ? <BodyComponent /> : body
  return (
    <StyledWizard
      id={`wizard-${id}`}
      className={classNames('wizard', { active }, className)}
      {...props}
      {...handlers}
    >
      {renderClose && prev && (
        <IconButton
          sx={{
            position: 'absolute',
            top: theme.spacing(1),
            right: theme.spacing(1),
            zIndex: 10,
          }}
        >
          <NavLink
            aria-label="Close"
            viewTransition
            style={{ lineHeight: 0, color: 'inherit !important' }}
            to={'/' + prev}
          >
            <CloseIcon />
          </NavLink>
        </IconButton>
      )}
      {header && (
        <FancyText
          fancy={{ animate: true, renderBorder: true }}
          variant="h1"
          zIndex={1}
        >
          {header}
        </FancyText>
      )}
      {wizardBody}
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'center',
          position: 'relative',
          flex: 1,
        }}
      >
        <Outlet context={stepConfig.next ? '/'+wizardId+'/'+stepConfig.next : '/'+next} />
      </Box>

      {showNav && (
        <Stack
          className="nav"
          direction="row"
          spacing={2}
          justifyContent="center"
          my={1}
        >
          <FancyNavButton
            aria-label='Back'
            to={prevLink}
            disabled={!prevLink}
            sx={{
              position: 'relative',
              zIndex: 2,
              flex: { xs: 0.5, md: 'unset' },
            }}
          >
            Back
          </FancyNavButton>

          <FancyNavButton
            aria-label='Next'
            to={nextLink}
            sx={{
              position: 'relative',
              zIndex: 2,
              flex: { xs: 0.5, md: 'unset' },
            }}
          >
            Next
          </FancyNavButton>
        </Stack>
      )}

      <Stack
        className="wizard-dots"
        direction="row"
        spacing={0}
        sx={[
          {
            ...(stepData.length <= 1 && { visibility: 'hidden' }),
            zIndex: 1,
            justifyContent: 'center',
            width: 'fit-content',
            mb: 2,
            mx: 'auto',
            p: 0.25,
            background: `rgba(255,255,255, ${stepData?.length > 1 ? 0.75 : 0})`,
            borderRadius: 3,
          },
          theme.applyStyles('dark', {
            background: `rgba(0,0,0, ${stepData?.length > 1 ? 0.5 : 0})`,
          }),
        ]}
      >
        {stepData.map((step) => (
          <WizardDot key={step.id} id={step.id} />
        ))}
      </Stack>
    </StyledWizard>
  )
}

export default Wizard
