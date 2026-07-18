import * as React from "react"
import { Link, useStaticQuery, graphql } from "gatsby"

type DocsSidebarQueryResult = {
  allMdx: {
    nodes: Array<{
      fields: { slug: string }
      frontmatter: { title: string; order: number }
    }>
  }
}

export const DocsSidebar = ({ currentSlug }: { currentSlug: string }): React.ReactElement => {
  const data = useStaticQuery<DocsSidebarQueryResult>(graphql`
    query DocsSidebarQuery {
      allMdx(filter: { fields: { collection: { eq: "docs" } } }, sort: { fields: [frontmatter___order], order: ASC }) {
        nodes {
          fields {
            slug
          }
          frontmatter {
            title
            order
          }
        }
      }
    }
  `)

  return (
    <nav aria-label="Docs navigation" className="w-56 shrink-0 pr-6 border-r-2 border-ink">
      <ul className="space-y-2">
        {data.allMdx.nodes.map((node) => (
          <li key={node.fields.slug}>
            <Link
              to={node.fields.slug}
              className={node.fields.slug === currentSlug ? "font-bold text-mustard" : "hover:text-mustard"}
            >
              {node.frontmatter.title}
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  )
}
