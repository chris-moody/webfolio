// Phase 3 guard: color values come from the token system (src/tokens/), never
// from literals in components or styles. Covers .ts, .tsx, .scss, and .css.
import { readdirSync, readFileSync, statSync } from 'node:fs'
import path from 'node:path'

const ROOT = path.resolve('src')
const ALLOWED = [
  /^src\/tokens\//, // the token source itself
  /^src\/styles\/tokens\.generated\.css$/,
  /\.test\.tsx?$/,
]
const EXTENSIONS = /\.(tsx?|s?css)$/

const PATTERNS = [
  {
    name: 'hex color',
    regex:
      /(?<![\w&])#(?:[0-9a-fA-F]{8}|[0-9a-fA-F]{6}|[0-9a-fA-F]{3,4})\b(?![\w-])/g,
  },
  {
    name: 'color function',
    regex: /\b(?:rgba?|hsla?|oklch|oklab|lab|lch|hwb)\(\s*[\d.]/g,
  },
  // Bare color keywords in style values (strings, templates, CSS). Prose words
  // in JSX text don't match: they aren't preceded by a quote, colon, comma,
  // parenthesis, or a CSS length.
  {
    name: 'named color',
    regex:
      /(?:['"`:,(]\s*|\d(?:px|%|em|rem)?\s+)(?:white|black|red|blue|green|yellow|orange|purple|pink|gray|grey)\b(?![\w-])/g,
  },
]

const walk = (dir) =>
  readdirSync(dir).flatMap((name) => {
    const full = path.join(dir, name)
    return statSync(full).isDirectory() ? walk(full) : [full]
  })

const problems = []
for (const file of walk(ROOT)) {
  const relative = path.relative(process.cwd(), file)
  if (
    !EXTENSIONS.test(file) ||
    ALLOWED.some((pattern) => pattern.test(relative))
  )
    continue
  readFileSync(file, 'utf8')
    .split('\n')
    .forEach((line, index) => {
      if (/^\s*(\/\/|\*|\/\*)/.test(line)) return // comments may mention colors
      for (const { name, regex } of PATTERNS) {
        for (const match of line.matchAll(regex)) {
          problems.push(`${relative}:${index + 1}  ${name}: ${match[0].trim()}`)
        }
      }
    })
}

if (problems.length) {
  console.error(
    `✘ ${problems.length} color literal(s) outside src/tokens/. Use a token instead:\n`
  )
  console.error(problems.join('\n'))
  process.exit(1)
}
console.log('✔ No color literals outside src/tokens/')
