// The only file you edit to set links. Leave a value empty to hide it.
// Rendered server-side, so no client script is needed to fill links in.
const SITE_CONFIG = {
  inviteUrl: "", // your bot's invite link, e.g. "https://discord.com/oauth2/authorize?client_id=...&scope=bot%20applications.commands&permissions=8"
  supportUrl: "", // your Discord support server invite, e.g. "https://discord.gg/xxxxxxx"
  supportEmail: "", // e.g. "support@example.com"
}

const isHttpsLink = (v: string) => /^https:\/\/[^\s"'<>]+$/.test(v.trim())
const isEmail = (v: string) => /^[^@\s<>"',;]{1,64}@[A-Za-z0-9.-]{1,190}\.[A-Za-z]{2,}$/.test(v.trim())

export const inviteHref = isHttpsLink(SITE_CONFIG.inviteUrl) ? SITE_CONFIG.inviteUrl.trim() : ""
export const supportHref = isHttpsLink(SITE_CONFIG.supportUrl) ? SITE_CONFIG.supportUrl.trim() : ""
export const supportMail = isEmail(SITE_CONFIG.supportEmail) ? SITE_CONFIG.supportEmail.trim() : ""
export const hasContact = supportHref !== "" || supportMail !== ""
