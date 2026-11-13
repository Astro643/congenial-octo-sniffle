import { clientEntry, css, on, ref } from "remix/component"
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
    let inputNode: HTMLInputElement | undefined
    let launcherNode: HTMLButtonElement | undefined
    let threadNode: HTMLElement | undefined

    const widgetStyle = css({
      "@keyframes swb": {
        "0%,60%,100%": { transform: "translateY(0)", opacity: ".5" },
        "30%": { transform: "translateY(-4px)", opacity: "1" },
      },
      "& .sw-launch": {
        position: "fixed",
        right: "22px",
        bottom: "22px",
        zIndex: 60,
        width: "58px",
        height: "58px",
        borderRadius: "16px",
        border: 0,
        padding: 0,
        cursor: "pointer",
        background: "var(--btn)",
        color: "var(--green)",
        display: "grid",
        placeItems: "center",
        boxShadow: "0 4px 0 #000,0 16px 30px -10px rgba(5,5,5,.5)",
        transition: "transform .12s,background .18s,box-shadow .12s",
      },
      "& .sw-launch:hover": {
        background: "#403E40",
      },
      "& .sw-launch:active": {
        transform: "translateY(3px)",
        boxShadow: "0 1px 0 #000,0 8px 18px -10px rgba(5,5,5,.5)",
      },
      "& .sw-launch svg": {
        gridArea: "1/1",
        width: "26px",
        height: "26px",
        transition: "opacity .2s,transform .28s",
      },
      "& .sw-launch .ico-x": {
        opacity: 0,
        transform: "rotate(-80deg)",
      },
      "&.sw-open .sw-launch .ico-chat": {
        opacity: 0,
        transform: "rotate(80deg)",
      },
      "&.sw-open .sw-launch .ico-x": {
        opacity: 1,
        transform: "none",
      },
      "& .sw-dot": {
        position: "absolute",
        top: "1px",
        right: "1px",
        width: "15px",
        height: "15px",
        borderRadius: "50%",
        border: "3px solid var(--canvas)",
        background: "var(--faint)",
        transition: "background .3s",
      },
      "& .sw-dot.operational": { background: "var(--emerald)" },
      "& .sw-dot.degraded": { background: "var(--amber)" },
      "& .sw-dot.outage": { background: "var(--rose)" },
      "& .sw-panel": {
        position: "fixed",
        right: "22px",
        bottom: "94px",
        zIndex: 60,
        width: "min(400px,calc(100vw - 32px))",
        height: "min(650px,calc(100dvh - 120px))",
        background: "var(--surface)",
        border: "1px solid var(--border)",
        borderRadius: "14px",
        display: "flex",
        flexDirection: "column",
        overflow: "hidden",
        boxShadow: "0 36px 90px -24px rgba(17,17,19,.38),0 4px 16px rgba(17,17,19,.08)",
        opacity: 0,
        visibility: "hidden",
        pointerEvents: "none",
        transform: "translateY(14px) scale(.97)",
        transformOrigin: "bottom right",
        transition: "opacity .22s,transform .28s cubic-bezier(.2,.8,.2,1),visibility 0s linear .28s",
      },
      "&.sw-open .sw-panel": {
        opacity: 1,
        visibility: "visible",
        pointerEvents: "auto",
        transform: "none",
        transitionDelay: "0s",
      },
      "& .sw-view": {
        display: "none",
        flex: 1,
        minHeight: 0,
        flexDirection: "column",
      },
      "& .sw-view.on": {
        display: "flex",
      },
      "& .sw-hero": {
        position: "relative",
        padding: "26px 26px 96px",
        background: "linear-gradient(180deg,#8DFFC6 0%,#D6FBE7 52%,#F8F7F4 100%)",
        flex: "none",
      },
      "& .sw-brand": {
        display: "flex",
        alignItems: "center",
        gap: "10px",
        fontWeight: 650,
        fontSize: "17px",
        letterSpacing: ".08em",
      },
      "& .sw-brand .logo": {
        width: "19px",
        height: "19px",
        display: "block",
        color: "#000",
      },
      "& .sw-x": {
        position: "absolute",
        top: "18px",
        right: "18px",
        width: "34px",
        height: "34px",
        borderRadius: "50%",
        border: 0,
        background: "rgba(255,255,255,.55)",
        color: "var(--ink)",
        cursor: "pointer",
        display: "grid",
        placeItems: "center",
        transition: "background .15s",
      },
      "& .sw-x:hover": {
        background: "rgba(255,255,255,.9)",
      },
      "& .sw-x svg": {
        width: "16px",
        height: "16px",
      },
      "& .sw-hello": {
        margin: "30px 0 0",
        font: "400 36px/1.02 var(--display)",
        textTransform: "uppercase",
        letterSpacing: ".005em",
      },
      "& .sw-body": {
        flex: 1,
        minHeight: 0,
        overflow: "auto",
        padding: "0 18px 18px",
        marginTop: "-68px",
        display: "grid",
        gap: "12px",
        alignContent: "start",
      },
      "& .sw-card": {
        background: "var(--surface)",
        border: "1px solid var(--border)",
        borderRadius: "12px",
        boxShadow: "0 8px 24px -14px rgba(17,17,19,.22)",
      },
      "& .sw-card-h": {
        display: "flex",
        justifyContent: "space-between",
        alignItems: "baseline",
        gap: "10px",
        padding: "16px 18px 12px",
      },
      "& .sw-card-h b": {
        fontSize: "15px",
      },
      "& .sw-card-h span": {
        fontSize: "12px",
        color: "var(--faint)",
      },
      "& .sw-overall": {
        display: "flex",
        gap: "14px",
        alignItems: "center",
        padding: "14px 18px",
        borderTop: "1px solid var(--border-soft)",
      },
      "& .sw-ico": {
        flex: "none",
        width: "34px",
        height: "34px",
        borderRadius: "50%",
        display: "grid",
        placeItems: "center",
        color: "#fff",
        background: "var(--faint)",
      },
      "& .sw-ico svg": {
        width: "17px",
        height: "17px",
      },
      "& .sw-ico.operational": { background: "var(--emerald)" },
      "& .sw-ico.degraded": { background: "var(--amber)" },
      "& .sw-ico.outage": { background: "var(--rose)" },
      "& .sw-overall b": {
        display: "block",
        fontSize: "15.5px",
        lineHeight: 1.3,
      },
      "& .sw-overall small": {
        color: "var(--muted)",
        fontSize: "13px",
      },
      "& .sw-list": {
        borderTop: "1px solid var(--border-soft)",
        padding: "6px 0",
      },
      "& .sw-comp": {
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        gap: "12px",
        padding: "9px 18px",
        fontSize: "14.5px",
      },
      "& .sw-comp span:last-child": {
        display: "flex",
        alignItems: "center",
        gap: "8px",
        color: "var(--muted)",
        fontSize: "13px",
        textAlign: "right",
      },
      "& .sw-comp i": {
        flex: "none",
        width: "8px",
        height: "8px",
        borderRadius: "50%",
        background: "var(--faint)",
      },
      "& .sw-comp i.operational": { background: "var(--emerald)" },
      "& .sw-comp i.degraded": { background: "var(--amber)" },
      "& .sw-comp i.outage": { background: "var(--rose)" },
      "& .sw-ask": {
        padding: "16px 18px",
      },
      "& .sw-ask p": {
        fontSize: "13.5px",
        color: "var(--muted)",
        margin: "2px 0 12px",
      },
      "& .sw-ask b": {
        fontSize: "15px",
      },
      "& .sw-btn": {
        width: "100%",
        font: "600 13px var(--mono)",
        letterSpacing: ".07em",
        textTransform: "uppercase",
        color: "#fff",
        background: "var(--btn)",
        border: 0,
        borderBottom: "4px solid #000",
        borderRadius: "9px",
        padding: "14px 13px 11px",
        cursor: "pointer",
        transition: "background .15s,transform .08s,box-shadow .15s",
      },
      "& .sw-btn:hover": {
        background: "#403E40",
      },
      "& .sw-btn:active": {
        transform: "translateY(2px)",
        borderBottomWidth: "2px",
        paddingBottom: "13px",
      },
      "& .sw-bar": {
        flex: "none",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        gap: "10px",
        padding: "16px 16px 14px 22px",
        borderBottom: "1px solid var(--border-soft)",
      },
      "& .sw-bar b": {
        fontSize: "16px",
        display: "block",
        lineHeight: 1.25,
      },
      "& .sw-bar small": {
        color: "var(--muted)",
        fontSize: "12.5px",
      },
      "& .sw-bar div": {
        display: "flex",
        gap: "6px",
      },
      "& .sw-ib": {
        width: "34px",
        height: "34px",
        borderRadius: "50%",
        border: 0,
        background: "transparent",
        color: "var(--muted)",
        cursor: "pointer",
        display: "grid",
        placeItems: "center",
        transition: "background .15s,color .15s",
      },
      "& .sw-ib:hover": {
        background: "var(--mono-bg)",
        color: "var(--ink)",
      },
      "& .sw-ib svg": {
        width: "17px",
        height: "17px",
      },
      "& .sw-thread": {
        flex: 1,
        minHeight: 0,
        overflow: "auto",
        padding: "18px",
        display: "flex",
        flexDirection: "column",
        gap: "10px",
      },
      "& .sw-empty": {
        margin: "auto",
        textAlign: "center",
        padding: "10px 6px",
        maxWidth: "300px",
      },
      "& .sw-empty svg": {
        width: "34px",
        height: "34px",
        color: "var(--ink)",
      },
      "& .sw-empty h4": {
        margin: "12px 0 6px",
        fontSize: "17px",
      },
      "& .sw-empty p": {
        color: "var(--muted)",
        fontSize: "14px",
      },
      "& .sw-chips": {
        display: "flex",
        flexDirection: "column",
        gap: "8px",
        marginTop: "18px",
      },
      "& .sw-chip": {
        font: "inherit",
        fontSize: "13.5px",
        textAlign: "left",
        color: "var(--ink-2)",
        background: "var(--surface)",
        border: "1px solid var(--border)",
        borderRadius: "14px",
        padding: "10px 14px",
        cursor: "pointer",
        transition: "border-color .15s,background .15s",
      },
      "& .sw-chip:hover": {
        borderColor: "var(--green)",
        background: "var(--green-soft)",
      },
      "& .sw-msg": {
        maxWidth: "86%",
        padding: "10px 14px",
        fontSize: "14.5px",
        lineHeight: 1.55,
        whiteSpace: "pre-wrap",
        wordBreak: "break-word",
        letterSpacing: "-.005em",
      },
      "& .sw-msg.user": {
        alignSelf: "flex-end",
        background: "var(--btn)",
        color: "#fff",
        borderRadius: "18px 18px 5px 18px",
      },
      "& .sw-msg.bot": {
        alignSelf: "flex-start",
        background: "var(--mono-bg)",
        color: "var(--ink)",
        borderRadius: "18px 18px 18px 5px",
      },
      "& .sw-msg.err": {
        background: "#FDE2DF",
        color: "var(--rose)",
      },
      "& .sw-typing": {
        alignSelf: "flex-start",
        background: "var(--mono-bg)",
        borderRadius: "18px 18px 18px 5px",
        padding: "13px 16px",
        display: "flex",
        gap: "5px",
      },
      "& .sw-typing i": {
        width: "7px",
        height: "7px",
        borderRadius: "50%",
        background: "var(--faint)",
        animation: "swb 1.2s ease-in-out infinite",
      },
      "& .sw-typing i:nth-child(2)": { animationDelay: ".15s" },
      "& .sw-typing i:nth-child(3)": { animationDelay: ".3s" },
      "& .sw-note": {
        flex: "none",
        textAlign: "center",
        fontSize: "11.5px",
        color: "var(--faint)",
        padding: "0 18px 8px",
      },
      "& .sw-form": {
        flex: "none",
        position: "relative",
        padding: "0 14px 14px",
      },
      "& .sw-form input": {
        width: "100%",
        font: "inherit",
        fontSize: "15px",
        color: "var(--ink)",
        background: "var(--surface)",
        border: "1px solid var(--border)",
        borderRadius: "16px",
        padding: "13px 54px 13px 16px",
        outline: "none",
        transition: "border-color .2s,box-shadow .2s",
      },
      "& .sw-form input:focus": {
        borderColor: "rgba(51,229,138,.55)",
        boxShadow: "0 0 0 4px rgba(51,229,138,.1)",
      },
      "& .sw-send": {
        position: "absolute",
        right: "21px",
        top: "6px",
        width: "34px",
        height: "34px",
        borderRadius: "50%",
        border: 0,
        padding: 0,
        cursor: "pointer",
        display: "grid",
        placeItems: "center",
        color: "var(--faint)",
        background: "#EFEFF3",
        transition: "background .2s,color .2s",
      },
      "& .sw-send svg": {
        width: "16px",
        height: "16px",
      },
      "& .sw-form.ready .sw-send": {
        color: "#000",
        background: "var(--green)",
      },
      "& .sw-send:disabled": {
        opacity: ".5",
        cursor: "progress",
      },
      "& .sw-tabs": {
        flex: "none",
        display: "grid",
        gridTemplateColumns: "1fr 1fr",
        borderTop: "1px solid var(--border-soft)",
        background: "var(--surface)",
      },
      "& .sw-tab": {
        font: "inherit",
        fontSize: "13px",
        fontWeight: 550,
        color: "var(--muted)",
        background: "transparent",
        border: 0,
        padding: "11px 0 12px",
        cursor: "pointer",
        display: "grid",
        justifyItems: "center",
        gap: "3px",
        transition: "color .15s",
      },
      "& .sw-tab svg": {
        width: "25px",
        height: "25px",
      },
      "& .sw-tab.on": {
        color: "var(--ink)",
      },
      "& .sw-tab.on svg": {
        fill: "currentColor",
      },
      "& .sw-launch:focus-visible, & .sw-tab:focus-visible, & .sw-x:focus-visible, & .sw-ib:focus-visible, & .sw-btn:focus-visible, & .sw-chip:focus-visible": {
        outline: "3px solid rgba(10,122,71,.5)",
        outlineOffset: "2px",
      },
      "@media (max-width:520px)": {
        "& .sw-launch": {
          right: "16px",
          bottom: "16px",
        },
        "& .sw-panel": {
          right: "16px",
          bottom: "86px",
          height: "min(650px,calc(100dvh - 108px))",
        },
      },
      "@media (pointer:coarse)": {
        "& .sw-form input": {
          fontSize: "16px",
        },
      },
    })

    const focusInput = (delay = 0) => setTimeout(() => inputNode?.focus(), delay)

    const setDraft = (v: string) => {
      draft = v
      if (inputNode) inputNode.value = v
    }

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
        if (threadNode) threadNode.scrollTop = threadNode.scrollHeight
      }, 0)

    const setTab = (t: "home" | "messages") => {
      tab = t
      handle.update()
      if (t === "messages") {
        scrollThread()
        focusInput(60)
      }
    }

    const setOpen = (v: boolean) => {
      open = v
      handle.update()
      if (v) {
        if (Date.now() - statusFetchedAt > 15000) fetchStatus()
        if (tab === "messages") focusInput(120)
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
      setDraft("")
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
      focusInput()
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
            launcherNode?.focus()
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
      <div id="sw" class={open ? "sw-open" : ""} mix={widgetStyle}>
        <button
          class="sw-launch"
          id="sw-launch"
          type="button"
          aria-label={open ? "Close support" : "Open support and system status"}
          aria-expanded={open}
          aria-controls={handle.id}
          mix={[
            on("click", () => setOpen(!open)),
            ref((node) => {
              launcherNode = node
            }),
          ]}
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
        <div class="sw-panel" id={handle.id} role="dialog" aria-label="Support" aria-hidden={!open}>
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
                      focusInput()
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
            <div
              class="sw-thread"
              id="sw-thread"
              aria-live="polite"
              mix={ref((node) => {
                threadNode = node
              })}
            >
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
                mix={[
                  on("input", (event) => {
                    draft = event.currentTarget.value
                    handle.update()
                  }),
                  ref((node) => {
                    inputNode = node
                  }),
                ]}
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
