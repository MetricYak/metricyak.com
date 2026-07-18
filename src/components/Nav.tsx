import * as React from "react"
import { Link } from "gatsby"
import { DocSearch } from "./DocSearch"

const NAV_LINKS: Array<{ label: string; to: string }> = [
  { label: "Docs", to: "/docs/getting-started/" },
  { label: "Pricing", to: "/pricing/" },
  { label: "Blog", to: "/blog/" },
]

export const Nav = (): React.ReactElement => {
  return (
    <header className="flex items-center justify-between px-6 py-4 border-b-4 border-ink">
      <Link to="/" className="font-heading text-xl font-bold">
        MetricYak
      </Link>
      <nav className="flex items-center gap-6">
        <DocSearch />
        {NAV_LINKS.map((link) => (
          <Link key={link.to} to={link.to} className="font-medium hover:text-mustard">
            {link.label}
          </Link>
        ))}
      </nav>
    </header>
  )
}
