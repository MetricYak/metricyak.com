import * as React from "react"
import { Helmet } from "react-helmet"

type SeoProps = {
  title: string
  description?: string
}

const SITE_DESCRIPTION = "Open-source metrics, monitors, investigations, and autonomous workflows."

export const Seo = ({ title, description }: SeoProps): React.ReactElement => {
  return (
    <Helmet>
      <html lang="en" />
      <title>{`${title} · MetricYak`}</title>
      <meta name="description" content={description ?? SITE_DESCRIPTION} />
    </Helmet>
  )
}
