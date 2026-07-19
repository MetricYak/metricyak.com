import * as React from "react"
import { Link } from "gatsby"
import { annotate, annotationGroup } from "rough-notation"
import { Layout } from "../components/Layout"
import { Seo } from "../components/Seo"
import { Badge } from "../components/ui/badge"
import { Button } from "../components/ui/button"
import { GithubStarButton, GITHUB_REPO } from "../components/GithubStarButton"
import { useReducedMotion } from "../hooks/useReducedMotion"
import { useScrollReveal } from "../hooks/useScrollReveal"
import { cn } from "../lib/utils"

const DOCS_URL = "/docs/getting-started/"

const HERO_HIGHLIGHT_COLOR = "rgba(244, 197, 66, 0.55)"

const HighlightWord = React.forwardRef<HTMLSpanElement, { children: string }>(({ children }, ref) => (
  <span ref={ref} className="relative inline-block" style={{ lineHeight: 0.8 }}>
    {children}
  </span>
))
HighlightWord.displayName = "HighlightWord"

const HeroHeadline = (): React.ReactElement => {
  const metricsRef = React.useRef<HTMLSpanElement>(null)
  const autopilotRef = React.useRef<HTMLSpanElement>(null)

  React.useEffect(() => {
    const metricsEl = metricsRef.current
    const autopilotEl = autopilotRef.current
    if (!metricsEl || !autopilotEl) return

    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches
    const config = {
      type: "highlight" as const,
      color: HERO_HIGHLIGHT_COLOR,
      iterations: 2,
      animationDuration: reducedMotion ? 0 : 500,
    }

    const metricsAnnotation = annotate(metricsEl, config)
    const autopilotAnnotation = annotate(autopilotEl, config)
    annotationGroup([metricsAnnotation, autopilotAnnotation]).show()

    return () => {
      metricsAnnotation.remove()
      autopilotAnnotation.remove()
    }
  }, [])

  return (
    <h1 className="mt-6 mb-5 text-[clamp(2.2rem,6.4vw,5.2rem)] font-extrabold leading-[0.98] tracking-[-0.04em] text-balance">
      <span className="block md:whitespace-nowrap">
        Open-source <HighlightWord ref={metricsRef}>metrics</HighlightWord>.
      </span>
      <span className="block">
        On <HighlightWord ref={autopilotRef}>autopilot</HighlightWord>.
      </span>
    </h1>
  )
}

type Capability = { glyph: string; title: string; desc: string }

const CAPABILITIES: Capability[] = [
  { glyph: "#", title: "Metrics", desc: "Track anything, no schema wrangling." },
  { glyph: "!", title: "Monitors", desc: "The thresholds and conditions." },
  { glyph: "?", title: "Investigations", desc: "Trace an anomaly back to its root cause." },
  { glyph: "→", title: "Workflows", desc: "Chain checks and actions on autopilot." },
  { glyph: "=", title: "Dashboards", desc: "Ship a shareable view in one command." },
]

const ROTATE_INTERVAL_MS = 3600
const TRANSITION_DURATION_MS = 380

const CapabilityContent = ({ capability }: { capability: Capability }): React.ReactElement => (
  <>
    <div className="text-[16px] font-extrabold leading-tight tracking-[-0.02em]">{capability.title}</div>
    <div className="text-[13px] leading-tight text-muted-foreground">{capability.desc}</div>
  </>
)

const CapabilityCarousel = (): React.ReactElement => {
  const reducedMotion = useReducedMotion()
  const [index, setIndex] = React.useState(0)
  const [prevIndex, setPrevIndex] = React.useState<number | null>(null)

  React.useEffect(() => {
    if (reducedMotion) return

    const rotate = window.setInterval(() => {
      setIndex((current) => {
        setPrevIndex(current)
        return (current + 1) % CAPABILITIES.length
      })
    }, ROTATE_INTERVAL_MS)

    return () => window.clearInterval(rotate)
  }, [reducedMotion])

  React.useEffect(() => {
    if (prevIndex === null) return

    const clear = window.setTimeout(() => setPrevIndex(null), TRANSITION_DURATION_MS)
    return () => window.clearTimeout(clear)
  }, [prevIndex])

  return (
    <>
      <div className="flex min-w-65 flex-1 items-center gap-3.5 overflow-hidden">
        <span className="shrink-0 text-[22px] font-black leading-none text-brand-orange">
          {CAPABILITIES[index].glyph}
        </span>
        <div className="relative h-10 flex-1 overflow-hidden">
          {prevIndex !== null && (
            <div key={`out-${prevIndex}`} className="capability-slide-out absolute inset-0">
              <CapabilityContent capability={CAPABILITIES[prevIndex]} />
            </div>
          )}
          <div key={`in-${index}`} className={cn("absolute inset-0", prevIndex !== null && "capability-slide-in")}>
            <CapabilityContent capability={CAPABILITIES[index]} />
          </div>
        </div>
      </div>
      <div className="flex shrink-0 gap-1.5">
        {CAPABILITIES.map((capability, dotIndex) => (
          <span
            key={capability.title}
            className={cn(
              "size-1.5 rounded-full transition-[opacity,background-color] duration-300",
              dotIndex === index ? "bg-brand-orange opacity-100" : "bg-metricyak-900 opacity-30"
            )}
          />
        ))}
      </div>
    </>
  )
}

