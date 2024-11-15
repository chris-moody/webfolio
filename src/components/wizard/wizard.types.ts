export type WizardValue = number | string

export type WizardSelection = {
  id: WizardValue
  label: string
  next?: WizardValue
  renderer?: (
    selection: WizardSelection,
    onSelect: (value: WizardResult) => () => void,
    active: boolean
  ) => React.ReactNode
}

export interface WizardSelectionRendererProps {
  selection: WizardSelection
  onSelect: (value: WizardResult) => () => void
  active: boolean
}

export type WizardResult = {
  id: WizardValue
  next: WizardValue
  value: WizardValue
}