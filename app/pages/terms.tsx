import type { PageMeta } from "../lib/page.ts"
import { ContactLine, Footer, Header } from "../ui/chrome.tsx"
import { SupportWidget } from "../ui/support-widget.tsx"

export const meta: PageMeta = {
  title: "Terms of Service · Controller",
  description: "The rules for using Controller.",
  styles: ["/site.css"],
}

export function TermsPage() {
  return () => (
      <>
        <Header />
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
