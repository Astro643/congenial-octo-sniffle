import type { PageMeta } from "../lib/page.ts"

export const meta: PageMeta = {
  title: "Controller",
  styles: ["/dashboard.css"],
  scripts: ["/dashboard.js"],
}

export function DashboardPage() {
  return () => (
      <>
        <a className={"mark"} href={"/"} aria-label={"Home"}>
          <svg className={"logo"} viewBox={"0 0 24 24"} aria-hidden={"true"}>
            <path d={"M2.5 5h19L12 20.5z"} fill={"currentColor"}></path>
          </svg>
        </a>
        <div className={"top-right"}>
          <div className={"top-row"}>
            <span className={"agent-chip"} id={"agent-chip"}></span>
          </div>
        </div>
        <main>
          <section id={"feed"} aria-live={"polite"}></section>
        </main>
        <div id={"bar"}>
          <form id={"form"} autoComplete={"off"}>
            <input id={"prompt"} type={"text"} maxLength={2000} placeholder={"Describe a change to your server"} aria-label={"Goal"} />
            <button id={"go"} type={"submit"} aria-label={"Execute goal"} title={"Execute goal"}>
              <svg viewBox={"0 0 24 24"} fill={"none"} stroke={"currentColor"} strokeWidth={"2.4"} strokeLinecap={"round"} strokeLinejoin={"round"} aria-hidden={"true"}>
                <path d={"M12 19V5"}></path>
                <path d={"M5 12l7-7 7 7"}></path>
              </svg>
            </button>
          </form>
          <div id={"hint"}></div>
        </div>
      </>
  )
}
