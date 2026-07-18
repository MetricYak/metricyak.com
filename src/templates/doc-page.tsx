import * as React from "react"
import { graphql, PageProps } from "gatsby"
import { MDXRenderer } from "gatsby-plugin-mdx"
import { Layout } from "../components/Layout"
import { Seo } from "../components/Seo"
import { DocsSidebar } from "../components/DocsSidebar"

type DocPageQueryResult = {
  mdx: {
    body: string
    fields: { slug: string }
    frontmatter: { title: string; description: string }
  }
}

const DocPageTemplate = ({ data }: PageProps<DocPageQueryResult>): React.ReactElement => {
  const { mdx } = data

  return (
    <Layout>
      <Seo title={mdx.frontmatter.title} description={mdx.frontmatter.description} />
      <div className="flex gap-8">
        <DocsSidebar currentSlug={mdx.fields.slug} />
        <article className="prose max-w-none flex-1">
          <MDXRenderer>{mdx.body}</MDXRenderer>
        </article>
      </div>
    </Layout>
  )
}

export default DocPageTemplate

export const query = graphql`
  query DocPageQuery($id: String!) {
    mdx(id: { eq: $id }) {
      body
      fields {
        slug
      }
      frontmatter {
        title
        description
      }
    }
  }
`
