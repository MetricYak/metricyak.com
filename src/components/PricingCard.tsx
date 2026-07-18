import * as React from "react"
import type { Tier } from "../types/pricing"

export const PricingCard = ({ tier }: { tier: Tier }): React.ReactElement => {
  return (
    <div
      className={`border-2 border-ink p-6 flex flex-col gap-4 ${tier.highlighted ? "bg-mustard" : "bg-white"}`}
    >
      <h2 className="text-2xl font-bold">{tier.name}</h2>
      <p className="text-3xl font-heading font-bold">{tier.price}</p>
      <p>{tier.tagline}</p>
      <ul className="flex-1 space-y-1">
        {tier.features.map((feature) => (
          <li key={feature}>✓ {feature}</li>
        ))}
      </ul>
      <a href={tier.cta.href} className="px-4 py-2 border-2 border-ink font-bold text-center bg-white">
        {tier.cta.label}
      </a>
    </div>
  )
}
