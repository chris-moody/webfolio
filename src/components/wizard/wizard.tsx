import { FC, useEffect, useRef } from 'react'
import { WizardStepConfig } from './components/wizardStep/WizardStep'
import { Box, BoxProps, IconButton, Stack, useTheme } from '@mui/material'
import classNames from 'classnames'
import CloseIcon from '@mui/icons-material/Close'
import gsap from 'gsap'
import { TextPlugin } from 'gsap/TextPlugin'
import { useGSAP } from '@gsap/react'
import { WizardResult } from './wizard.types'
import { WizardDot } from './components/WizardDot'
import { FancyText } from '../fancyText/FancyText'
import { wizardOff, wizardOn } from './wizard.transitions'
import { useWizard } from '@/data/wizards'
import { NavLink, Outlet, useNavigate, useParams } from 'react-router'
import { FancyNavButton } from '../fancyButton/FancyButton'
import { useAppSelector } from '@/redux/hooks'
import { selectWizardSelection, selectWizardStep } from '@/redux/slices/wizard/wizard.selector'
gsap.registerPlugin(useGSAP, TextPlugin)

export interface WizardConfig {
  id: string
  next?: string
  prev?: string
  stepData?: WizardStepConfig[]
  active?: boolean
  renderClose?: boolean
  header?: React.ReactNode
  body?: React.ReactNode
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

export const Wizard: FC<WizardProps> = ({ className, ...props }) => {
  const { wizardId: id = '', stepId } = useParams()
  const stepConfig = useAppSelector(selectWizardStep)
  const selection = useAppSelector(selectWizardSelection)
  const {
    active = true,
    defaultStep = '',
    renderClose = true,
    stepData = [],
    header,
    body,
    next,
    prev = next,
    bodyComponent,
  } = useWizard(id)

  const theme = useTheme()
  const container = useRef<HTMLDivElement>(undefined)
  const navigate = useNavigate()

  useEffect(() => {
    if (!stepId) navigate(defaultStep)
  }, [defaultStep, navigate, stepId])

  useGSAP(
    () => {
      const target = container.current
      if (!target) return
      if (active) {
        wizardOn({
          target,
          stepCount: stepData.length,
          onComplete: () => {},
        })
      }
    },
    {
      dependencies: [active, defaultStep, stepData],
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
        onComplete: () => {},
      })
    },
    {
      dependencies: [active, defaultStep, stepData],
      scope: container,
    }
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
      {renderClose && prev && (
        <IconButton
          sx={{
            position: 'absolute',
            top: theme.spacing(1),
            right: theme.spacing(1),
            zIndex: 2,
          }}
        >
          <NavLink style={{ lineHeight: 0 }} to={"/"+prev}><CloseIcon /></NavLink>
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
        <Outlet />
      </Box>

      <Stack
        className="nav"
        direction={{ xs: 'column', md: 'row' }}
        spacing={2}
        justifyContent="center"
        mb={2}
      >
        <FancyNavButton
          to={"/"+prev}
          disabled={!prev}
          //onClick={backHandler}
          sx={{ position: 'relative', zIndex: 2 }}
        >
          Back
        </FancyNavButton>

        <FancyNavButton
          to={stepConfig.next  || (next && '/'+next) || (selection.next && '/'+selection.next)|| ""}
          //disabled={!selected && selections.length > 0}
          //onClick={nextHandler}
          sx={{ position: 'relative', zIndex: 2 }}
        >
          Next
        </FancyNavButton>
      </Stack>

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
            <WizardDot key={step.id} id={step.id} />
          ))}
        </Stack>
      )}
    </Box>
  )
}

export default Wizard
