import type { PageMeta } from "../lib/page.ts"

export const meta: PageMeta = {
  title: "Docs · Controller",
  description: "How to use the Controller Console: goals, previews, request statuses, the monthly report and how requests run under the hood.",
  styles: ["/site.css"],
  scripts: ["/config.js","/widget.js","/site.js"],
}

export function DocsPage() {
  return () => (
      <>
        <header className={"nav"}>
          <div className={"wrap nav-in"}>
            <a className={"brand"} href={"/"}>
              <svg className={"logo"} viewBox={"0 0 24 24"} width={"24"} height={"24"} aria-hidden={"true"}>
                <path d={"M2.5 5h19L12 20.5z"} fill={"currentColor"}></path>
              </svg>
              {"Controller"}
            </a>
            <div className={"nav-right"}>
              <a className={"btn btn-primary btn-sm"} href={"/dashboard"}>
                {"Open Console"}
              </a>
            </div>
          </div>
        </header>
        <main>
          <div className={"wrap"}>
            <div className={"page"}>
              <h1>
                {"Docs"}
              </h1>
              <p className={"lead"}>
                {"How to use Controller, what your agent does with a goal, and what every status means."}
              </p>
            </div>
            <div className={"prose"}>
              <h2>
                {"Using the Console"}
              </h2>
              <p>
                {"Open the Console from your bot's link, describe a change in plain language, and press execute. Controller first shows you a preview: either a short plan with the steps it intends to run, or a direct answer if your message was a question."}
              </p>
              <ul>
                <li>
                  <b>
                    {"Preview."}
                  </b>
                  {" You always see what will happen before it happens. Executing starts the plan; cancel closes it without doing anything."}
                </li>
                <li>
                  <b>
                    {"Tracking."}
                  </b>
                  {" Each request appears in your Console with a live status. Your last 50 requests are kept in your browser only."}
                </li>
                <li>
                  <b>
                    {"Cancel."}
                  </b>
                  {" A running request can be cancelled. Steps that already ran are not undone."}
                </li>
              </ul>
              <h2>
                {"Request statuses"}
              </h2>
              <ul>
                <li>
                  <b>
                    {"Processing."}
                  </b>
                  {" The plan is running right now."}
                </li>
                <li>
                  <b>
                    {"Completed."}
                  </b>
                  {" Every step finished. The result note shows what was done."}
                </li>
                <li>
                  <b>
                    {"Failed."}
                  </b>
                  {" Something went wrong; the note says what. Nothing is retried without your say-so — run it again from the Console."}
                </li>
                <li>
                  <b>
                    {"Cancelled."}
                  </b>
                  {" You stopped it."}
                </li>
                <li>
                  <b>
                    {"Expired."}
                  </b>
                  {" The request waited too long and was retired."}
                </li>
              </ul>
              <h2>
                {"How a request runs"}
              </h2>
              <p>
                {"When you execute a plan, Controller starts a durable workflow: an isolated Linux sandbox is created for your request, each step runs inside it in order, and the sandbox is destroyed when the plan finishes — nothing is shared between requests. The bot carries out the Discord-side actions, and the workflow records the result of every step so the Console can show you exactly what happened."}
              </p>
              <h2>
                {"Monthly report"}
              </h2>
              <p>
                {"Once a month, Controller can generate a report for your server: activity, growth and recommendations written by the agent. During the closed beta you can generate one on demand from the Console; automatic monthly runs for every server come later."}
              </p>
              <h2>
                {"Support and status"}
              </h2>
              <p>
                {"The chat bubble on any page shows live system status and an AI assistant that answers questions about Controller, around the clock."}
              </p>
              <h2>
                {"API"}
              </h2>
              <p>
                {"The Console talks to a small JSON API. All endpoints live under "}
                <code>
                  {"/api"}
                </code>
                {":"}
              </p>
              <ul>
                <li>
                  <code>
                    {"POST /api/preview"}
                  </code>
                  {" — turn a prompt into a plan or an answer."}
                </li>
                <li>
                  <code>
                    {"POST /api/execute"}
                  </code>
                  {" — start a plan (or a prompt) and get a request id."}
                </li>
                <li>
                  <code>
                    {"GET /api/status/:id"}
                  </code>
                  {" — current status and result of a request."}
                </li>
                <li>
                  <code>
                    {"POST /api/cancel/:id"}
                  </code>
                  {" — cancel a running request."}
                </li>
                <li>
                  <code>
                    {"GET /api/public/status"}
                  </code>
                  {" — system status feed."}
                </li>
                <li>
                  <code>
                    {"POST /api/support/chat"}
                  </code>
                  {" — AI support chat."}
                </li>
              </ul>
            </div>
          </div>
        </main>
        <footer>
          <div className={"wrap"}>
            <div className={"foot"}>
              <div>
                <a className={"brand"} href={"/"} style={{ padding: "0" }}>
                  <svg className={"logo"} viewBox={"0 0 24 24"} width={"24"} height={"24"} aria-hidden={"true"}>
                    <path d={"M2.5 5h19L12 20.5z"} fill={"currentColor"}></path>
                  </svg>
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
                <a href={"#"} rel={"noopener"} data-invite-only={""} hidden>
                  {"Add to Discord"}
                </a>
              </div>
              <div>
                <h4>
                  {"Help"}
                </h4>
                <a href={"#"} rel={"noopener"} data-support-url={""} hidden>
                  {"Discord server"}
                </a>
                <a href={"#"} data-support-email={""} hidden></a>
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
                <span data-year={""}>
                  {"2026"}
                </span>
                {" Controller"}
              </span>
              <span>
                {"Not affiliated with or endorsed by Discord Inc."}
              </span>
            </div>
          </div>
        </footer>
        <div id={"sw"}>
          <button className={"sw-launch"} id={"sw-launch"} type={"button"} aria-label={"Open support and system status"} aria-expanded={"false"} aria-controls={"sw-panel"}>
            <svg className={"ico-chat"} viewBox={"0 0 24 24"} fill={"none"} stroke={"currentColor"} strokeWidth={"2"} strokeLinecap={"round"} strokeLinejoin={"round"} aria-hidden={"true"}>
              <path d={"M5 5h14a1 1 0 0 1 1 1v9a1 1 0 0 1-1 1h-7l-4 3.5V16H5a1 1 0 0 1-1-1V6a1 1 0 0 1 1-1z"}></path>
              <path d={"M8.5 10.2c1 1.5 2.1 2.2 3.5 2.2s2.5-.7 3.5-2.2"}></path>
            </svg>
            <svg className={"ico-x"} viewBox={"0 0 24 24"} fill={"none"} stroke={"currentColor"} strokeWidth={"2.2"} strokeLinecap={"round"} strokeLinejoin={"round"} aria-hidden={"true"}>
              <path d={"M6 9.5l6 6 6-6"}></path>
            </svg>
            <span className={"sw-dot"} id={"sw-dot"}></span>
          </button>
          <div className={"sw-panel"} id={"sw-panel"} role={"dialog"} aria-label={"Support"} aria-hidden={"true"}>
            <section className={"sw-view on"} id={"sw-home"}>
              <div className={"sw-hero"}>
                <div className={"sw-brand"}>
                  <svg className={"logo"} viewBox={"0 0 24 24"} width={"24"} height={"24"} aria-hidden={"true"}>
                    <path d={"M2.5 5h19L12 20.5z"} fill={"currentColor"}></path>
                  </svg>
                  {"Controller"}
                </div>
                <button className={"sw-x"} type={"button"} data-sw-close={""} aria-label={"Close"}>
                  <svg viewBox={"0 0 24 24"} fill={"none"} stroke={"currentColor"} strokeWidth={"2.4"} strokeLinecap={"round"}>
                    <path d={"M6 6l12 12M18 6L6 18"}></path>
                  </svg>
                </button>
                <h3 className={"sw-hello"}>
                  {"Hi there"}
                  <br />
                  {"How can we help?"}
                </h3>
              </div>
              <div className={"sw-body"}>
                <div className={"sw-card"}>
                  <div className={"sw-card-h"}>
                    <b>
                      {"System status"}
                    </b>
                    <span id={"sw-updated"}></span>
                  </div>
                  <div className={"sw-overall"}>
                    <span className={"sw-ico"} id={"sw-ico"}></span>
                    <div>
                      <b id={"sw-label"}>
                        {"Checking status…"}
                      </b>
                      <small id={"sw-sub"}>
                        {"Live status of every part of Controller"}
                      </small>
                    </div>
                  </div>
                  <div className={"sw-list"} id={"sw-list"}></div>
                </div>
                <div className={"sw-card sw-ask"}>
                  <b>
                    {"Ask our AI assistant"}
                  </b>
                  <p>
                    {"Instant answers, any time. Replies are written by AI, not by people."}
                  </p>
                  <button className={"sw-btn"} type={"button"} id={"sw-ask"}>
                    {"Start a chat"}
                  </button>
                </div>
              </div>
            </section>
            <section className={"sw-view"} id={"sw-messages"}>
              <div className={"sw-bar"}>
                <div style={{ display: "block" }}>
                  <b>
                    {"AI Support"}
                  </b>
                  <small>
                    {"Answers are written by AI"}
                  </small>
                </div>
                <button className={"sw-x"} type={"button"} data-sw-close={""} aria-label={"Close"}>
                  <svg viewBox={"0 0 24 24"} fill={"none"} stroke={"currentColor"} strokeWidth={"2.4"} strokeLinecap={"round"}>
                    <path d={"M6 6l12 12M18 6L6 18"}></path>
                  </svg>
                </button>
              </div>
              <div className={"sw-thread"} id={"sw-thread"}></div>
              <form className={"sw-form"} id={"sw-form"} autoComplete={"off"}>
                <input id={"sw-input"} type={"text"} maxLength={600} placeholder={"Ask about Controller…"} aria-label={"Message"} />
                <button id={"sw-send"} type={"submit"} aria-label={"Send"} title={"Send"}>
                  <svg viewBox={"0 0 24 24"} fill={"none"} stroke={"currentColor"} strokeWidth={"2.2"} strokeLinecap={"round"} strokeLinejoin={"round"} aria-hidden={"true"}>
                    <path d={"M12 19V5"}></path>
                    <path d={"M5 12l7-7 7 7"}></path>
                  </svg>
                </button>
              </form>
            </section>
          </div>
        </div>
      </>
  )
}
