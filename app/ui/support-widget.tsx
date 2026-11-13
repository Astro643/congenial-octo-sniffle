import { clientEntry, on } from "remix/component"
import type { Handle } from "remix/component"

const STORE_KEY = "support_chat_v1"
const MAX_KEPT = 30
const CHAT_TIMEOUT = 30000
const STATUS_TIMEOUT = 15000
const SUGGESTIONS = [
  "Is everything working right now?",
  "How do I get my magic link?",
  "Why did my request fail?",
]

const to = (ms: number) => {
  try {
    return AbortSignal.timeout(ms)
  } catch {
    return undefined
  }
}

interface StatusInfo {
  overall: string
  label: string
  updated: string
  components?: { name: string; detail: string; status: string }[]
}

interface ChatMessage {
  role: string
  text: string
  error?: boolean
}

function loadMessages(): ChatMessage[] {
  try {
    const v = JSON.parse(localStorage.getItem(STORE_KEY) || "[]")
    return Array.isArray(v) ? v : []
  } catch {
    return []
  }
}

function saveMessages(messages: ChatMessage[]) {
  try {
    localStorage.setItem(STORE_KEY, JSON.stringify(messages.slice(-MAX_KEPT)))
  } catch {}
}

function updatedAgo(iso: string) {
  const s = Math.max(0, Math.round((Date.now() - new Date(iso).getTime()) / 1000))
  if (!isFinite(s)) return ""
  if (s < 10) return "Updated just now"
  if (s < 90) return "Updated " + s + "s ago"
  return "Updated " + Math.round(s / 60) + " min ago"
}

