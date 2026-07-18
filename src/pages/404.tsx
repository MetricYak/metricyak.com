import * as React from "react"
import { Link } from "gatsby"
import { Layout } from "../components/Layout"
import { Seo } from "../components/Seo"
import { MascotIllustration } from "../components/MascotIllustration"

const NotFoundPage = (): React.ReactElement => {
  return (
    <Layout>
      <Seo title="404" description="This page doesn't exist." />
      <section className="flex flex-col items-center text-center gap-6 py-16">
        <MascotIllustration variant="shrug" className="w-32 h-32" />
        <h1 className="text-3xl font-bold">This metric doesn't exist. Neither does this page.</h1>
        <p>Whatever you were looking for wandered off. Try the docs instead.</p>
        <Link to="/" className="px-6 py-3 bg-mustard font-bold border-2 border-ink">
          Back to Home
        </Link>
      </section>
    </Layout>
  )
}

export default NotFoundPage
