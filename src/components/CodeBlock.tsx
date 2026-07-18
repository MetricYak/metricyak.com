import * as React from "react"
import { cn } from "../lib/utils"

const DOT_COLORS = ["bg-brand-orange", "bg-yellow", "bg-metricyak-25"]

const extractText = (node: React.ReactNode): string => {
  if (typeof node === "string" || typeof node === "number") return String(node)
  if (Array.isArray(node)) return node.map(extractText).join("")
  if (React.isValidElement(node)) return extractText((node.props as { children?: React.ReactNode }).children)
  return ""
}

type CodeBlockProps = {
  children?: React.ReactNode
}

export const CodeBlock = ({ children }: CodeBlockProps): React.ReactElement => {
  const [copied, setCopied] = React.useState(false)
  const code = extractText(children).replace(/\n$/, "")

  const handleCopy = (): void => {
    navigator.clipboard
      .writeText(code)
      .then(() => {
        setCopied(true)
        window.setTimeout(() => setCopied(false), 1200)
      })
      .catch(() => {})
  }

  return (
    <div className="dark relative rounded-[var(--radius)] border-[1.5px] border-metricyak-900 bg-background p-4 text-foreground">
      <div className="mb-2.5 flex gap-1.5">
        {DOT_COLORS.map((color) => (
          <span key={color} className={cn("size-2.5 rounded-full", color)} />
        ))}
      </div>
      <pre className="m-0 overflow-x-auto font-mono text-[13px] leading-relaxed">{children}</pre>
      <button
        type="button"
        onClick={handleCopy}
        className="absolute right-3 top-3 rounded-md border border-metricyak-900 bg-transparent px-2 py-1 font-sans text-[11px] text-foreground opacity-50 transition-opacity hover:opacity-100"
      >
        {copied ? "Copied ✓" : "Copy"}
      </button>
    </div>
  )
}
