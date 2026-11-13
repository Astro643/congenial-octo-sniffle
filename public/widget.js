(() => {
  "use strict";
  const $ = id => document.getElementById(id);
  const root = () => $("sw"), launch = () => $("sw-launch"), panel = () => $("sw-panel"), dot = () => $("sw-dot");
  const thread = () => $("sw-thread"), form = () => $("sw-form"), input = () => $("sw-input"), sendBtn = () => $("sw-send");
  const STORE = "support_chat_v1", MAX_KEPT = 30, CHAT_TIMEOUT = 30000, STATUS_TIMEOUT = 15000;
  const to = (ms) => { try { return AbortSignal.timeout(ms); } catch { return undefined; } };
  const CHECK = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><path d="M5.5 12.5l4.2 4.2L18.5 7.8"/></svg>';
  const WARN = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round"><path d="M12 6v8M12 18h.01"/></svg>';
  const CHAT = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linejoin="round" stroke-linecap="round"><path d="M5 5h14a1 1 0 0 1 1 1v9a1 1 0 0 1-1 1h-7l-4 3.5V16H5a1 1 0 0 1-1-1V6a1 1 0 0 1 1-1z"/><path d="M8 9.5h8M8 12.5h5"/></svg>';
  const SUGGESTIONS = ["Is everything working right now?", "How do I get my magic link?", "Why did my request fail?"];

  let tab = "home", busy = false, status = null, statusTimer = null;
  let messages = [];

  // Chat history lives only in this browser; storage can be unavailable, so every access is guarded.
  const load = () => { try { const v = JSON.parse(localStorage.getItem(STORE) || "[]"); return Array.isArray(v) ? v : []; } catch { return []; } };
  const save = () => { try { localStorage.setItem(STORE, JSON.stringify(messages.slice(-MAX_KEPT))); } catch {} };

  function el(tag, cls, text) {
    const n = document.createElement(tag);
    if (cls) n.className = cls;
    if (text !== undefined) n.textContent = text;   // text only, never HTML
    return n;
  }

  const isOpen = () => root()?.classList.contains("sw-open") ?? false;

  /* ---------- open / close / tabs ---------- */
  function setOpen(v) {
    const r = root(), l = launch(), p = panel();
    if (!r || !l || !p) return;
    r.classList.toggle("sw-open", v);
    l.setAttribute("aria-expanded", String(v));
    l.setAttribute("aria-label", v ? "Close support" : "Open support and system status");
    p.setAttribute("aria-hidden", String(!v));
    if (v) { fetchStatus(); if (tab === "messages") setTimeout(() => input()?.focus(), 120); }
    schedule();
  }
  function setTab(t) {
    tab = t;
    $("sw-home")?.classList.toggle("on", t === "home");
    $("sw-messages")?.classList.toggle("on", t === "messages");
    $("sw-tab-home")?.classList.toggle("on", t === "home");
    $("sw-tab-messages")?.classList.toggle("on", t === "messages");
    if (t === "messages") { renderThread(); setTimeout(() => input()?.focus(), 60); }
  }
  function openChat() { setTab("messages"); setOpen(true); }

  // Delegated listeners live on `document`, so they survive Remix's client-side
  // DOM swaps that would orphan per-element handlers after internal navigations.
  document.addEventListener("click", e => {
    const t = e.target instanceof Element ? e.target : null;
    if (!t) return;
    if (t.closest("#sw-launch")) { setOpen(!isOpen()); return; }
    if (t.closest("[data-sw-close]")) { setOpen(false); return; }
    const tabBtn = t.closest(".sw-tab");
    if (tabBtn?.dataset.tab) { setTab(tabBtn.dataset.tab); return; }
    if (t.closest("#sw-ask")) { openChat(); return; }
    if (t.closest("#sw-new")) { if (!busy) { messages = []; save(); renderThread(); input()?.focus(); } return; }
    if (t.closest("[data-open-support]")) { e.preventDefault(); openChat(); }
  });
  document.addEventListener("submit", e => {
    if ((e.target)?.id === "sw-form") { e.preventDefault(); send(input()?.value); }
  });
  document.addEventListener("input", e => { if ((e.target)?.id === "sw-input") syncReady(); });
  document.addEventListener("keydown", e => { if (e.key === "Escape" && isOpen()) { setOpen(false); launch()?.focus(); } });

  /* ---------- live status ---------- */
  function ago(iso) {
    const s = Math.max(0, Math.round((Date.now() - new Date(iso).getTime()) / 1000));
    if (!isFinite(s)) return "";
    if (s < 10) return "Updated just now";
    if (s < 90) return "Updated " + s + "s ago";
    return "Updated " + Math.round(s / 60) + " min ago";
  }
  function renderStatus() {
    const list = $("sw-list"), ico = $("sw-ico"), label = $("sw-label"), sub = $("sw-sub");
    if (!list || !ico || !label || !sub || !dot() || !$("sw-updated")) return;
    list.replaceChildren();
    if (!status) {
      dot().className = "sw-dot";
      ico.className = "sw-ico"; ico.innerHTML = WARN;
      label.textContent = "Status unavailable";
      sub.textContent = "We could not load the live status. Try again shortly.";
      $("sw-updated").textContent = "";
      return;
    }
    dot().className = "sw-dot " + status.overall;
    ico.className = "sw-ico " + status.overall;
    ico.innerHTML = status.overall === "operational" ? CHECK : WARN;
    label.textContent = status.label;
    sub.textContent = status.overall === "operational" ? "Everything is running normally" : "We are aware and working through it";
    $("sw-updated").textContent = ago(status.updated);
    for (const c of (Array.isArray(status.components) ? status.components : [])) {
      const row = el("div", "sw-comp");
      row.appendChild(el("span", "", c.name));
      const right = el("span");
      right.appendChild(el("span", "", c.detail));
      const d = el("i", c.status);
      right.appendChild(d);
      row.appendChild(right);
      list.appendChild(row);
    }
  }
  async function fetchStatus() {
    try {
      const r = await fetch("/api/public/status", {cache: "no-store", signal: to(STATUS_TIMEOUT)});
      if (!r.ok) throw new Error();
      status = await r.json();
    } catch { if (!status) status = null; }
    renderStatus();
  }
  // Refresh often while the panel is open, and now and then in the background so the launcher dot stays honest.
  function schedule() {
    clearInterval(statusTimer);
    statusTimer = setInterval(() => { if (!document.hidden) fetchStatus(); }, isOpen() ? 20000 : 60000);
  }

  /* ---------- AI chat ---------- */
  function renderThread() {
    const t = thread();
    if (!t) return;
    t.replaceChildren();
    if (!messages.length) {
      const box = el("div", "sw-empty");
      box.innerHTML = CHAT;
      box.appendChild(el("h4", "", "No messages yet"));
      box.appendChild(el("p", "", "Ask anything about the bot. Answers come from an AI assistant, available around the clock."));
      const chips = el("div", "sw-chips");
      SUGGESTIONS.forEach(s => {
        const c = el("button", "sw-chip", s); c.type = "button";
        c.addEventListener("click", () => send(s));
        chips.appendChild(c);
      });
      box.appendChild(chips);
      t.appendChild(box);
      return;
    }
    messages.forEach(m => t.appendChild(el("div", "sw-msg " + (m.role === "user" ? "user" : "bot") + (m.error ? " err" : ""), m.text)));
    if (busy) { const typing = el("div", "sw-typing"); typing.append(el("i"), el("i"), el("i")); t.appendChild(typing); }
    t.scrollTop = t.scrollHeight;
  }
  async function send(text) {
    text = (text || "").trim();
    if (!text || busy) return;
    const btn = sendBtn(), box = form();
    messages.push({role: "user", text});
    busy = true; if (btn) btn.disabled = true; if (box) box.classList.remove("ready");
    if (input()) input().value = "";
    renderThread();
    const history = messages.slice(0, -1).filter(m => !m.error).slice(-8).map(m => ({role: m.role, text: m.text.slice(0, 800)}));
    try {
      const r = await fetch("/api/support/chat", {
        method: "POST", headers: {"Content-Type": "application/json"},
        body: JSON.stringify({message: text.slice(0, 600), history}),
        signal: to(CHAT_TIMEOUT)
      });
      const data = await r.json().catch(() => ({}));
      if (r.ok && data.reply) messages.push({role: "assistant", text: data.reply});
      else messages.push({role: "assistant", error: true,
        text: typeof data.detail === "string" ? data.detail : "Sorry, something went wrong. Please try again."});
    } catch {
      messages.push({role: "assistant", error: true, text: "Network error. Please check your connection and try again."});
    }
    busy = false; if (btn) btn.disabled = false; save(); renderThread(); input()?.focus();
  }
  const syncReady = () => form()?.classList.toggle("ready", (input()?.value ?? "").trim().length > 0);

  /* ---------- start ---------- */
  messages = load();
  schedule();
  form()?.setAttribute("data-ready", "1");
  setTimeout(fetchStatus, 800);
  if (location.hash === "#support") openChat();
})();
