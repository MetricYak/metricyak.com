import * as React from "react"
import { Link } from "gatsby"
import { GITHUB_REPO } from "./GithubStarButton"
import { LogoMark } from "./LogoMark"

const GITHUB_URL = `https://github.com/${GITHUB_REPO}`

export const Footer = (): React.ReactElement => {
  return (
    <footer className="border-t border-metricyak-900">
      <div className="max-w-[1280px] mx-auto [padding-inline:clamp(1.25rem,6vw,3.5rem)] [padding-block:clamp(2.5rem,6vw,4rem)]">
        <div className="flex flex-wrap items-start justify-between gap-10">
          <div className="max-w-[380px]">
            <div className="mb-2.5">
              <LogoMark className="text-xl" />
            </div>
            <p className="text-sm leading-relaxed text-muted-foreground">
              Open source metrics, monitors, investigations and workflows — built in the open.
            </p>
          </div>
          <div className="flex flex-wrap gap-14">
            <div>
              <div className="mb-3 text-xs font-bold uppercase tracking-[0.06em] text-muted-foreground">
                Product
              </div>
              <div className="flex flex-col gap-2 text-sm">
                <Link to="/docs/getting-started/">Docs</Link>
                <a href={GITHUB_URL}>GitHub</a>
              </div>
            </div>
          </div>
        </div>
        <div className="mt-10 text-xs text-muted-foreground">
          &copy; {new Date().getFullYear()} MetricYak. Open source, MIT licensed. No yaks were harmed.
        </div>
      </div>
    </footer>
  )
}
