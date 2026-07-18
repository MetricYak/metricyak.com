# MetricYak Website Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build the initial version of metricyak.com — a Gatsby 4 marketing site, docs, pricing page, and blog for MetricYak, with a mascot/hand-drawn "playful yak" personality and a Decap CMS editorial workflow for non-technical writers.

**Architecture:** A single Gatsby 4 + TypeScript site. Docs and blog posts are MDX files under `content/`, sourced via `gatsby-source-filesystem` and turned into pages at build time by `gatsby-node.ts` (`onCreateNode` tags each MDX node with a `collection` + `slug`, `createPages` creates one page per node from a template). Decap CMS runs as a static admin UI at `/admin` that commits directly to GitHub, authenticated through two small Vercel serverless functions that implement the OAuth handshake (replacing Netlify's Git Gateway, which isn't available on Vercel).

**Tech Stack:** Gatsby ^4.25.0, React 17, TypeScript, Tailwind CSS (via `gatsby-plugin-postcss`), `gatsby-plugin-mdx` v3 (MDX v1 syntax — matches Gatsby 4; v4 of this plugin requires MDX v2 and targets Gatsby 5), Decap CMS (CDN build, no npm dependency), `@docsearch/react` for docs search, Vercel for hosting + serverless functions.

## Global Constraints

- Gatsby major version is pinned to 4.x everywhere (`"gatsby": "^4.25.0"` — never let this float to 5.x)
- Full TypeScript: every file under `src/`, plus `gatsby-config.ts` and `gatsby-node.ts`, is `.ts`/`.tsx`
- Content format is MDX for docs and blog; pricing is structured JSON, not MDX
- Docs have a single version — no version switcher, no `/docs/v1/`-style paths
- Pricing page is static content only — no Stripe/billing integration, no dynamic pricing
- v1 site sections are exactly: Home, Docs, Pricing, Blog (no Changelog page, no dedicated Community page — GitHub/Discord links may appear as plain links in the footer)
- Brand personality is "Mascot & Hand-Drawn": a yak mascot, warm mustard/gold accent against near-black, playful/dry-witted copy in microcopy, but clear and accurate copy in docs/pricing
- Fonts: Space Grotesk for headings, Inter for body (Google Fonts)
- CMS is Decap CMS with a `github` backend and a custom OAuth provider (two Vercel serverless functions) — not Git Gateway, not a hosted headless CMS
- Deployment target is Vercel
- No unit/integration test framework is introduced in this plan (per spec — this is a low-logic marketing/docs/blog site). Validation per task is: `npx tsc --noEmit` (type check), `npm run build` (Gatsby build succeeds), and a manual browser check of the specific behavior the task adds
- GraphQL `sort` arguments use **Gatsby 4 syntax** (`sort: { fields: [frontmatter___x], order: ASC }`), not the Gatsby 5 nested-object syntax — mixing these will cause query errors

---

### Task 1: Project Initialization & TypeScript Setup

**Files:**
- Create: `package.json`
- Create: `gatsby-config.ts`
- Create: `gatsby-node.ts`
- Create: `tsconfig.json`
- Create: `src/pages/index.tsx` (temporary placeholder, replaced in Task 7)
- Create: `.gitignore` additions for Gatsby (`/.cache`, `/public`, `/node_modules`)

**Interfaces:**
- Produces: `gatsby-config.ts` exporting a `GatsbyConfig` object that later tasks extend by adding entries to `plugins: []`
- Produces: `gatsby-node.ts` exporting named Gatsby Node APIs (`onCreateNode`, `createPages`) that later tasks add to
- Produces: `tsconfig.json` with `"include": ["./src/**/*", "./gatsby-config.ts", "./gatsby-node.ts"]`

- [ ] **Step 1: Create `package.json`**

```json
{
  "name": "metricyak-website",
  "version": "1.0.0",
  "private": true,
  "description": "Official docs and website for MetricYak",
  "scripts": {
    "develop": "gatsby develop",
    "build": "gatsby build",
    "serve": "gatsby serve",
    "clean": "gatsby clean",
    "typecheck": "tsc --noEmit"
  },
  "dependencies": {
    "gatsby": "^4.25.0",
    "gatsby-plugin-image": "^2.25.0",
    "gatsby-plugin-sharp": "^4.25.0",
    "gatsby-transformer-sharp": "^4.25.0",
    "react": "^17.0.2",
    "react-dom": "^17.0.2"
  },
  "devDependencies": {
    "gatsby-plugin-typescript": "^4.25.0",
    "typescript": "^5.3.3"
  }
}
```

- [ ] **Step 2: Install dependencies**

Run: `npm install`
Expected: installs without errors, creates `package-lock.json` and `node_modules/`

- [ ] **Step 3: Create `tsconfig.json`**

```json
{
  "compilerOptions": {
    "target": "ES2020",
    "module": "commonjs",
    "moduleResolution": "node",
    "jsx": "react",
    "strict": true,
    "esModuleInterop": true,
    "skipLibCheck": true,
    "forceConsistentCasingInFileNames": true,
    "resolveJsonModule": true,
    "noEmit": true
  },
  "include": ["./src/**/*", "./gatsby-config.ts", "./gatsby-node.ts"],
  "exclude": ["node_modules", "public", ".cache"]
}
```

- [ ] **Step 4: Create `gatsby-config.ts`**

```typescript
import type { GatsbyConfig } from "gatsby"

const config: GatsbyConfig = {
  siteMetadata: {
    title: `MetricYak`,
    description: `Open-source metrics, monitors, investigations, and autonomous workflows.`,
    siteUrl: `https://metricyak.com`,
  },
  graphqlTypegen: true,
  plugins: [`gatsby-plugin-typescript`, `gatsby-plugin-image`, `gatsby-plugin-sharp`, `gatsby-transformer-sharp`],
}

export default config
```

- [ ] **Step 5: Create `gatsby-node.ts` with an empty scaffold later tasks extend**

```typescript
import type { GatsbyNode } from "gatsby"

export const onCreateNode: GatsbyNode["onCreateNode"] = () => {
  // Extended in Task 4 (tags Mdx nodes with collection + slug)
}

export const createPages: GatsbyNode["createPages"] = async () => {
  // Extended in Task 5 (docs) and Task 6 (blog)
}
```

- [ ] **Step 6: Create a temporary placeholder home page so the build has at least one page**

```tsx
// src/pages/index.tsx
import * as React from "react"

const IndexPage = (): React.ReactElement => {
  return <main>MetricYak — under construction</main>
}

export default IndexPage
```

- [ ] **Step 7: Add Gatsby's own ignore entries to `.gitignore`**

Append to the existing `.gitignore`:

```
# Gatsby
.cache/
public/
node_modules/
.env.*
!.env.example
```

- [ ] **Step 8: Verify the build**

Run: `npx tsc --noEmit`
Expected: no output, exit code 0

Run: `npm run build`
Expected: `gatsby build` completes successfully, reports 1 page built (`/`)

- [ ] **Step 9: Commit**

```bash
git add package.json package-lock.json tsconfig.json gatsby-config.ts gatsby-node.ts src/pages/index.tsx .gitignore
git commit -m "chore: scaffold Gatsby 4 + TypeScript project"
```

---

### Task 2: Tailwind CSS & Fonts

**Files:**
- Modify: `package.json` (add `gatsby-plugin-postcss`, `postcss`, `tailwindcss`, `autoprefixer`)
- Modify: `gatsby-config.ts` (register `gatsby-plugin-postcss`, add Google Fonts `<link>` via `gatsby-plugin-google-fonts` alternative — using a static `<link>` in a root `Html` wrapper instead, see below)
- Create: `postcss.config.js`
- Create: `tailwind.config.js`
- Create: `src/styles/global.css`
- Create: `gatsby-browser.ts`
- Create: `gatsby-ssr.tsx` (injects the Google Fonts `<link>` into `<head>`)

**Interfaces:**
- Produces: `src/styles/global.css` imported once via `gatsby-browser.ts`, available to every page/component through Tailwind utility classes
- Produces: Tailwind theme colors `mustard` (`#FFC531`) and `ink` (`#111111`) usable as `bg-mustard`, `text-ink`, etc. in later components

