import type { LinksFunction, MetaFunction } from "@remix-run/node"
import { useScripts } from "../lib/use-scripts"

export const meta: MetaFunction = () => [
  { title: "Human support" },
  { name: "robots", content: "noindex" },
]

export const links: LinksFunction = () => [
  { rel: "stylesheet", href: "/chat.css" },
]

export default function HumanSupportRoute() {
  useScripts(["/chat-ui.js","/human-support.js"])
  return (
    <>
      <main className={"wrap"}>
        <div className={"top"}>
          <h1>
            {"Human support "}
            <span className={"xp-tag"}>
              {"Experimental"}
            </span>
          </h1>
          <p className={"sub"}>
            {"Only you and our team can see this conversation. Messages are saved and read by a person."}
          </p>
        </div>
        <div id={"stage"}></div>
      </main>
    </>
  )
}
