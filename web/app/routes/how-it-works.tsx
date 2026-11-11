import type { LinksFunction, MetaFunction } from "@remix-run/node"
import { siteLinks } from "../lib/site-links"
import { useScripts } from "../lib/use-scripts"

export const meta: MetaFunction = () => [
  { title: "How it works · Controller" },
  { name: "description", content: "How the agents, durable workflows and your bot turn a goal into a finished change." },
]

export const links: LinksFunction = () => [
  ...siteLinks(),
]

export default function HowItWorksRoute() {
  useScripts(["/config.js","/widget.js","/site.js"])
  return (
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
            <a href={"/how-it-works"} className={"on"}>
              {"How it works"}
            </a>
            <a href={"/faq"} className={""}>
              {"FAQ"}
            </a>
            <a href={"/support"} className={""}>
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
              {"How it works"}
            </h1>
            <p className={"lead"}>
              {"A goal goes in. An agent audits and plans it, a durable workflow runs it, and your bot carries it out."}
            </p>
          </div>
          <section className={"block"} style={{ paddingTop: "48px" }}>
            <div className={"steps"}>
              <div className={"step"}>
                <h3>
                  {"Sign in with a magic link"}
                </h3>
                <p>
                  {"Run "}
                  <span className={"mono"}>
                    {"/dashboard"}
                  </span>
                  {" in your server. The bot replies with a private link that only you can see. It works once and expires after 15 minutes."}
                </p>
              </div>
              <div className={"step"}>
                <h3>
                  {"Get your agent"}
                </h3>
                <p>
                  {"Each Console session is served by its own AI agent, one person at a time. If every agent is busy you wait in a line, with your position shown, and you are let in when one frees up."}
                </p>
              </div>
              <div className={"step"}>
                <h3>
                  {"State the goal"}
                </h3>
                <p>
                  {"Type what you want in the Console, for example “make a voice channel called Lounge and a role called Regulars”. You can add timing too, such as “lock it in two hours”."}
                </p>
              </div>
              <div className={"step"}>
                <h3>
                  {"The agent works step by step"}
                </h3>
                <p>
                  {"Your agent reads the request together with your server’s layout and refuses abuse and vague orders. Then it takes one action at a time, such as searching the web, writing a summary or changing the server, reads the result, and decides what to do next. If its main model fails, its backup model takes over."}
                </p>
              </div>
              <div className={"step"}>
                <h3>
                  {"A durable workflow keeps it running"}
                </h3>
                <p>
                  {"The whole job runs as a background workflow that survives restarts. It can pause between actions, for minutes or hours, then resume on time."}
                </p>
              </div>
              <div className={"step"}>
                <h3>
                  {"The bot executes the Discord side"}
                </h3>
                <p>
                  {"The bot has no AI of its own. It performs each Discord action with its own permissions and its own safety limits. If a Discord action fails, the run stops there and tells you why. The agent’s final report appears under the request."}
                </p>
              </div>
            </div>
          </section>
          <section className={"block"}>
            <div className={"head"}>
              <h2>
                {"What you see while it runs"}
              </h2>
              <p>
                {"Every request in the Console carries a live status."}
              </p>
            </div>
            <table className={"table"}>
              <tbody>
                <tr>
                  <td>
                    <span className={"badge s-processing"}>
                      <i></i>
                      {"Processing"}
                    </span>
                  </td>
                  <td>
                    {"The request is being checked and carried out."}
                  </td>
                </tr>
                <tr>
                  <td>
                    <span className={"badge s-waiting"}>
                      <i></i>
                      {"Waiting"}
                    </span>
                  </td>
                  <td>
                    {"The request includes a scheduled step and is paused until it is due. You can close the Console meanwhile."}
                  </td>
                </tr>
                <tr>
                  <td>
                    <span className={"badge s-cancelled"}>
                      <i></i>
                      {"Cancelled"}
                    </span>
                  </td>
                  <td>
                    {"You cancelled a waiting request. Steps that had already run are not undone."}
                  </td>
                </tr>
                <tr>
                  <td>
                    <span className={"badge s-executed"}>
                      <i></i>
                      {"Executed"}
                    </span>
                  </td>
                  <td>
                    {"Every step finished successfully."}
                  </td>
                </tr>
                <tr>
                  <td>
                    <span className={"badge s-failed_sensibility"}>
                      <i></i>
                      {"Rejected by audit"}
                    </span>
                  </td>
                  <td>
                    {"The safety check refused the request. The reason is shown under it."}
                  </td>
                </tr>
                <tr>
                  <td>
                    <span className={"badge s-blocked_by_traffic"}>
                      <i></i>
                      {"Traffic stall"}
                    </span>
                  </td>
                  <td>
                    {"Your agent was too busy to answer, even on its fallback model. Nothing ran, so you can safely send it again."}
                  </td>
                </tr>
                <tr>
                  <td>
                    <span className={"badge s-failed"}>
                      <i></i>
                      {"Failed"}
                    </span>
                  </td>
                  <td>
                    {"A step could not be completed, usually because of a Discord permission. The error is shown."}
                  </td>
                </tr>
              </tbody>
            </table>
          </section>
          <section className={"block"}>
            <div className={"grid"} style={{ gap: "40px", gridTemplateColumns: "repeat(auto-fit,minmax(300px,1fr))" }}>
              <div className={"prose"} style={{ marginTop: "0" }}>
                <h2 style={{ marginTop: "0" }}>
                  {"What the audit refuses"}
                </h2>
                <ul>
                  <li>
                    {"Tricks that try to change the bot’s rules or reveal its instructions."}
                  </li>
                  <li>
                    {"Anything aimed at the server owner or the bot itself."}
                  </li>
                  <li>
                    {"Wiping a server in one go, such as “ban everyone” or “delete all channels”."}
                  </li>
                  <li>
                    {"Spam, harassment, scams, or anything that breaks Discord’s rules."}
                  </li>
                  <li>
                    {"Requests too vague to carry out without guessing who or what they mean."}
                  </li>
                </ul>
              </div>
              <div className={"prose"} style={{ marginTop: "0" }}>
                <h2 style={{ marginTop: "0" }}>
                  {"Good to know"}
                </h2>
                <ul>
                  <li>
                    {"Steps inside one request run in order and stop at the first problem."}
                  </li>
                  <li>
                    {"A waiting request can be cancelled from the Console. Closing the Console does not cancel it."}
                  </li>
                  <li>
                    {"Waits are capped at 6 hours each and 12 hours in total."}
                  </li>
                  <li>
                    {"One request allows up to 10 agent turns and 25 Discord actions."}
                  </li>
                  <li>
                    {"Web research is limited to 4 searches per request. Email and webhooks work only for recipients and hosts that were set up in advance."}
                  </li>
                  <li>
                    {"Text the agent reads from the web is treated as untrusted. After that, kicks, bans, deletes and other destructive actions are blocked for that request."}
                  </li>
                  <li>
                    {"The bot can only act on people below its own role, so keep its role high in your list."}
                  </li>
                  <li>
                    {"Deleting and banning cannot be undone by the bot. Check the request before sending it."}
                  </li>
                </ul>
              </div>
            </div>
          </section>
          <section className={"band"}>
            <h2>
              {"Ready to put agents to work?"}
            </h2>
            <p className={"lead"}>
              {"Run "}
              <span className={"mono"}>
                {"/dashboard"}
              </span>
              {" in your server to open the Console."}
            </p>
            <div className={"cta"}>
              <a className={"btn btn-primary"} href={"/dashboard"} data-invite={""}>
                {"Open Console"}
              </a>
              <a className={"btn"} href={"/faq"}>
                {"Read the FAQ"}
              </a>
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