export const SupportWidget = clientEntry(
  import.meta.url,
  function SupportWidget(handle: Handle) {
    let open = false
    let tab: "home" | "messages" = "home"
    let busy = false
    let status: StatusInfo | undefined
    let statusFetchedAt = 0
    let messages: ChatMessage[] = []
    let draft = ""

    const setMessages = (next: ChatMessage[]) => {
      messages = next
      saveMessages(messages)
      handle.update()
    }

    const fetchStatus = async () => {
      try {
        const r = await fetch("/api/public/status", { cache: "no-store", signal: to(STATUS_TIMEOUT) })
        if (!r.ok) return
        status = await r.json()
      } catch {}
      statusFetchedAt = Date.now()
      handle.update()
    }

    const scrollThread = () =>
      setTimeout(() => {
        const t = document.getElementById("sw-thread")
        if (t) t.scrollTop = t.scrollHeight
      }, 0)

    const setTab = (t: "home" | "messages") => {
      tab = t
      handle.update()
      if (t === "messages") {
        scrollThread()
        setTimeout(() => document.getElementById("sw-input")?.focus(), 60)
      }
    }

    const setOpen = (v: boolean) => {
      open = v
      handle.update()
      if (v) {
        if (Date.now() - statusFetchedAt > 15000) fetchStatus()
        if (tab === "messages") setTimeout(() => document.getElementById("sw-input")?.focus(), 120)
      }
    }

    const send = async (raw: string) => {
      const text = (raw || "").trim()
      if (!text || busy) return
      const history = messages
        .filter((m) => !m.error)
        .slice(-8)
        .map((m) => ({ role: m.role, text: m.text.slice(0, 800) }))
      messages = [...messages, { role: "user", text }]
      busy = true
      draft = ""
      handle.update()
      try {
        const r = await fetch("/api/support/chat", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ message: text.slice(0, 600), history }),
          signal: to(CHAT_TIMEOUT),
        })
        const data = await r.json().catch(() => ({} as Record<string, unknown>))
        if (r.ok && typeof data.reply === "string" && data.reply) {
          messages = [...messages, { role: "assistant", text: data.reply }]
        } else {
          messages = [
            ...messages,
            {
              role: "assistant",
              error: true,
              text:
                typeof data.detail === "string"
                  ? data.detail
                  : "Sorry, something went wrong. Please try again.",
            },
          ]
        }
      } catch {
        messages = [
          ...messages,
          {
            role: "assistant",
            error: true,
            text: "Network error. Please check your connection and try again.",
          },
        ]
      }
      busy = false
      saveMessages(messages)
      handle.update()
      scrollThread()
      setTimeout(() => document.getElementById("sw-input")?.focus(), 0)
    }

    handle.queueTask(() => {
      messages = loadMessages()
      handle.update()
      scrollThread()

      const tick = setInterval(() => {
        if (document.hidden) return
        if (open || Date.now() - statusFetchedAt > 60000) fetchStatus()
      }, 20000)
      handle.signal.addEventListener("abort", () => clearInterval(tick))

      document.addEventListener(
        "keydown",
        (e) => {
          if (e.key === "Escape" && open) {
            setOpen(false)
            document.getElementById("sw-launch")?.focus()
          }
        },
        { signal: handle.signal },
      )

      setTimeout(fetchStatus, 800)
      if (location.hash === "#support") {
        tab = "messages"
        setOpen(true)
      }
    })

    const thread = () => {
      if (!messages.length) {
        return (
          <div class="sw-empty">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linejoin="round" stroke-linecap="round" aria-hidden="true">
              <path d="M5 5h14a1 1 0 0 1 1 1v9a1 1 0 0 1-1 1h-7l-4 3.5V16H5a1 1 0 0 1-1-1V6a1 1 0 0 1 1-1z" />
              <path d="M8 9.5h8M8 12.5h5" />
            </svg>
            <h4>{"No messages yet"}</h4>
            <p>
              {"Ask anything about the bot. Answers come from an AI assistant, available around the clock."}
            </p>
            <div class="sw-chips">
              {SUGGESTIONS.map((s) => (
                <button key={s} class="sw-chip" type="button" mix={on("click", () => send(s))}>
                  {s}
                </button>
              ))}
            </div>
          </div>
        )
      }
      return (
        <>
          {messages.map((m, i) => (
            <div key={i} class={"sw-msg " + (m.role === "user" ? "user" : "bot") + (m.error ? " err" : "")}>
              {m.text}
            </div>
          ))}
          {busy ? (
            <div class="sw-typing">
              <i />
              <i />
              <i />
            </div>
          ) : null}
        </>
      )
    }

    const statusCard = () => {
      const overall = status?.overall
      const ok = overall === "operational"
      return (
        <div class="sw-card">
          <div class="sw-card-h">
            <b>{"System status"}</b>
            <span id="sw-updated">{status ? updatedAgo(status.updated) : ""}</span>
          </div>
          <div class="sw-overall">
            <span class={"sw-ico " + (overall ?? "")}>
              {ok ? (
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
                  <path d="M5.5 12.5l4.2 4.2L18.5 7.8" />
                </svg>
              ) : (
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" aria-hidden="true">
                  <path d="M12 6v8M12 18h.01" />
                </svg>
              )}
            </span>
            <div>
              <b id="sw-label">{status ? status.label : "Status unavailable"}</b>
              <small id="sw-sub">
                {status
                  ? ok
                    ? "Everything is running normally"
                    : "We are aware and working through it"
                  : "We could not load the live status. Try again shortly."}
              </small>
            </div>
          </div>
          <div class="sw-list" id="sw-list">
            {(Array.isArray(status?.components) ? status!.components! : []).map((c, i) => (
              <div key={i} class="sw-comp">
                <span>{c.name}</span>
                <span>
                  {c.detail}
                  <i class={c.status} />
                </span>
              </div>
            ))}
          </div>
        </div>
      )
    }

    return () => (
      <div id="sw" class={open ? "sw-open" : ""}>
        <button
          class="sw-launch"
          id="sw-launch"
          type="button"
          aria-label={open ? "Close support" : "Open support and system status"}
          aria-expanded={open}
          aria-controls="sw-panel"
          mix={on("click", () => setOpen(!open))}
        >
          <svg class="ico-chat" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
            <path d="M5 5h14a1 1 0 0 1 1 1v9a1 1 0 0 1-1 1h-7l-4 3.5V16H5a1 1 0 0 1-1-1V6a1 1 0 0 1 1-1z" />
            <path d="M8.5 10.2c1 1.5 2.1 2.2 3.5 2.2s2.5-.7 3.5-2.2" />
          </svg>
          <svg class="ico-x" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
            <path d="M6 9.5l6 6 6-6" />
          </svg>
          <span class="sw-dot" id="sw-dot" />
        </button>
        <div class="sw-panel" id="sw-panel" role="dialog" aria-label="Support" aria-hidden={!open}>
          <section class={"sw-view" + (tab === "home" ? " on" : "")} id="sw-home">
            <div class="sw-hero">
              <div class="sw-brand">
                <svg class="logo" viewBox="0 0 24 24" width="24" height="24" aria-hidden="true">
                  <path d="M2.5 5h19L12 20.5z" fill="currentColor" />
                </svg>
                {"Controller"}
              </div>
              <button class="sw-x" type="button" aria-label="Close" mix={on("click", () => setOpen(false))}>
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" aria-hidden="true">
                  <path d="M6 6l12 12M18 6L6 18" />
                </svg>
              </button>
              <h3 class="sw-hello">
                {"Hi there"}
                <br />
                {"How can we help?"}
              </h3>
            </div>
            <div class="sw-body">
              {statusCard()}
              <div class="sw-card sw-ask">
                <b>{"Ask our AI assistant"}</b>
                <p>{"Instant answers, any time. Replies are written by AI, not by people."}</p>
                <button
                  class="sw-btn"
                  type="button"
                  mix={on("click", () => {
                    tab = "messages"
                    setOpen(true)
                  })}
                >
                  {"Start a chat"}
                </button>
              </div>
            </div>
          </section>
          <section class={"sw-view" + (tab === "messages" ? " on" : "")} id="sw-messages">
            <div class="sw-bar">
              <div style={{ display: "block" }}>
                <b>{"AI Support"}</b>
                <small>{"Answers are written by AI"}</small>
              </div>
              <div>
                <button
                  class="sw-ib"
                  type="button"
                  aria-label="New chat"
                  title="New chat"
                  mix={on("click", () => {
                    if (!busy) {
                      messages = []
                      saveMessages(messages)
                      handle.update()
                      setTimeout(() => document.getElementById("sw-input")?.focus(), 0)
                    }
                  })}
                >
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" aria-hidden="true">
                    <path d="M12 5v14M5 12h14" />
                  </svg>
                </button>
                <button class="sw-ib" type="button" aria-label="Close" mix={on("click", () => setOpen(false))}>
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" aria-hidden="true">
                    <path d="M6 6l12 12M18 6L6 18" />
                  </svg>
                </button>
              </div>
            </div>
            <div class="sw-thread" id="sw-thread" aria-live="polite">
              {thread()}
            </div>
            <div class="sw-note">
              {"AI can make mistakes. For anything important, check the FAQ."}
            </div>
            <form
              class="sw-form"
              id="sw-form"
              autoComplete="off"
              mix={[
                on("submit", (event) => {
                  event.preventDefault()
                  send(draft)
                }),
              ]}
            >
              <input
                id="sw-input"
                type="text"
                maxLength={600}
                placeholder="Ask a question"
                aria-label="Your question"
                value={draft}
                mix={on("input", (event) => {
                  draft = event.currentTarget.value
                  handle.update()
                })}
              />
              <button class="sw-send" id="sw-send" type="submit" aria-label="Send" disabled={busy}>
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
                  <path d="M12 19V5" />
                  <path d="M5 12l7-7 7 7" />
                </svg>
              </button>
            </form>
          </section>
          <nav class="sw-tabs" aria-label="Support sections">
            <button
              class={"sw-tab" + (tab === "home" ? " on" : "")}
              type="button"
              id="sw-tab-home"
              mix={on("click", () => setTab("home"))}
            >
              <svg viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.9" stroke-linejoin="round" stroke-linecap="round" fill="none" aria-hidden="true">
                <path d="M4 11.2 12 4.8l8 6.4V19a1 1 0 0 1-1 1h-4.2v-5.2H9.2V20H5a1 1 0 0 1-1-1z" />
              </svg>
              {"Home"}
            </button>
            <button
              class={"sw-tab" + (tab === "messages" ? " on" : "")}
              type="button"
              id="sw-tab-messages"
              mix={on("click", () => setTab("messages"))}
            >
              <svg viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.9" stroke-linejoin="round" stroke-linecap="round" fill="none" aria-hidden="true">
                <path d="M5 5h14a1 1 0 0 1 1 1v9a1 1 0 0 1-1 1h-7l-4 3.5V16H5a1 1 0 0 1-1-1V6a1 1 0 0 1 1-1z" />
              </svg>
              {"Messages"}
            </button>
          </nav>
        </div>
      </div>
    )
  },
)
