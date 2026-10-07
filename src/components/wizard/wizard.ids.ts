/** Id of a slide's heading: the focus target when focus would otherwise be lost. */
export const slideHeadingId = (wizardId: string, stepId: string) =>
  `slide-title-${wizardId}-${stepId}`
