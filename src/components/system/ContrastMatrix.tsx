import { ScrollRegion } from '@/components/ScrollRegion'
import {
  contrastPairs,
  type PairResult,
  SWEEP_CHROMAS,
  SWEEP_HUES,
  SWEEP_LIGHTNESSES,
  themes,
} from '@/tokens'

const ratio = (value: number) => `${value.toFixed(2)}`

/**
 * The contrast matrix. Rows are computed at build time (the /system route's
 * loader) by the same functions and sweep the CI suite asserts; recomputing
 * them in the browser cost ~230 ms of main-thread time under throttling.
 */
export const ContrastMatrix = ({ rows }: { rows: PairResult[] }) => {
  const accents =
    1 + SWEEP_HUES.length * SWEEP_CHROMAS.length * SWEEP_LIGHTNESSES.length
  const checks = Object.keys(themes).length * 2 * accents * contrastPairs.length
  const allPass = rows.every(
    (row) => Math.min(row.worst.light, row.worst.dark) >= row.min
  )
  return (
    <>
      <p className="mt-3 text-fg-muted">
        Each pair is checked for the brand accent and for{' '}
        {accents.toLocaleString()} visitor accents (36 hues × 3 chromas × 3
        lightnesses, plus brand), in both modes and all three themes:{' '}
        {checks.toLocaleString()} checks on every CI run. “Worst” is the lowest
        ratio any of those accents produces.{' '}
        {allPass ? 'All pass.' : 'Some fail.'}
      </p>
      <ScrollRegion label="Contrast matrix" className="mt-3">
        <table className="w-full text-left text-sm tabular-nums [&_td]:border-t [&_td]:border-border [&_td]:py-1.5 [&_td]:pr-3 [&_th]:pb-1.5 [&_th]:pr-3 [&_tbody_th]:border-t [&_tbody_th]:border-border [&_tbody_th]:py-1.5">
          <caption className="sr-only">
            Contrast ratios for every declared foreground and background pair
          </caption>
          <thead>
            <tr>
              <th scope="col">Pair</th>
              <th scope="col">Used for</th>
              <th scope="col">Min</th>
              <th scope="col">Light (brand)</th>
              <th scope="col">Light (worst)</th>
              <th scope="col">Dark (brand)</th>
              <th scope="col">Dark (worst)</th>
              <th scope="col">Result</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((row) => {
              const pass = Math.min(row.worst.light, row.worst.dark) >= row.min
              return (
                <tr key={row.name}>
                  <th scope="row" className="font-mono text-xs font-normal">
                    {row.name}
                  </th>
                  <td className="text-fg-muted">{row.use}</td>
                  <td>{row.min}:1</td>
                  <td>{ratio(row.brand.light)}</td>
                  <td>{ratio(row.worst.light)}</td>
                  <td>{ratio(row.brand.dark)}</td>
                  <td>{ratio(row.worst.dark)}</td>
                  <td className={pass ? 'text-positive' : 'text-negative'}>
                    {pass ? 'Pass' : 'Fail'}
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </ScrollRegion>
    </>
  )
}
