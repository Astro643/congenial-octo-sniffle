import { clientEntry, css, on, ref } from "remix/component"
import type { Handle } from "remix/component"

const LABELS: Record<string, string> = {
  processing: "Processing",
  waiting: "Waiting",
  cancelled: "Cancelled",
  completed: "Completed",
  blocked_by_traffic: "Traffic stall",
  rejected: "Rejected",
  failed: "Failed",
  stalled: "No response",
  unknown: "Expired",
}
const FINAL_STATES = new Set([
  "cancelled",
  "completed",
  "blocked_by_traffic",
  "failed",
  "rejected",
  "unknown",
  "stalled",
])
const POLL_MS = 1500
const GIVE_UP_MS = 26 * 60 * 60 * 1000
const STORE_KEY = "console_history_v1"
const MAX_ITEMS = 50
const API_TIMEOUT = 45000

const to = (ms: number) => {
  try {
    return AbortSignal.timeout(ms)
  } catch {
    return undefined
  }
}

interface OpItem {
  id: string
  prompt: string
  ts: number
  status: string
  note: string
}

interface PreviewData {
  complete?: boolean
  incomplete?: boolean
  question?: string
  summary?: string
  steps?: { label?: string; action?: string }[]
}

function loadHistory(): OpItem[] {
  try {
    const v = JSON.parse(localStorage.getItem(STORE_KEY) || "[]")
    return Array.isArray(v) ? v : []
  } catch {
    return []
  }
}

function saveHistory(items: OpItem[]) {
  try {
    localStorage.setItem(STORE_KEY, JSON.stringify(items.slice(-MAX_ITEMS)))
  } catch {}
}

