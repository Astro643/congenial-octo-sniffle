import type { PageMeta } from "../lib/page.ts"
import { Footer, Header } from "../ui/chrome.tsx"
import { SupportWidget } from "../ui/support-widget.tsx"

export const meta: PageMeta = {
  title: "Docs · Controller",
  description: "How to use the Controller Console: goals, previews, request statuses, the monthly report and how requests run under the hood.",
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
        <Footer />
        <SupportWidget />
      </>
  )
}
