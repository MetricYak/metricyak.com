import * as React from "react"
import { Link } from "gatsby"
import { Button } from "./ui/button"
import { LogoMark } from "./LogoMark"

const GITHUB_URL = "https://github.com/metricyak/metricyak"

export const Nav = (): React.ReactElement => {
  return (
    <header
      className="sticky top-0 z-40 flex flex-wrap items-center justify-between gap-x-4 gap-y-2 border-b border-metricyak-900 py-[18px] backdrop-blur-sm [padding-inline:clamp(1.25rem,5vw,3.5rem)]"
      style={{ background: "color-mix(in oklab, var(--background) 88%, transparent)" }}
    >
      <Link to="/" className="hover:text-foreground">
        <LogoMark className="text-[22px]" />
      </Link>
      <nav
        aria-label="Primary"
        className="flex flex-wrap items-center gap-x-[clamp(0.75rem,3vw,1.75rem)] gap-y-2"
      >
        <Link to="/docs/getting-started/" className="text-sm font-semibold text-foreground hover:text-primary">
          Docs
        </Link>
        <Link to="/blog/" className="text-sm font-semibold text-foreground hover:text-primary">
          Blog
        </Link>
        <a href={GITHUB_URL} className="text-sm font-semibold text-foreground hover:text-primary">
          GitHub ↗
        </a>
        <Button asChild variant="raised" size="sm">
          <Link to="/docs/getting-started/">metricyak init</Link>
        </Button>
      </nav>
    </header>
  )
}
