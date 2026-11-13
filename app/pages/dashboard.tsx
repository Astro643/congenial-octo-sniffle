import type { PageMeta } from "../lib/page.ts"
import { Console } from "../ui/console.tsx"

export const meta: PageMeta = {
  title: "Controller",
  styles: ["/dashboard.css"],
}

export function DashboardPage() {
  return () => (
      <>
        <a className={"mark"} href={"/"} aria-label={"Home"} style={{ color: "#000" }}>
          <svg className={"logo"} viewBox={"0 0 24 24"} width={"24"} height={"24"} aria-hidden={"true"}>
            <path d={"M2.5 5h19L12 20.5z"} fill={"currentColor"}></path>
          </svg>
        </a>
        <Console />
      </>
  )
}
