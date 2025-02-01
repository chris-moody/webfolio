import gsap from 'gsap'

export interface WizardTransitionProps {
  target?: HTMLElement | string
  count?: number
  onComplete?: () => void
}

export type WizardTransition = (props?: WizardTransitionProps) => void

export const wizardOn: WizardTransition = (
  { target, count = 0, onComplete } = {} as WizardTransitionProps
) => {
  if (count > 1) gsap.to('.nav, .wizard-dots', { alpha: 100 })
  if (!target) return
  gsap.to(target, {
    alpha: 100,
    top: '0%',
    onComplete,
  })
}

export const wizardOff: WizardTransition = (
  { target, count = 0, onComplete } = {} as WizardTransitionProps
) => {
  if (count > 1) gsap.to('.nav, .wizard-dots', { alpha: 0 })
  if (!target) return
  gsap.to(target, {
    alpha: '0',
    top: '-100%',
    onComplete,
  })
}

export const buildStepOn: WizardTransition = () => {
  gsap.fromTo('.content', { alpha: 0 }, { alpha: 1, stagger: 0.2, delay: 0.5, duration: 0.5 })
}

export const buildStepOff: WizardTransition = ({ target } = {} as WizardTransitionProps) => {
  gsap.to((target && target+' ')+'.content', { alpha: 0, x: -100 })
}
