import type { PageMeta } from "../lib/page.ts"
import { ContactLine, Footer, Header } from "../ui/chrome.tsx"
import { SupportWidget } from "../ui/support-widget.tsx"

export const meta: PageMeta = {
  title: "Privacy Policy · Controller",
  description: "What Controller collects, why, who it is shared with and how long it is kept.",
  styles: ["/site.css"],
}

export function PrivacyPage() {
  return () => (
      <>
        <Header />
        <main>
          <div className={"wrap"}>
            <div className={"page"}>
              <h1>
                {"Privacy Policy"}
              </h1>
              <p className={"lead"}>
                {"What Controller handles, why, and for how long."}
              </p>
            </div>
            <div className={"prose"}>
              <p className={"updated"}>
                {"Last updated: October 31, 2026"}
              </p>
              <h2>
                {"Who this covers"}
              </h2>
              <p>
                {"This policy applies to the Controller Discord bot and its website (together, the “Service”). The Service lets a Discord server owner describe changes in plain language and have the bot carry them out."}
              </p>
              <h2>
                {"What we handle"}
              </h2>
              <ul>
                <li>
                  <b>
                    {"Your requests."}
                  </b>
                  {" The text you type into the Console."}
                </li>
                <li>
                  <b>
                    {"Server information."}
                  </b>
                  {" When a request is processed, the bot reads your server’s name and ID, the owner’s and bot’s user IDs, and the names and IDs of channels and roles. When you ask for an action on a member, the bot looks that member up by name or ID."}
                </li>
                <li>
                  <b>
                    {"Results."}
                  </b>
                  {" A status for each request (such as executed or failed) and, if something failed or was rejected, an error or reason that may include names and IDs."}
                </li>
                <li>
                  <b>
                    {"Request history and audit log."}
                  </b>
                  {" The text of each request, its final status and result, and a record of irreversible actions an agent took (such as bans, kicks and deletions), stored against your server ID so you can look back and so abuse can be investigated."}
                </li>
                <li>
                  <b>
                    {"Console session."}
                  </b>
                  {" While your Console is open, which AI agent you hold and, if all are busy, your place in the waiting line, stored against your server ID. It is released shortly after you close the Console."}
                </li>
                <li>
                  <b>
                    {"Sign-in data."}
                  </b>
                  {" A temporary magic-link token and a session cookie."}
                </li>
                <li>
                  <b>
                    {"Support chat."}
                  </b>
                  {" Messages you send to the AI support assistant, plus the current system status, are used to write a reply. We do not keep them after the reply is sent; the chat history stays in your browser. To limit abuse, a salted, hashed form of your IP address is kept as a request counter for up to 24 hours."}
                </li>
              </ul>
              <p>
                {"We do not read, record or store the messages members send in your server. The bot acts only on requests made through the Console."}
              </p>
              <h2>
                {"How we use it"}
              </h2>
              <p>
                {"Only to run the Service: to check your request is safe, to turn it into steps, to carry them out on your server, and to show you the result. We do not sell your data, run advertising, or use analytics trackers."}
              </p>
              <h2>
                {"Who it is shared with"}
              </h2>
              <ul>
                <li>
                  <b>
                    {"Google (Gemini)."}
                  </b>
                  {" Your request and the server information described above are sent to one of our AI agents (Google’s Gemini models) to perform the safety check and planning. Support chat messages are sent to a separate support agent to write answers, with a backup agent if it is unavailable. Google handles that data under its own terms and privacy policy."}
                </li>
                <li>
                  <b>
                    {"Web research."}
                  </b>
                  {" When an agent researches the web, its search question is sent to Google through the Gemini service, and the answer comes back with source links."}
                </li>
                <li>
                  <b>
                    {"Email and webhooks (only if the operator turns them on)."}
                  </b>
                  {" The text of an email goes to our email provider (Resend) and then to an allowed recipient. A webhook request goes from our server to a host the operator has allowed."}
                </li>
                <li>
                  <b>
                    {"Google Fonts."}
                  </b>
                  {" Pages load the Anton and JetBrains Mono typefaces from Google Fonts, so Google receives your IP address and browser details when a page loads. Google handles that data under its own privacy policy."}
                </li>
                <li>
                  <b>
                    {"Discord."}
                  </b>
                  {" The bot carries out actions on your server through Discord’s API."}
                </li>
                <li>
                  <b>
                    {"Inngest."}
                  </b>
                  {" Each request runs as a durable background task. Inngest keeps the request’s progress, including the results of finished steps (plan steps with names and IDs, and short summaries), so a task can wait for a scheduled step and carry on. Upstash Redis holds our live state."}
                </li>
                <li>
                  <b>
                    {"Infrastructure providers."}
                  </b>
                  {" Upstash (temporary storage), Aiven (the database that holds request history and the audit log), and our hosting providers, which run the bot and website and may keep standard technical logs such as IP address and request time."}
                </li>
              </ul>
              <h2>
                {"How long we keep it"}
              </h2>
              <ul>
                <li>
                  {"A request’s one-time job record is deleted as soon as its task starts. Tasks that include a wait stay scheduled until the wait ends (at most 12 hours)."}
                </li>
                <li>
                  {"Live request statuses and error messages are deleted automatically after 24 hours."}
                </li>
                <li>
                  {"Request history and the audit log are deleted automatically after 30 days."}
                </li>
                <li>
                  {"Magic-link tokens are deleted when used, or after 15 minutes."}
                </li>
                <li>
                  {"The session cookie lasts up to 12 hours. It is strictly necessary for sign-in."}
                </li>
                <li>
                  {"Your browser keeps a list of your last 50 requests in its local storage so the Console can show them. It stays on your device, and you can clear it any time in your browser settings."}
                </li>
              </ul>
              <h2>
                {"Security"}
              </h2>
              <p>
                {"Sign-in uses single-use links and a signed, HTTP-only, secure cookie. Connections use HTTPS. No system is perfectly secure, so please keep your magic links private."}
              </p>
              <h2>
                {"Your choices"}
              </h2>
              <p>
                {"You can stop all processing at any time by removing the bot from your server. To ask what is held about your server or to request deletion, contact us using the details below. You can ask us to delete the history and audit records we hold for your server at any time; otherwise they are removed automatically after 30 days."}
              </p>
              <h2>
                {"Children"}
              </h2>
              <p>
                {"The Service is intended for people who meet Discord’s minimum age requirement and is not directed at children."}
              </p>
              <h2>
                {"Changes"}
              </h2>
              <p>
                {"If we change this policy, we will update the date above. Continued use after a change means you accept it."}
              </p>
              <h2>
                {"Contact"}
              </h2>
              <p>
                {"Questions about this policy: "}
                {ContactLine()}
              </p>
            </div>
          </div>
        </main>
        <Footer />
        <SupportWidget />
      </>
  )
}
