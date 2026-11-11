import type { LinksFunction, MetaFunction } from "@remix-run/node"
import { siteLinks } from "../lib/site-links"
import { useScripts } from "../lib/use-scripts"

export const meta: MetaFunction = () => [
  { title: "FAQ · Controller" },
  { name: "description", content: "Answers about agents, workflows, safety, permissions and what the bot can do." },
]

export const links: LinksFunction = () => [
  ...siteLinks(),
]

export default function FaqRoute() {
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
            <a href={"/faq"} className={"on"}>
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
              {"Frequently asked questions"}
            </h1>
            <p className={"lead"}>
              {"Quick answers about agents, workflows, safety and what to expect."}
            </p>
          </div>
          <div className={"faq"}>
            <details open>
              <summary>
                {"Who can use the Console?"}
              </summary>
              <div className={"ans"}>
                <p>
                  {"Only the server owner. The "}
                  <span className={"mono"}>
                    {"/dashboard"}
                  </span>
                  {" command refuses everyone else, and the link it creates is shown only to the person who ran it."}
                </p>
              </div>
            </details>
            <details>
              <summary>
                {"Is it safe to give a bot this much power?"}
              </summary>
              <div className={"ans"}>
                <p>
                  {"Every request is reviewed by a safety check before anything runs, and some limits are enforced by the bot itself no matter what the AI says: it never acts against the owner or itself, never deletes the server, never prunes or mass-bans, and a single request is capped in size."}
                </p>
                <p>
                  {"Even so, it can delete and ban when you ask it to. Treat each request the way you would treat clicking the button yourself."}
                </p>
              </div>
            </details>
            <details>
              <summary>
                {"What does a magic link do?"}
              </summary>
              <div className={"ans"}>
                <p>
                  {"It signs you in once. It expires after 15 minutes, and opening it uses it up, so a copied link is useless afterwards. Your session then lasts 12 hours. Run "}
                  <span className={"mono"}>
                    {"/dashboard"}
                  </span>
                  {" again whenever you need a new one."}
                </p>
              </div>
            </details>
            <details>
              <summary>
                {"What permissions does the bot need?"}
              </summary>
              <div className={"ans"}>
                <p>
                  {"Administrator is the simplest way to let it do everything you might ask. The bot’s role must also sit above the roles of anyone you want it to kick, ban or time out, because Discord does not let a bot act on members above it."}
                </p>
              </div>
            </details>
            <details>
              <summary>
                {"Why did my request fail?"}
              </summary>
              <div className={"ans"}>
                <p>
                  {"The error appears under the request. The usual causes are the bot’s role being too low, a missing permission, or two members sharing the same name (in that case, use the person’s user ID). Fix it and send the request again."}
                </p>
              </div>
            </details>
            <details>
              <summary>
                {"Can it kick or ban by display name?"}
              </summary>
              <div className={"ans"}>
                <p>
                  {"Yes. It matches usernames, display names and server nicknames, for people and for bots. If more than one member matches, it stops and lists them so you can use an ID instead."}
                </p>
              </div>
            </details>
            <details>
              <summary>
                {"Can I undo a change?"}
              </summary>
              <div className={"ans"}>
                <p>
                  {"Not automatically. You can ask for the opposite, such as unlocking a channel or unbanning a user, but deleted channels and removed members cannot be restored by the bot."}
                </p>
              </div>
            </details>
            <details>
              <summary>
                {"What does the AI get to see?"}
              </summary>
              <div className={"ans"}>
                <p>
                  {"Your request plus a snapshot of your server’s layout: its name, channel and role names and IDs, and the owner and bot IDs. It does not read or store your chat messages. See the "}
                  <a href={"/privacy"} style={{ color: "var(--green-ink)" }}>
                    {"Privacy Policy"}
                  </a>
                  {" for details."}
                </p>
              </div>
            </details>
            <details>
              <summary>
                {"What does “Traffic stall” mean?"}
              </summary>
              <div className={"ans"}>
                <p>
                  {"Your agent was too busy to answer, even on its fallback model. Nothing was changed, so you can safely send the request again."}
                </p>
              </div>
            </details>
            <details>
              <summary>
                {"What can the agents do besides Discord?"}
              </summary>
              <div className={"ans"}>
                <p>
                  {"They can research the web, write and summarise text, send email and call webhooks, then use the result in Discord. For example: “Find this week’s patch notes, summarise them in #news and email me the link”. Email and webhooks only go to recipients and hosts the server operator has set up in advance, so an agent cannot contact anyone else."}
                </p>
              </div>
            </details>
            <details>
              <summary>
                {"Is my request history saved?"}
              </summary>
              <div className={"ans"}>
                <p>
                  {"Yes, for 30 days. We keep the text of each request, its result, plus a log of irreversible actions the agent took, such as bans and deletions. Ask us to delete them at any time. See the "}
                  <a href={"/privacy"} style={{ color: "var(--green-ink)" }}>
                    {"Privacy Policy"}
                  </a>
                  {"."}
                </p>
              </div>
            </details>
            <details>
              <summary>
                {"Why am I in a line?"}
              </summary>
              <div className={"ans"}>
                <p>
                  {"The Console is staffed by a few AI agents, and each serves one person at a time. When all are busy you wait, with your position shown, and you are let in when someone closes their Console. Keep the tab open to hold your place. An idle session gives up its agent if others are waiting."}
                </p>
              </div>
            </details>
            <details>
              <summary>
                {"Can I ask for something to happen later?"}
              </summary>
              <div className={"ans"}>
                <p>
                  {"Yes. Say so in the request, for example “in 2 hours, post a reminder in announcements”. It shows as Waiting and runs on time even if you close the Console. To stop it, press Cancel on the waiting request; steps that already ran are not undone. Waits are capped at 6 hours each and 12 hours in total."}
                </p>
              </div>
            </details>
            <details>
              <summary>
                {"Can it do things that are not listed?"}
              </summary>
              <div className={"ans"}>
                <p>
                  {"Often, yes. Besides its built-in actions, the bot can send requests to Discord directly for things like threads, events and invites. Sensible requests that fit within Discord’s rules are usually carried out."}
                </p>
              </div>
            </details>
          </div>
          <section className={"band"} style={{ marginTop: "72px" }}>
            <h2>
              {"Still have a question?"}
            </h2>
            <p className={"lead"}>
              {"We are happy to help."}
            </p>
            <div className={"cta"}>
              <a className={"btn btn-primary"} href={"/support"}>
                {"Contact support"}
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
