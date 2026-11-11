import type { PageMeta } from "../lib/page.ts"

export const meta: PageMeta = {
  title: "Human support",
  robots: "noindex",
  styles: ["/chat.css"],
  scripts: ["/chat-ui.js","/human-support.js"],
}

export function HumanSupportPage() {
  return () => (
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
