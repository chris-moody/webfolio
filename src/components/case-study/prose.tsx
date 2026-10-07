import type { MDXComponents } from 'mdx/types'

/** Typography for case-study MDX, on the site's tokens. */
export const proseComponents: MDXComponents = {
  h2: (props) => (
    <h2
      className="mt-12 mb-3 text-2xl font-bold tracking-tight text-fg"
      {...props}
    />
  ),
  h3: (props) => (
    <h3 className="mt-8 mb-2 text-lg font-semibold text-fg" {...props} />
  ),
  p: (props) => <p className="my-4 leading-relaxed" {...props} />,
  ul: (props) => <ul className="my-4 list-disc space-y-1.5 pl-6" {...props} />,
  ol: (props) => (
    <ol className="my-4 list-decimal space-y-1.5 pl-6" {...props} />
  ),
  li: (props) => <li className="leading-relaxed" {...props} />,
  strong: (props) => <strong className="font-semibold text-fg" {...props} />,
  blockquote: (props) => (
    <blockquote
      className="my-6 border-l-4 border-accent pl-4 text-fg-muted italic"
      {...props}
    />
  ),
  hr: () => <hr className="my-10 border-border" />,
  code: (props) => (
    <code
      className="rounded bg-canvas px-1.5 py-0.5 font-mono text-[0.9em]"
      {...props}
    />
  ),
  pre: (props) => (
    <pre
      tabIndex={0}
      className="my-6 overflow-x-auto rounded-lg border border-border bg-canvas p-4 font-mono text-sm leading-relaxed [&_code]:bg-transparent [&_code]:p-0"
      {...props}
    />
  ),
}
