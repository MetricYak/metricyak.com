import * as React from "react"
import { graphql, Link, PageProps } from "gatsby"
import { Layout } from "../components/Layout"
import { Seo } from "../components/Seo"

type BlogIndexQueryResult = {
  allMdx: {
    nodes: Array<{
      fields: { slug: string }
      frontmatter: { title: string; date: string; description: string }
    }>
  }
}

const BlogIndexPage = ({ data }: PageProps<BlogIndexQueryResult>): React.ReactElement => {
  return (
    <Layout>
      <Seo title="Blog" description="Updates and notes from the MetricYak team." />
      <h1 className="text-3xl font-bold mb-8">Blog</h1>
      <ul className="space-y-8">
        {data.allMdx.nodes.map((node) => (
          <li key={node.fields.slug}>
            <Link to={node.fields.slug} className="text-xl font-heading font-bold hover:text-mustard">
              {node.frontmatter.title}
            </Link>
            <p className="text-sm uppercase tracking-wide mt-1">{node.frontmatter.date}</p>
            <p className="mt-2">{node.frontmatter.description}</p>
          </li>
        ))}
      </ul>
    </Layout>
  )
}

export default BlogIndexPage

export const query = graphql`
  query BlogIndexQuery {
    allMdx(filter: { fields: { collection: { eq: "blog" } } }, sort: { fields: [frontmatter___date], order: DESC }) {
      nodes {
        fields {
          slug
        }
        frontmatter {
          title
          date(formatString: "MMMM D, YYYY")
          description
        }
      }
    }
  }
`
