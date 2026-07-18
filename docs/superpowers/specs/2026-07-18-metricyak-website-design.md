# MetricYak Website — Design Spec

**Date:** 2026-07-18
**Status:** Approved, pending implementation plan

## Purpose

Build the initial version of metricyak.com: the marketing site, documentation, pricing page, and blog for MetricYak, an open-source metrics/analytics platform (metrics, monitors, investigations, autonomous workflows).

## Scope

In scope for this build:
- Home (marketing) page
- Docs section (single version, no versioning)
- Pricing page (static content, no billing integration)
- Blog

Explicitly out of scope for v1 (revisit later if needed):
- Docs versioning (multiple doc versions with a switcher)
- Dynamic/Stripe-integrated pricing or self-serve checkout
- Changelog page
- Dedicated Community page (GitHub/Discord links can still appear in nav/footer as simple links, but no dedicated page/section)

## Architecture & Tech Stack

- **Framework:** Gatsby 4, React, full TypeScript (`.ts`/`.tsx` throughout, including `gatsby-config.ts` and `gatsby-node.ts`)
  - `gatsby-plugin-typescript` for TS/TSX compilation
  - `gatsby-plugin-typegen` for auto-generated types on every GraphQL query
- **Content format:** MDX for docs and blog posts, via `gatsby-plugin-mdx`
- **Styling:** Tailwind CSS
- **Fonts:** Space Grotesk (headings), Inter (body) — free Google Fonts, swappable later for real brand fonts
- **Images:** `gatsby-plugin-image`, `gatsby-plugin-sharp`, `gatsby-transformer-sharp`
- **SEO:** `react-helmet` + `gatsby-plugin-react-helmet` for meta tags (Gatsby 4 predates the Gatsby 5 Head API), `gatsby-plugin-sitemap`
- **Blog feed:** `gatsby-plugin-feed` (RSS)
- **Docs search:** Algolia DocSearch (free tier for open-source docs)
- **Deployment:** Vercel, connected to the GitHub repo, automatic preview deployments per PR

## Repo & Content Structure

```
metricyak.com/
├── content/
│   ├── docs/                  # MDX, one file per doc page, nested folders = nested nav
│   │   ├── getting-started.mdx
│   │   ├── metrics/
│   │   ├── monitors/
│   │   ├── investigations/
│   │   └── workflows/
│   ├── blog/
│   │   └── 2026-07-18-launch-post/
│   │       ├── index.mdx
│   │       └── cover.png
│   └── pricing.json           # tiers, features, copy — structured data, not MDX
├── src/
│   ├── pages/                  # index.tsx (home), pricing.tsx
│   ├── templates/              # doc-page.tsx, blog-post.tsx
│   ├── components/             # Nav.tsx, Footer.tsx, MascotIllustration.tsx, Callout.tsx, PricingCard.tsx, etc.
│   ├── types/                  # shared/manual types (e.g. content shapes authored via Decap)
│   └── styles/
├── static/
│   ├── admin/                  # Decap CMS config.yml + index.html
│   └── images/
├── gatsby-config.ts
├── gatsby-node.ts               # createPages for docs + blog from content/, typed via GatsbyNode<...>
├── tsconfig.json
└── api/                         # Vercel serverless functions (GitHub OAuth handshake for Decap CMS), .ts
```

Content model conventions:
- **Docs nav** is derived from folder structure + frontmatter (`title`, `order`) — no hand-maintained sidebar config
- **Blog posts** use one folder per post so each post can bundle its own images; frontmatter: `{title, date, author, description, cover}`
- **Docs frontmatter:** `{title, order, description}`
- **Pricing** is one structured JSON file (tiers/features/prices) rendered through a single `PricingCard` component — chosen over MDX so Decap CMS can expose it as a clean form rather than freeform prose

## CMS / Editorial Workflow

Decision: **MDX-in-repo + Decap CMS** (over: no-CMS-for-v1, or a hosted headless CMS like Sanity). Chosen because content authorship is a mix of engineers (comfortable with MDX + PRs) and non-technical writers (want a friendlier editing UI), and keeping content in git fits an open-source project's ethos better than an external hosted content service.

- **Admin UI** at `/admin`, configured via `static/admin/config.yml`, defining collections for `docs`, `blog`, and `pricing` mapped to their respective files/folders in `content/`
- **Auth backend:** since hosting is Vercel (not Netlify), Decap's Git Gateway isn't available. Instead, GitHub OAuth is implemented via two small Vercel serverless functions (`api/auth.ts`, `api/callback.ts`) handling the OAuth handshake Decap's `github` backend expects. The GitHub OAuth App is scoped to this repo only.
- **Workflow:** non-technical writers log in via GitHub through the Decap UI and publish through form-based editing, which commits directly to the repo (optionally through Decap's editorial workflow / draft-PR feature for a review step)
- **Engineers** bypass the admin UI and edit MDX/JSON files directly via normal PRs

## Design & Branding

Personality direction (chosen from 3 explored options — mascot/hand-drawn, nerdy terminal, bold brutalist): **Mascot & Hand-Drawn**, in the spirit of PostHog's hedgehog branding.

- **Mascot:** a yak as the recurring character, appearing in the hero, empty states, 404 page, docs sidebar, and loading states. v1 uses placeholder SVG/illustration slots via a `<MascotIllustration variant="..." />` component so real commissioned art can be swapped in later without layout changes.
- **Palette:** warm mustard/gold primary accent against near-black text/background
- **Voice:** playful, dry-witted copy in microcopy (error messages, empty states, docs asides) — but pricing and product documentation stay clear and accurate; playful never means vague, especially in pricing terms
- **Personality touches:** hand-drawn-style dividers/badges, an irreverent 404 page, sticker-like tags for blog categories

No final brand assets (logo, real illustrations, exact palette) exist yet — this build uses placeholder styling that's easy to restyle once real assets are ready.

## Testing & Validation

Intentionally light, matching the nature of a marketing/docs/blog site with no complex business logic:

- **Build verification:** `gatsby build` must succeed as part of the Vercel build step — catches most MDX/frontmatter/GraphQL errors
- **Type checking:** `tsc --noEmit` in CI
- **Manual QA:** golden-path check per page type (home, a docs page, a blog post, pricing) in a real browser after meaningful changes
- No unit/integration test framework introduced for v1 — revisit if interactive components (e.g. a pricing toggle) grow non-trivial logic later

## Open Items / Future Work (explicitly deferred)

- Docs versioning
- Dynamic pricing / Stripe integration
- Changelog page
- Dedicated Community page
- Real brand assets (logo, commissioned mascot illustrations, final palette)
