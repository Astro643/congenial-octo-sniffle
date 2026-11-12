import type { PageMeta } from "../lib/page.ts"

export const meta: PageMeta = {
  title: "Terms of Service · Controller",
  description: "The rules for using Controller.",
  styles: ["/site.css"],
  scripts: ["/config.js","/widget.js","/site.js"],
}

export function TermsPage() {
  return () => (
      <>
        <header className={"nav"}>
          <div className={"wrap nav-in"}>
            <a className={"brand"} href={"/"}>
              <svg className={"logo"} viewBox={"0 0 24 24"} aria-hidden={"true"}>
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
                {"Terms of Service"}
              </h1>
              <p className={"lead"}>
                {"The simple rules for using Controller."}
              </p>
            </div>
            <div className={"prose"}>
              <p className={"updated"}>
                {"Last updated: October 31, 2026"}
              </p>
              <h2>
                {"Agreement"}
              </h2>
              <p>
                {"By adding the Controller bot to a server or using its website (the “Service”), you agree to these terms. If you do not agree, please do not use the Service."}
              </p>
              <h2>
                {"Who may use it"}
              </h2>
              <p>
                {"The Console is for the owner of the server the bot is in. You must follow Discord’s Terms of Service and Community Guidelines, and you must be old enough to use Discord."}
              </p>
              <h2>
                {"What the Service does"}
              </h2>
              <p>
                {"The Service turns your written requests into actions on your Discord server, after an AI-based safety check. It can create, change and delete channels, roles and messages, and can moderate members, including by kicking, banning and timing them out."}
              </p>
              <h2>
                {"Agents and the waiting line"}
              </h2>
              <p>
                {"The Console is staffed by a limited number of AI agents, each serving one person at a time. If all are busy you will be placed in a line. An agent is released when you close the Console, and may be released if your session is idle while others wait. Requests can include scheduled steps that run later, up to 12 hours in total."}
              </p>
              <h2>
                {"Fair use"}
              </h2>
              <p>
                {"The Service is free, and its overall capacity may be changed at any time. We may limit or end access for anyone who abuses it, for example by sending requests unrelated to a Discord server, flooding the Service with requests, or trying to get around its limits."}
              </p>
              <h2>
                {"Research, email and webhooks"}
              </h2>
              <p>
                {"Agents can search the web, write text, and, where the operator has enabled it, send email and call webhooks. They can only reach recipients and hosts set up in advance. Information found on the web may be wrong or outdated. Check anything important before relying on it. You must not use these tools to spam, harass, deceive or attack anyone."}
              </p>
              <h2>
                {"Your responsibility"}
              </h2>
              <ul>
                <li>
                  {"You are responsible for the requests you make and for what they do to your server and its members."}
                </li>
                <li>
                  {"Some actions cannot be undone, including deleting channels and removing members."}
                </li>
                <li>
                  {"The AI can misunderstand a request. Review what you send, and check results."}
                </li>
                <li>
                  {"Keep your magic links private. Anyone holding a valid link can act as you until it is used or expires."}
                </li>
              </ul>
              <h2>
                {"Acceptable use"}
              </h2>
              <p>
                {"Do not use the Service to harass or harm people, to spam, to evade bans, to break Discord’s rules or the law, to try to bypass its safety checks, or to attempt to access anything that is not yours."}
              </p>
              <h2>
                {"Safety checks are not a guarantee"}
              </h2>
              <p>
                {"The safety check is designed to refuse abusive or unclear requests, but it can be wrong in either direction. It is a safeguard, not a promise that every request will be handled correctly."}
              </p>
              <h2>
                {"AI support"}
              </h2>
              <p>
                {"Support in the chat widget is answered by an AI assistant (with a backup assistant if it is down), not by people. If both are unavailable, support is temporarily down. Its answers can be incomplete or wrong, so verify anything important yourself. The assistant cannot see or change your server."}
              </p>
              <h2>
                {"Availability"}
              </h2>
              <p>
                {"The Service is provided “as is” and “as available”. It may be interrupted, changed or discontinued, and it depends on third-party services such as Discord and Google that we do not control."}
              </p>
              <h2>
                {"Suspension"}
              </h2>
              <p>
                {"We may limit or end access to the Service for anyone who breaks these terms or misuses it."}
              </p>
              <h2>
                {"Limitation of liability"}
              </h2>
              <p>
                {"To the fullest extent the law allows, we are not liable for indirect or consequential losses, or for loss of data, members or content on your server, arising from your use of the Service. Nothing in these terms limits liability that cannot be limited by law."}
              </p>
              <h2>
                {"Privacy"}
              </h2>
              <p>
                {"How we handle data is described in the "}
                <a href={"/privacy"} style={{ color: "var(--green-ink)" }}>
                  {"Privacy Policy"}
                </a>
                {"."}
              </p>
              <h2>
                {"Changes"}
              </h2>
              <p>
                {"We may update these terms. If we do, we will change the date above, and continued use means you accept the new terms."}
              </p>
              <h2>
                {"Contact"}
              </h2>
              <p>
                {"Questions about these terms: "}
                <span data-contact={""}>
                  <a data-support-email={""} hidden style={{ color: "var(--green-ink)" }}></a>
                  <span data-contact-or={""} hidden>
                    {" or "}
                  </span>
                  <a data-support-url={""} hidden style={{ color: "var(--green-ink)" }} rel={"noopener"}>
                    {"our Discord server"}
                  </a>
                  <span data-contact-none={""}>
                    {"please contact whoever operates this bot for your server."}
                  </span>
                </span>
              </p>
            </div>
          </div>
        </main>
        <footer>
          <div className={"wrap"}>
            <div className={"foot"}>
              <div>
                <a className={"brand"} href={"/"} style={{ padding: "0" }}>
                  <svg className={"logo"} viewBox={"0 0 24 24"} aria-hidden={"true"}>
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
                  <svg className={"logo"} viewBox={"0 0 24 24"} aria-hidden={"true"}>
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
                <div>
                  <button className={"sw-ib"} type={"button"} id={"sw-new"} aria-label={"New chat"} title={"New chat"}>
                    <svg viewBox={"0 0 24 24"} fill={"none"} stroke={"currentColor"} strokeWidth={"2.2"} strokeLinecap={"round"}>
                      <path d={"M12 5v14M5 12h14"}></path>
                    </svg>
                  </button>
                  <button className={"sw-ib"} type={"button"} data-sw-close={""} aria-label={"Close"}>
                    <svg viewBox={"0 0 24 24"} fill={"none"} stroke={"currentColor"} strokeWidth={"2.4"} strokeLinecap={"round"}>
                      <path d={"M6 6l12 12M18 6L6 18"}></path>
                    </svg>
                  </button>
                </div>
              </div>
              <div className={"sw-thread"} id={"sw-thread"} aria-live={"polite"}></div>
              <div className={"sw-note"}>
                {"AI can make mistakes. For anything important, check the FAQ."}
              </div>
              <form className={"sw-form"} id={"sw-form"} autoComplete={"off"}>
                <input id={"sw-input"} type={"text"} maxLength={600} placeholder={"Ask a question"} aria-label={"Your question"} />
                <button className={"sw-send"} id={"sw-send"} type={"submit"} aria-label={"Send"}>
                  <svg viewBox={"0 0 24 24"} fill={"none"} stroke={"currentColor"} strokeWidth={"2.6"} strokeLinecap={"round"} strokeLinejoin={"round"} aria-hidden={"true"}>
                    <path d={"M12 19V5"}></path>
                    <path d={"M5 12l7-7 7 7"}></path>
                  </svg>
                </button>
              </form>
            </section>
            <nav className={"sw-tabs"} aria-label={"Support sections"}>
              <button className={"sw-tab on"} type={"button"} id={"sw-tab-home"} data-tab={"home"}>
                <svg viewBox={"0 0 24 24"} stroke={"currentColor"} strokeWidth={"1.9"} strokeLinejoin={"round"} strokeLinecap={"round"} fill={"none"} aria-hidden={"true"}>
                  <path d={"M4 11.2 12 4.8l8 6.4V19a1 1 0 0 1-1 1h-4.2v-5.2H9.2V20H5a1 1 0 0 1-1-1z"}></path>
                </svg>
                {"Home"}
              </button>
              <button className={"sw-tab"} type={"button"} id={"sw-tab-messages"} data-tab={"messages"}>
                <svg viewBox={"0 0 24 24"} stroke={"currentColor"} strokeWidth={"1.9"} strokeLinejoin={"round"} strokeLinecap={"round"} fill={"none"} aria-hidden={"true"}>
                  <path d={"M5 5h14a1 1 0 0 1 1 1v9a1 1 0 0 1-1 1h-7l-4 3.5V16H5a1 1 0 0 1-1-1V6a1 1 0 0 1 1-1z"}></path>
                </svg>
                {"Messages"}
              </button>
            </nav>
          </div>
        </div>
      </>
  )
}
