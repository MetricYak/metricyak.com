declare module "@mdx-js/react" {
  import * as React from "react"

  export type MDXComponents = Record<string, React.ComponentType<any>>

  export const MDXProvider: React.FC<{
    components?: MDXComponents
    children?: React.ReactNode
  }>
}
