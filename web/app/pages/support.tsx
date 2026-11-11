import type { PageMeta } from "../lib/page.ts"

export const meta: PageMeta = {
  title: "Support · Controller",
  description: "Get help, fix common problems and reach us.",
  styles: ["/site.css","/support-extras.css"],
  scripts: ["/config.js","/widget.js","/site.js"],
}

export function SupportPage() {
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
            <nav aria-label={"Main"}>
              <a href={"/how-it-works"} className={""}>
                {"How it works"}
              </a>
              <a href={"/faq"} className={""}>
                {"FAQ"}
              </a>
              <a href={"/support"} className={"on"}>
                {"Support"}
              </a>
            </nav>
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
                {"Support"}
              </h1>
              <p className={"lead"}>
                {"Fix a common problem in a minute, ask our AI assistant, or talk to a real person."}
              </p>
            </div>
            <section className={"block"} style={{ paddingTop: "44px" }}>
              <div className={"grid"}>
                <div className={"card"}>
                  <div className={"bar"}></div>
                  <h3>
                    {"Ask the AI assistant"}
                  </h3>
                  <p>
                    {"Instant answers any time of day, written by AI."}
                  </p>
                  <p style={{ marginTop: "16px" }}>
                    <button className={"btn btn-primary btn-sm"} type={"button"} data-open-support={""}>
                      {"Start a chat"}
                    </button>
                  </p>
                </div>
                <div className={"card"}>
                  <div className={"bar"}></div>
                  <h3>
                    {"Live system status"}
                  </h3>
                  <p>
                    {"See whether Agents 1, 2 and 3 and the support assistant are running. Open the chat button in the corner and look at the Home tab."}
                  </p>
                  <p style={{ marginTop: "16px" }}>
                    <button className={"btn btn-sm"} type={"button"} data-open-support={""}>
                      {"See status"}
                    </button>
                  </p>
                </div>
                <div className={"card"}>
                  <div className={"bar"}></div>
                  <h3>
                    {"Read first"}
                  </h3>
                  <p>
                    {"Most answers are in the "}
                    <a href={"/faq"} style={{ color: "var(--green-ink)" }}>
                      {"FAQ"}
                    </a>
                    {" and the "}
                    <a href={"/how-it-works"} style={{ color: "var(--green-ink)" }}>
                      {"walkthrough"}
                    </a>
                    {"."}
                  </p>
                </div>
              </div>
            </section>
            <section className={"block"}>
              <div className={"head"}>
                <h2>
                  {"Common problems"}
                </h2>
              </div>
              <div className={"faq"} style={{ marginTop: "0" }}>
                <details>
                  <summary>
                    {"The "}
                    <span className={"mono"}>
                      {"/dashboard"}
                    </span>
                    {" command does not appear"}
                  </summary>
                  <div className={"ans"}>
                    <p>
                      {"New commands can take a few minutes to show up after the bot starts. Check that the bot is online and in your server, then type "}
                      <span className={"mono"}>
                        {"/"}
                      </span>
                      {" and look again. Restarting Discord can also help."}
                    </p>
                  </div>
                </details>
                <details>
                  <summary>
                    {"My magic link says it was already used or expired"}
                  </summary>
                  <div className={"ans"}>
                    <p>
                      {"Links work once and expire after 15 minutes. Run "}
                      <span className={"mono"}>
                        {"/dashboard"}
                      </span>
                      {" again for a fresh one. Chat apps that preview links do not use them up, but opening the link twice does."}
                    </p>
                  </div>
                </details>
                <details>
                  <summary>
                    {"A request shows Failed with a permissions error"}
                  </summary>
                  <div className={"ans"}>
                    <p>
                      {"Open Server Settings → Roles and drag the bot’s role above the roles of the members you want it to act on. Make sure it has the permission needed for the action, or Administrator."}
                    </p>
                  </div>
                </details>
                <details>
                  <summary>
                    {"It says no member was found, or several match"}
                  </summary>
                  <div className={"ans"}>
                    <p>
                      {"Use the person’s user ID instead of their name. In Discord, turn on Developer Mode, then right-click the member and choose Copy User ID."}
                    </p>
                  </div>
                </details>
                <details>
                  <summary>
                    {"It was rejected by the audit but my request seems fine"}
                  </summary>
                  <div className={"ans"}>
                    <p>
                      {"The reason is shown under the request. The most common cause is wording that is too vague, such as “ban the bad people”. Name the exact people, channels or roles and send it again."}
                    </p>
                  </div>
                </details>
                <details>
                  <summary>
                    {"The session ended while I was working"}
                  </summary>
                  <div className={"ans"}>
                    <p>
                      {"Sessions last 12 hours. Run "}
                      <span className={"mono"}>
                        {"/dashboard"}
                      </span>
                      {" again to sign back in."}
                    </p>
                  </div>
                </details>
              </div>
            </section>
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
                <a href={"/how-it-works"}>
                  {"How it works"}
                </a>
                <a href={"/faq"}>
                  {"FAQ"}
                </a>
                <a href={"/dashboard"}>
                  {"Console"}
                </a>
                <a href={"#"} rel={"noopener"} data-invite-only={""} hidden>
                  {"Add to Discord"}
                </a>
              </div>
              <div>
                <h4>
                  {"Help"}
                </h4>
                <a href={"/support"}>
                  {"Support"}
                </a>
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
