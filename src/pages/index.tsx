import * as React from "react"
import { Link } from "gatsby"
import { Layout } from "../components/Layout"
import { Seo } from "../components/Seo"
import { MascotIllustration } from "../components/MascotIllustration"

const IndexPage = (): React.ReactElement => {
  return (
    <Layout>
      <Seo title="Metrics that don't leave you guessing" />
      <section className="flex flex-col items-center text-center gap-6 py-12">
        <MascotIllustration variant="wave" className="w-32 h-32" />
        <h1 className="text-4xl font-bold max-w-2xl">
          Metrics that fire, monitors that notice, and a yak that tells you why.
        </h1>
        <p className="max-w-xl text-lg">
          MetricYak is an open-source platform for defining metrics, setting monitors that fire when they move, and
          getting a real investigation into when, where, and why — plus autonomous workflows that act on it.
        </p>
        <div className="flex gap-4 mt-4">
          <Link to="/docs/getting-started/" className="px-6 py-3 bg-mustard font-bold border-2 border-ink">
            Get Started
          </Link>
          <Link to="/pricing/" className="px-6 py-3 border-2 border-ink font-bold hover:bg-mustard">
            See Pricing
          </Link>
        </div>
      </section>

      <section className="grid grid-cols-1 md:grid-cols-3 gap-8 py-12">
        <div>
          <h2 className="text-xl font-bold mb-2">Metrics</h2>
          <p>Track the numbers that matter — conversion, latency, signups — from your existing pipelines.</p>
        </div>
        <div>
          <h2 className="text-xl font-bold mb-2">Monitors</h2>
          <p>Fire the moment a metric crosses a threshold you define, not an arbitrary system default.</p>
        </div>
        <div>
          <h2 className="text-xl font-bold mb-2">Investigations</h2>
          <p>Get when, where, and why a metric changed — automatically, before anyone has to ask.</p>
        </div>
      </section>
    </Layout>
  )
}

export default IndexPage
