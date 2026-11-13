import type { PageMeta } from "../lib/page.ts"
import { Footer, Header } from "../ui/chrome.tsx"
import { ScrollCue } from "../ui/scroll-cue.tsx"
import { inviteHref } from "../lib/site-config.ts"
import { SupportWidget } from "../ui/support-widget.tsx"

export const meta: PageMeta = {
  title: "Controller · Agentic infrastructure for Discord",
  description: "Agentic infrastructure for Discord. AI agents audit and plan your goals, durable workflows run them, and your bot carries them out.",
  styles: ["/site.css"],
}

export function HomePage() {
  return () => (
      <>
        <Header />
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
              <ScrollCue />
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
                <a className={"btn btn-primary"} href={inviteHref || "/dashboard"}>
                  {inviteHref ? "Add to Discord" : "Open Console"}
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
                <a className={"btn btn-primary"} href={inviteHref || "/dashboard"}>
                  {inviteHref ? "Add to Discord" : "Open Console"}
                </a>
              </div>
            </section>
          </div>
        </main>
        <Footer />
        <SupportWidget />
      </>
  )
}
