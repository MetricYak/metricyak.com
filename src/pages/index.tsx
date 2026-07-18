import * as React from "react"
import { Link } from "gatsby"
import { Layout } from "../components/Layout"
import { Seo } from "../components/Seo"
import { Badge } from "../components/ui/badge"
import { Button } from "../components/ui/button"
import { Input } from "../components/ui/input"
import { GithubStarButton, GITHUB_REPO } from "../components/GithubStarButton"
import { useParallaxScroll } from "../hooks/useParallaxScroll"
import { useScrollReveal } from "../hooks/useScrollReveal"
import { cn } from "../lib/utils"

const DOCS_URL = "/docs/getting-started/"

const IndexPage = (): React.ReactElement => {
  const scrollY = useParallaxScroll()
  const [subscribed, setSubscribed] = React.useState(false)
  const oss = useScrollReveal()

  const handleSubscribe = (event: React.FormEvent<HTMLFormElement>): void => {
    event.preventDefault()
    setSubscribed(true)
  }

  return (
    <Layout>
      <Seo title="Metrics that don't leave you guessing" />

      {/* Hero */}
      <section className="relative mx-auto max-w-[1280px] [padding-inline:clamp(1.25rem,6vw,3.5rem)] [padding-block-start:clamp(3.5rem,10vw,7.5rem)] [padding-block-end:clamp(1.5rem,3vw,2rem)]">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute right-[2%] top-[8%] z-0 select-none text-[clamp(5.6rem,18vw,16.25rem)] font-black tracking-[-0.04em] text-brand-orange opacity-[0.07]"
          style={{
            transform: `rotate(${-6 + scrollY * 0.05}deg) translateY(${scrollY * 0.5}px) scale(${1 + scrollY * 0.0003})`,
          }}
        >
          YAK
        </div>

        <div className="relative z-10 max-w-[760px]" style={{ transform: `translateY(${scrollY * -0.18}px)` }}>
          <Badge
            variant="outline"
            className="-rotate-3 border-brand-orange px-2.5 py-1 text-[11px] font-bold uppercase tracking-[0.04em] text-brand-orange"
          >
            Open source · early days, big plans
          </Badge>

          <h1 className="mt-6 mb-5 text-[clamp(2.6rem,6.4vw,5.2rem)] font-extrabold leading-[0.98] tracking-[-0.04em] text-balance">
            Your metrics are{" "}
            <span className="relative inline-block">
              <span aria-hidden="true" className="absolute -inset-x-1.5 top-[38%] bottom-[2%] -z-10 -rotate-2 bg-yellow" />
              dying to tell you
            </span>{" "}
            something.
          </h1>

          <p className="mb-8 max-w-[560px] text-[clamp(1.05rem,2vw,1.35rem)] leading-normal text-muted-foreground">
            Watches your numbers, investigates the second they misbehave, and fires off the fix before you&rsquo;ve
            had your coffee. Open source. Self-hostable. Built to be watched right back.
          </p>

          <div className="flex flex-wrap items-center gap-3.5">
            <Button asChild variant="raised" size="lg" className="text-base font-bold">
              <Link to={DOCS_URL}>metricyak init →</Link>
            </Button>
            <GithubStarButton size="lg" className="rotate-1 text-base font-bold" />
          </div>
        </div>
      </section>

      {/* Not live yet — subscribe bar */}
      <section className="mx-auto max-w-[1280px] [padding-inline:clamp(1.25rem,6vw,3.5rem)] [padding-block-end:clamp(1.75rem,4vw,2.5rem)]">
        <div className="flex -rotate-[0.6deg] flex-wrap items-center justify-between gap-5 rounded-[var(--radius)] border-[1.5px] border-metricyak-900 bg-secondary p-[18px] shadow-[0_6px_0_0_var(--metricyak-900)] [padding-inline:clamp(1.25rem,3vw,2rem)]">
          <div>
            <div className="mb-1 text-xs font-bold uppercase tracking-[0.06em] text-brand-orange">Not live yet</div>
            <div className="text-[19px] font-extrabold tracking-[-0.02em]">
              Get the nudge the moment MetricYak ships.
            </div>
          </div>
          <form onSubmit={handleSubscribe} className="flex flex-wrap gap-2">
            <Input
              type="email"
              placeholder="you@company.com"
              required
              className="min-w-[220px]"
              disabled={subscribed}
            />
            <Button
              type="submit"
              variant="raised"
              size="lg"
              disabled={subscribed}
              className={subscribed ? "pulse-once" : undefined}
            >
              {subscribed ? "You're in ✓" : "Notify me"}
            </Button>
          </form>
        </div>
      </section>

      {/* Built in the open */}
      <section
        ref={oss.ref as React.RefObject<HTMLElement | null>}
        className={cn(
          "dark relative overflow-hidden bg-background text-foreground [padding-block:clamp(3.5rem,9vw,6.875rem)] [padding-inline:clamp(1.25rem,6vw,3.5rem)]",
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

        <div className="relative z-10 mx-auto max-w-[720px] text-center">
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
