import { css } from "remix/component"
import type { RemixNode } from "remix/component"

import { hasContact, inviteHref, supportHref, supportMail } from "../lib/site-config.ts"

const PREFETCH = { "data-rmx-prefetch": "intent" } as const

export function Logo() {
  return () => (
    <svg className={"logo"} viewBox={"0 0 24 24"} width={"24"} height={"24"} aria-hidden={"true"}>
      <path d={"M2.5 5h19L12 20.5z"} fill={"currentColor"} />
    </svg>
  )
}

export function Header() {
  const navStyle = css({
    position: "sticky",
    top: 0,
    zIndex: 20,
    background: "rgba(238,237,232,.84)",
    webkitBackdropFilter: "saturate(1.2) blur(12px)",
    backdropFilter: "saturate(1.2) blur(12px)",
    borderBottom: "1px solid rgba(5,5,5,.06)",
    "& .nav-in": {
      display: "grid",
      gridTemplateColumns: "1fr auto 1fr",
      alignItems: "center",
      height: "80px",
    },
    "& .brand": {
      fontWeight: 650,
      fontSize: "20px",
      letterSpacing: ".09em",
      textDecoration: "none",
      display: "flex",
      alignItems: "center",
      gap: "11px",
    },
    "& .brand .logo": {
      width: "24px",
      height: "24px",
      display: "block",
      color: "#000",
      flex: "none",
    },
    "& .nav-right": {
      display: "flex",
      justifySelf: "end",
      alignItems: "center",
      gap: "10px",
    },
    "@media (max-width:760px)": {
      "& .nav-in": {
        display: "flex",
        justifyContent: "space-between",
        height: "68px",
      },
      "& .nav-right": {
        gap: "8px",
      },
    },
  })

  return () => (
    <header className={"nav"} mix={navStyle}>
      <div className={"wrap nav-in"}>
        <a className={"brand"} href={"/"} {...PREFETCH}>
          <Logo />
          {"Controller"}
        </a>
        <div className={"nav-right"}>
          <a className={"btn btn-primary btn-sm"} href={"/dashboard"} {...PREFETCH}>
            {"Open Console"}
          </a>
        </div>
      </div>
    </header>
  )
}

export function Footer() {
  const footerStyle = css({
    marginTop: "110px",
    background: "var(--dark)",
    color: "#ECEBEC",
    "& .foot": {
      display: "grid",
      gap: "36px",
      gridTemplateColumns: "1.4fr 1fr 1fr 1fr",
      padding: "56px 0 40px",
    },
    "& .foot h4": {
      margin: "0 0 16px",
      font: "600 11.5px var(--mono)",
      color: "#8F8E92",
      letterSpacing: ".09em",
      textTransform: "uppercase",
    },
    "& .foot a": {
      display: "block",
      textDecoration: "none",
      color: "#D4D3D5",
      fontSize: "15px",
      padding: "4px 0",
    },
    "& .foot a:hover": {
      color: "var(--green)",
    },
    "& .foot p": {
      color: "#9A999D",
      fontSize: "14.5px",
      marginTop: "12px",
      maxWidth: "290px",
    },
    "& .brand": {
      color: "#fff",
    },
    "& .brand .logo": {
      background: "var(--green)",
      color: "#000",
      padding: "5px",
      borderRadius: "7px",
      width: "30px",
      height: "30px",
    },
    "& .legal": {
      borderTop: "1px solid var(--dark-line)",
      padding: "18px 0 28px",
      color: "#8F8E92",
      font: "500 11.5px var(--mono)",
      textTransform: "uppercase",
      letterSpacing: ".06em",
      display: "flex",
      justifyContent: "space-between",
    },
    "& a:focus-visible": {
      outlineColor: "#fff",
    },
    "@media (max-width:760px)": {
      "& .foot": {
        gridTemplateColumns: "1fr 1fr",
      },
    },
  })

  return () => (
    <footer mix={footerStyle}>
      <div className={"wrap"}>
        <div className={"foot"}>
          <div>
            <a className={"brand"} href={"/"} style={{ padding: "0" }} {...PREFETCH}>
              <Logo />
              {"Controller"}
            </a>
            <p>
              {"Agentic infrastructure for Discord. Agents plan it, workflows run it, your bot does it."}
            </p>
          </div>
          <div>
            <h4>
              {"Product"}
            </h4>
            <a href={"/dashboard"} {...PREFETCH}>
              {"Console"}
            </a>
            <a href={"/docs"} {...PREFETCH}>
              {"Docs"}
            </a>
            {inviteHref ? (
              <a href={inviteHref} rel={"noopener"}>
                {"Add to Discord"}
              </a>
            ) : null}
          </div>
          <div>
            <h4>
              {"Help"}
            </h4>
            {supportHref ? (
              <a href={supportHref} rel={"noopener"}>
                {"Discord server"}
              </a>
            ) : null}
            {supportMail ? (
              <a href={"mailto:" + supportMail}>
                {supportMail}
              </a>
            ) : null}
          </div>
          <div>
            <h4>
              {"Legal"}
            </h4>
            <a href={"/privacy"} {...PREFETCH}>
              {"Privacy Policy"}
            </a>
            <a href={"/terms"} {...PREFETCH}>
              {"Terms of Service"}
            </a>
          </div>
        </div>
        <div className={"legal"}>
          <span>
            {"© "}
            {String(new Date().getFullYear())}
            {" Controller"}
          </span>
          <span>
            {"Not affiliated with or endorsed by Discord Inc."}
          </span>
        </div>
      </div>
    </footer>
  )
}

export function ContactLine(): RemixNode {
  if (supportMail && supportHref) {
    return (
      <>
        <a href={"mailto:" + supportMail} style={{ color: "var(--green-ink)" }}>
          {supportMail}
        </a>
        {" or "}
        <a href={supportHref} style={{ color: "var(--green-ink)" }} rel={"noopener"}>
          {"our Discord server"}
        </a>
      </>
    )
  }
  if (supportMail) {
    return (
      <a href={"mailto:" + supportMail} style={{ color: "var(--green-ink)" }}>
        {supportMail}
      </a>
    )
  }
  if (supportHref) {
    return (
      <a href={supportHref} style={{ color: "var(--green-ink)" }} rel={"noopener"}>
        {"our Discord server"}
      </a>
    )
  }
  return <span>{"please contact whoever operates this bot for your server."}</span>
}
