import * as React from "react"
import { CodeBlock } from "./CodeBlock"

type WithChildren = { children?: React.ReactNode }

const InlineCode = ({ className, ...props }: React.HTMLAttributes<HTMLElement>): React.ReactElement => {
  // Fenced blocks compile to <pre><code className="language-x">…</code></pre> — that inner
  // <code> renders through CodeBlock's own <pre>, so it stays plain here to avoid double-styling.
  if (className) {
    return <code className={className} {...props} />
  }
  return (
    <code
      className="rounded border border-metricyak-900 bg-metricyak-100 px-1.5 py-px font-mono text-[0.9em]"
      {...props}
    />
  )
}

export const mdxComponents = {
  h1: ({ children }: WithChildren) => (
    <h1 className="mb-[18px] text-[clamp(2.2rem,4.4vw,3.2rem)] font-extrabold leading-[1.05] tracking-[-0.03em] text-balance">
      {children}
    </h1>
  ),
  h2: ({ children }: WithChildren) => (
    <h2 className="mb-4 mt-12 text-[26px] font-extrabold tracking-[-0.02em] text-balance first:mt-0">{children}</h2>
  ),
  h3: ({ children }: WithChildren) => (
    <h3 className="mb-3 mt-8 text-[19px] font-bold tracking-[-0.01em]">{children}</h3>
  ),
  p: ({ children }: WithChildren) => (
    <p className="mb-4 max-w-[65ch] text-[16px] leading-[1.7] text-foreground text-pretty">{children}</p>
  ),
  strong: ({ children }: WithChildren) => <strong className="font-semibold text-foreground">{children}</strong>,
  a: ({ children, ...props }: React.AnchorHTMLAttributes<HTMLAnchorElement>) => (
    <a {...props} className="text-brand-orange hover:text-button-orange hover:underline">
      {children}
    </a>
  ),
  ul: ({ children }: WithChildren) => (
    <ul className="mb-5 max-w-[65ch] list-disc space-y-2 pl-[22px] text-[16px] leading-[1.7] text-foreground">
      {children}
    </ul>
  ),
  ol: ({ children }: WithChildren) => (
    <ol className="mb-5 max-w-[65ch] list-decimal space-y-2 pl-[22px] text-[16px] leading-[1.7] text-foreground">
      {children}
    </ol>
  ),
  li: ({ children }: WithChildren) => <li>{children}</li>,
  blockquote: ({ children }: WithChildren) => (
    <blockquote className="mb-5 -rotate-[0.3deg] rounded-[var(--radius)] border-[1.5px] border-metricyak-900 bg-secondary px-5 py-4 text-[15px] leading-[1.6] text-muted-foreground">
      {children}
    </blockquote>
  ),
  code: InlineCode,
  pre: ({ children }: WithChildren) => <CodeBlock>{children}</CodeBlock>,
  table: ({ children }: WithChildren) => (
    <div className="mb-5 overflow-x-auto rounded-[var(--radius)] border-[1.5px] border-metricyak-900">
      <table className="w-full border-collapse text-[14px]">{children}</table>
    </div>
  ),
  thead: ({ children }: WithChildren) => <thead className="bg-secondary">{children}</thead>,
  tbody: ({ children }: WithChildren) => <tbody className="[&>tr:last-child>td]:border-b-0">{children}</tbody>,
  th: ({ children }: WithChildren) => (
    <th className="border-b-[1.5px] border-metricyak-900 px-[18px] py-3 text-left text-[12px] font-extrabold uppercase tracking-[0.05em] text-muted-foreground">
      {children}
    </th>
  ),
  td: ({ children }: WithChildren) => (
    <td className="border-b border-metricyak-900 px-[18px] py-3">{children}</td>
  ),
  hr: () => <hr className="my-10 border-metricyak-900" />,
}
