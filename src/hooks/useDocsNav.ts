import { useStaticQuery, graphql } from "gatsby"

export type DocsNavPage = {
  slug: string
  title: string
  order: number
  section: string
}

export type DocsNavGroup = {
  section: string
  pages: DocsNavPage[]
}

type DocsNavQueryResult = {
  allMdx: {
    nodes: Array<{
      fields: { slug: string }
      frontmatter: { title: string; order: number; section: string | null }
    }>
  }
}

const FALLBACK_SECTION = "Guides"

export const useDocsNav = (): { pages: DocsNavPage[]; groups: DocsNavGroup[] } => {
  const data = useStaticQuery<DocsNavQueryResult>(graphql`
    query DocsNavQuery {
      allMdx(filter: { fields: { collection: { eq: "docs" } } }, sort: { fields: [frontmatter___order], order: ASC }) {
        nodes {
          fields {
            slug
          }
          frontmatter {
            title
            order
            section
          }
        }
      }
    }
  `)

  const pages: DocsNavPage[] = data.allMdx.nodes.map((node) => ({
    slug: node.fields.slug,
    title: node.frontmatter.title,
    order: node.frontmatter.order,
    section: node.frontmatter.section ?? FALLBACK_SECTION,
  }))

  const groups: DocsNavGroup[] = []
  pages.forEach((page) => {
    const group = groups.find((g) => g.section === page.section)
    if (group) {
      group.pages.push(page)
    } else {
      groups.push({ section: page.section, pages: [page] })
    }
  })

  return { pages, groups }
}
