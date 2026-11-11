import type { LinksFunction, MetaFunction } from "@remix-run/node"
import { useScripts } from "../lib/use-scripts"

export const meta: MetaFunction = () => [
  { title: "Team" },
  { name: "robots", content: "noindex" },
]

export const links: LinksFunction = () => [
  { rel: "stylesheet", href: "/chat.css" },
]

export default function TeamRoute() {
  useScripts(["/chat-ui.js","/team.js"])
  return (
    <>
      <main className={"wrap"}>
        <div className={"top"}>
          <h1>
            {"Team"}
          </h1>
          <p className={"sub"}>
            {"Support inbox"}
          </p>
        </div>
        <div id={"stage"}></div>
      </main>
    </>
  )
}
