import gsap from 'gsap'
import { WizardValue } from './wizard.types'

export interface WizardTransitionProps {
  target: HTMLElement
  stepCount: number
  onComplete: () => void
}

export const wizardOn: (props: WizardTransitionProps) => void = ({ target, stepCount, onComplete }) => {
  if (stepCount > 1) gsap.to('.wizard-dots', { alpha: 100, delay: 0.5 })
  gsap.to(target, {
    alpha: 100,
    top: '0%',
    onComplete,
  })
}

export const wizardOff: (props: WizardTransitionProps) => void = ({ target, stepCount, onComplete }) => {
  if (stepCount > 1) gsap.to('.wizard-dots', { alpha: 0 })
    gsap.to(target, {
      alpha: '0',
      top: '-100%',
      onComplete
    })
}

export const wizardStepOn = (step: WizardValue, dir: number) => {
  gsap.fromTo(
    `#wizard-step-${step}`,
    { xPercent: dir * 200 },
    { xPercent: '0' }
  )
}

export const wizardStepOff = (step: WizardValue, dir: number) => {
  gsap.to(`#wizard-step-${step}`, { xPercent: -dir * 200 })
}

export const buildStepOn = () => {
  gsap.fromTo('.content', { alpha: 0 }, { alpha: 1, delay: 0 })
  gsap.fromTo(
    '.wizard-step-content > *, .nav',
    { alpha: 0 },
    { alpha: 1, stagger: 0.2, delay: 0.2 }
  )
}

export const buildStepOff = () => {
  gsap.to('.content', { alpha: 0 })
  gsap.to('.wizard-step-content > *, .nav', { alpha: 0 })
}