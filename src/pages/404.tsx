import * as React from "react"
import { Link } from "gatsby"
import { Layout } from "../components/Layout"
import { Seo } from "../components/Seo"
import { Button } from "../components/ui/button"

const NotFoundPage = (): React.ReactElement => {
  return (
    <Layout>
      <Seo title="404" description="This page doesn't exist." />
      <div className="max-w-4xl mx-auto w-full px-6 py-12">
        <section className="flex flex-col items-center text-center gap-6 py-16">
          <h1 className="text-3xl font-bold">This metric doesn&rsquo;t exist. Neither does this page.</h1>
          <p className="text-muted-foreground">Whatever you were looking for wandered off. Try the docs instead.</p>
          <Button asChild variant="raised">
            <Link to="/">Back to home</Link>
          </Button>
        </section>
      </div>
    </Layout>
  )
}

export default NotFoundPage
