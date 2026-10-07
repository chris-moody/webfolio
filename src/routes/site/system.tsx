import { ScrollRegion } from '@/components/ScrollRegion'
import { ContrastMatrix } from '@/components/system/ContrastMatrix'
import { Playground } from '@/components/system/Playground'
import { TierDiagram } from '@/components/system/TierDiagram'
import { TokenTables } from '@/components/system/TokenTables'
import { pageMeta, SITE } from '@/site'
import type { Route } from './+types/system'

export const meta: Route.MetaFunction = () =>
  pageMeta({
    title: 'Design system · Christopher Moody',
    description:
      'The token system behind this site: three tiers in TypeScript, one source for Tailwind and MUI, and an accent resolver that keeps any visitor color at WCAG AA.',
    path: '/system',
  })

const Section = ({
  id,
  title,
  children,
}: {
  id: string
  title: string
  children: React.ReactNode
}) => (
  <section aria-labelledby={id} className="mt-14">
    <h2 id={id} className="text-2xl font-bold tracking-tight">
      {title}
    </h2>
    {children}
  </section>
)

const repo = (file: string) => `${SITE.repo}/blob/develop/${file}`

export default function System() {
  return (
    <>
      <h1 className="text-4xl font-bold tracking-tight">Design system</h1>
      <p className="mt-4 max-w-prose text-lg text-fg-muted">
        Every color, space, radius, and duration on this site comes from one
        TypeScript source. The tour lets visitors pick any accent color; the
        system adjusts it until it passes WCAG AA in both modes, and a CI suite
        proves that for 325 colors on every build.
      </p>

      <Section id="tiers" title="Three tiers, two consumers">
        <TierDiagram />
        <ul className="mt-4 max-w-prose list-disc space-y-1.5 pl-6">
          <li>
            <strong>Reference</strong> (
            <a href={repo('src/tokens/reference.ts')}>reference.ts</a>): OKLCH
            ramps, so lightness steps are perceptually even, plus spacing,
            radii, type, and motion.
          </li>
          <li>
            <strong>Semantic</strong> (
            <a href={repo('src/tokens/semantic.ts')}>semantic.ts</a>): what a
            value is for, per mode. The accent comes from{' '}
            <a href={repo('src/tokens/accent.ts')}>resolveAccent()</a>.
          </li>
          <li>
            <strong>Component</strong>: a few named uses (buttons, focus rings,
            the carousel’s current dot, price flashes), derived from semantics.
          </li>
        </ul>
      </Section>

      <Section id="playground" title="Try it">
        <p className="mt-3 max-w-prose text-fg-muted">
          The tour’s three flair levels are three themes. Pick one, a mode, and
          any color. The preview below is styled only by token variables,
          computed in your browser by the same functions the build and the tests
          use.
        </p>
        <Playground />
      </Section>

      <Section id="accent" title="Any color, always readable">
        <div className="mt-3 max-w-prose space-y-3">
          <p>
            A visitor can choose a pale yellow, and a pale yellow link on white
            fails WCAG. Rather than limit the picker,{' '}
            <code className="font-mono text-sm">resolveAccent()</code> keeps the
            color’s hue and chroma and searches its OKLCH lightness for the
            value closest to the original that clears 4.5:1 as text on the
            canvas and on cards, and under its own button text. Light mode keeps
            a color that already passes; dark mode starts from a light version
            of the same hue. If the new lightness is out of the sRGB gamut,
            chroma is reduced instead of clipping channels, so the hue doesn’t
            shift.
          </p>
          <p>
            The tour’s color step shows the resolved colors and their ratios,
            and says when it adjusted. Nothing is silently changed.
          </p>
        </div>
      </Section>

      <Section id="contrast" title="Contrast matrix">
        <ContrastMatrix />
      </Section>

      <Section id="tokens" title="Tokens">
        <TokenTables />
      </Section>

      <Section id="bridge" title="One source, Tailwind and MUI">
        <div className="mt-3 max-w-prose space-y-3">
          <p>
            Content pages use Tailwind; the guided tour predates them and uses
            MUI. Both read the same tokens (
            <a
              href={repo(
                'docs/adr/0002-one-token-source-for-mui-and-tailwind.md'
              )}
            >
              ADR 0002
            </a>
            ):
          </p>
          <ul className="list-disc space-y-1.5 pl-6">
            <li>
              <code className="font-mono text-sm">yarn tokens</code> writes{' '}
              <a href={repo('src/styles/tokens.generated.css')}>
                tokens.generated.css
              </a>
              : CSS variables for light (
              <code className="font-mono text-sm">:root</code>) and dark (
              <code className="font-mono text-sm">:root.dark</code>
              ), per-theme type and radius (
              <code className="font-mono text-sm">[data-theme]</code>), and a
              Tailwind <code className="font-mono text-sm">@theme</code> block
              that maps utilities like{' '}
              <code className="font-mono text-sm">bg-accent</code> to them. CI
              fails if the file is stale.
            </li>
            <li>
              <a href={repo('src/theme/index.ts')}>createTourTheme()</a> builds
              MUI’s theme from the same semantic tokens and the visitor’s
              resolved accent, so MUI’s own CSS variables carry token values.
            </li>
            <li>
              In the tour, the visitor’s accent is also written to the CSS
              variables, so Tailwind utilities inside the tour match MUI.
              Leaving the tour restores the brand accent.
            </li>
            <li>
              <code className="font-mono text-sm">yarn lint:colors</code> fails
              the build if a color literal appears anywhere outside{' '}
              <code className="font-mono text-sm">src/tokens/</code>, in
              TypeScript, SCSS, or CSS.
            </li>
          </ul>
        </div>
      </Section>

      <Section id="carousel" title="An accessible carousel">
        <div className="mt-3 max-w-prose space-y-3">
          <p>
            The tour is a set of route-based carousels built on the{' '}
            <a href="https://www.w3.org/WAI/ARIA/apg/patterns/carousel/">
              WAI-ARIA APG carousel pattern
            </a>
            . Every slide is a URL, so Back, Next, and the slide picker are real
            links that work before JavaScript loads. Slides are labelled groups
            (“3 of 5: Where I’ve worked”); the picker is a labelled navigation
            with{' '}
            <code className="font-mono text-sm">
              aria-current=&quot;step&quot;
            </code>{' '}
            and 24-pixel targets.
          </p>
          <p>
            Focus stays on the control you used, so pressing Next five times
            takes five presses, and a polite live region announces each slide.
            Focus moves to the slide’s heading only when the control you used
            left with the old slide. Arrow keys, Home, and End move between
            slides, but never inside a form field or the color picker.
          </p>
          <p>
            Motion follows a System / Reduce / Full setting applied before first
            paint. Reduced motion swaps every looping effect for a static
            version, and a “Stop animations” control is the pause mechanism for
            anything longer than five seconds. Testing it across all three
            themes caught the Maximal theme’s 3D text exposing each link and
            heading eight times; its decorative layers are now inert. Details:{' '}
            <a href={repo('docs/a11y-audit.md')}>accessibility audit</a>.
          </p>
        </div>
      </Section>

      <Section id="status" title="Migration status">
        <ScrollRegion label="Migration status" className="mt-3">
          <table className="w-full text-left text-sm [&_td]:border-t [&_td]:border-border [&_td]:py-1.5 [&_td]:pr-3 [&_th]:pb-1.5 [&_th]:pr-3">
            <thead>
              <tr>
                <th scope="col">Surface</th>
                <th scope="col">Styling</th>
                <th scope="col">Tokens</th>
              </tr>
            </thead>
            <tbody>
              {[
                [
                  'Home, resume, 404, lab, work, this page',
                  'Tailwind',
                  'Token utilities',
                ],
                [
                  'Tape (live grid)',
                  'Tailwind + canvas',
                  'Utilities; canvas reads token variables',
                ],
                [
                  'Guided tour',
                  'MUI (Emotion)',
                  'createTourTheme() from tokens',
                ],
                [
                  'Tour SCSS (transitions, flair shadows)',
                  'SCSS',
                  'MUI CSS variables (token-derived)',
                ],
                [
                  'Diagrams and effects (socket flow, water text)',
                  'MUI + Pixi',
                  'Reference data palette',
                ],
              ].map(([surface, styling, tokens]) => (
                <tr key={surface}>
                  <td>{surface}</td>
                  <td>{styling}</td>
                  <td className="text-positive">✓ {tokens}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </ScrollRegion>
        <p className="mt-3 text-sm text-fg-muted">
          Enforced, not tracked by hand: the color-literal check fails CI on any
          regression.
        </p>
      </Section>
    </>
  )
}
