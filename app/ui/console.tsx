import { clientEntry, on } from "remix/component"
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
    setTimeout(() => document.getElementById("prompt")?.focus(), 0)
  }

  const execute = async (prompt: string, plan: { summary?: string; steps?: PreviewData["steps"] } | null, signal: AbortSignal) => {
    busy = true
    setHint("")
    handle.update()
    try {
      const r = await fetch("/api/execute", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(plan ? { prompt, plan } : { prompt }),
        signal: signal.aborted ? undefined : to(API_TIMEOUT),
      })
      const data = await r.json().catch(() => ({}) as Record<string, unknown>)
      if (signal.aborted) return
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
      if (!signal.aborted) setHint("Network error. Please try again.", true)
    } finally {
      if (!signal.aborted) {
        busy = false
        handle.update()
        setTimeout(() => document.getElementById("prompt")?.focus(), 0)
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
            execute(previewPrompt, plan, new AbortController().signal)
          }
        }, 9000)
      }
    } catch {
      if (!signal.aborted) setHint("Network error. Please try again.", true)
    } finally {
      if (!signal.aborted && !preview) {
        busy = false
        handle.update()
        setTimeout(() => document.getElementById("prompt")?.focus(), 0)
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
      setTimeout(() => document.getElementById("prompt")?.focus(), 0)
    } else {
      handle.update()
      execute(prompt, plan, new AbortController().signal)
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

    document.getElementById("prompt")?.focus()
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
        mix={on("click", (event) => {
          if (event.target === event.currentTarget) closePreview()
        })}
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
      <div className="top-right">
        <div className="top-row">
          <span className="agent-chip show" id="agent-chip">
            {"Agent ready"}
          </span>
        </div>
      </div>
      <main>
        <section id="feed" aria-live="polite">
          {loaded ? feed() : null}
        </section>
      </main>
      <div id="bar">
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
            mix={on("input", (event) => {
              draft = event.currentTarget.value
              handle.update()
            })}
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
