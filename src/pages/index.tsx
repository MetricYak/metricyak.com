import * as React from "react"
import { Layout } from "../components/Layout"
import { Seo } from "../components/Seo"
import { MascotIllustration } from "../components/MascotIllustration"

const IndexPage = (): React.ReactElement => {
  return (
    <Layout>
      <Seo title="Home" />
      <MascotIllustration variant="wave" className="w-24 h-24" />
      <h1 className="text-3xl font-bold mt-4">MetricYak — under construction</h1>
    </Layout>
  )
}

export default IndexPage