- [ ] **Step 1: Add dependencies to `package.json`**

Add to `devDependencies`:

```json
"gatsby-plugin-postcss": "^5.25.0",
"postcss": "^8.4.33",
"tailwindcss": "^3.4.1",
"autoprefixer": "^10.4.17"
```

Run: `npm install`

- [ ] **Step 2: Create `postcss.config.js`**

```javascript
module.exports = () => ({
  plugins: [require("tailwindcss"), require("autoprefixer")],
})
```

- [ ] **Step 3: Create `tailwind.config.js`**

```javascript
/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        mustard: "#FFC531",
        ink: "#111111",
      },
      fontFamily: {
        heading: ["Space Grotesk", "sans-serif"],
        body: ["Inter", "sans-serif"],
      },
    },
  },
  plugins: [],
}
```

- [ ] **Step 4: Create `src/styles/global.css`**

```css
@tailwind base;
@tailwind components;
@tailwind utilities;

body {
  @apply font-body text-ink bg-white;
}

h1,
h2,
h3,
h4 {
  @apply font-heading;
}
```

- [ ] **Step 5: Create `gatsby-browser.ts` to import the global stylesheet**

```typescript
import type { GatsbyBrowser } from "gatsby"
import "./src/styles/global.css"

export const onClientEntry: GatsbyBrowser["onClientEntry"] = () => {}
```

- [ ] **Step 6: Create `gatsby-ssr.tsx` to load Space Grotesk + Inter from Google Fonts**

```tsx
import * as React from "react"
import type { GatsbySSR } from "gatsby"

export const onRenderBody: GatsbySSR["onRenderBody"] = ({ setHeadComponents }) => {
  setHeadComponents([
    <link key="preconnect-gstatic" rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />,
    <link
      key="fonts"
      rel="stylesheet"
      href="https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@500;700&family=Inter:wght@400;500&display=swap"
    />,
  ])
}
```

- [ ] **Step 7: Register `gatsby-plugin-postcss` in `gatsby-config.ts`**

```diff
   plugins: [
     `gatsby-plugin-typescript`,
+    `gatsby-plugin-postcss`,
     `gatsby-plugin-image`,
     `gatsby-plugin-sharp`,
     `gatsby-transformer-sharp`,
   ],
```

- [ ] **Step 8: Verify Tailwind is applied**

Update `src/pages/index.tsx` temporarily to use a Tailwind class:

```tsx
import * as React from "react"

const IndexPage = (): React.ReactElement => {
  return <main className="text-mustard font-heading text-3xl">MetricYak — under construction</main>
}

export default IndexPage
```

Run: `npm run develop`
Expected: dev server starts; visiting `http://localhost:8000/` shows large mustard-colored heading text in Space Grotesk

Run: `npx tsc --noEmit`
Expected: no output, exit code 0

- [ ] **Step 9: Commit**

```bash
git add package.json package-lock.json postcss.config.js tailwind.config.js src/styles/global.css gatsby-browser.ts gatsby-ssr.tsx gatsby-config.ts src/pages/index.tsx
git commit -m "feat: add Tailwind CSS and Space Grotesk/Inter fonts"
```

---

### Task 3: Shared Layout Components

**Files:**
- Create: `src/components/Seo.tsx`
- Create: `src/components/MascotIllustration.tsx`
- Create: `src/components/Nav.tsx`
- Create: `src/components/Footer.tsx`
- Create: `src/components/Layout.tsx`
- Modify: `package.json` (add `react-helmet`, `gatsby-plugin-react-helmet`, `@types/react-helmet`)
- Modify: `gatsby-config.ts` (register `gatsby-plugin-react-helmet`)

**Interfaces:**
- Produces: `Seo` component — `<Seo title={string} description?={string} />`, renders `<title>` and meta tags via `react-helmet`
- Produces: `MascotIllustration` component — `<MascotIllustration variant="wave" | "shrug" | "magnify" | "sleep" className?={string} />`, renders a placeholder inline SVG yak silhouette (swappable for real art later without changing call sites)
- Produces: `Layout` component — `<Layout><...content/></Layout>`, wraps children with `Nav` + `Footer` + consistent page container
- Consumes: Tailwind classes/theme from Task 2, Google Fonts from Task 2

- [ ] **Step 1: Add `react-helmet` dependencies to `package.json`**

Add to `dependencies`: `"react-helmet": "^6.1.0"`
Add to `devDependencies`: `"gatsby-plugin-react-helmet": "^5.25.0"`, `"@types/react-helmet": "^6.1.11"`

Run: `npm install`

- [ ] **Step 2: Register the plugin in `gatsby-config.ts`**

```diff
   plugins: [
     `gatsby-plugin-typescript`,
     `gatsby-plugin-postcss`,
+    `gatsby-plugin-react-helmet`,
     `gatsby-plugin-image`,
     `gatsby-plugin-sharp`,
     `gatsby-transformer-sharp`,
   ],
```

- [ ] **Step 3: Create `src/components/Seo.tsx`**

```tsx
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
```

- [ ] **Step 4: Create `src/components/MascotIllustration.tsx`**

```tsx
import * as React from "react"

export type MascotVariant = "wave" | "shrug" | "magnify" | "sleep"

type MascotIllustrationProps = {
  variant: MascotVariant
  className?: string
}

const MASCOT_LABELS: Record<MascotVariant, string> = {
  wave: "Yak waving hello",
  shrug: "Yak shrugging, unsure what happened",
  magnify: "Yak investigating with a magnifying glass",
  sleep: "Yak asleep, nothing to report",
}

/**
 * Placeholder yak silhouette. Swap the <svg> body for commissioned art later —
 * the variant prop and call sites stay the same.
 */
export const MascotIllustration = ({ variant, className }: MascotIllustrationProps): React.ReactElement => {
  return (
    <svg
      role="img"
      aria-label={MASCOT_LABELS[variant]}
      viewBox="0 0 120 120"
      className={className}
      xmlns="http://www.w3.org/2000/svg"
    >
      <circle cx="60" cy="60" r="56" fill="#FFC531" />
      <ellipse cx="60" cy="70" rx="30" ry="22" fill="#111111" />
      <circle cx="60" cy="42" r="20" fill="#111111" />
      <circle cx="52" cy="40" r="3" fill="#FFC531" />
      <circle cx="68" cy="40" r="3" fill="#FFC531" />
    </svg>
  )
}
```

- [ ] **Step 5: Create `src/components/Nav.tsx`**

```tsx
import * as React from "react"
import { Link } from "gatsby"

const NAV_LINKS: Array<{ label: string; to: string }> = [
  { label: "Docs", to: "/docs/getting-started/" },
  { label: "Pricing", to: "/pricing/" },
  { label: "Blog", to: "/blog/" },
]

export const Nav = (): React.ReactElement => {
  return (
    <header className="flex items-center justify-between px-6 py-4 border-b-4 border-ink">
      <Link to="/" className="font-heading text-xl font-bold">
        MetricYak
      </Link>
      <nav className="flex gap-6">
        {NAV_LINKS.map((link) => (
          <Link key={link.to} to={link.to} className="font-medium hover:text-mustard">
            {link.label}
          </Link>
        ))}
      </nav>
    </header>
  )
}
```

