import * as React from "react"
import { Link } from "gatsby"
import { Button } from "./ui/button"
import { LogoMark } from "./LogoMark"
import { cn } from "../lib/utils"

const GITHUB_URL = "https://github.com/metricyak/metricyak"

const MenuToggleIcon = ({ open }: { open: boolean }): React.ReactElement => (
  <span aria-hidden="true" className="flex h-3.5 w-4.5 flex-col justify-between">
    <span
      className={cn(
        "h-0.5 w-full origin-center rounded-full bg-current transition-transform duration-200 ease-out motion-reduce:transition-none",
        open && "translate-y-[6px] rotate-45"
      )}
    />
    <span
      className={cn(
        "h-0.5 w-full rounded-full bg-current transition-opacity duration-150 ease-out motion-reduce:transition-none",
        open && "opacity-0"
      )}
    />
    <span
      className={cn(
        "h-0.5 w-full origin-center rounded-full bg-current transition-transform duration-200 ease-out motion-reduce:transition-none",
        open && "-translate-y-[6px] -rotate-45"
      )}
    />
  </span>
)

export const Nav = (): React.ReactElement => {
  const [open, setOpen] = React.useState(false)
  const closeMenu = (): void => setOpen(false)

  React.useEffect(() => {
    if (!open) return

    const onKeyDown = (event: KeyboardEvent): void => {
      if (event.key === "Escape") closeMenu()
    }
    window.addEventListener("keydown", onKeyDown)
    return () => window.removeEventListener("keydown", onKeyDown)
  }, [open])

  const mobileLinkClasses =
    "rounded-md px-3 py-3 text-base font-semibold text-foreground hover:bg-secondary hover:text-primary"

  return (
    <header
      className="sticky top-0 z-40 backdrop-blur-sm"
      style={{ background: "color-mix(in oklab, var(--background) 88%, transparent)" }}
    >
      <div className="flex items-center justify-between gap-4 border-b border-metricyak-900 py-[18px] [padding-inline:clamp(1.25rem,5vw,3.5rem)]">
        <Link to="/" className="hover:text-foreground" onClick={closeMenu}>
          <LogoMark className="text-[22px]" />
        </Link>

        <nav aria-label="Primary" className="hidden items-center gap-x-[clamp(1rem,3vw,1.75rem)] md:flex">
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

        <button
          type="button"
          onClick={() => setOpen((current) => !current)}
          aria-expanded={open}
          aria-controls="mobile-nav-panel"
          aria-label={open ? "Close menu" : "Open menu"}
          className="flex size-11 shrink-0 items-center justify-center rounded-md border border-metricyak-900 text-foreground hover:bg-secondary md:hidden"
        >
          <MenuToggleIcon open={open} />
        </button>
      </div>

      <div
        id="mobile-nav-panel"
        className="grid overflow-hidden transition-[grid-template-rows] duration-200 ease-out motion-reduce:transition-none md:hidden"
        style={{ gridTemplateRows: open ? "1fr" : "0fr" }}
      >
        <div className="min-h-0 overflow-hidden border-b border-metricyak-900">
          <nav
            aria-label="Primary mobile"
            className="flex flex-col gap-1 py-4 [padding-inline:clamp(1.25rem,5vw,3.5rem)]"
          >
            <Button asChild variant="raised" size="lg" className="mb-2 w-full text-base font-bold">
              <Link to="/docs/getting-started/" onClick={closeMenu} tabIndex={open ? undefined : -1}>
                metricyak init
              </Link>
            </Button>
            <Link
              to="/docs/getting-started/"
              className={mobileLinkClasses}
              onClick={closeMenu}
              tabIndex={open ? undefined : -1}
            >
              Docs
            </Link>
            <Link to="/blog/" className={mobileLinkClasses} onClick={closeMenu} tabIndex={open ? undefined : -1}>
              Blog
            </Link>
            <a href={GITHUB_URL} className={mobileLinkClasses} onClick={closeMenu} tabIndex={open ? undefined : -1}>
              GitHub ↗
            </a>
          </nav>
        </div>
      </div>
    </header>
  )
}
