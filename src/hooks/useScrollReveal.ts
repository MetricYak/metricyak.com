import { useEffect, useRef, useState } from "react"
import { useReducedMotion } from "./useReducedMotion"

type ScrollReveal = {
  ref: React.RefObject<HTMLElement | null>
  /** True once the element should render in its hidden pre-reveal state. */
  armed: boolean
  /** True once the reveal animation should play (or has already played). */
  revealed: boolean
}

// The element is ALWAYS visible by default (SSR output, no-JS, reduced motion,
// or already on-screen at mount) — we only arm the hide-then-reveal choreography
// for content that's genuinely below the fold when JS confirms it. This avoids
// ever gating real content behind a transition that might not fire.
export const useScrollReveal = (threshold = 0.15): ScrollReveal => {
  const reducedMotion = useReducedMotion()
  const ref = useRef<HTMLElement>(null)
  const [armed, setArmed] = useState(false)
  const [revealed, setRevealed] = useState(false)

  useEffect(() => {
    if (reducedMotion) return

    const node = ref.current
    if (!node) return

    const rect = node.getBoundingClientRect()
    const alreadyVisible = rect.top < window.innerHeight && rect.bottom > 0
    if (alreadyVisible) return

    setArmed(true)

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setRevealed(true)
            observer.unobserve(entry.target)
          }
        })
      },
      { threshold }
    )

    observer.observe(node)
    return () => observer.disconnect()
  }, [reducedMotion, threshold])

  return { ref, armed, revealed }
}