- [ ] **Step 6: Create `src/components/Footer.tsx`**

```tsx
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
```

- [ ] **Step 7: Create `src/components/Layout.tsx`**

```tsx
import * as React from "react"
import { Nav } from "./Nav"
import { Footer } from "./Footer"

type LayoutProps = {
  children: React.ReactNode
}

export const Layout = ({ children }: LayoutProps): React.ReactElement => {
  return (
    <div className="min-h-screen flex flex-col">
      <Nav />
      <main className="flex-1 px-6 py-12 max-w-4xl mx-auto w-full">{children}</main>
      <Footer />
    </div>
  )
}
```

- [ ] **Step 8: Wire the placeholder home page through `Layout` + `Seo` to verify everything renders together**

```tsx
// src/pages/index.tsx
import * as React from "react"
import { Layout } from "../components/Layout"
import { Seo } from "../components/Seo"
import { MascotIllustration } from "../components/MascotIllustration"

const IndexPage = (): React.ReactElement => {
  return (
    <Layout>
      <Seo title="Home" />
      <MascotIllustration variant="wave" className="w-24 h-24" />
      <h1 className="text-3xl font-bold mt-4">MetricYak — under construction</h1>
    </Layout>
  )
}

export default IndexPage
```

- [ ] **Step 9: Verify**

Run: `npx tsc --noEmit`
Expected: no output, exit code 0

Run: `npm run develop`
Expected: `http://localhost:8000/` shows the nav bar (MetricYak / Docs / Pricing / Blog), a yak icon, the heading, and the footer with GitHub/Discord links. Browser tab title reads "Home · MetricYak".

- [ ] **Step 10: Commit**

```bash
git add package.json package-lock.json gatsby-config.ts src/components src/pages/index.tsx
git commit -m "feat: add Seo, MascotIllustration, Nav, Footer, and Layout components"
```

---

### Task 4: MDX Content Sourcing

**Files:**
- Modify: `package.json` (add `gatsby-plugin-mdx@^3.20.0`, `@mdx-js/react@^1.6.22`, `gatsby-source-filesystem@^4.25.0`)
- Modify: `gatsby-config.ts` (register `gatsby-source-filesystem` twice — once for `content/docs`, once for `content/blog` — and `gatsby-plugin-mdx`)
- Modify: `gatsby-node.ts` (implement `onCreateNode` to tag every `Mdx` node with `fields.collection` and `fields.slug`)
- Create: `content/docs/getting-started.mdx` (real placeholder content, used to verify sourcing works)

**Interfaces:**
- Produces: every `Mdx` node gets `fields.collection` (`"docs"` or `"blog"`) and `fields.slug` (e.g. `/docs/getting-started/`) — Task 5 and Task 6 query on these fields
- Consumes: none beyond Task 1's `gatsby-node.ts` scaffold

- [ ] **Step 1: Add dependencies to `package.json`**

Add to `dependencies`: `"gatsby-plugin-mdx": "^3.20.0"`, `"@mdx-js/react": "^1.6.22"`, `"gatsby-source-filesystem": "^4.25.0"`

Run: `npm install`

- [ ] **Step 2: Register the source + MDX plugins in `gatsby-config.ts`**

```diff
   plugins: [
     `gatsby-plugin-typescript`,
     `gatsby-plugin-postcss`,
     `gatsby-plugin-react-helmet`,
     `gatsby-plugin-image`,
     `gatsby-plugin-sharp`,
     `gatsby-transformer-sharp`,
+    `gatsby-plugin-mdx`,
+    {
+      resolve: `gatsby-source-filesystem`,
+      options: {
+        name: `docs`,
+        path: `${__dirname}/content/docs`,
+      },
+    },
+    {
+      resolve: `gatsby-source-filesystem`,
+      options: {
+        name: `blog`,
+        path: `${__dirname}/content/blog`,
+      },
+    },
   ],
```

- [ ] **Step 3: Create the first real docs page, `content/docs/getting-started.mdx`**

```mdx
---
title: "Getting Started"
order: 0
description: "Set up MetricYak and define your first metric."
---

# Getting Started

MetricYak tracks the metrics you tell it to watch, fires monitors when
those metrics cross a threshold you define, and helps you figure out
**why** — automatically.

## 1. Define a metric

A metric is any number you want to track over time: signups, checkout
conversion, API latency, whatever moves your business.

## 2. Define a monitor

A monitor watches a metric and fires when it crosses a threshold you set —
a spike, a drop, or just "outside the usual range."

## 3. Let it investigate

When a monitor fires, MetricYak kicks off an investigation: when it
changed, where it changed, and — as far as an autonomous workflow can
tell you — why.
```

- [ ] **Step 4: Implement `onCreateNode` in `gatsby-node.ts`**

```typescript
import type { GatsbyNode } from "gatsby"
import { createFilePath } from "gatsby-source-filesystem"

export const onCreateNode: GatsbyNode["onCreateNode"] = ({ node, getNode, actions }) => {
  const { createNodeField } = actions

  if (node.internal.type !== "Mdx") {
    return
  }

  const parent = getNode(node.parent as string)
  const sourceInstanceName = parent?.sourceInstanceName as string | undefined

  if (sourceInstanceName === "docs") {
    const relativePath = createFilePath({ node, getNode })
    createNodeField({ node, name: "collection", value: "docs" })
    createNodeField({ node, name: "slug", value: `/docs${relativePath}` })
  }

  if (sourceInstanceName === "blog") {
    const relativePath = createFilePath({ node, getNode })
    createNodeField({ node, name: "collection", value: "blog" })
    createNodeField({ node, name: "slug", value: `/blog${relativePath}` })
  }
}

export const createPages: GatsbyNode["createPages"] = async () => {
  // Extended in Task 5 (docs) and Task 6 (blog)
}
```

- [ ] **Step 5: Verify sourcing works via the GraphiQL explorer**

Run: `npm run develop`

Visit `http://localhost:8000/___graphql` and run:

```graphql
query {
  allMdx {
    nodes {
      fields {
        collection
        slug
      }
      frontmatter {
        title
      }
    }
  }
}
```

Expected: one result, `fields.collection: "docs"`, `fields.slug: "/docs/getting-started/"`, `frontmatter.title: "Getting Started"`

Run: `npx tsc --noEmit`
Expected: no output, exit code 0

- [ ] **Step 6: Commit**

```bash
git add package.json package-lock.json gatsby-config.ts gatsby-node.ts content/docs/getting-started.mdx
git commit -m "feat: source docs/blog MDX and tag nodes with collection + slug"
```

---

### Task 5: Docs Content Pipeline

**Files:**
- Create: `src/templates/doc-page.tsx`
- Create: `src/components/DocsSidebar.tsx`
- Modify: `gatsby-node.ts` (implement `createPages` for docs)
- Create: `content/docs/metrics/index.mdx`
- Create: `content/docs/monitors/index.mdx`
- Create: `content/docs/investigations/index.mdx`
- Create: `content/docs/workflows/index.mdx`

**Interfaces:**
- Consumes: `fields.collection` / `fields.slug` from Task 4, `Layout`/`Seo` from Task 3
- Produces: one page per docs `Mdx` node at its `fields.slug`, rendered through `doc-page.tsx`, with a left sidebar (`DocsSidebar`) listing all docs pages ordered by `frontmatter.order`

- [ ] **Step 1: Create the remaining docs content**

```mdx
<!-- content/docs/metrics/index.mdx -->
---
title: "Metrics"
order: 1
description: "Define the numbers MetricYak should track."
---

# Metrics

A metric is a named, timestamped number: `checkout.conversion`,
`api.p95_latency`, `signups.daily`. MetricYak ingests metric values from
your existing pipelines and stores them so monitors can watch them.
```

