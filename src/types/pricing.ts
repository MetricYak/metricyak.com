export type PricingCta = {
  label: string
  href: string
}

export type Tier = {
  id: string
  name: string
  price: string
  tagline: string
  features: string[]
  cta: PricingCta
  highlighted?: boolean
}

export type PricingData = {
  tiers: Tier[]
}
