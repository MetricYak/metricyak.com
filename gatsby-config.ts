import type { GatsbyConfig } from "gatsby"

const config: GatsbyConfig = {
  siteMetadata: {
    title: `MetricYak`,
    description: `Open-source metrics, monitors, investigations, and autonomous workflows.`,
    siteUrl: `https://metricyak.com`,
  },
  graphqlTypegen: true,
  plugins: [`gatsby-plugin-typescript`, `gatsby-plugin-postcss`, `gatsby-plugin-image`, `gatsby-plugin-sharp`, `gatsby-transformer-sharp`],
}

export default config