```mdx
<!-- content/docs/monitors/index.mdx -->
---
title: "Monitors"
order: 2
description: "Fire alerts when a metric crosses a threshold."
---

# Monitors

A monitor watches one metric and fires when it crosses a threshold you
configure — a hard limit, a percentage change, or a statistical
deviation from the recent baseline.
```

```mdx
<!-- content/docs/investigations/index.mdx -->
---
title: "Investigations"
order: 3
description: "See when, where, and why a metric changed."
---

# Investigations

When a monitor fires, MetricYak opens an investigation: the exact
moment the metric changed, which dimensions (region, plan, version)
are implicated, and correlated events nearby in time.
```

```mdx
<!-- content/docs/workflows/index.mdx -->
---
title: "Autonomous Workflows"
order: 4
description: "Let MetricYak act on what an investigation finds."
---

# Autonomous Workflows

Workflows turn an investigation's findings into action — filing a
ticket, posting a summary to chat, or running a follow-up query —
without a human needing to kick it off manually.
```

- [ ] **Step 2: Implement `createPages` for docs in `gatsby-node.ts`**

```diff
+import path from "path"
 import type { GatsbyNode } from "gatsby"
 import { createFilePath } from "gatsby-source-filesystem"

 export const onCreateNode: GatsbyNode["onCreateNode"] = ({ node, getNode, actions }) => {
   ...
 }

 export const createPages: GatsbyNode["createPages"] = async ({ graphql, actions, reporter }) => {
-  // Extended in Task 5 (docs) and Task 6 (blog)
+  const { createPage } = actions
+
+  const result = await graphql<{
+    allMdx: {
+      nodes: Array<{
+        id: string
+        fields: { collection: string; slug: string }
+      }>
+    }
+  }>(`
+    query AllDocsPages {
+      allMdx(filter: { fields: { collection: { eq: "docs" } } }) {
+        nodes {
+          id
+          fields {
+            collection
+            slug
+          }
+        }
+      }
+    }
+  `)
+
+  if (result.errors) {
+    reporter.panicOnBuild("Error loading docs MDX for page creation", result.errors)
+    return
+  }
+
+  const docsNodes = result.data?.allMdx.nodes ?? []
+
+  docsNodes.forEach((node) => {
+    createPage({
+      path: node.fields.slug,
+      component: path.resolve("./src/templates/doc-page.tsx"),
+      context: { id: node.id },
+    })
+  })
 }
```

- [ ] **Step 3: Create `src/components/DocsSidebar.tsx`**

```tsx
import * as React from "react"
import { Link, useStaticQuery, graphql } from "gatsby"

type DocsSidebarQueryResult = {
  allMdx: {
    nodes: Array<{
      fields: { slug: string }
      frontmatter: { title: string; order: number }
    }>
  }
}

export const DocsSidebar = ({ currentSlug }: { currentSlug: string }): React.ReactElement => {
  const data = useStaticQuery<DocsSidebarQueryResult>(graphql`
    query DocsSidebarQuery {
      allMdx(filter: { fields: { collection: { eq: "docs" } } }, sort: { fields: [frontmatter___order], order: ASC }) {
        nodes {
          fields {
            slug
          }
          frontmatter {
            title
            order
          }
        }
      }
    }
  `)

  return (
    <nav aria-label="Docs navigation" className="w-56 shrink-0 pr-6 border-r-2 border-ink">
      <ul className="space-y-2">
        {data.allMdx.nodes.map((node) => (
          <li key={node.fields.slug}>
            <Link
              to={node.fields.slug}
              className={node.fields.slug === currentSlug ? "font-bold text-mustard" : "hover:text-mustard"}
            >
              {node.frontmatter.title}
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  )
}
```

- [ ] **Step 4: Create `src/templates/doc-page.tsx`**

```tsx
import * as React from "react"
import { graphql, PageProps } from "gatsby"
import { MDXRenderer } from "gatsby-plugin-mdx"
import { Layout } from "../components/Layout"
import { Seo } from "../components/Seo"
import { DocsSidebar } from "../components/DocsSidebar"

type DocPageQueryResult = {
  mdx: {
    body: string
    fields: { slug: string }
    frontmatter: { title: string; description: string }
  }
}

const DocPageTemplate = ({ data }: PageProps<DocPageQueryResult>): React.ReactElement => {
  const { mdx } = data

  return (
    <Layout>
      <Seo title={mdx.frontmatter.title} description={mdx.frontmatter.description} />
      <div className="flex gap-8">
        <DocsSidebar currentSlug={mdx.fields.slug} />
        <article className="prose max-w-none flex-1">
          <MDXRenderer>{mdx.body}</MDXRenderer>
        </article>
      </div>
    </Layout>
  )
}

export default DocPageTemplate

export const query = graphql`
  query DocPageQuery($id: String!) {
    mdx(id: { eq: $id }) {
      body
      fields {
        slug
      }
      frontmatter {
        title
        description
      }
    }
  }
`
```

- [ ] **Step 5: Verify**

Run: `npx tsc --noEmit`
Expected: no output, exit code 0

Run: `npm run build`
Expected: build succeeds; output lists 5 docs pages (`/docs/getting-started/`, `/docs/metrics/`, `/docs/monitors/`, `/docs/investigations/`, `/docs/workflows/`)

Run: `npm run develop`, visit `http://localhost:8000/docs/metrics/`
Expected: page renders the Metrics doc content, sidebar shows all 5 docs links in `order` sequence, current page is bolded/mustard-colored

- [ ] **Step 6: Commit**

```bash
git add gatsby-node.ts src/templates/doc-page.tsx src/components/DocsSidebar.tsx content/docs
git commit -m "feat: generate docs pages with an ordered sidebar"
```

---

### Task 6: Blog Content Pipeline

**Files:**
- Create: `src/templates/blog-post.tsx`
- Create: `src/pages/blog.tsx` (blog index/listing page)
- Modify: `gatsby-node.ts` (extend `createPages` to also create blog post pages)
- Create: `content/blog/2026-07-18-launch-post/index.mdx`

**Interfaces:**
- Consumes: `fields.collection` / `fields.slug` from Task 4, `Layout`/`Seo` from Task 3
- Produces: one page per blog `Mdx` node at its `fields.slug`, rendered through `blog-post.tsx`; `/blog/` lists all posts newest-first

- [ ] **Step 1: Create the launch blog post**

```mdx
<!-- content/blog/2026-07-18-launch-post/index.mdx -->
---
title: "Say hello to MetricYak"
date: "2026-07-18"
author: "The MetricYak Team"
description: "Why we built an open-source metrics platform with monitors that investigate themselves."
---

Metrics dashboards tell you *what* changed. They rarely tell you *why*.

MetricYak is an open-source platform for defining metrics, setting
monitors that fire when those metrics move, and getting an actual
investigation into when, where, and why — plus autonomous workflows
that can act on what they find.

We're just getting started. Follow along in the [docs](/docs/getting-started/).
```

- [ ] **Step 2: Extend `createPages` in `gatsby-node.ts` to also build blog pages**

