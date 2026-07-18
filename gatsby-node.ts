import path from "path"
import type { Actions, CreatePagesArgs, GatsbyNode, Node } from "gatsby"
import { createFilePath } from "gatsby-source-filesystem"

type Collection = "docs" | "blog"

const WORDS_PER_MINUTE = 200

const computeReadingTime = (rawContent: string): number => {
  const withoutFrontmatter = rawContent.replace(/^---\n[\s\S]*?\n---\n/, "")
  const wordCount = withoutFrontmatter.trim().split(/\s+/).filter(Boolean).length
  return Math.max(1, Math.round(wordCount / WORDS_PER_MINUTE))
}

const tagNode = (
  node: Node,
  getNode: (id: string) => Node | undefined,
  actions: Actions,
  collection: Collection
): void => {
  const { createNodeField } = actions
  const relativePath = createFilePath({ node, getNode })

  createNodeField({ node, name: "collection", value: collection })
  createNodeField({ node, name: "slug", value: `/${collection}${relativePath}` })
}

export const createSchemaCustomization: GatsbyNode["createSchemaCustomization"] = ({ actions }) => {
  // Declared explicitly since no content currently sets frontmatter.tags — without this,
  // Gatsby's type inference (which needs at least one populated example) can't find the field.
  actions.createTypes(`
    type MdxFrontmatter {
      tags: [String]
    }
  `)
}

export const onCreateNode: GatsbyNode["onCreateNode"] = ({ node, getNode, actions }) => {
  if (node.internal.type !== "Mdx") {
    return
  }

  const { createNodeField } = actions
  createNodeField({ node, name: "readingTime", value: computeReadingTime(node.internal.content ?? "") })

  const parent = getNode(node.parent as string)
  const sourceInstanceName = parent?.sourceInstanceName as string | undefined

  if (sourceInstanceName === "docs") {
    tagNode(node, getNode, actions, "docs")
  }

  if (sourceInstanceName === "blog") {
    tagNode(node, getNode, actions, "blog")
  }
}

const createCollectionPages = async (
  graphql: CreatePagesArgs["graphql"],
  actions: CreatePagesArgs["actions"],
  reporter: CreatePagesArgs["reporter"],
  collection: Collection,
  templatePath: string
): Promise<void> => {
  const { createPage } = actions

  const result = await graphql<{
    allMdx: {
      nodes: Array<{
        id: string
        fields: { collection: string; slug: string }
      }>
    }
  }>(`
    query AllCollectionPages($collection: String!) {
      allMdx(filter: { fields: { collection: { eq: $collection } } }) {
        nodes {
          id
          fields {
            collection
            slug
          }
        }
      }
    }
  `, { collection })

  if (result.errors) {
    reporter.panicOnBuild(`Error loading ${collection} MDX for page creation`, result.errors)
    return
  }

  const nodes = result.data?.allMdx.nodes ?? []

  nodes.forEach((node) => {
    createPage({
      path: node.fields.slug,
      component: path.resolve(templatePath),
      context: { id: node.id },
    })
  })
}

export const createPages: GatsbyNode["createPages"] = async ({ graphql, actions, reporter }) => {
  await createCollectionPages(graphql, actions, reporter, "docs", "./src/templates/doc-page.tsx")
  await createCollectionPages(graphql, actions, reporter, "blog", "./src/templates/blog-post.tsx")
}