export const Console = clientEntry(import.meta.url, function Console(handle: Handle) {
  let items: OpItem[] = []
  let loaded = false
  let hint = ""
  let hintIsError = false
  let draft = ""
  let busy = false
  let preview: PreviewData | undefined
  let previewPrompt = ""
  let previewTimer: ReturnType<typeof setTimeout> | undefined
  let inputNode: HTMLInputElement | undefined

  const mainStyle = css({
    "@keyframes consolePulse": {
      "0%": { boxShadow: "0 0 0 0 rgba(46,255,155,.45)", opacity: "1" },
      "70%": { boxShadow: "0 0 0 7px rgba(46,255,155,0)", opacity: ".55" },
      "100%": { boxShadow: "0 0 0 0 rgba(46,255,155,0)", opacity: "1" },
    },
    maxWidth: "680px",
    margin: "0 auto",
    padding: "64px 24px 210px",
    minHeight: "100vh",
    fontSize: "15px",
    letterSpacing: "-.011em",
    "& #feed": {
      display: "flex",
      flexDirection: "column",
      gap: "38px",
    },
    "& .op": {
      display: "flex",
      flexDirection: "column",
      gap: "12px",
      animation: "rise .5s cubic-bezier(.2,.7,.2,1) both",
    },
    "& .bubble": {
      alignSelf: "flex-end",
      maxWidth: "86%",
      background: "var(--surface)",
      border: "1px solid var(--border)",
      borderRadius: "14px 14px 4px 14px",
      padding: "12px 18px",
      boxShadow: "0 1px 2px rgba(17,17,19,.03)",
      fontSize: "16px",
      lineHeight: 1.6,
      wordBreak: "break-word",
    },
    "& .status-row": {
      display: "flex",
      flexWrap: "wrap",
      alignItems: "center",
      gap: "12px",
      paddingLeft: "4px",
    },
    "& .op-id": {
      fontFamily: "var(--mono)",
      fontSize: "11.5px",
      color: "var(--muted)",
      background: "var(--mono-bg)",
      borderRadius: "6px",
      padding: "2px 8px",
      letterSpacing: "0",
    },
    "& .op-time": {
      font: "500 11.5px var(--mono)",
      color: "var(--faint)",
      fontVariantNumeric: "tabular-nums",
    },
    "& .op-note": {
      marginLeft: "4px",
      fontFamily: "var(--mono)",
      fontSize: "12px",
      lineHeight: 1.7,
      color: "var(--ink-2)",
      background: "var(--mono-bg)",
      borderRadius: "12px",
      padding: "12px 14px",
      letterSpacing: "0",
      whiteSpace: "pre-wrap",
      wordBreak: "break-word",
    },
    "& .badge": {
      display: "inline-flex",
      alignItems: "center",
      gap: "8px",
      font: "600 11px/1 var(--mono)",
      textTransform: "uppercase",
      letterSpacing: ".07em",
      padding: "7px 11px 7px 9px",
      borderRadius: "6px",
      whiteSpace: "nowrap",
    },
    "& .badge i": {
      width: "7px",
      height: "7px",
      borderRadius: "50%",
      background: "currentColor",
      display: "block",
    },
    "& .s-processing": {
      color: "var(--green)",
      background: "var(--dark)",
    },
    "& .s-processing i": {
      animation: "consolePulse 1.3s ease-in-out infinite",
    },
    "& .s-executed": {
      color: "#000",
      background: "var(--green)",
    },
    "& .s-waiting": {
      color: "#0B5CAD",
      background: "#DCEBFB",
    },
    "& .s-cancelled": {
      color: "var(--muted)",
      background: "#E4E2DD",
    },
    "& .s-blocked_by_traffic, & .s-stalled": {
      color: "#8A4B04",
      background: "#FFEBC7",
    },
    "& .s-failed, & .s-failed_sensibility, & .s-unknown": {
      color: "#B42318",
      background: "#FDE2DF",
    },
    "& .op-cancel": {
      font: "600 11px/1 var(--mono)",
      textTransform: "uppercase",
      letterSpacing: ".07em",
      color: "var(--muted)",
      background: "transparent",
      border: "1px solid var(--border)",
      borderRadius: "6px",
      padding: "7px 10px",
      cursor: "pointer",
      transition: "color .15s ease,border-color .15s ease,background .15s ease",
    },
    "& .op-cancel:hover": {
      color: "var(--rose)",
      borderColor: "var(--rose)",
    },
    "& .op-cancel:disabled": {
      opacity: ".5",
      cursor: "progress",
    },
    "@media (max-width:520px)": {
      paddingTop: "96px",
      "& .bubble": {
        maxWidth: "94%",
      },
    },
  })

  const barStyle = css({
    position: "fixed",
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 10,
    pointerEvents: "none",
    padding: "36px 20px calc(26px + env(safe-area-inset-bottom))",
    background:
      "radial-gradient(38% 95% at 22% 100%,rgba(46,255,155,.18),rgba(46,255,155,0) 60%),linear-gradient(180deg,rgba(238,237,232,0),rgba(238,237,232,.8) 30%,rgba(238,237,232,.96) 48%,rgba(238,237,232,.98))",
    "& > *": {
      pointerEvents: "auto",
    },
    "& #form": {
      maxWidth: "680px",
      margin: "0 auto",
      position: "relative",
    },
    "& #form::before": {
      content: '""',
      position: "absolute",
      zIndex: -1,
      left: "6%",
      right: "6%",
      top: "18%",
      bottom: "-6px",
      borderRadius: "50%",
      background: "radial-gradient(closest-side,rgba(46,255,155,.30),rgba(46,255,155,0))",
      filter: "blur(30px)",
    },
    "& #form::after": {
      content: '""',
      position: "absolute",
      zIndex: -1,
      left: "10%",
      right: "10%",
      bottom: "-16px",
      height: "18px",
      borderRadius: "50%",
      background: "radial-gradient(closest-side,rgba(17,17,19,.20),rgba(17,17,19,0))",
      filter: "blur(14px)",
    },
    "& #prompt": {
      width: "100%",
      font: "inherit",
      letterSpacing: "inherit",
      color: "var(--ink)",
      background: "var(--surface)",
      border: "1px solid rgba(17,17,19,.06)",
      borderRadius: "16px",
      padding: "19px 68px 19px 26px",
      outline: "none",
      boxShadow: "0 1px 2px rgba(17,17,19,.04),0 20px 30px -20px rgba(17,17,19,.18)",
      transition: "border-color .15s ease,box-shadow .15s ease,transform .15s ease",
    },
    "& #prompt::placeholder": {
      color: "var(--faint)",
    },
    "& #prompt:focus": {
      borderColor: "rgba(46,255,155,.5)",
      transform: "translateY(-1px)",
      boxShadow:
        "0 0 0 4px rgba(46,255,155,.10),0 2px 4px rgba(17,17,19,.04),0 14px 30px -6px rgba(17,17,19,.12),0 36px 70px -22px rgba(17,17,19,.12)",
    },
    "& #go": {
      position: "absolute",
      right: "11px",
      top: "50%",
      transform: "translateY(-50%)",
      width: "40px",
      height: "40px",
      borderRadius: "11px",
      border: 0,
      padding: 0,
      cursor: "pointer",
      display: "grid",
      placeItems: "center",
      color: "var(--faint)",
      background: "rgba(17,17,19,.04)",
      transition: "background .15s ease,color .15s ease,transform .15s ease",
    },
    "& #go svg": {
      width: "18px",
      height: "18px",
      display: "block",
    },
    "& #form.ready #go": {
      color: "#000",
      background: "var(--green)",
    },
    "& #form.ready #go:hover": {
      background: "var(--green-deep)",
    },
    "& #go:active": {
      transform: "translateY(-50%) scale(.93)",
    },
    "& #go:disabled": {
      opacity: ".5",
      cursor: "progress",
    },
    "& #go:focus-visible": {
      outline: "3px solid rgba(10,122,71,.5)",
      outlineOffset: "2px",
    },
    "& #hint": {
      maxWidth: "680px",
      margin: "10px auto 0",
      textAlign: "center",
      fontSize: "12px",
      color: "var(--muted)",
      minHeight: "18px",
    },
    "& #hint.err": {
      color: "var(--rose)",
    },
    "@media (pointer:coarse)": {
      "& #prompt": {
        fontSize: "16px",
      },
    },
  })

  const chipStyle = css({
    position: "fixed",
    top: "16px",
    right: "24px",
    zIndex: 10,
    display: "flex",
    flexDirection: "column",
    alignItems: "flex-end",
    gap: "12px",
    "& .top-row": {
      display: "flex",
      alignItems: "center",
      gap: "14px",
    },
    "& .agent-chip": {
      font: "600 11px/1 var(--mono)",
      textTransform: "uppercase",
      letterSpacing: ".07em",
      color: "var(--green-ink)",
      background: "var(--green-soft)",
      borderRadius: "999px",
      padding: "10px 12px",
      display: "none",
    },
    "& .agent-chip.show": {
      display: "block",
    },
    "@media (max-width:520px)": {
      right: "14px",
      top: "12px",
    },
  })

  const modalStyle = css({
    "@keyframes fade": {
      from: { opacity: "0" },
      to: { opacity: "1" },
    },
    position: "fixed",
    inset: 0,
    zIndex: 100,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    padding: "20px",
    background: "rgba(34,32,34,.45)",
    webkitBackdropFilter: "blur(8px)",
    backdropFilter: "blur(8px)",
    animation: "fade .2s ease both",
    "& .preview-card": {
      width: "100%",
      maxWidth: "520px",
      maxHeight: "82vh",
      overflow: "auto",
      background: "var(--surface)",
      border: "1px solid var(--border)",
      borderRadius: "18px",
      padding: "28px 26px 22px",
      boxShadow: "var(--lift),0 40px 90px -30px rgba(5,5,5,.45)",
      animation: "rise .35s cubic-bezier(.2,.7,.2,1) both",
    },
    "& .preview-title": {
      margin: "0 0 6px",
      font: "400 28px/1.05 var(--display)",
      textTransform: "uppercase",
      letterSpacing: ".01em",
    },
    "& .preview-question": {
      margin: "14px 0",
      padding: "12px 14px",
      borderRadius: "10px",
      background: "#FFEBC7",
      color: "#8A4B04",
      fontWeight: 600,
      fontSize: "14.5px",
    },
    "& .preview-summary": {
      margin: "8px 0 18px",
      color: "var(--muted)",
      fontSize: "14.5px",
    },
    "& .preview-h": {
      margin: "18px 0 10px",
      font: "600 11.5px/1 var(--mono)",
      textTransform: "uppercase",
      letterSpacing: ".09em",
      color: "var(--faint)",
    },
    "& .preview-steps": {
      display: "flex",
      flexDirection: "column",
      gap: "8px",
    },
    "& .preview-step": {
      display: "flex",
      alignItems: "flex-start",
      gap: "12px",
      background: "var(--dark)",
      color: "#ECEBEC",
      borderRadius: "10px",
      padding: "11px 14px",
      fontSize: "14px",
      lineHeight: 1.5,
    },
    "& .preview-step-num": {
      flex: "none",
      display: "grid",
      placeItems: "center",
      width: "24px",
      height: "24px",
      borderRadius: "7px",
      background: "var(--dark-2)",
      color: "var(--green)",
      font: "700 12px var(--mono)",
    },
    "& .preview-step-label": {
      flex: 1,
      paddingTop: "2px",
    },
    "& .preview-empty": {
      margin: 0,
      color: "var(--muted)",
      fontStyle: "italic",
    },
    "& .preview-actions": {
      display: "flex",
      justifyContent: "flex-end",
      gap: "10px",
      marginTop: "22px",
    },
    "& .preview-btn": {
      font: "600 13px/1 var(--mono)",
      letterSpacing: ".07em",
      textTransform: "uppercase",
      borderRadius: "9px",
      padding: "14px 20px 12px",
      cursor: "pointer",
      transition: "background .15s,transform .08s,border-color .15s",
    },
    "& .preview-cancel": {
      background: "transparent",
      color: "var(--ink)",
      border: "1px solid var(--border)",
    },
    "& .preview-cancel:hover": {
      background: "rgba(5,5,5,.05)",
    },
    "& .preview-confirm": {
      background: "var(--green)",
      color: "#000",
      border: 0,
      borderBottom: "4px solid var(--green-ink)",
    },
    "& .preview-confirm:hover": {
      background: "var(--green-deep)",
    },
    "& .preview-confirm:active": {
      transform: "translateY(2px)",
      borderBottomWidth: "2px",
      paddingBottom: "14px",
    },
    "& .preview-btn:focus-visible": {
      outline: "3px solid rgba(6,116,60,.55)",
      outlineOffset: "2px",
    },
    "@media (prefers-reduced-motion:reduce)": {
      animation: "none",
      "& .preview-card": {
        animation: "none",
      },
    },
  })

  const focusInput = () => inputNode?.focus()

  const setHint = (msg: string, isErr = false) => {
    hint = msg || ""
    hintIsError = isErr
  }

  const closePreview = () => {
    clearTimeout(previewTimer)
    preview = undefined
    previewTimer = undefined
    busy = false
    handle.update()
    focusInput()
  }

  const execute = async (
    prompt: string,
    plan: { summary?: string; steps?: PreviewData["steps"] } | null,
    signal?: AbortSignal,
  ) => {
    busy = true
    setHint("")
    handle.update()
    try {
      const r = await fetch("/api/execute", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(plan ? { prompt, plan } : { prompt }),
        signal: to(API_TIMEOUT),
      })
      const data = await r.json().catch(() => ({}) as Record<string, unknown>)
      if (signal?.aborted) return
      if (!r.ok) {
        setHint(typeof data.detail === "string" ? data.detail : "Could not queue that goal.", true)
        return
      }
      if (typeof data.command_id !== "string" || !data.command_id) {
        setHint("Unexpected response. Please try again.", true)
        return
      }
      const item: OpItem = {
        id: data.command_id,
        prompt,
        ts: Date.now(),
        status: typeof data.status === "string" ? data.status : "processing",
        note: "",
      }
      items = [...items, item].slice(-MAX_ITEMS)
      saveHistory(items)
      draft = ""
      handle.update()
      window.scrollTo({ top: document.body.scrollHeight, behavior: "smooth" })
    } catch {
      if (!signal?.aborted) setHint("Network error. Please try again.", true)
    } finally {
      if (!signal?.aborted) {
        busy = false
        handle.update()
        focusInput()
      }
    }
  }

  const submit = async (event: SubmitEvent, signal: AbortSignal) => {
    event.preventDefault()
    const prompt = draft.trim()
    if (!prompt || busy) return
    busy = true
    setHint("")
    handle.update()
    try {
      const r = await fetch("/api/preview", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt }),
        signal: signal.aborted ? undefined : to(API_TIMEOUT),
      })
      const data = (await r.json().catch(() => ({}))) as PreviewData
      if (signal.aborted) return
      if (!r.ok) {
        const detail = (data as unknown as Record<string, unknown>).detail
        setHint(typeof detail === "string" ? detail : "Could not generate preview.", true)
        return
      }
      preview = data
      previewPrompt = prompt
      handle.update()
      const plan =
        data.complete && !data.incomplete ? { summary: data.summary, steps: data.steps } : null
      if (plan) {
        clearTimeout(previewTimer)
        previewTimer = setTimeout(() => {
          if (preview) {
            preview = undefined
            previewTimer = undefined
            execute(previewPrompt, plan)
          }
        }, 9000)
      }
    } catch {
      if (!signal.aborted) setHint("Network error. Please try again.", true)
    } finally {
      if (!signal.aborted && !preview) {
        busy = false
        handle.update()
        focusInput()
      }
    }
  }

  const confirmPreview = () => {
    if (!preview) return
    const data = preview
    const prompt = previewPrompt
    const needsAnswer = data.incomplete || !data.complete
    const plan = needsAnswer ? null : { summary: data.summary, steps: data.steps }
    clearTimeout(previewTimer)
    preview = undefined
    previewTimer = undefined
    if (needsAnswer) {
      draft = prompt
      busy = false
      setHint(data.question || "Add more detail and run it again.", false)
      handle.update()
      focusInput()
    } else {
      handle.update()
      execute(prompt, plan)
    }
  }

  const cancelOp = async (item: OpItem, signal: AbortSignal) => {
    try {
      const r = await fetch("/api/cancel/" + encodeURIComponent(item.id), {
        method: "POST",
        signal: signal.aborted ? undefined : to(15000),
      })
      const d = await r.json().catch(() => ({}) as Record<string, unknown>)
      if (signal.aborted) return
      if (r.ok) {
        items = items.map((i) => (i.id === item.id ? { ...i, status: "cancelled", note: "" } : i))
        saveHistory(items)
        handle.update()
      } else {
        setHint(typeof d.detail === "string" ? d.detail : "Could not cancel.", true)
        handle.update()
      }
    } catch {
      if (!signal.aborted) {
        setHint("Network error. Please try again.", true)
        handle.update()
      }
    }
  }

  const poll = async () => {
    const pending = items.filter((i) => !FINAL_STATES.has(i.status))
    await Promise.all(
      pending.map(async (item) => {
        if (Date.now() - item.ts > GIVE_UP_MS) {
          items = items.map((i) => (i.id === item.id ? { ...i, status: "stalled" } : i))
          handle.update()
          return
        }
        try {
          const r = await fetch("/api/status/" + encodeURIComponent(item.id), {
            cache: "no-store",
            signal: to(15000),
          })
          if (r.status === 401) {
            setHint("Session expired. Open a fresh link from your bot.", true)
            handle.update()
            return
          }
          if (r.status === 404) {
            items = items.map((i) => (i.id === item.id ? { ...i, status: "unknown", note: "" } : i))
            handle.update()
            return
          }
          if (!r.ok) return
          const data = await r.json()
          if (typeof data.status !== "string" || !data.status) return
          const note = data.error || data.result || ""
          if (data.status !== item.status || note !== item.note) {
            items = items.map((i) =>
              i.id === item.id ? { ...i, status: data.status, note } : i,
            )
            handle.update()
          }
        } catch {}
      }),
    )
    saveHistory(items)
  }

  handle.queueTask(() => {
    items = loadHistory()
    loaded = true
    handle.update()

    const tick = setInterval(() => {
      if (!document.hidden) poll()
    }, POLL_MS)
    handle.signal.addEventListener("abort", () => clearInterval(tick))
    poll()

    document.addEventListener(
      "keydown",
      (e) => {
        if (e.key === "Escape" && preview) {
          e.stopPropagation()
          closePreview()
        }
      },
      { signal: handle.signal },
    )
    handle.signal.addEventListener("abort", () => clearTimeout(previewTimer))

    focusInput()
  })

  const feed = () => (
    <>
      {items.map((item) => (
        <article key={item.id} class="op" data-id={item.id}>
          <div class="bubble">{item.prompt}</div>
          <div class="status-row">
            <span class={"badge s-" + item.status}>
              <i />
              {LABELS[item.status] || item.status}
            </span>
            <span class="op-id">{item.id}</span>
            <span class="op-time">
              {new Date(item.ts).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
            </span>
            {item.status === "waiting" ? (
              <button
                class="op-cancel"
                type="button"
                title="Cancel this waiting request. Steps that already ran are not undone."
                mix={on("click", (event, signal) => {
                  ;(event.currentTarget as HTMLButtonElement).disabled = true
                  cancelOp(item, signal)
                })}
              >
                {"Cancel"}
              </button>
            ) : null}
          </div>
          {item.note ? <div class="op-note">{item.note}</div> : null}
        </article>
      ))}
    </>
  )

  const previewModal = () => {
    if (!preview) return null
    const needsAnswer = preview.incomplete || !preview.complete
    return (
      <div
        class="preview-modal"
        id="preview-modal"
        mix={[
          modalStyle,
          on("click", (event) => {
            if (event.target === event.currentTarget) closePreview()
          }),
        ]}
      >
        <div class="preview-card">
          <h2 class="preview-title">{"Preview (Dry Run)"}</h2>
          {needsAnswer ? (
            <p class="preview-question">{preview.question || "Can you clarify your request?"}</p>
          ) : null}
          {preview.summary ? <p class="preview-summary">{preview.summary}</p> : null}
          <h3 class="preview-h">{"Planned steps"}</h3>
          <div class="preview-steps">
            {preview.steps && preview.steps.length > 0 ? (
              preview.steps.map((step, idx) => (
                <div key={idx} class="preview-step">
                  <span class="preview-step-num">{String(idx + 1)}</span>
                  <span class="preview-step-label">{step.label || step.action}</span>
                </div>
              ))
            ) : (
              <p class="preview-empty">{"No steps generated."}</p>
            )}
          </div>
          <div class="preview-actions">
            <button class="preview-btn preview-cancel" type="button" mix={on("click", closePreview)}>
              {"Cancel"}
            </button>
            <button
              class="preview-btn preview-confirm"
              type="button"
              mix={on("click", confirmPreview)}
            >
              {needsAnswer ? "Edit request" : "Execute"}
            </button>
          </div>
        </div>
      </div>
    )
  }

  return () => (
    <>
      <div className="top-right" mix={chipStyle}>
        <div className="top-row">
          <span className="agent-chip show" id="agent-chip">
            {"Agent ready"}
          </span>
        </div>
      </div>
      <main mix={mainStyle}>
        <section id="feed" aria-live="polite">
          {loaded ? feed() : null}
        </section>
      </main>
      <div id="bar" mix={barStyle}>
        <form
          id="form"
          autoComplete="off"
          class={draft.trim().length > 0 ? "ready" : ""}
          mix={on("submit", (event, signal) => submit(event, signal))}
        >
          <input
            id="prompt"
            type="text"
            maxLength={2000}
            placeholder="Describe a change to your server"
            aria-label="Goal"
            value={draft}
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
          <button
            id="go"
            type="submit"
            aria-label="Execute goal"
            title="Execute goal"
            disabled={busy}
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
              <path d="M12 19V5" />
              <path d="M5 12l7-7 7 7" />
            </svg>
          </button>
        </form>
        <div id="hint" class={hintIsError ? "err" : ""}>
          {hint}
        </div>
      </div>
      {previewModal()}
    </>
  )
})