```diff
 export const createPages: GatsbyNode["createPages"] = async ({ graphql, actions, reporter }) => {
   const { createPage } = actions

   const result = await graphql<{
     allMdx: {
       nodes: Array<{
         id: string
         fields: { collection: string; slug: string }
       }>
     }
   }>(`
     query AllDocsPages {
       allMdx(filter: { fields: { collection: { eq: "docs" } } }) {
         nodes {
           id
           fields {
             collection
             slug
           }
         }
       }
     }
   `)

   if (result.errors) {
     reporter.panicOnBuild("Error loading docs MDX for page creation", result.errors)
     return
   }

   const docsNodes = result.data?.allMdx.nodes ?? []

   docsNodes.forEach((node) => {
     createPage({
       path: node.fields.slug,
       component: path.resolve("./src/templates/doc-page.tsx"),
       context: { id: node.id },
     })
   })
+
+  const blogResult = await graphql<{
+    allMdx: {
+      nodes: Array<{
+        id: string
+        fields: { collection: string; slug: string }
+      }>
+    }
+  }>(`
+    query AllBlogPages {
+      allMdx(filter: { fields: { collection: { eq: "blog" } } }) {
+        nodes {
+          id
+          fields {
+            collection
+            slug
+          }
+        }
+      }
+    }
+  `)
+
+  if (blogResult.errors) {
+    reporter.panicOnBuild("Error loading blog MDX for page creation", blogResult.errors)
+    return
+  }
+
+  const blogNodes = blogResult.data?.allMdx.nodes ?? []
+
+  blogNodes.forEach((node) => {
+    createPage({
+      path: node.fields.slug,
+      component: path.resolve("./src/templates/blog-post.tsx"),
+      context: { id: node.id },
+    })
+  })
 }
```

- [ ] **Step 3: Create `src/templates/blog-post.tsx`**

```tsx
import * as React from "react"
import { graphql, PageProps } from "gatsby"
import { MDXRenderer } from "gatsby-plugin-mdx"
import { Layout } from "../components/Layout"
import { Seo } from "../components/Seo"

type BlogPostQueryResult = {
  mdx: {
    body: string
    frontmatter: {
      title: string
      date: string
      author: string
      description: string
    }
  }
}

const BlogPostTemplate = ({ data }: PageProps<BlogPostQueryResult>): React.ReactElement => {
  const { mdx } = data

  return (
    <Layout>
      <Seo title={mdx.frontmatter.title} description={mdx.frontmatter.description} />
      <article className="prose max-w-none">
        <p className="text-sm uppercase tracking-wide">
          {mdx.frontmatter.date} · {mdx.frontmatter.author}
        </p>
        <h1>{mdx.frontmatter.title}</h1>
        <MDXRenderer>{mdx.body}</MDXRenderer>
      </article>
    </Layout>
  )
}

export default BlogPostTemplate

export const query = graphql`
  query BlogPostQuery($id: String!) {
    mdx(id: { eq: $id }) {
      body
      frontmatter {
        title
        date(formatString: "MMMM D, YYYY")
        author
        description
      }
    }
  }
`
```

- [ ] **Step 4: Create `src/pages/blog.tsx` (listing page)**

```tsx
import * as React from "react"
import { graphql, Link, PageProps } from "gatsby"
import { Layout } from "../components/Layout"
import { Seo } from "../components/Seo"

type BlogIndexQueryResult = {
  allMdx: {
    nodes: Array<{
      fields: { slug: string }
      frontmatter: { title: string; date: string; description: string }
    }>
  }
}

const BlogIndexPage = ({ data }: PageProps<BlogIndexQueryResult>): React.ReactElement => {
  return (
    <Layout>
      <Seo title="Blog" description="Updates and notes from the MetricYak team." />
      <h1 className="text-3xl font-bold mb-8">Blog</h1>
      <ul className="space-y-8">
        {data.allMdx.nodes.map((node) => (
          <li key={node.fields.slug}>
            <Link to={node.fields.slug} className="text-xl font-heading font-bold hover:text-mustard">
              {node.frontmatter.title}
            </Link>
            <p className="text-sm uppercase tracking-wide mt-1">{node.frontmatter.date}</p>
            <p className="mt-2">{node.frontmatter.description}</p>
          </li>
        ))}
      </ul>
    </Layout>
  )
}

export default BlogIndexPage

export const query = graphql`
  query BlogIndexQuery {
    allMdx(filter: { fields: { collection: { eq: "blog" } } }, sort: { fields: [frontmatter___date], order: DESC }) {
      nodes {
        fields {
          slug
        }
        frontmatter {
          title
          date(formatString: "MMMM D, YYYY")
          description
        }
      }
    }
  }
`
```

- [ ] **Step 5: Verify**

Run: `npx tsc --noEmit`
Expected: no output, exit code 0

Run: `npm run build`
Expected: build succeeds; output additionally lists `/blog/` and `/blog/2026-07-18-launch-post/`

Run: `npm run develop`, visit `http://localhost:8000/blog/`
Expected: shows the launch post title, date, description; clicking through renders the full post at `/blog/2026-07-18-launch-post/`

- [ ] **Step 6: Commit**

```bash
git add gatsby-node.ts src/templates/blog-post.tsx src/pages/blog.tsx content/blog
git commit -m "feat: generate blog post pages and a blog index listing"
```

---

### Task 7: Home Page

**Files:**
- Modify: `src/pages/index.tsx` (replace placeholder with real marketing content)

**Interfaces:**
- Consumes: `Layout`, `Seo`, `MascotIllustration` from Task 3

- [ ] **Step 1: Write the real home page**

```tsx
import * as React from "react"
import { Link } from "gatsby"
import { Layout } from "../components/Layout"
import { Seo } from "../components/Seo"
import { MascotIllustration } from "../components/MascotIllustration"

const IndexPage = (): React.ReactElement => {
  return (
    <Layout>
      <Seo title="Metrics that don't leave you guessing" />
      <section className="flex flex-col items-center text-center gap-6 py-12">
        <MascotIllustration variant="wave" className="w-32 h-32" />
        <h1 className="text-4xl font-bold max-w-2xl">
          Metrics that fire, monitors that notice, and a yak that tells you why.
        </h1>
        <p className="max-w-xl text-lg">
          MetricYak is an open-source platform for defining metrics, setting monitors that fire when they move, and
          getting a real investigation into when, where, and why — plus autonomous workflows that act on it.
        </p>
        <div className="flex gap-4 mt-4">
          <Link to="/docs/getting-started/" className="px-6 py-3 bg-mustard font-bold border-2 border-ink">
            Get Started
          </Link>
          <Link to="/pricing/" className="px-6 py-3 border-2 border-ink font-bold hover:bg-mustard">
            See Pricing
          </Link>
        </div>
      </section>

      <section className="grid grid-cols-1 md:grid-cols-3 gap-8 py-12">
        <div>
          <h2 className="text-xl font-bold mb-2">Metrics</h2>
          <p>Track the numbers that matter — conversion, latency, signups — from your existing pipelines.</p>
        </div>
        <div>
          <h2 className="text-xl font-bold mb-2">Monitors</h2>
          <p>Fire the moment a metric crosses a threshold you define, not an arbitrary system default.</p>
        </div>
        <div>
          <h2 className="text-xl font-bold mb-2">Investigations</h2>
          <p>Get when, where, and why a metric changed — automatically, before anyone has to ask.</p>
        </div>
      </section>
    </Layout>
  )
}

export default IndexPage
```

- [ ] **Step 2: Verify**

Run: `npx tsc --noEmit`
Expected: no output, exit code 0

Run: `npm run develop`, visit `http://localhost:8000/`
Expected: hero section with waving yak, headline, description, "Get Started" and "See Pricing" buttons that link to `/docs/getting-started/` and `/pricing/`; three-column feature summary below

- [ ] **Step 3: Commit**

```bash
git add src/pages/index.tsx
git commit -m "feat: write the real MetricYak home page"
```

---

### Task 8: Pricing Page

**Files:**
- Create: `content/pricing.json`
- Create: `src/components/PricingCard.tsx`
- Create: `src/pages/pricing.tsx`
- Create: `src/types/pricing.ts`

