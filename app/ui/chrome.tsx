import type { RemixNode } from "remix/component"

import { hasContact, inviteHref, supportHref, supportMail } from "../lib/site-config.ts"

export function Logo() {
  return () => (
    <svg className={"logo"} viewBox={"0 0 24 24"} width={"24"} height={"24"} aria-hidden={"true"}>
      <path d={"M2.5 5h19L12 20.5z"} fill={"currentColor"} />
    </svg>
  )
}

export function Header() {
  return () => (
    <header className={"nav"}>
      <div className={"wrap nav-in"}>
        <a className={"brand"} href={"/"}>
          <Logo />
          {"Controller"}
        </a>
        <div className={"nav-right"}>
          <a className={"btn btn-primary btn-sm"} href={"/dashboard"}>
            {"Open Console"}
          </a>
        </div>
      </div>
    </header>
  )
}

export function Footer() {
  return () => (
    <footer>
      <div className={"wrap"}>
        <div className={"foot"}>
          <div>
            <a className={"brand"} href={"/"} style={{ padding: "0" }}>
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
            <a href={"/dashboard"}>
              {"Console"}
            </a>
            <a href={"/docs"}>
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
            <a href={"/privacy"}>
              {"Privacy Policy"}
            </a>
            <a href={"/terms"}>
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
