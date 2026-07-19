import * as React from "react"
import { GITHUB_REPO } from "./GithubStarButton"

const GITHUB_URL = `https://github.com/${GITHUB_REPO}`

export const AnnouncementBar = (): React.ReactElement => (
  <div className="border-b-[1.5px] border-metricyak-900 bg-yellow text-metricyak-900">
    <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-center gap-x-2.5 gap-y-1 px-4 py-2 text-center text-[13px] font-semibold leading-tight [padding-inline:clamp(1rem,5vw,3.5rem)]">
      <span className="relative flex size-2 shrink-0" aria-hidden="true">
        <span className="absolute inline-flex size-full animate-ping rounded-full bg-brand-orange opacity-75 motion-reduce:animate-none" />
        <span className="relative inline-flex size-2 rounded-full bg-brand-orange" />
      </span>
      <span>Not live yet &mdash; we&rsquo;re still shaving the yak.</span>
      <a
        href={GITHUB_URL}
        target="_blank"
        rel="noopener noreferrer"
        className="font-bold text-metricyak-900 underline decoration-2 underline-offset-2 hover:text-metricyak-700"
      >
        Follow progress on GitHub &rarr;
      </a>
    </div>
  </div>
)
