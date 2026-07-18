import * as React from "react"
import { Layout } from "../components/Layout"
import { Seo } from "../components/Seo"
import { PricingCard } from "../components/PricingCard"
import pricingData from "../../content/pricing.json"
import type { PricingData } from "../types/pricing"

const typedPricingData = pricingData as PricingData

const PricingPage = (): React.ReactElement => {
  return (
    <Layout>
      <Seo title="Pricing" description="MetricYak pricing — from solo builders to full teams." />
      <h1 className="text-3xl font-bold mb-8">Pricing</h1>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {typedPricingData.tiers.map((tier) => (
          <PricingCard key={tier.id} tier={tier} />
        ))}
      </div>
    </Layout>
  )
}

export default PricingPage
