import * as React from "react"
import { graphql, Link, PageProps } from "gatsby"
import { MDXProvider } from "@mdx-js/react"
import { MDXRenderer } from "gatsby-plugin-mdx"
import { Layout } from "../components/Layout"
import { Seo } from "../components/Seo"
import { DocsSidebar } from "../components/DocsSidebar"
import { Badge } from "../components/ui/badge"
import { mdxComponents } from "../components/mdx-components"
import { useDocsNav } from "../hooks/useDocsNav"

type DocPageQueryResult = {
  mdx: {
    body: string
    fields: { slug: string }
    frontmatter: {
      title: string
      description: string
      section: string | null
      watermark: string | null
    }
  }
}

const DocPageTemplate = ({ data }: PageProps<DocPageQueryResult>): React.ReactElement => {
  const { mdx } = data
  const { pages } = useDocsNav()

  const index = pages.findIndex((page) => page.slug === mdx.fields.slug)
  const prev = index > 0 ? pages[index - 1] : null
  const next = index >= 0 && index < pages.length - 1 ? pages[index + 1] : null

  const watermark = mdx.frontmatter.watermark ?? mdx.frontmatter.title.split(" ")[0].toUpperCase()
  const section = mdx.frontmatter.section ?? "Guides"

  return (
    <Layout>
      <Seo title={mdx.frontmatter.title} description={mdx.frontmatter.description} />
      <div className="mx-auto grid max-w-[1280px] grid-cols-1 gap-10 [padding-block:clamp(28px,4vw,48px)_100px] [padding-inline:clamp(20px,4vw,48px)] lg:grid-cols-[250px_1fr] lg:gap-14">
        {/* 74px = the shared Nav's rendered height (18px padding × 2 + 36px tallest child + 1px border) — the topbar never resizes between marketing and docs pages, so this stays in sync with Nav.tsx.
            Below lg the sidebar collapses into a native <details> menu (no JS needed for the toggle); at lg+ the <summary> hides and it's forced open, sticky beside the content. */}
        <details open className="group lg:sticky lg:top-[74px] lg:h-fit lg:max-h-[calc(100vh-104px)] lg:overflow-y-auto">
          <summary className="mb-4 flex cursor-pointer list-none items-center justify-between gap-2 rounded-[var(--radius)] border-[1.5px] border-metricyak-900 px-4 py-3 text-[13px] font-extrabold uppercase tracking-[0.05em] text-foreground [&::-webkit-details-marker]:hidden lg:hidden">
            <span>Menu</span>
            <span
              aria-hidden="true"
              className="inline-block text-brand-orange transition-transform duration-150 ease-out group-open:rotate-90 motion-reduce:transition-none"
            >
              ›
            </span>
          </summary>
          <DocsSidebar currentSlug={mdx.fields.slug} />
        </details>

        <main className="relative min-w-0 max-w-[760px]">
          <span
            aria-hidden="true"
            className="pointer-events-none absolute -right-1.5 -top-2.5 z-0 select-none text-[clamp(64px,11vw,150px)] font-black leading-none tracking-[-0.04em] text-brand-orange opacity-[0.06]"
          >
            {watermark}
          </span>

          <article className="relative z-10">
            <div className="mb-3.5 inline-block -rotate-2">
              <Badge
                variant="outline"
                className="border-brand-orange px-2.5 py-1 text-[11px] font-bold uppercase tracking-[0.04em] text-brand-orange"
              >
                {section}
              </Badge>
            </div>
            <MDXProvider components={mdxComponents}>
              <MDXRenderer>{mdx.body}</MDXRenderer>
            </MDXProvider>
          </article>

          {(prev || next) && (
            <nav
              aria-label="Docs pager"
              className="mt-16 flex flex-col items-stretch gap-4 border-t-[1.5px] border-metricyak-900 pt-8 sm:flex-row sm:justify-between"
            >
              {prev ? (
                <Link
                  to={prev.slug}
                  className="flex flex-1 flex-col gap-1 rounded-[var(--radius)] border-[1.5px] border-metricyak-900 px-4 py-3 no-underline hover:bg-secondary"
                >
                  <span className="text-[11px] font-bold uppercase tracking-[0.05em] text-muted-foreground">
                    ← Previous
                  </span>
                  <span className="text-[15px] font-bold text-foreground">{prev.title}</span>
                </Link>
              ) : (
                <div className="flex-1" />
              )}
              {next ? (
                <Link
                  to={next.slug}
                  className="flex flex-1 flex-col items-end gap-1 rounded-[var(--radius)] border-[1.5px] border-metricyak-900 px-4 py-3 text-right no-underline hover:bg-secondary"
                >
                  <span className="text-[11px] font-bold uppercase tracking-[0.05em] text-muted-foreground">
                    Next →
                  </span>
                  <span className="text-[15px] font-bold text-foreground">{next.title}</span>
                </Link>
              ) : (
                <div className="flex-1" />
              )}
            </nav>
          )}
        </main>
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
        section
        watermark
      }
    }
  }
`
