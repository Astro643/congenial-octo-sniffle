import type { LinksFunction, MetaFunction } from "@remix-run/node"
import { siteLinks } from "../lib/site-links"
import { useScripts } from "../lib/use-scripts"

export const meta: MetaFunction = () => [
  { title: "Controller · Agentic infrastructure for Discord" },
  { name: "description", content: "Agentic infrastructure for Discord. AI agents audit and plan your goals, durable workflows run them, and your bot carries them out." },
]

export const links: LinksFunction = () => [
  ...siteLinks(),
]

export default function IndexRoute() {
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
            <a href={"/how-it-works"} className={""}>
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
          <section className={"agentic landing"} aria-label={"Agentic infrastructure"}>
            <div className={"a-left"}>
              <h2>
                {"Agentic"}
                <br />
                {"infrastructure"}
              </h2>
            </div>
            <div className={"a-mid"}>
              <div className={"tile"}>
                <svg viewBox={"0 0 24 24"} aria-hidden={"true"}>
                  <path d={"M2.5 5h19L12 20.5z"} fill={"currentColor"}></path>
                </svg>
              </div>
            </div>
            <div className={"a-right"}>
              <span className={"a-chip"} tabIndex={0} aria-describedby={"a-tip"}>
                {"Automated by agents"}
              </span>
              <span className={"a-tip"} id={"a-tip"} role={"tooltip"}>
                {"Agents audit and plan, workflows run it, your bot acts."}
              </span>
            </div>
            <a className={"scroll"} id={"scroll-cue"} href={"#intro"} aria-label={"Scroll to learn more"}>
              <span>
                {"Scroll"}
              </span>
              <svg viewBox={"0 0 24 22"} aria-hidden={"true"}>
                <path d={"M1.5 2h21L12 20z"} fill={"currentColor"}></path>
              </svg>
            </a>
          </section>
          <section className={"hero"} id={"intro"}>
            <span className={"eyebrow"}>
              {"Agentic infrastructure for Discord"}
            </span>
            <h1>
              {"Give your server "}
              <em>
                {"agents that do the work."}
              </em>
            </h1>
            <p className={"lead"}>
              {"State a goal in plain language. A dedicated AI agent audits it, researches, decides each next step and acts, a durable workflow keeps it running, and your bot carries out the Discord side, in seconds or across hours."}
            </p>
            <div className={"cta"}>
              <a className={"btn btn-primary"} href={"/dashboard"} data-invite={""}>
                {"Open Console"}
              </a>
              <a className={"btn"} href={"/how-it-works"}>
                {"See how it works"}
              </a>
            </div>
            <div className={"demo"} aria-label={"Example request"}>
              <div className={"bubble"}>
                {"Post the tournament rules in #announcements, then lock #signups in 2 hours"}
              </div>
              <div className={"row"}>
                <span className={"badge s-waiting"}>
                  <i></i>
                  {"Waiting"}
                </span>
                <span className={"mono"}>
                  {"2 steps · resumes in 2h"}
                </span>
              </div>
              <div className={"steps-mini"}>
                <div>
                  <b>
                    {"1"}
                  </b>
                  {" post the rules in #announcements "}
                  <span style={{ color: "var(--green)" }}>
                    {" · done"}
                  </span>
                </div>
                <div>
                  <b>
                    {"2"}
                  </b>
                  {" wait 2 hours, then lock #signups from @everyone"}
                </div>
              </div>
            </div>
          </section>
          <section className={"block"}>
            <div className={"head"}>
              <h2>
                {"Infrastructure, not another dashboard."}
              </h2>
              <p>
                {"Four parts work together so a request can be checked, planned and finished without you babysitting it."}
              </p>
            </div>
            <div className={"grid"} style={{ gridTemplateColumns: "repeat(auto-fit,minmax(230px,1fr))" }}>
              <div className={"card"}>
                <div className={"bar"}></div>
                <h3>
                  {"Your own agent"}
                </h3>
                <p>
                  {"Every Console session gets a dedicated AI agent that audits the request, then works step by step, reading each result before choosing the next. It has a backup model ready if its main model fails."}
                </p>
              </div>
              <div className={"card"}>
                <div className={"bar"}></div>
                <h3>
                  {"Durable workflows"}
                </h3>
                <p>
                  {"Each request runs as a background workflow. It can pause for minutes or hours and pick up again on time, even after you close the Console."}
                </p>
              </div>
              <div className={"card"}>
                <div className={"bar"}></div>
                <h3>
                  {"An executor, not a gambler"}
                </h3>
                <p>
                  {"The bot has no AI of its own. It performs one approved step at a time, with hard safety limits built into the bot itself."}
                </p>
              </div>
              <div className={"card"}>
                <div className={"bar"}></div>
                <h3>
                  {"Visible end to end"}
                </h3>
                <p>
                  {"Live status for every request, and a live status card for the bot, each agent and the task engine, right in the corner of the site."}
                </p>
              </div>
            </div>
          </section>
          <section className={"block"}>
            <div className={"head"}>
              <h2>
                {"What your agents can do."}
              </h2>
              <p>
                {"Anything an owner does by hand, from one sentence."}
              </p>
            </div>
            <div className={"grid"}>
              <div className={"card"}>
                <div className={"bar"}></div>
                <h3>
                  {"Structure"}
                </h3>
                <p>
                  {"Create categories and channels, rename them, lock them down or remove them when you are done."}
                </p>
              </div>
              <div className={"card"}>
                <div className={"bar"}></div>
                <h3>
                  {"Roles"}
                </h3>
                <p>
                  {"Make roles with exactly the permissions you choose, then hand them out or take them back."}
                </p>
              </div>
              <div className={"card"}>
                <div className={"bar"}></div>
                <h3>
                  {"Moderation"}
                </h3>
                <p>
                  {"Kick, ban, time out or rename members, people and bots alike, simply by their display name."}
                </p>
              </div>
              <div className={"card"}>
                <div className={"bar"}></div>
                <h3>
                  {"Scheduled work"}
                </h3>
                <p>
                  {"Ask for something to happen later, such as locking a channel in two hours. Waits can last up to 12 hours in total."}
                </p>
              </div>
              <div className={"card"}>
                <div className={"bar"}></div>
                <h3>
                  {"Research and automation"}
                </h3>
                <p>
                  {"Search the web, write the summary, post it to Discord, email it to you or call your own webhooks, all from one goal."}
                </p>
              </div>
              <div className={"card"}>
                <div className={"bar"}></div>
                <h3>
                  {"Anything Discord allows"}
                </h3>
                <p>
                  {"Beyond the built-in actions, agents can use Discord itself for threads, events, invites, emojis and more."}
                </p>
              </div>
            </div>
          </section>
          <section className={"block"}>
            <div className={"head"}>
              <h2>
                {"Three steps. No setup screens."}
              </h2>
            </div>
            <div className={"steps"}>
              <div className={"step"}>
                <h3>
                  {"Get a magic link"}
                </h3>
                <p>
                  {"Type "}
                  <span className={"mono"}>
                    {"/dashboard"}
                  </span>
                  {" in your server. Only you can see the link, and it works once."}
                </p>
              </div>
              <div className={"step"}>
                <h3>
                  {"State the goal"}
                </h3>
                <p>
                  {"Write it the way you would tell a person. No commands to learn."}
                </p>
              </div>
              <div className={"step"}>
                <h3>
                  {"Let the agents run it"}
                </h3>
                <p>
                  {"Your agent audits and plans it, the workflow runs it, and the status updates live."}
                </p>
              </div>
            </div>
            <p style={{ marginTop: "22px" }}>
              <a href={"/how-it-works"} style={{ color: "var(--green-ink)", fontWeight: "600", textDecoration: "none" }}>
                {"Read the full walkthrough →"}
              </a>
            </p>
          </section>
          <section className={"block"}>
            <div className={"grid"} style={{ alignItems: "center", gap: "40px", gridTemplateColumns: "repeat(auto-fit,minmax(300px,1fr))" }}>
              <div>
                <h2>
                  {"Autonomy with the owner in control."}
                </h2>
                <p className={"lead"} style={{ marginTop: "14px" }}>
                  {"Agents are only worth it if you can trust them. These protections are built in, not bolted on."}
                </p>
              </div>
              <ul className={"checks"}>
                <li>
                  <span>
                    <b>
                      {"Owner only."}
                    </b>
                    {" Your magic link works once and expires in minutes."}
                  </span>
                </li>
                <li>
                  <span>
                    <b>
                      {"Never against you."}
                    </b>
                    {" The bot refuses to act against the server owner or itself."}
                  </span>
                </li>
                <li>
                  <span>
                    <b>
                      {"Audited first."}
                    </b>
                    {" Requests that look abusive or unclear are rejected before anything runs."}
                  </span>
                </li>
                <li>
                  <span>
                    <b>
                      {"Web content cannot take control."}
                    </b>
                    {" Once an agent has read the web, destructive actions like bans and deletes are blocked for that request."}
                  </span>
                </li>
                <li>
                  <span>
                    <b>
                      {"Fails safe."}
                    </b>
                    {" If an agent and its backup model are both unavailable, nothing runs."}
                  </span>
                </li>
                <li>
                  <span>
                    <b>
                      {"Cancel while waiting."}
                    </b>
                    {" A request paused for a scheduled step can be cancelled any time before it resumes."}
                  </span>
                </li>
                <li>
                  <span>
                    <b>
                      {"Capped."}
                    </b>
                    {" A single request is limited in size, so one mistake cannot snowball."}
                  </span>
                </li>
              </ul>
            </div>
          </section>
          <section className={"band"}>
            <h2>
              {"Put agents to work on your server."}
            </h2>
            <p className={"lead"}>
              {"Add the bot, run "}
              <span className={"mono"}>
                {"/dashboard"}
              </span>
              {", and hand over your first goal."}
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