**Interfaces:**
- Produces: `Tier` type (in `src/types/pricing.ts`) — `{ id, name, price, tagline, features: string[], cta: { label, href }, highlighted?: boolean }`
- Produces: `PricingCard` component — `<PricingCard tier={Tier} />`

- [ ] **Step 1: Create `src/types/pricing.ts`**

```typescript
export type PricingCta = {
  label: string
  href: string
}

export type Tier = {
  id: string
  name: string
  price: string
  tagline: string
  features: string[]
  cta: PricingCta
  highlighted?: boolean
}

export type PricingData = {
  tiers: Tier[]
}
```

- [ ] **Step 2: Create `content/pricing.json`**

```json
{
  "tiers": [
    {
      "id": "starter",
      "name": "Starter",
      "price": "Free",
      "tagline": "For solo builders herding their first few metrics.",
      "features": ["Up to 10 metrics", "Up to 5 monitors", "Community support"],
      "cta": { "label": "Get Started", "href": "https://github.com/metricyak/metricyak" }
    },
    {
      "id": "team",
      "name": "Team",
      "price": "$49/mo",
      "tagline": "For teams who want monitors that investigate themselves.",
      "features": [
        "Unlimited metrics",
        "Unlimited monitors",
        "Autonomous investigations",
        "Email support"
      ],
      "cta": { "label": "Start Trial", "href": "mailto:hello@metricyak.com" },
      "highlighted": true
    },
    {
      "id": "enterprise",
      "name": "Enterprise",
      "price": "Contact us",
      "tagline": "For herds too large for a spreadsheet.",
      "features": ["Everything in Team", "SSO", "Dedicated support", "Custom workflows"],
      "cta": { "label": "Contact Sales", "href": "mailto:hello@metricyak.com" }
    }
  ]
}
```

- [ ] **Step 3: Create `src/components/PricingCard.tsx`**

```tsx
import * as React from "react"
import type { Tier } from "../types/pricing"

export const PricingCard = ({ tier }: { tier: Tier }): React.ReactElement => {
  return (
    <div
      className={`border-2 border-ink p-6 flex flex-col gap-4 ${tier.highlighted ? "bg-mustard" : "bg-white"}`}
    >
      <h2 className="text-2xl font-bold">{tier.name}</h2>
      <p className="text-3xl font-heading font-bold">{tier.price}</p>
      <p>{tier.tagline}</p>
      <ul className="flex-1 space-y-1">
        {tier.features.map((feature) => (
          <li key={feature}>✓ {feature}</li>
        ))}
      </ul>
      <a href={tier.cta.href} className="px-4 py-2 border-2 border-ink font-bold text-center bg-white">
        {tier.cta.label}
      </a>
    </div>
  )
}
```

- [ ] **Step 4: Create `src/pages/pricing.tsx`**

Gatsby's Node.js build environment can `import` local JSON directly (no GraphQL sourcing needed for a single static file):

```tsx
import * as React from "react"
import { Layout } from "../components/Layout"
import { Seo } from "../components/Seo"
import { PricingCard } from "../components/PricingCard"
import pricingData from "../../content/pricing.json"
import type { PricingData } from "../types/pricing"

const typedPricingData = pricingData as PricingData

const PricingPage = (): React.ReactElement => {
  return (
    <Layout>
      <Seo title="Pricing" description="MetricYak pricing — from solo builders to full teams." />
      <h1 className="text-3xl font-bold mb-8">Pricing</h1>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {typedPricingData.tiers.map((tier) => (
          <PricingCard key={tier.id} tier={tier} />
        ))}
      </div>
    </Layout>
  )
}

export default PricingPage
```

- [ ] **Step 5: Enable JSON imports in `tsconfig.json`**

`resolveJsonModule: true` was already set in Task 1 — confirm it's still present, no change needed.

- [ ] **Step 6: Verify**

Run: `npx tsc --noEmit`
Expected: no output, exit code 0

Run: `npm run build`
Expected: build succeeds; output lists `/pricing/`

Run: `npm run develop`, visit `http://localhost:8000/pricing/`
Expected: three pricing cards (Starter, Team, Enterprise), Team card has mustard background, each card's CTA link points to the configured `href`

- [ ] **Step 7: Commit**

```bash
git add content/pricing.json src/types/pricing.ts src/components/PricingCard.tsx src/pages/pricing.tsx
git commit -m "feat: add static pricing page"
```

---

### Task 9: 404 Page

**Files:**
- Create: `src/pages/404.tsx`

**Interfaces:**
- Consumes: `Layout`, `Seo`, `MascotIllustration` from Task 3

- [ ] **Step 1: Create `src/pages/404.tsx`**

```tsx
import * as React from "react"
import { Link } from "gatsby"
import { Layout } from "../components/Layout"
import { Seo } from "../components/Seo"
import { MascotIllustration } from "../components/MascotIllustration"

const NotFoundPage = (): React.ReactElement => {
  return (
    <Layout>
      <Seo title="404" description="This page doesn't exist." />
      <section className="flex flex-col items-center text-center gap-6 py-16">
        <MascotIllustration variant="shrug" className="w-32 h-32" />
        <h1 className="text-3xl font-bold">This metric doesn't exist. Neither does this page.</h1>
        <p>Whatever you were looking for wandered off. Try the docs instead.</p>
        <Link to="/" className="px-6 py-3 bg-mustard font-bold border-2 border-ink">
          Back to Home
        </Link>
      </section>
    </Layout>
  )
}

export default NotFoundPage
```

- [ ] **Step 2: Verify**

Run: `npx tsc --noEmit`
Expected: no output, exit code 0

Run: `npm run develop`, visit `http://localhost:8000/this-page-does-not-exist/`
Expected: Gatsby's dev 404 handling shows the custom page with the shrugging yak and "Back to Home" link

- [ ] **Step 3: Commit**

```bash
git add src/pages/404.tsx
git commit -m "feat: add a custom 404 page"
```

---

### Task 10: Sitemap & RSS Feed

**Files:**
- Modify: `package.json` (add `gatsby-plugin-sitemap`, `gatsby-plugin-feed`)
- Modify: `gatsby-config.ts` (register both plugins)

**Interfaces:**
- Consumes: `siteMetadata` from `gatsby-config.ts` (Task 1), blog `Mdx` nodes tagged in Task 4/6

- [ ] **Step 1: Add dependencies to `package.json`**

Add to `dependencies`: `"gatsby-plugin-sitemap": "^5.25.0"`, `"gatsby-plugin-feed": "^4.25.0"`

Run: `npm install`

- [ ] **Step 2: Register `gatsby-plugin-sitemap` and configure `gatsby-plugin-feed` in `gatsby-config.ts`**

```diff
+    `gatsby-plugin-sitemap`,
+    {
+      resolve: `gatsby-plugin-feed`,
+      options: {
+        query: `
+          {
+            site {
+              siteMetadata {
+                title
+                description
+                siteUrl
+              }
+            }
+          }
+        `,
+        feeds: [
+          {
+            serialize: ({ query: { site, allMdx } }: any) =>
+              allMdx.nodes.map((node: any) => ({
+                title: node.frontmatter.title,
+                description: node.frontmatter.description,
+                date: node.frontmatter.date,
+                url: site.siteMetadata.siteUrl + node.fields.slug,
+                guid: site.siteMetadata.siteUrl + node.fields.slug,
+              })),
+            query: `
+              {
+                allMdx(
+                  filter: { fields: { collection: { eq: "blog" } } }
+                  sort: { fields: [frontmatter___date], order: DESC }
+                ) {
+                  nodes {
+                    fields {
+                      slug
+                    }
+                    frontmatter {
+                      title
+                      description
+                      date
+                    }
+                  }
+                }
+              }
+            `,
+            output: "/rss.xml",
+            title: "MetricYak Blog RSS Feed",
+          },
+        ],
+      },
+    },
     `gatsby-plugin-mdx`,
```

