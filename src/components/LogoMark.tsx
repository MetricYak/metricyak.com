import * as React from "react"
import { cn } from "../lib/utils"

type LogoMarkProps = {
  className?: string
}

// Hidden-for-curious-users touch: the brand period flicks like an ear on hover. Not
// announced anywhere — matches the "discovery reward" register, not a callout.
export const LogoMark = ({ className }: LogoMarkProps): React.ReactElement => (
  <span className={cn("group inline-block -rotate-2 font-extrabold tracking-[-0.03em] text-foreground", className)}>
    MetricYak
    <span className="inline-block text-primary transition-transform duration-200 ease-out group-hover:rotate-[20deg] group-hover:scale-125 motion-reduce:transition-none motion-reduce:group-hover:scale-100 motion-reduce:group-hover:rotate-0">
      .
    </span>
  </span>
)
