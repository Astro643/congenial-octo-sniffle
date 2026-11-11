import { useParams } from "@remix-run/react"
import { LegacyPage } from "../legacy"

const routeFiles: Record<string, string> = {
  "how-it-works": "how-it-works.html",
  faq: "faq.html",
  support: "support.html",
  privacy: "privacy.html",
  terms: "terms.html",
  dashboard: "dashboard.html",
  team: "team.html",
  "human-support": "human-support.html",
}

export default function LegacyRoute() {
  const { "*": path = "" } = useParams()
  return <LegacyPage file={routeFiles[path.replace(/\/$/, "")] ?? "404.html"} />
}
