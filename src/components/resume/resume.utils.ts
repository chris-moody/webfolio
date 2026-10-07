export const RESUME_PDF_PATH = '/cmoodyResume.pdf'

const MONTHS = [
  'Jan',
  'Feb',
  'Mar',
  'Apr',
  'May',
  'Jun',
  'Jul',
  'Aug',
  'Sep',
  'Oct',
  'Nov',
  'Dec',
]

/** Formats a JSON Resume date (`YYYY` or `YYYY-MM`) as `Mon YYYY`. */
export const formatResumeDate = (value?: string) => {
  if (!value) return 'Present'
  const [year, month] = value.split('-')
  const monthName = month ? MONTHS[Number(month) - 1] : undefined
  return monthName ? `${monthName} ${year}` : (year ?? value)
}
