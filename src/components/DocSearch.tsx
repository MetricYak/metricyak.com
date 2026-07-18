import * as React from "react"
import { DocSearch as AlgoliaDocSearch } from "@docsearch/react"
import "@docsearch/css"

export const DocSearch = (): React.ReactElement | null => {
  const appId = process.env.GATSBY_ALGOLIA_APP_ID
  const apiKey = process.env.GATSBY_ALGOLIA_SEARCH_API_KEY
  const indexName = process.env.GATSBY_ALGOLIA_INDEX_NAME

  if (!appId || !apiKey || !indexName) {
    return null
  }

  return <AlgoliaDocSearch appId={appId} apiKey={apiKey} indexName={indexName} />
}
