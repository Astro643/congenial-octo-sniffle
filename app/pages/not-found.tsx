import type { PageMeta } from "../lib/page.ts"
import { Footer, Header } from "../ui/chrome.tsx"
import { SupportWidget } from "../ui/support-widget.tsx"

export const meta: PageMeta = {
  title: "Page not found · Controller",
  description: "Agentic infrastructure for Discord. AI agents audit and plan your goals, durable workflows run them, and your bot carries them out.",
  styles: ["/site.css"],
}

export function NotFoundPage() {
  return () => (
      <>
        <Header />
        <main>
          <div className={"wrap"}>
            <div className={"page"}>
              <h1>
                {"Page not found"}
              </h1>
              <p className={"lead"}>
                {"That page does not exist. Head back to the home page or open the Console."}
              </p>
              <div className={"cta"} style={{ justifyContent: "flex-start", marginTop: "28px" }}>
                <a className={"btn btn-primary"} href={"/"}>
                  {"Home"}
                </a>
                <a className={"btn"} href={"/dashboard"}>
                  {"Open Console"}
                </a>
              </div>
            </div>
          </div>
        </main>
        <Footer />
        <SupportWidget />
      </>
  )
}
