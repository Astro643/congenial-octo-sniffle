import { readFileSync, writeFileSync, mkdirSync } from "node:fs"

const root = "/vercel/share/v0-project/web"
const routes = {
  "_index": { slug: "home", component: "HomePage" },
  "how-it-works": { slug: "how-it-works", component: "HowItWorksPage" },
  "faq": { slug: "faq", component: "FaqPage" },
  "support": { slug: "support", component: "SupportPage" },
  "privacy": { slug: "privacy", component: "PrivacyPage" },
  "terms": { slug: "terms", component: "TermsPage" },
  "dashboard": { slug: "dashboard", component: "DashboardPage" },
  "team": { slug: "team", component: "TeamPage" },
  "human-support": { slug: "human-support", component: "HumanSupportPage" },
  "$": { slug: "not-found", component: "NotFoundPage" },
}

mkdirSync(`${root}/app/pages`, { recursive: true })

for (const [file, { slug, component }] of Object.entries(routes)) {
  const src = readFileSync(`${root}/app/routes/${file}.tsx`, "utf8")
  const title = src.match(/\{ title: "((?:[^"\\]|\\.)*)" \}/)?.[1]
  const description = src.match(/name: "description", content: "((?:[^"\\]|\\.)*)"/)?.[1]
  const robots = src.match(/name: "robots", content: "([^"]*)"/)?.[1]
  const scripts = JSON.parse(src.match(/useScripts\((\[.*?\])\)/)[1])

  const styles = []
  if (src.includes("...siteLinks()")) styles.push("/site.css")
  if (src.includes("supportExtras")) styles.push("/support-extras.css")
  if (src.includes("dashboardStyles")) styles.push("/dashboard.css")
  for (const m of src.matchAll(/href: "(\/[^"]+\.css)"/g)) styles.push(m[1])

  const start = src.indexOf("  return (\n")
  const end = src.lastIndexOf("\n  )\n}")
  const body = src.slice(start + "  return (\n".length, end)
  const indented = body.replace(/^/gm, "  ")

  const out = `import type { PageMeta } from "../lib/page.ts"

export const meta: PageMeta = {
  title: ${JSON.stringify(title)},${description ? `\n  description: ${JSON.stringify(description)},` : ""}${robots ? `\n  robots: ${JSON.stringify(robots)},` : ""}
  styles: ${JSON.stringify(styles)},
  scripts: ${JSON.stringify(scripts)},
}

export function ${component}() {
  return () => (
${indented}
  )
}
`
  writeFileSync(`${root}/app/pages/${slug}.tsx`, out)
  console.log(slug, title, styles, scripts)
}
