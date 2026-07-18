import * as React from "react"
import { Link } from "gatsby"
import { Badge } from "./ui/badge"
import { DocSearch } from "./DocSearch"
import { useDocsNav } from "../hooks/useDocsNav"
import { cn } from "../lib/utils"

const COMING_SOON = [
  "Self-hosting & deployment",
  "Full API reference",
  "Integrations",
]

export const DocsSidebar = ({ currentSlug }: { currentSlug: string }): React.ReactElement => {
  const { groups } = useDocsNav()

  const [expanded, setExpanded] = React.useState<Record<string, boolean>>(() =>
    Object.fromEntries(groups.map((group) => [group.section, group.pages.some((page) => page.slug === currentSlug)]))
  )

  // Gatsby's <Link> navigates without remounting the sidebar, so switching to a page in a
  // collapsed group needs its group force-expanded — otherwise the active link goes hidden.
  React.useEffect(() => {
    const activeGroup = groups.find((group) => group.pages.some((page) => page.slug === currentSlug))
    if (!activeGroup) return
    setExpanded((prev) => (prev[activeGroup.section] ? prev : { ...prev, [activeGroup.section]: true }))
  }, [currentSlug, groups])

  const toggleGroup = (section: string): void => {
    setExpanded((prev) => ({ ...prev, [section]: !prev[section] }))
  }

  return (
    <nav aria-label="Docs navigation" className="w-full lg:w-[250px] lg:shrink-0">
      <div className="mb-6">
        <DocSearch />
      </div>

      <div className="mb-2.5 text-[11px] font-extrabold uppercase tracking-[0.08em] text-muted-foreground">
        Contents
      </div>

      {groups.map((group) => {
        const isExpanded = expanded[group.section] ?? false
        return (
          <div key={group.section} className="mb-1">
            <button
              type="button"
              onClick={() => toggleGroup(group.section)}
              aria-expanded={isExpanded}
              className="flex w-full items-center gap-1.5 rounded-md px-1.5 py-1.5 text-left text-[13px] font-extrabold uppercase tracking-[0.03em] text-foreground hover:bg-secondary"
            >
              <span
                aria-hidden="true"
                className={cn(
                  "inline-block font-black text-brand-orange transition-transform duration-150 ease-out motion-reduce:transition-none",
                  isExpanded && "rotate-90"
                )}
              >
                ›
              </span>
              <span>{group.section}</span>
            </button>
            <div
              className="grid overflow-hidden transition-[grid-template-rows] duration-200 ease-out motion-reduce:transition-none"
              style={{ gridTemplateRows: isExpanded ? "1fr" : "0fr" }}
            >
              <ul className="ml-[9px] flex min-h-0 flex-col overflow-hidden border-l-2 border-metricyak-900 pl-[13px]">
                {group.pages.map((page) => {
                  const isActive = page.slug === currentSlug
                  return (
                    <li key={page.slug}>
                      <Link
                        to={page.slug}
                        className={cn(
                          "block py-1.5 text-[14px] no-underline",
                          isActive
                            ? "font-extrabold text-brand-orange"
                            : "font-medium text-muted-foreground hover:text-foreground"
                        )}
                      >
                        {page.title}
                      </Link>
                    </li>
                  )
                })}
              </ul>
            </div>
          </div>
        )
      })}

      <div className="mb-3.5 mt-6 text-[11px] font-extrabold uppercase tracking-[0.08em] text-muted-foreground">
        Further down the trail
      </div>
      <div className="flex flex-col gap-2.5">
        {COMING_SOON.map((label) => (
          <div key={label} className="flex cursor-not-allowed items-center justify-between gap-2 opacity-55">
            <span className="text-[13px] text-muted-foreground">{label}</span>
            <Badge variant="outline" className="border-metricyak-900 px-1.5 py-0.5 text-[9px] text-muted-foreground">
              soon
            </Badge>
          </div>
        ))}
      </div>
    </nav>
  )
}
