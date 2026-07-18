import type { Actions, GatsbyNode, Node } from "gatsby"
import { createFilePath } from "gatsby-source-filesystem"

type Collection = "docs" | "blog"

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

export const onCreateNode: GatsbyNode["onCreateNode"] = ({ node, getNode, actions }) => {
  if (node.internal.type !== "Mdx") {
    return
  }

  const parent = getNode(node.parent as string)
  const sourceInstanceName = parent?.sourceInstanceName as string | undefined

  if (sourceInstanceName === "docs") {
    tagNode(node, getNode, actions, "docs")
  }

  if (sourceInstanceName === "blog") {
    tagNode(node, getNode, actions, "blog")
  }
}

export const createPages: GatsbyNode["createPages"] = async () => {
  // Extended in Task 5 (docs) and Task 6 (blog)
}
