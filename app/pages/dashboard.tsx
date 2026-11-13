import { css } from "remix/component"

import type { PageMeta } from "../lib/page.ts"
import { Console } from "../ui/console.tsx"

export const meta: PageMeta = {
  title: "Controller",
}

export function DashboardPage() {
  const markStyle = css({
    position: "fixed",
    top: "20px",
    left: "24px",
    zIndex: 5,
    color: "#000",
    display: "block",
    lineHeight: 0,
    "& svg": {
      width: "22px",
      height: "22px",
    },
  })

  return () => (
      <>
        <a className={"mark"} href={"/"} aria-label={"Home"} mix={markStyle}>
          <svg className={"logo"} viewBox={"0 0 24 24"} width={"24"} height={"24"} aria-hidden={"true"}>
            <path d={"M2.5 5h19L12 20.5z"} fill={"currentColor"}></path>
          </svg>
        </a>
        <Console />
      </>
  )
}
