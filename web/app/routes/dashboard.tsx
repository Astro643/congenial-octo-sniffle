import type { LinksFunction, MetaFunction } from "@remix-run/node"
import dashboardStyles from "../styles/dashboard.css?url"
import { useScripts } from "../lib/use-scripts"

export const meta: MetaFunction = () => [
  { title: "Controller" },
]

export const links: LinksFunction = () => [
  { rel: "stylesheet", href: dashboardStyles },
]

export default function DashboardRoute() {
  useScripts(["/dashboard.js"])
  return (
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
      <div id={"gate"} role={"status"} aria-live={"polite"}>
        <div className={"gate-card"}>
          <h1 id={"gate-title"}>
            {"You are in line"}
          </h1>
          <div className={"gate-num"} id={"gate-num"}></div>
          <p id={"gate-text"}>
            {"Every agent is helping someone else. You will be let in as soon as one is free."}
          </p>
          <div className={"gate-bar"} id={"gate-bar"}>
            <i></i>
          </div>
        </div>
      </div>
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
