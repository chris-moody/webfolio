import { ScrollRegion } from '@/components/ScrollRegion'
import {
  componentTokens,
  cssVar,
  duration,
  neutral,
  radius,
  semanticColors,
  space,
} from '@/tokens'

const Swatch = ({ color }: { color: string }) => (
  <span
    aria-hidden="true"
    className="inline-block size-5 shrink-0 rounded border border-border align-middle"
    style={{ background: color }}
  />
)

const Value = ({ color }: { color: string }) => (
  <span className="flex items-center gap-2">
    <Swatch color={color} />
    <code className="font-mono text-xs">{color}</code>
  </span>
)

/** Token tables, generated from src/tokens at build time. */
export const TokenTables = () => {
  const light = semanticColors('light')
  const dark = semanticColors('dark')
  const lightComponents = componentTokens(light, 'light')
  const darkComponents = componentTokens(dark, 'dark')
  const table =
    'mt-3 w-full text-left text-sm [&_td]:border-t [&_td]:border-border [&_td]:py-1.5 [&_td]:pr-3 [&_th]:pb-1.5 [&_th]:pr-3'
  return (
    <>
      <h3 className="mt-8 text-lg font-semibold">
        Reference: neutral ramp (OKLCH, hue 262)
      </h3>
      <ul className="mt-3 flex flex-wrap gap-2" aria-label="Neutral ramp">
        {Object.entries(neutral).map(([step, color]) => (
          <li key={step} className="w-20 text-center text-xs">
            <span
              className="block h-10 rounded-md border border-border"
              style={{ background: color }}
              aria-hidden="true"
            />
            <span className="mt-1 block font-semibold">{step}</span>
            <code className="font-mono text-fg-muted">{color}</code>
          </li>
        ))}
      </ul>

      <h3 className="mt-8 text-lg font-semibold">Semantic colors</h3>
      <ScrollRegion label="Semantic color tokens">
        <table className={table}>
          <thead>
            <tr>
              <th scope="col">Token</th>
              <th scope="col">CSS variable</th>
              <th scope="col">Light</th>
              <th scope="col">Dark</th>
            </tr>
          </thead>
          <tbody>
            {(Object.keys(light) as (keyof typeof light)[]).map((token) => (
              <tr key={token}>
                <td className="font-semibold">{token}</td>
                <td>
                  <code className="font-mono text-xs">{cssVar(token)}</code>
                </td>
                <td>
                  <Value color={light[token]} />
                </td>
                <td>
                  <Value color={dark[token]} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </ScrollRegion>

      <h3 className="mt-8 text-lg font-semibold">Component tokens</h3>
      <ScrollRegion label="Component tokens">
        <table className={table}>
          <thead>
            <tr>
              <th scope="col">Token</th>
              <th scope="col">Light</th>
              <th scope="col">Dark</th>
            </tr>
          </thead>
          <tbody>
            {(
              Object.keys(lightComponents) as (keyof typeof lightComponents)[]
            ).map((token) => (
              <tr key={token}>
                <td>
                  <code className="font-mono text-xs">{cssVar(token)}</code>
                </td>
                <td>
                  <Value color={lightComponents[token]} />
                </td>
                <td>
                  <Value color={darkComponents[token]} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </ScrollRegion>

      <h3 className="mt-8 text-lg font-semibold">Scales</h3>
      <dl className="mt-3 grid gap-4 text-sm sm:grid-cols-3">
        {[
          ['Space', space],
          ['Radius', radius],
          ['Duration', duration],
        ].map(([label, values]) => (
          <div key={label as string}>
            <dt className="font-semibold">{label as string}</dt>
            {Object.entries(values as Record<string, string>).map(
              ([key, value]) => (
                <dd key={key} className="font-mono text-xs">
                  {key}: {value}
                </dd>
              )
            )}
          </div>
        ))}
      </dl>
    </>
  )
}
