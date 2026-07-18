import type { GatsbyConfig } from "gatsby"

const config: GatsbyConfig = {
  siteMetadata: {
    title: `MetricYak`,
    description: `Open-source metrics, monitors, investigations, and autonomous workflows.`,
    siteUrl: `https://metricyak.com`,
  },
  graphqlTypegen: true,
  plugins: [
    `gatsby-plugin-typescript`,
    `gatsby-plugin-postcss`,
    `gatsby-plugin-react-helmet`,
    `gatsby-plugin-image`,
    `gatsby-plugin-sharp`,
    `gatsby-transformer-sharp`,
    `gatsby-plugin-sitemap`,
    {
      resolve: `gatsby-plugin-feed`,
      options: {
        query: `
          {
            site {
              siteMetadata {
                title
                description
                siteUrl
              }
            }
          }
        `,
        feeds: [
          {
            serialize: ({ query: { site, allMdx } }: any) =>
              allMdx.nodes.map((node: any) => ({
                title: node.frontmatter.title,
                description: node.frontmatter.description,
                date: node.frontmatter.date,
                url: site.siteMetadata.siteUrl + node.fields.slug,
                guid: site.siteMetadata.siteUrl + node.fields.slug,
              })),
            query: `
              {
                allMdx(
                  filter: { fields: { collection: { eq: "blog" } } }
                  sort: { fields: [frontmatter___date], order: DESC }
                ) {
                  nodes {
                    fields {
                      slug
                    }
                    frontmatter {
                      title
                      description
                      date
                    }
                  }
                }
              }
            `,
            output: "/rss.xml",
            title: "MetricYak Blog RSS Feed",
          },
        ],
      },
    },
    `gatsby-plugin-mdx`,
    {
      resolve: `gatsby-source-filesystem`,
      options: {
        name: `docs`,
        path: `${__dirname}/content/docs`,
      },
    },
    {
      resolve: `gatsby-source-filesystem`,
      options: {
        name: `blog`,
        path: `${__dirname}/content/blog`,
      },
    },
  ],
}

export default config
