import { useEffect, useRef, useState } from "react"
import { useReducedMotion } from "./useReducedMotion"

// Tracks scrollY via rAF-throttled listener for subtle hero parallax.
// Returns 0 (and never attaches a listener) when the user prefers reduced motion.
export const useParallaxScroll = (): number => {
  const reducedMotion = useReducedMotion()
  const [scrollY, setScrollY] = useState(0)
  const raf = useRef<number | null>(null)

  useEffect(() => {
    if (reducedMotion) return

    const onScroll = (): void => {
      if (raf.current !== null) return
      raf.current = window.requestAnimationFrame(() => {
        setScrollY(window.scrollY)
        raf.current = null
      })
    }

    window.addEventListener("scroll", onScroll, { passive: true })
    return () => {
      window.removeEventListener("scroll", onScroll)
      if (raf.current !== null) cancelAnimationFrame(raf.current)
    }
  }, [reducedMotion])

  return reducedMotion ? 0 : scrollY
}
