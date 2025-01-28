import React, { useState } from 'react'
import { Box, Typography, useTheme } from '@mui/material'
import classNames from 'classnames'
import { Wizard, WizardProps } from './Wizard'
import { WizardResult, WizardValue } from './wizard.types'
import { useAppSelector } from '@/redux/hooks'
import { selectThemeFlair } from '@/redux/slices/theme/theme.selector'
import './wizardController.scss'
import { NavMenu } from '../navMenu/NavMenu'

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

  const onWizardBack =
    () => (value: WizardValue) => {
      setCurrent(value)
    }

  const onWizardComplete =
    () => (value: WizardResult) => {
      setCurrent(value.next)
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
      <NavMenu />
      {wizards.map((wizard, index) => {
        const active = wizard.id === current
        const onComplete = onWizardComplete()
        const { renderer, ...wizardProps } = wizard
        const WizardComponent = renderer || Wizard;
        return (
          <WizardComponent
            {...wizardProps}
            renderClose={index !== 0}
            onComplete={onComplete}
            onBack={onWizardBack()}
            active={active}
            key={wizard.id}
          />
        )
      })}
      <Typography variant="caption" component="p" sx={{ position: 'absolute', bottom: theme.spacing(1), width: '100%', mx: 'auto' }}>&copy; 2025 Christopher C. Moody</Typography>
    </Box>
  )
}

export default WizardController
