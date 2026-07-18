import * as React from "react"

export type MascotVariant = "wave" | "shrug" | "magnify" | "sleep"

type MascotIllustrationProps = {
  variant: MascotVariant
  className?: string
}

const MASCOT_LABELS: Record<MascotVariant, string> = {
  wave: "Yak waving hello",
  shrug: "Yak shrugging, unsure what happened",
  magnify: "Yak investigating with a magnifying glass",
  sleep: "Yak asleep, nothing to report",
}

/**
 * Placeholder yak silhouette. Swap the <svg> body for commissioned art later —
 * the variant prop and call sites stay the same.
 */
export const MascotIllustration = ({ variant, className }: MascotIllustrationProps): React.ReactElement => {
  return (
    <svg
      role="img"
      aria-label={MASCOT_LABELS[variant]}
      viewBox="0 0 120 120"
      className={className}
      xmlns="http://www.w3.org/2000/svg"
    >
      <circle cx="60" cy="60" r="56" fill="#FFC531" />
      <ellipse cx="60" cy="70" rx="30" ry="22" fill="#111111" />
      <circle cx="60" cy="42" r="20" fill="#111111" />
      <circle cx="52" cy="40" r="3" fill="#FFC531" />
      <circle cx="68" cy="40" r="3" fill="#FFC531" />
    </svg>
  )
}
