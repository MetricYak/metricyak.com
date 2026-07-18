import * as React from "react"
import { graphql, PageProps } from "gatsby"
import { MDXRenderer } from "gatsby-plugin-mdx"
import { Layout } from "../components/Layout"
import { Seo } from "../components/Seo"

type BlogPostQueryResult = {
  mdx: {
    body: string
    frontmatter: {
      title: string
      date: string
      author: string
      description: string
    }
  }
}

const BlogPostTemplate = ({ data }: PageProps<BlogPostQueryResult>): React.ReactElement => {
  const { mdx } = data

  return (
    <Layout>
      <Seo title={mdx.frontmatter.title} description={mdx.frontmatter.description} />
      <article className="prose max-w-none">
        <p className="text-sm uppercase tracking-wide">
          {mdx.frontmatter.date} · {mdx.frontmatter.author}
        </p>
        <h1>{mdx.frontmatter.title}</h1>
        <MDXRenderer>{mdx.body}</MDXRenderer>
      </article>
    </Layout>
  )
}

export default BlogPostTemplate

export const query = graphql`
  query BlogPostQuery($id: String!) {
    mdx(id: { eq: $id }) {
      body
      frontmatter {
        title
        date(formatString: "MMMM D, YYYY")
        author
        description
      }
    }
  }
`