const IndexPage = (): React.ReactElement => {
  const oss = useScrollReveal()

  return (
    <Layout>
      <Seo title="Metrics that don't leave you guessing" />

      {/* Hero */}
      <section className="relative mx-auto max-w-7xl px-[clamp(1.25rem,6vw,3.5rem)] [padding-block-start:clamp(3.5rem,10vw,7.5rem)] [padding-block-end:clamp(1.5rem,3vw,2rem)]">
        <div className="relative z-10 max-w-190">
          <HeroHeadline />

          <p className="mb-8 max-w-140 text-[clamp(1.05rem,2vw,1.35rem)] leading-normal text-muted-foreground">
            Complete stack to define, explore and investigate why, when and where metrics change.
          </p>

          <div className="flex flex-wrap items-center gap-3.5">
            <Button asChild variant="raised" size="lg" className="text-base font-bold">
              <Link to={DOCS_URL}>metricyak init →</Link>
            </Button>
            <GithubStarButton size="lg" className="text-base font-bold" />
          </div>
        </div>
      </section>

      {/* Under the hood — capability carousel */}
      <section className="mx-auto max-w-7xl px-[clamp(1.25rem,6vw,3.5rem)] pbe-[clamp(1.75rem,4vw,2.5rem)]">
        <div className="flex rotate-[0.6deg] flex-wrap items-center justify-between gap-5 rounded-(--radius) border-[1.5px] border-metricyak-900 bg-secondary p-4.5 shadow-[0_6px_0_0_var(--metricyak-900)] px-[clamp(1.25rem,3vw,2rem)]">
          <div className="text-xs font-bold uppercase tracking-[0.06em] text-brand-orange">Under the hood</div>
          <CapabilityCarousel />
        </div>
      </section>

      {/* Built in the open */}
      <section
        ref={oss.ref as React.RefObject<HTMLElement | null>}
        className={cn(
          "dark relative overflow-hidden bg-background text-foreground py-[clamp(3.5rem,9vw,6.875rem)] px-[clamp(1.25rem,6vw,3.5rem)]",
          oss.armed && !oss.revealed && "reveal-pending",
          oss.armed && oss.revealed && "reveal-in"
        )}
      >
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -bottom-[10%] -left-[4%] select-none rotate-[8deg] text-[clamp(6.25rem,22vw,20rem)] font-black text-brand-orange opacity-[0.08]"
        >
          OSS
        </div>

        <div className="relative z-10 mx-auto max-w-180 text-center">
          <div className="inline-block -rotate-2">
            <Badge className="bg-brand-orange text-[11px] font-bold uppercase tracking-[0.04em] text-metricyak-25">
              MIT licensed
            </Badge>
          </div>

          <h2 className="mt-5 mb-4 text-[clamp(2rem,4.4vw,3.4rem)] font-extrabold tracking-[-0.03em]">
            Built in the open. On purpose.
          </h2>

          <p className="mb-8 text-[17px] leading-relaxed text-muted-foreground">
            MetricYak is open source from commit one, and it&rsquo;s moving fast. Read the code, poke holes in it,
            file the issue, fork the yak — or just star it now so you don&rsquo;t lose it in your tabs.
          </p>

          <div className="flex flex-wrap justify-center gap-3.5">
            <Button asChild variant="raised" size="lg" className="text-base font-bold">
              <a href={`https://github.com/${GITHUB_REPO}`}>View on GitHub</a>
            </Button>
            <Button asChild variant="ghost" size="lg" className="text-base font-bold">
              <Link to={DOCS_URL}>Read the docs</Link>
            </Button>
          </div>
        </div>
      </section>
    </Layout>
  )
}

export default IndexPage
