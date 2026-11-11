import type { LinksFunction, MetaFunction } from "@remix-run/node"
import { Links, Meta, Outlet, Scripts, ScrollRestoration } from "@remix-run/react"
import motionStyles from "./styles/motion.css?url"
import { PageMotion } from "./components/page-motion"
import { ParticleBackdrop } from "./components/particle-backdrop"
import { VersionBadge } from "./components/version-badge"

export const links: LinksFunction = () => [
  { rel: "stylesheet", href: motionStyles },
  { rel: "icon", href: "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24'%3E%3Cpath d='M2.5 5h19L12 20.5z' fill='%23000'/%3E%3C/svg%3E" },
  { rel: "preconnect", href: "https://fonts.googleapis.com" },
  { rel: "preconnect", href: "https://fonts.gstatic.com", crossOrigin: "anonymous" },
  { rel: "stylesheet", href: "https://fonts.googleapis.com/css2?family=Anton&family=JetBrains+Mono:wght@400;500;600;700&display=swap" },
]

export const meta: MetaFunction = () => [
  { title: "Controller · Agentic infrastructure for Discord" },
  { name: "description", content: "Agentic infrastructure for Discord. AI agents audit and plan your goals, durable workflows run them, and your bot carries them out." },
  { name: "theme-color", content: "#EEEDE8" },
]

export default function App() {
  return <html lang="en">
    <head>
      <meta charSet="utf-8" />
      <meta name="viewport" content="width=device-width,initial-scale=1" />
      <Meta />
      <Links />
    </head>
    <body>
      <ParticleBackdrop />
      <PageMotion>
        <Outlet />
      </PageMotion>
      <VersionBadge />
      <ScrollRestoration />
      <Scripts />
    </body>
  </html>
}
