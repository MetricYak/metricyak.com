import * as React from "react"

const GITHUB_URL = "https://github.com/metricyak/metricyak"
const DISCORD_URL = "https://discord.gg/metricyak"

export const Footer = (): React.ReactElement => {
  return (
    <footer className="px-6 py-8 mt-16 border-t-4 border-ink text-sm flex justify-between">
      <span>&copy; {new Date().getFullYear()} MetricYak. Open source, herd-approved.</span>
      <span className="flex gap-4">
        <a href={GITHUB_URL} className="hover:text-mustard">
          GitHub
        </a>
        <a href={DISCORD_URL} className="hover:text-mustard">
          Discord
        </a>
      </span>
    </footer>
  )
}
