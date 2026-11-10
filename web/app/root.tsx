import type { LinksFunction, MetaFunction } from "@remix-run/node"
import { Links, Meta, Outlet, Scripts, ScrollRestoration } from "@remix-run/react"
import siteStyles from "../site.css?url"

export const links: LinksFunction = () => [
  { rel: "stylesheet", href: siteStyles },
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
    <head><Meta /><Links /></head>
    <body>
      <Outlet />
      <ScrollRestoration />
      <Scripts />
    </body>
  </html>
}