- [ ] **Step 3: Verify**

Run: `npm run build`
Expected: build succeeds; `public/sitemap-index.xml` and `public/rss.xml` exist after build

Run: `cat public/rss.xml | grep "Say hello to MetricYak"`
Expected: matches — the launch post appears in the feed

- [ ] **Step 4: Commit**

```bash
git add package.json package-lock.json gatsby-config.ts
git commit -m "feat: add sitemap and blog RSS feed"
```

---

### Task 11: Algolia DocSearch

**Files:**
- Modify: `package.json` (add `@docsearch/react`, `@docsearch/css`)
- Create: `src/components/DocSearch.tsx`
- Modify: `src/components/Nav.tsx` (render `DocSearch` in the nav bar)
- Create: `.env.example`

**Interfaces:**
- Produces: `DocSearch` component reading `GATSBY_ALGOLIA_APP_ID`, `GATSBY_ALGOLIA_SEARCH_API_KEY`, `GATSBY_ALGOLIA_INDEX_NAME` from environment variables (Gatsby only exposes browser env vars prefixed `GATSBY_`)

DocSearch requires a live public site to be crawled before Algolia issues real credentials (via the [DocSearch program](https://docsearch.algolia.com/apply/) — free for open-source docs, which MetricYak qualifies for). The component below is fully functional; it just needs real credentials once the site is live and the crawler has run — that's a runtime configuration step for whoever deploys the site, not a code placeholder.

- [ ] **Step 1: Add dependencies to `package.json`**

Add to `dependencies`: `"@docsearch/react": "^3.5.2"`, `"@docsearch/css": "^3.5.2"`

Run: `npm install`

- [ ] **Step 2: Create `.env.example`**

```
GATSBY_ALGOLIA_APP_ID=
GATSBY_ALGOLIA_SEARCH_API_KEY=
GATSBY_ALGOLIA_INDEX_NAME=metricyak
```

- [ ] **Step 3: Create `src/components/DocSearch.tsx`**

```tsx
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
```

- [ ] **Step 4: Render it in `src/components/Nav.tsx`**

```diff
 import * as React from "react"
 import { Link } from "gatsby"
+import { DocSearch } from "./DocSearch"

 const NAV_LINKS: Array<{ label: string; to: string }> = [
   ...
 ]

 export const Nav = (): React.ReactElement => {
   return (
     <header className="flex items-center justify-between px-6 py-4 border-b-4 border-ink">
       <Link to="/" className="font-heading text-xl font-bold">
         MetricYak
       </Link>
-      <nav className="flex gap-6">
+      <nav className="flex items-center gap-6">
+        <DocSearch />
         {NAV_LINKS.map((link) => (
           <Link key={link.to} to={link.to} className="font-medium hover:text-mustard">
             {link.label}
           </Link>
         ))}
       </nav>
     </header>
   )
 }
```

- [ ] **Step 5: Verify**

Run: `npx tsc --noEmit`
Expected: no output, exit code 0

Run: `npm run develop` (with no `.env.development` present)
Expected: nav bar renders with no search box and no console errors — `DocSearch` returns `null` when env vars are unset

Run: `cp .env.example .env.development` and fill in placeholder-but-non-empty test values (e.g. `test`), then `npm run develop`
Expected: a search box now renders in the nav (it won't return real results without genuine Algolia credentials, but it mounts without throwing)

Delete the test `.env.development` afterward so it isn't committed.

- [ ] **Step 6: Commit**

```bash
git add package.json package-lock.json src/components/DocSearch.tsx src/components/Nav.tsx .env.example
git commit -m "feat: add Algolia DocSearch to the nav (env-gated)"
```

---

### Task 12: Decap CMS Admin Config

**Files:**
- Create: `static/admin/index.html`
- Create: `static/admin/config.yml`

**Interfaces:**
- Produces: `/admin` route serving the Decap CMS app (loaded from CDN, no npm dependency)
- Consumes: none — this is config, not code that other tasks import

- [ ] **Step 1: Create `static/admin/index.html`**

```html
<!DOCTYPE html>
<html>
  <head>
    <meta charset="utf-8" />
    <title>MetricYak Content Manager</title>
  </head>
  <body>
    <script src="https://unpkg.com/decap-cms@^3.0.0/dist/decap-cms.js"></script>
  </body>
</html>
```

- [ ] **Step 2: Create `static/admin/config.yml`**

```yaml
backend:
  name: github
  repo: metricyak/metricyak.com
  branch: main
  base_url: https://metricyak.com
  auth_endpoint: api/auth

media_folder: "static/images/uploads"
public_folder: "/images/uploads"

collections:
  - name: "docs"
    label: "Docs"
    folder: "content/docs"
    create: true
    extension: "mdx"
    format: "frontmatter"
    slug: "{{slug}}"
    fields:
      - { label: "Title", name: "title", widget: "string" }
      - { label: "Order", name: "order", widget: "number" }
      - { label: "Description", name: "description", widget: "string" }
      - { label: "Body", name: "body", widget: "markdown" }

  - name: "blog"
    label: "Blog"
    folder: "content/blog"
    create: true
    path: "{{slug}}/index"
    extension: "mdx"
    format: "frontmatter"
    slug: "{{year}}-{{month}}-{{day}}-{{slug}}"
    fields:
      - { label: "Title", name: "title", widget: "string" }
      - { label: "Date", name: "date", widget: "date" }
      - { label: "Author", name: "author", widget: "string" }
      - { label: "Description", name: "description", widget: "string" }
      - { label: "Body", name: "body", widget: "markdown" }

  - name: "pricing"
    label: "Pricing"
    files:
      - name: "tiers"
        label: "Pricing Tiers"
        file: "content/pricing.json"
        fields:
          - label: "Tiers"
            name: "tiers"
            widget: "list"
            fields:
              - { label: "ID", name: "id", widget: "string" }
              - { label: "Name", name: "name", widget: "string" }
              - { label: "Price", name: "price", widget: "string" }
              - { label: "Tagline", name: "tagline", widget: "string" }
              - { label: "Features", name: "features", widget: "list" }
              - label: "CTA"
                name: "cta"
                widget: "object"
                fields:
                  - { label: "Label", name: "label", widget: "string" }
                  - { label: "Href", name: "href", widget: "string" }
              - { label: "Highlighted", name: "highlighted", widget: "boolean", required: false }
```

- [ ] **Step 2: Verify**

Run: `npm run build`
Expected: build succeeds; `public/admin/index.html` and `public/admin/config.yml` exist (Gatsby copies everything under `static/` verbatim to `public/`)

- [ ] **Step 3: Commit**

```bash
git add static/admin
git commit -m "feat: add Decap CMS admin config for docs, blog, and pricing"
```

---

### Task 13: GitHub OAuth Serverless Functions (Decap CMS on Vercel)

**Files:**
- Create: `api/auth.ts`
- Create: `api/callback.ts`
- Modify: `package.json` (add `@vercel/node` as a dev dependency for request/response types)
- Create/Modify: `.env.example` (add `GITHUB_OAUTH_CLIENT_ID`, `GITHUB_OAUTH_CLIENT_SECRET`)

**Interfaces:**
- Produces: `GET /api/auth` — redirects the browser to GitHub's OAuth authorize URL
- Produces: `GET /api/callback` — exchanges the OAuth `code` for an access token and returns an HTML page that `postMessage`s the token back to the Decap CMS window, per the protocol Decap's `github` backend expects for external OAuth providers

This implements the "External OAuth Clients" pattern Decap CMS documents for Git hosts other than Netlify — Decap's `github` backend has no client-side PKCE option, so a small server-side handshake is required.

- [ ] **Step 1: Add `@vercel/node` to `package.json`**

Add to `devDependencies`: `"@vercel/node": "^3.0.29"`

Run: `npm install`

- [ ] **Step 2: Add OAuth app credentials to `.env.example`**

```diff
 GATSBY_ALGOLIA_APP_ID=
 GATSBY_ALGOLIA_SEARCH_API_KEY=
 GATSBY_ALGOLIA_INDEX_NAME=metricyak
+GITHUB_OAUTH_CLIENT_ID=
+GITHUB_OAUTH_CLIENT_SECRET=
```

(These come from a GitHub OAuth App scoped to the `metricyak/metricyak.com` repo, created under GitHub Settings → Developer settings → OAuth Apps, with callback URL `https://metricyak.com/api/callback`.)

- [ ] **Step 3: Create `api/auth.ts`**

```typescript
import type { VercelRequest, VercelResponse } from "@vercel/node"

export default function handler(req: VercelRequest, res: VercelResponse): void {
  const clientId = process.env.GITHUB_OAUTH_CLIENT_ID

  if (!clientId) {
    res.status(500).send("GITHUB_OAUTH_CLIENT_ID is not configured")
    return
  }

  const redirectUri = `https://${req.headers.host}/api/callback`
  const authorizeUrl = `https://github.com/login/oauth/authorize?client_id=${clientId}&scope=repo&redirect_uri=${encodeURIComponent(
    redirectUri
  )}`

  res.writeHead(302, { Location: authorizeUrl })
  res.end()
}
```

- [ ] **Step 4: Create `api/callback.ts`**

```typescript
import type { VercelRequest, VercelResponse } from "@vercel/node"

export default async function handler(req: VercelRequest, res: VercelResponse): Promise<void> {
  const code = req.query.code as string | undefined
  const clientId = process.env.GITHUB_OAUTH_CLIENT_ID
  const clientSecret = process.env.GITHUB_OAUTH_CLIENT_SECRET

  if (!code || !clientId || !clientSecret) {
    res.status(400).send("Missing code or OAuth app credentials")
    return
  }

  const tokenResponse = await fetch("https://github.com/login/oauth/access_token", {
    method: "POST",
    headers: { "Content-Type": "application/json", Accept: "application/json" },
    body: JSON.stringify({ client_id: clientId, client_secret: clientSecret, code }),
  })

  const tokenData = (await tokenResponse.json()) as { access_token?: string; error?: string }

  if (!tokenData.access_token) {
    res.status(400).send(`GitHub OAuth error: ${tokenData.error ?? "unknown error"}`)
    return
  }

  const message = JSON.stringify({ token: tokenData.access_token, provider: "github" })

  res.setHeader("Content-Type", "text/html")
  res.status(200).send(`
    <script>
      (function() {
        function receiveMessage(e) {
          window.opener.postMessage(
            'authorization:github:success:${message.replace(/'/g, "\\'")}',
            e.origin
          )
          window.removeEventListener("message", receiveMessage, false)
        }
        window.addEventListener("message", receiveMessage, false)
        window.opener.postMessage("authorizing:github", "*")
      })()
    </script>
  `)
}
```

- [ ] **Step 5: Verify**

Run: `npx tsc --noEmit`
Expected: no output, exit code 0

Run: `npx vercel dev` (requires a Vercel account linked via `npx vercel login` — if unavailable in this environment, skip live verification and note it in the PR description for manual verification after first deploy)
Expected: `http://localhost:3000/api/auth` redirects to a GitHub authorize URL containing the configured `client_id`

- [ ] **Step 6: Commit**

```bash
git add package.json package-lock.json api .env.example
git commit -m "feat: add GitHub OAuth serverless functions for Decap CMS"
```

---

### Task 14: Deployment & CI Scripts

**Files:**
- Modify: `package.json` (ensure `build` and `typecheck` scripts are CI-ready — already added in Task 1, confirm here)
- Create: `README.md` (replace the placeholder content with real setup/deploy instructions)
- Create: `.env.example` confirmation (already exists from Tasks 11 & 13 — no changes needed)

**Interfaces:**
- None — this task documents and wires up existing scripts for Vercel, it doesn't introduce new runtime interfaces

- [ ] **Step 1: Confirm `package.json` scripts (from Task 1) are unchanged and CI-ready**

```json
"scripts": {
  "develop": "gatsby develop",
  "build": "gatsby build",
  "serve": "gatsby serve",
  "clean": "gatsby clean",
  "typecheck": "tsc --noEmit"
}
```

No edit needed if Task 1 was completed as written — this step just confirms it.

- [ ] **Step 2: Replace `README.md` with real setup instructions**

```markdown
# metricyak.com

Official docs and website for MetricYak — an open-source metrics, monitors,
investigations, and autonomous workflows platform.

## Stack

Gatsby 4, TypeScript, Tailwind CSS, MDX, Decap CMS.

## Local development

\`\`\`bash
npm install
npm run develop
\`\`\`

Visit `http://localhost:8000`. GraphiQL is at `http://localhost:8000/___graphql`.

## Content

- Docs: `content/docs/**/*.mdx`
- Blog posts: `content/blog/<slug>/index.mdx`
- Pricing: `content/pricing.json`

Edit these directly and open a PR, or use the Decap CMS admin UI at `/admin`
(requires `GITHUB_OAUTH_CLIENT_ID` / `GITHUB_OAUTH_CLIENT_SECRET` configured
on Vercel — see `.env.example`).

## Environment variables

Copy `.env.example` to `.env.development` for local development. Required for:

- Docs search (`GATSBY_ALGOLIA_*`) — optional locally, search box hides itself if unset
- Decap CMS OAuth (`GITHUB_OAUTH_CLIENT_ID`, `GITHUB_OAUTH_CLIENT_SECRET`) — required for `/admin` to work; not needed to run the site itself

## Deployment

Hosted on Vercel, connected to this GitHub repo. Every push to `main` deploys
to production; every PR gets a preview deployment. Configure the environment
variables above in the Vercel project settings (Production + Preview).

## Type checking

\`\`\`bash
npm run typecheck
\`\`\`
```

- [ ] **Step 3: Verify the full build one more time end-to-end**

Run: `npm run typecheck`
Expected: no output, exit code 0

Run: `npm run build`
Expected: build succeeds; `public/` contains `index.html`, `pricing/index.html`, `blog/index.html`, `blog/2026-07-18-launch-post/index.html`, `docs/getting-started/index.html`, `docs/metrics/index.html`, `docs/monitors/index.html`, `docs/investigations/index.html`, `docs/workflows/index.html`, `404.html`, `admin/index.html`, `sitemap-index.xml`, `rss.xml`

- [ ] **Step 4: Commit**

```bash
git add README.md
git commit -m "docs: write real README with setup and deployment instructions"
```

- [ ] **Step 5: Push and connect the Vercel project (manual, one-time)**

This step is a manual action outside the codebase — confirm with the user before doing it:

1. Push `main` to GitHub (`git push -u origin main`, if not already pushed)
2. In Vercel, import the GitHub repo as a new project (Vercel auto-detects Gatsby)
3. Add the environment variables from `.env.example` in Vercel's project settings
4. Trigger a deploy and confirm `https://<project>.vercel.app/` loads the home page

## Deferred / Not Built Here

Per the design spec's explicit scope boundaries — do not build these without a new spec:
- Docs versioning
- Dynamic/Stripe-integrated pricing
- Changelog page
- Dedicated Community page
- Real brand assets (logo, commissioned mascot illustrations, final palette) — current mascot art is a placeholder SVG by design
