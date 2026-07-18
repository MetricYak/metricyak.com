import * as React from "react"
import { useGithubStars } from "../hooks/useGithubStars"
import { Button, type ButtonProps } from "./ui/button"
import { cn } from "../lib/utils"

export const GITHUB_REPO = "metricyak/metricyak"

type GithubStarButtonProps = {
  className?: string
  variant?: ButtonProps["variant"]
  size?: ButtonProps["size"]
}

export const GithubStarButton = ({
  className,
  variant = "outline",
  size = "lg",
}: GithubStarButtonProps): React.ReactElement => {
  const { label } = useGithubStars(GITHUB_REPO)

  return (
    <Button asChild variant={variant} size={size} className={cn("group", className)}>
      <a href={`https://github.com/${GITHUB_REPO}`} target="_blank" rel="noopener noreferrer">
        <span className="inline-block transition-transform duration-200 ease-out group-hover:rotate-[24deg] group-hover:scale-125 group-hover:text-yellow motion-reduce:transition-none motion-reduce:group-hover:transform-none">
          ★
        </span>{" "}
        Star on GitHub
        {label && (
          <span className="font-normal opacity-70" aria-label={`${label} stars on GitHub`}>
            {label}
          </span>
        )}
      </a>
    </Button>
  )
}
