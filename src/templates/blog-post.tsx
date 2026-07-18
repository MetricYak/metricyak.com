import * as React from "react"
import { graphql, Link, PageProps } from "gatsby"
import { MDXProvider } from "@mdx-js/react"
import { MDXRenderer } from "gatsby-plugin-mdx"
import { ArrowLeft } from "lucide-react"
import { Layout } from "../components/Layout"
import { Seo } from "../components/Seo"
import { Badge } from "../components/ui/badge"
import { mdxComponents } from "../components/mdx-components"
import { getInitials } from "../lib/utils"

type BlogPostQueryResult = {
  mdx: {
    body: string
    fields: { readingTime: number }
    frontmatter: {
      title: string
      date: string
      author: string
      description: string
      tags: string[] | null
    }
  }
  related: {
    nodes: Array<{
      id: string
      fields: { slug: string }
      frontmatter: { title: string }
    }>
  }
}

const PostHeading = mdxComponents.h1

const BlogPostTemplate = ({ data }: PageProps<BlogPostQueryResult>): React.ReactElement => {
  const { mdx, related } = data
  const tags = mdx.frontmatter.tags ?? []
  const relatedPosts = related.nodes

  return (
    <Layout>
      <Seo title={mdx.frontmatter.title} description={mdx.frontmatter.description} />
      <article className="mx-auto max-w-[720px] [padding-block:clamp(3rem,7vw,5rem)_6rem] [padding-inline:clamp(1.25rem,5vw,2rem)]">
        <Link
          to="/blog/"
          className="mb-8 inline-flex items-center gap-1.5 text-[13px] font-bold uppercase tracking-[0.05em] text-muted-foreground hover:text-brand-orange"
        >
          <ArrowLeft className="size-3.5" /> All posts
        </Link>

        {tags.length > 0 && (
          <div className="mb-4 mt-7 flex flex-wrap gap-1.5">
            {tags.map((tag) => (
              <Badge key={tag} variant="secondary">
                {tag}
              </Badge>
            ))}
          </div>
        )}

        <PostHeading>{mdx.frontmatter.title}</PostHeading>

        <div className="mb-9 flex items-center gap-2.5 border-b-[1.5px] border-metricyak-900 pb-7">
          <span className="flex size-9 shrink-0 items-center justify-center rounded-full bg-brand-orange text-[13px] font-bold text-white">
            {getInitials(mdx.frontmatter.author)}
          </span>
          <div>
            <div className="text-[14px] font-semibold text-foreground">{mdx.frontmatter.author}</div>
            <div className="text-[13px] text-muted-foreground">
              {mdx.frontmatter.date} &middot; {mdx.fields.readingTime} min read
            </div>
          </div>
        </div>

        <MDXProvider components={mdxComponents}>
          <MDXRenderer>{mdx.body}</MDXRenderer>
        </MDXProvider>

        {relatedPosts.length > 0 && (
          <div className="mt-16 border-t-[1.5px] border-metricyak-900 pt-8">
            <div className="mb-4 text-[13px] font-bold uppercase tracking-[0.05em] text-muted-foreground">
              More from the blog
            </div>
            <div className="flex flex-col gap-3.5">
              {relatedPosts.map((post) => (
                <Link
                  key={post.id}
                  to={post.fields.slug}
                  className="text-[16px] font-semibold text-foreground hover:text-brand-orange"
                >
                  {post.frontmatter.title}
                </Link>
              ))}
            </div>
          </div>
        )}
      </article>
    </Layout>
  )
}

export default BlogPostTemplate

export const query = graphql`
  query BlogPostQuery($id: String!) {
    mdx(id: { eq: $id }) {
      body
      fields {
        readingTime
      }
      frontmatter {
        title
        date(formatString: "MMMM D, YYYY")
        author
        description
        tags
      }
    }
    related: allMdx(
      filter: { fields: { collection: { eq: "blog" } }, id: { ne: $id } }
      sort: { fields: [frontmatter___date], order: DESC }
      limit: 2
    ) {
      nodes {
        id
        fields {
          slug
        }
        frontmatter {
          title
        }
      }
    }
  }
`
