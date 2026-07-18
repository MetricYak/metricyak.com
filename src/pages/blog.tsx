import * as React from "react"
import { graphql, Link, PageProps } from "gatsby"
import { ArrowLeft, ArrowRight } from "lucide-react"
import { Layout } from "../components/Layout"
import { Seo } from "../components/Seo"
import { Badge } from "../components/ui/badge"
import { Button } from "../components/ui/button"
import { getInitials } from "../lib/utils"

const PAGE_SIZE = 6

type Post = {
  slug: string
  readingTime: number
  title: string
  date: string
  description: string
  author: string
  tags: string[]
}

type BlogIndexQueryResult = {
  allMdx: {
    nodes: Array<{
      fields: { slug: string; readingTime: number }
      frontmatter: {
        title: string
        date: string
        description: string
        author: string
        tags: string[] | null
      }
    }>
  }
}

const BlogIndexPage = ({ data }: PageProps<BlogIndexQueryResult>): React.ReactElement => {
  const posts: Post[] = data.allMdx.nodes.map((node) => ({
    slug: node.fields.slug,
    readingTime: node.fields.readingTime,
    title: node.frontmatter.title,
    date: node.frontmatter.date,
    description: node.frontmatter.description,
    author: node.frontmatter.author,
    tags: node.frontmatter.tags ?? [],
  }))

  const tags = React.useMemo(() => {
    const unique = new Set<string>()
    posts.forEach((post) => post.tags.forEach((tag) => unique.add(tag)))
    return ["All", ...Array.from(unique)]
  }, [posts])

  const [activeTag, setActiveTag] = React.useState("All")
  const [page, setPage] = React.useState(0)

  const filtered = activeTag === "All" ? posts : posts.filter((post) => post.tags.includes(activeTag))
  const pageCount = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE))
  const clampedPage = Math.min(page, pageCount - 1)
  const visiblePosts = filtered.slice(clampedPage * PAGE_SIZE, clampedPage * PAGE_SIZE + PAGE_SIZE)
  const isFirstPage = clampedPage === 0
  const isLastPage = clampedPage >= pageCount - 1

  const selectTag = (tag: string): void => {
    setActiveTag(tag)
    setPage(0)
  }

  return (
    <Layout>
      <Seo title="Blog" description="Updates and notes from the MetricYak team." />
      <div className="relative mx-auto max-w-[880px] overflow-hidden [padding-inline:clamp(1.25rem,5vw,2rem)] [padding-block:clamp(3rem,7vw,5rem)_1.5rem]">
        <span
          aria-hidden="true"
          className="pointer-events-none absolute -right-4 -top-6 select-none text-[160px] font-black leading-none text-primary/[0.06] sm:text-[220px]"
        >
          LOG
        </span>

        <div className="relative mb-4 inline-block -rotate-2">
          <Badge
            variant="outline"
            className="border-brand-orange px-2.5 py-1 text-[11px] font-bold uppercase tracking-[0.04em] text-brand-orange"
          >
            From the Yak Pen
          </Badge>
        </div>
        <h1 className="relative mb-5 max-w-[17ch] text-[clamp(2.4rem,5.5vw,3.5rem)] font-extrabold leading-[1.05] tracking-[-0.03em] text-balance">
          Notes on <mark className="rounded-sm bg-yellow px-1.5 text-foreground">building</mark> MetricYak.
        </h1>
        <p className="relative mb-10 max-w-[60ch] text-[17px] leading-relaxed text-muted-foreground">
          Why we&rsquo;re building it, how the pieces fit together, and everything in between.
        </p>

        {tags.length > 2 && (
          <div className="relative flex flex-wrap gap-2">
            {tags.map((tag) => (
              <Button
                key={tag}
                type="button"
                size="sm"
                variant={tag === activeTag ? "raised" : "outline"}
                onClick={() => selectTag(tag)}
              >
                {tag}
              </Button>
            ))}
          </div>
        )}
      </div>

      <div className="mx-auto max-w-[880px] [padding-inline:clamp(1.25rem,5vw,2rem)] pb-24">
        {visiblePosts.length === 0 ? (
          <p className="text-muted-foreground">Nothing here yet — check back soon.</p>
        ) : (
          <ul className="flex flex-col border-t-[1.5px] border-metricyak-900 [&>li:last-child]:border-b-0">
            {visiblePosts.map((post) => (
              <li key={post.slug} className="border-b-[1.5px] border-metricyak-900 py-8">
                <Link to={post.slug} className="group block no-underline">
                  <div className="mb-2 flex flex-wrap items-center justify-between gap-3">
                    <p className="text-[13px] font-bold uppercase tracking-[0.05em] text-muted-foreground">
                      {post.date} &middot; {post.readingTime} min read
                    </p>
                    {post.tags.length > 0 && (
                      <div className="flex flex-wrap gap-1.5">
                        {post.tags.map((tag) => (
                          <Badge key={tag} variant="secondary">
                            {tag}
                          </Badge>
                        ))}
                      </div>
                    )}
                  </div>
                  <h2 className="mb-2 text-[22px] font-extrabold tracking-[-0.02em] text-foreground group-hover:text-brand-orange">
                    {post.title}
                  </h2>
                  <p className="mb-3.5 max-w-[60ch] text-[15px] leading-relaxed text-muted-foreground">
                    {post.description}
                  </p>
                  <div className="flex items-center gap-2">
                    <span className="flex size-6 shrink-0 items-center justify-center rounded-full bg-brand-orange text-[10px] font-bold text-white">
                      {getInitials(post.author)}
                    </span>
                    <span className="text-[13px] text-muted-foreground">{post.author}</span>
                  </div>
                </Link>
              </li>
            ))}
          </ul>
        )}

        {pageCount > 1 && (
          <div className="flex items-center justify-center gap-4 pt-10">
            <Button
              type="button"
              variant="outline"
              size="sm"
              disabled={isFirstPage}
              onClick={() => setPage((current) => Math.max(0, current - 1))}
            >
              <ArrowLeft /> Newer
            </Button>
            <span className="text-[13px] text-muted-foreground">
              Page {clampedPage + 1} of {pageCount}
            </span>
            <Button
              type="button"
              variant="outline"
              size="sm"
              disabled={isLastPage}
              onClick={() => setPage((current) => Math.min(pageCount - 1, current + 1))}
            >
              Older <ArrowRight />
            </Button>
          </div>
        )}
      </div>
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
          readingTime
        }
        frontmatter {
          title
          date(formatString: "MMMM D, YYYY")
          description
          author
          tags
        }
      }
    }
  }
`
