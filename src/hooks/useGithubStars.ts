import { useEffect, useState } from "react"

const CACHE_TTL_MS = 10 * 60 * 1000

const cache = new Map<string, { count: number; fetchedAt: number }>()
const inFlight = new Map<string, Promise<number>>()

const formatStars = (count: number): string => {
  if (count < 1000) return String(count)
  return `${(count / 1000).toFixed(1).replace(/\.0$/, "")}k`
}

const fetchStars = (repo: string): Promise<number> => {
  const cached = cache.get(repo)
  if (cached && Date.now() - cached.fetchedAt < CACHE_TTL_MS) {
    return Promise.resolve(cached.count)
  }

  const existing = inFlight.get(repo)
  if (existing) return existing

  const request = fetch(`https://api.github.com/repos/${repo}`)
    .then((res) => {
      if (!res.ok) throw new Error(`GitHub API responded ${res.status}`)
      return res.json()
    })
    .then((data) => {
      const count = typeof data.stargazers_count === "number" ? data.stargazers_count : 0
      cache.set(repo, { count, fetchedAt: Date.now() })
      return count
    })
    .finally(() => {
      inFlight.delete(repo)
    })

  inFlight.set(repo, request)
  return request
}

type GithubStars = {
  label: string | null
}

// Renders a plain "star on GitHub" link until the count resolves — the CTA
// never blocks or shows a loading state on an unauthenticated API that can rate-limit.
export const useGithubStars = (repo: string): GithubStars => {
  const [count, setCount] = useState<number | null>(cache.get(repo)?.count ?? null)

  useEffect(() => {
    let cancelled = false
    fetchStars(repo)
      .then((value) => {
        if (!cancelled) setCount(value)
      })
      .catch(() => {
        // Fall back to no count — the star link still works without it.
      })
    return () => {
      cancelled = true
    }
  }, [repo])

  return { label: count === null ? null : formatStars(count) }
}