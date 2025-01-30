export type WizardSelection = {
  id: string
  label: string
  next?: string
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
  id: string
  next: string
  value: string
}