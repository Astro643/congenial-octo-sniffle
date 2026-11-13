import type { PageMeta } from "../lib/page.ts"
import { Footer, Header } from "../ui/chrome.tsx"
import { SupportWidget } from "../ui/support-widget.tsx"

export const meta: PageMeta = {
  title: "Docs · Controller",
  description:
    "How to use the Controller Console: getting started, writing goals, previews, request statuses, safety, the monthly schedule and how requests run under the hood.",
  styles: ["/site.css"],
}

export function DocsPage() {
  return () => (
      <>
        <Header />
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
                {"Getting started"}
              </h2>
              <p>
                {"Controller has no setup screens and no passwords. Add the bot to your server, then type "}
                <span className={"mono"}>
                  {"/dashboard"}
                </span>
                {" in your server. The bot replies with a magic link that only you can see \u2014 it works once and expires in minutes. Open it to reach your Console."}
              </p>
              <p>
                {"If the Console ever says your session expired, just run "}
                <span className={"mono"}>
                  {"/dashboard"}
                </span>
                {" again for a fresh link. Your request history is not lost \u2014 it lives in your browser."}
              </p>
              <h2>
                {"Using the Console"}
              </h2>
              <p>
                {"Describe a change in plain language and press execute. Controller first shows you a preview: either a short plan with the steps it intends to run, or \u2014 if your message was a question \u2014 a direct answer."}
              </p>
              <ul>
                <li>
                  <b>
                    {"Preview."}
                  </b>
                  {" You always see what will happen before it happens. If the request is unclear, the preview becomes a question instead \u2014 press edit request, add the missing detail, and run it again."}
                </li>
                <li>
                  <b>
                    {"Auto-execute."}
                  </b>
                  {" A clear plan executes itself after a short countdown. Press cancel if you changed your mind \u2014 nothing runs until you confirm or the countdown ends."}
                </li>
                <li>
                  <b>
                    {"Tracking."}
                  </b>
                  {" Each request appears in your Console with a live status. Your last 50 requests are kept in your browser only \u2014 clearing your browser data clears them."}
                </li>
                <li>
                  <b>
                    {"Cancel."}
                  </b>
                  {" A waiting request can be cancelled. Steps that already ran are not undone."}
                </li>
              </ul>
              <h2>
                {"Writing good goals"}
              </h2>
              <p>
                {"Write the goal the way you would tell a person. A few habits get better plans:"}
              </p>
              <ul>
                <li>
                  <b>
                    {"Name the exact targets."}
                  </b>
                  {" \u201cRename #general to #lobby and slow it to 5 seconds\u201d beats \u201ctidy up my channels\u201d."}
                </li>
                <li>
                  <b>
                    {"One outcome per request."}
                  </b>
                  {" Ten small requests are easier to preview, track and cancel than one giant one."}
                </li>
                <li>
                  <b>
                    {"Questions are free."}
                  </b>
                  {" Ask \u201chow many webhooks does my server have?\u201d \u2014 questions get answers, not actions."}
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
                    {"Waiting."}
                  </b>
                  {" The request is queued and will start shortly. It can still be cancelled."}
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
                  {" Something went wrong; the note says what. Nothing is retried without your say-so \u2014 run it again from the Console."}
                </li>
                <li>
                  <b>
                    {"Traffic stall."}
                  </b>
                  {" Discord rate limits slowed the plan down. It resumes automatically; no action needed."}
                </li>
                <li>
                  <b>
                    {"No response."}
                  </b>
                  {" The request went quiet for too long and was retired. Run it again if it still looks right."}
                </li>
                <li>
                  <b>
                    {"Rejected."}
                  </b>
                  {" The plan was refused by a safety check before anything ran."}
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
                {"When you execute a plan, Controller starts a durable workflow: an isolated Linux sandbox is created for your request, each step runs inside it in order, and the sandbox is destroyed when the plan finishes \u2014 nothing is shared between requests. The bot carries out the Discord-side actions, and the workflow records the result of every step so the Console can show you exactly what happened."}
              </p>
              <h2>
                {"Safety"}
              </h2>
              <ul>
                <li>
                  <b>
                    {"Owner only."}
                  </b>
                  {" Console links come from the "}
                  <span className={"mono"}>
                    {"/dashboard"}
                  </span>
                  {" command, work once, and expire in minutes."}
                </li>
                <li>
                  <b>
                    {"Never against you."}
                  </b>
                  {" The bot refuses to act against the server owner or itself."}
                </li>
                <li>
                  <b>
                    {"You approve every plan."}
                  </b>
                  {" Nothing runs until a preview is confirmed \u2014 by you or the countdown, which you can always cancel."}
                </li>
                <li>
                  <b>
                    {"Small footprint."}
                  </b>
                  {" Your request history stays in your browser. Server history and audit records are removed automatically after 30 days."}
                </li>
              </ul>
              <h2>
                {"Scheduled runs (coming soon)"}
              </h2>
              <p>
                {"Soon you will be able to put any goal on a monthly schedule: Controller will run it for you automatically, around the same time every month, and you will be able to cancel it from the Console like any other request."}
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
                {" and are tied to your Console session:"}
              </p>
              <ul>
                <li>
                  <code>
                    {"POST /api/preview"}
                  </code>
                  {" \u2014 turn a prompt into a plan or an answer."}
                </li>
                <li>
                  <code>
                    {"POST /api/execute"}
                  </code>
                  {" \u2014 start a plan (or a prompt) and get a request id."}
                </li>
                <li>
                  <code>
                    {"GET /api/status/:id"}
                  </code>
                  {" \u2014 current status and result of a request."}
                </li>
                <li>
                  <code>
                    {"POST /api/cancel/:id"}
                  </code>
                  {" \u2014 cancel a running request."}
                </li>
                <li>
                  <code>
                    {"GET /api/public/status"}
                  </code>
                  {" \u2014 system status feed."}
                </li>
                <li>
                  <code>
                    {"POST /api/support/chat"}
                  </code>
                  {" \u2014 AI support chat."}
                </li>
              </ul>
            </div>
            <div className={"faq"}>
              <details>
                <summary>
                  {"Do I need to learn commands?"}
                </summary>
                <div className={"ans"}>
                  <p>
                    {"Only one: "}
                    <span className={"mono"}>
                      {"/dashboard"}
                    </span>
                    {", to get your Console link. Everything else is plain language."}
                  </p>
                </div>
              </details>
              <details>
                <summary>
                  {"Where is my request history kept?"}
                </summary>
                <div className={"ans"}>
                  <p>
                    {"In your browser, on your device \u2014 the last 50 requests. Clearing your browser data clears it. Server-side history and audit records are deleted automatically after 30 days."}
                  </p>
                </div>
              </details>
              <details>
                <summary>
                  {"What happens when I cancel a request?"}
                </summary>
                <div className={"ans"}>
                  <p>
                    {"The remaining steps never run. Steps that already finished are not undone \u2014 if a channel was already renamed, it stays renamed."}
                  </p>
                </div>
              </details>
              <details>
                <summary>
                  {"Why did my request fail?"}
                </summary>
                <div className={"ans"}>
                  <p>
                    {"The note next to the status says what went wrong \u2014 usually a missing channel or a permission Discord refused. Fix the detail and run it again; nothing is retried on its own."}
                  </p>
                </div>
              </details>
              <details>
                <summary>
                  {"Is Controller affiliated with Discord?"}
                </summary>
                <div className={"ans"}>
                  <p>
                    {"No. Controller is an independent product and is not affiliated with or endorsed by Discord Inc."}
                  </p>
                </div>
              </details>
            </div>
          </div>
        </main>
        <Footer />
        <SupportWidget />
      </>
  )
}
