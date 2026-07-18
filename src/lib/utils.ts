import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export const cn = (...inputs: ClassValue[]): string => twMerge(clsx(inputs))

const STOPWORDS = new Set(["the", "a", "an", "of"])

export const getInitials = (name: string): string => {
  const words = name.split(/\s+/).filter(Boolean)
  const significant = words.filter((word) => !STOPWORDS.has(word.toLowerCase()))
  const source = significant.length > 0 ? significant : words

  if (source.length === 1) {
    return source[0].slice(0, 2).toUpperCase()
  }
  return (source[0][0] + source[source.length - 1][0]).toUpperCase()
}
