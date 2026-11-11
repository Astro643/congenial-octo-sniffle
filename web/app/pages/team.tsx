import type { PageMeta } from "../lib/page.ts"

export const meta: PageMeta = {
  title: "Team",
  robots: "noindex",
  styles: ["/chat.css"],
  scripts: ["/chat-ui.js","/team.js"],
}

export function TeamPage() {
  return () => (
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
