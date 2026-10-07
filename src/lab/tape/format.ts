const price = new Intl.NumberFormat('en-US', {
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
})
const signed = new Intl.NumberFormat('en-US', {
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
  signDisplay: 'exceptZero',
})
const compact = new Intl.NumberFormat('en-US', {
  notation: 'compact',
  maximumFractionDigits: 1,
})

export const formatPrice = (value: number) => price.format(value)
export const formatChange = (value: number) => signed.format(value)
export const formatPercent = (value: number) => `${signed.format(value)}%`
export const formatVolume = (value: number) => compact.format(value)
