(() => {
  "use strict";
  const $ = id => document.getElementById(id);
  const root = $("sw"), launch = $("sw-launch"), panel = $("sw-panel"), dot = $("sw-dot");
  const thread = $("sw-thread"), form = $("sw-form"), input = $("sw-input"), sendBtn = $("sw-send");
  const STORE = "support_chat_v1", MAX_KEPT = 30;
  const CHECK = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><path d="M5.5 12.5l4.2 4.2L18.5 7.8"/></svg>';
  const WARN = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round"><path d="M12 6v8M12 18h.01"/></svg>';
  const CHAT = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linejoin="round" stroke-linecap="round"><path d="M5 5h14a1 1 0 0 1 1 1v9a1 1 0 0 1-1 1h-7l-4 3.5V16H5a1 1 0 0 1-1-1V6a1 1 0 0 1 1-1z"/><path d="M8 9.5h8M8 12.5h5"/></svg>';
  const PERSON = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="12" cy="8.5" r="3.6"/><path d="M5 19.5c.7-3.6 3.4-5.6 7-5.6s6.3 2 7 5.6z"/></svg>';
  const SEND = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M12 19V5"/><path d="M5 12l7-7 7 7"/></svg>';
  const XICON = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round"><path d="M6 6l12 12M18 6L6 18"/></svg>';
  const PLUS = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round"><path d="M12 5v14M5 12h14"/></svg>';
  const SUGGESTIONS = ["Is everything working right now?", "How do I get my magic link?", "Why did my request fail?"];
  const TABS = ["home", "messages", "human"];

  let open = false, tab = "home", busy = false, status = null, statusTimer = null;
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

  /* ---------- human chat: markup added here so no page needs editing ---------- */
  const HUMAN_VIEW =
    '<section class="sw-view" id="sw-human">' +
      '<div class="sw-bar">' +
        '<div style="display:block"><b>Talk to a person</b><small><i class="sw-pdot" id="sw-h-dot"></i><span id="sw-h-stext">Checking</span></small></div>' +
        '<div>' +
          '<button class="sw-ib" type="button" id="sw-h-new" aria-label="New conversation" title="New conversation">' + PLUS + '</button>' +
          '<button class="sw-ib" type="button" data-sw-close aria-label="Close">' + XICON + '</button>' +
        '</div>' +
      '</div>' +
      '<div class="sw-thread" id="sw-h-thread" aria-live="polite"></div>' +
      '<div class="sw-note">Replies come from a person, not AI.</div>' +
      '<form class="sw-form" id="sw-h-form" autocomplete="off">' +
        '<input id="sw-h-input" type="text" maxlength="600" placeholder="Write a message" aria-label="Your message">' +
        '<button class="sw-send" id="sw-h-send" type="submit" aria-label="Send">' + SEND + '</button>' +
      '</form>' +
    '</section>';

  (function injectHuman() {
    const body = document.querySelector(".sw-body");
    if (body) {
      body.insertAdjacentHTML("beforeend",
        '<div class="sw-card sw-ask"><b><i class="sw-pdot" id="sw-hc-dot"></i>Talk to a person</b>' +
        '<p id="sw-hc-text">Chat with a real person, not an AI.</p>' +
        '<button class="sw-btn" type="button" id="sw-hc-btn">Start a conversation</button></div>');
    }
    const tabs = document.querySelector(".sw-tabs");
    if (tabs) {
      tabs.insertAdjacentHTML("beforeend",
        '<button class="sw-tab" type="button" id="sw-tab-human" data-tab="human">' + PERSON + 'Human<span class="sw-badge" id="sw-h-badge" hidden></span></button>');
      const t = document.createElement("template");
      t.innerHTML = HUMAN_VIEW;
      panel.insertBefore(t.content.firstElementChild, tabs);
    }
    launch.insertAdjacentHTML("beforeend", '<span class="sw-badge" id="sw-l-badge" hidden></span>');
  })();

  const hThread = $("sw-h-thread"), hForm = $("sw-h-form"), hInput = $("sw-h-input"), hSendBtn = $("sw-h-send");

  /* ---------- open / close / tabs ---------- */
  function setOpen(v) {
    open = v;
    root.classList.toggle("sw-open", v);
    launch.setAttribute("aria-expanded", String(v));
    launch.setAttribute("aria-label", v ? "Close support" : "Open support and system status");
    panel.setAttribute("aria-hidden", String(!v));
    if (v) {
      fetchStatus();
      if (h.online === null || !h.id) humanPresence();
      if (tab === "messages") setTimeout(() => input.focus(), 120);
      if (tab === "human") { humanSeen(); setTimeout(() => hInput.focus(), 120); }
    }
    schedule();
    humanSchedule();
  }
  function setTab(t) {
    tab = t;
    TABS.forEach(n => {
      const v = $("sw-" + n), b = $("sw-tab-" + n);
      if (v) v.classList.toggle("on", n === t);
      if (b) b.classList.toggle("on", n === t);
    });
    if (t === "messages") { renderThread(); setTimeout(() => input.focus(), 60); }
    if (t === "human") { humanSeen(); setTimeout(() => hInput.focus(), 60); if (!h.id) humanPresence(); }
    humanSchedule();
  }
  function openChat() { setTab("messages"); setOpen(true); }
  function openHuman() { setTab("human"); setOpen(true); }

  launch.addEventListener("click", () => setOpen(!open));
  document.querySelectorAll("[data-sw-close]").forEach(b => b.addEventListener("click", () => setOpen(false)));
  document.querySelectorAll(".sw-tab").forEach(b => b.addEventListener("click", () => setTab(b.dataset.tab)));
  $("sw-ask").addEventListener("click", openChat);
  $("sw-hc-btn").addEventListener("click", openHuman);
  document.querySelectorAll("[data-open-support]").forEach(b => b.addEventListener("click", e => { e.preventDefault(); openChat(); }));
  document.querySelectorAll("[data-open-human]").forEach(b => b.addEventListener("click", e => { e.preventDefault(); openHuman(); }));
  document.addEventListener("keydown", e => { if (e.key === "Escape" && open) { setOpen(false); launch.focus(); } });

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
    list.replaceChildren();
    if (!status) {
      dot.className = "sw-dot";
      ico.className = "sw-ico"; ico.innerHTML = WARN;
      label.textContent = "Status unavailable";
      sub.textContent = "We could not load the live status. Try again shortly.";
      $("sw-updated").textContent = "";
      return;
    }
    dot.className = "sw-dot " + status.overall;
    ico.className = "sw-ico " + status.overall;
    ico.innerHTML = status.overall === "operational" ? CHECK : WARN;
    label.textContent = status.label;
    sub.textContent = status.overall === "operational" ? "Everything is running normally" : "We are aware and working through it";
    $("sw-updated").textContent = ago(status.updated);
    for (const c of status.components) {
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
      const r = await fetch("/api/public/status", {cache: "no-store"});
      if (!r.ok) throw new Error();
      status = await r.json();
    } catch { if (!status) status = null; }
    renderStatus();
  }
  // Refresh often while the panel is open, and now and then in the background so the launcher dot stays honest.
  function schedule() {
    clearInterval(statusTimer);
    statusTimer = setInterval(() => { if (!document.hidden) fetchStatus(); }, open ? 20000 : 60000);
  }

  /* ---------- AI chat ---------- */
  function renderThread() {
    thread.replaceChildren();
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
      thread.appendChild(box);
      return;
    }
    messages.forEach(m => thread.appendChild(el("div", "sw-msg " + (m.role === "user" ? "user" : "bot") + (m.error ? " err" : ""), m.text)));
    if (busy) { const t = el("div", "sw-typing"); t.append(el("i"), el("i"), el("i")); thread.appendChild(t); }
    thread.scrollTop = thread.scrollHeight;
  }
  async function send(text) {
    text = (text || "").trim();
    if (!text || busy) return;
    messages.push({role: "user", text});
    busy = true; sendBtn.disabled = true; input.value = ""; syncReady(); renderThread();
    const history = messages.slice(0, -1).filter(m => !m.error).slice(-8).map(m => ({role: m.role, text: m.text.slice(0, 800)}));
    try {
      const r = await fetch("/api/support/chat", {
        method: "POST", headers: {"Content-Type": "application/json"},
        body: JSON.stringify({message: text.slice(0, 600), history})
      });
      const data = await r.json().catch(() => ({}));
      if (r.ok && data.reply) messages.push({role: "assistant", text: data.reply});
      else messages.push({role: "assistant", error: true,
        text: typeof data.detail === "string" ? data.detail : "Sorry, something went wrong. Please try again."});
    } catch {
      messages.push({role: "assistant", error: true, text: "Network error. Please check your connection and try again."});
    }
    busy = false; sendBtn.disabled = false; save(); renderThread(); input.focus();
  }
  const syncReady = () => form.classList.toggle("ready", input.value.trim().length > 0);
  input.addEventListener("input", syncReady);
  form.addEventListener("submit", e => { e.preventDefault(); send(input.value); });
  $("sw-new").addEventListener("click", () => { if (busy) return; messages = []; save(); renderThread(); input.focus(); });

  /* ---------- human chat ---------- */
  // Only the conversation id and the messages are kept, in this browser. The id is the visitor's key to the thread.
  const HSTORE = "support_human_v1", H_KEPT = 100;
  const h = {id: "", msgs: [], last: 0, online: null, closed: false, pending: [], error: "", unread: 0, quiet: 0,
             sending: false, name: "", email: ""};

  function hLoad() {
    try {
      const v = JSON.parse(localStorage.getItem(HSTORE) || "{}");
      if (v && typeof v.id === "string" && Array.isArray(v.msgs)) {
        h.id = v.id; h.msgs = v.msgs.slice(-H_KEPT); h.last = Number(v.last) || 0; h.unread = Number(v.unread) || 0;
      }
    } catch {}
  }
  function hSave() {
    try { localStorage.setItem(HSTORE, JSON.stringify({id: h.id, msgs: h.msgs.slice(-H_KEPT), last: h.last, unread: h.unread})); } catch {}
  }
  function humanReset() {
    h.id = ""; h.msgs = []; h.last = 0; h.closed = false; h.pending = []; h.error = ""; h.unread = 0; h.quiet = 0;
    hSave(); renderHuman(); renderBadges(); renderPresence(); humanSchedule();
  }

  function renderBadges() {
    const n = h.unread, txt = n > 9 ? "9+" : String(n);
    ["sw-h-badge", "sw-l-badge"].forEach(id => { const b = $(id); b.hidden = !n; b.textContent = txt; });
  }
  function renderPresence() {
    const known = h.online !== null, on = h.online === true;
    const cls = "sw-pdot" + (known ? (on ? " online" : " away") : "");
    $("sw-h-dot").className = cls; $("sw-hc-dot").className = cls;
    $("sw-h-stext").textContent = !known ? "Checking" : on ? "Online now" : "Away, leave a message";
    $("sw-hc-text").textContent = !known ? "Chat with a real person, not an AI."
      : on ? "A person is online and can reply right here."
           : "Nobody is online right now. Leave a message and we will reply here.";
    $("sw-hc-btn").textContent = h.id ? "Continue conversation" : "Start a conversation";
    if (!h.msgs.length && !h.pending.length) renderHuman();
  }
  function renderHuman() {
    hThread.replaceChildren();
    const viewing = open && tab === "human";
    if (viewing && h.unread) { h.unread = 0; hSave(); renderBadges(); }
    if (!h.msgs.length && !h.pending.length) {
      const box = el("div", "sw-empty");
      box.innerHTML = PERSON;
      box.appendChild(el("h4", "", "Talk to a person"));
      box.appendChild(el("p", "", h.online === true
        ? "Someone is online. Send a message and the reply appears here."
        : "Nobody is online right now. Leave a message and the reply will appear here when you come back."));
      const name = el("input", "sw-field"), mail = el("input", "sw-field");
      name.type = "text"; name.maxLength = 40; name.placeholder = "Your name (optional)"; name.value = h.name; name.setAttribute("aria-label", "Your name");
      mail.type = "email"; mail.maxLength = 200; mail.placeholder = "Email, in case you leave (optional)"; mail.value = h.email; mail.setAttribute("aria-label", "Your email");
      name.addEventListener("input", () => { h.name = name.value; });
      mail.addEventListener("input", () => { h.email = mail.value; });
      box.append(name, mail);
      const fine = el("p", "sw-fine");
      fine.append("Messages are kept for a short time. See the ");
      const a = el("a", "", "Privacy Policy"); a.href = "/privacy";
      fine.append(a, ".");
      box.appendChild(fine);
      hThread.appendChild(box);
      return;
    }
    h.msgs.forEach(m => hThread.appendChild(el("div", "sw-msg " + (m.from === "operator" ? "bot person" : "user"), m.text)));
    h.pending.forEach(t => hThread.appendChild(el("div", "sw-msg user pending", t)));
    if (h.error) hThread.appendChild(el("div", "sw-msg err", h.error));
    if (h.closed) hThread.appendChild(el("div", "sw-sys", "This conversation was closed. Send a message to reopen it."));
    hThread.scrollTop = hThread.scrollHeight;
  }
  function humanSeen() { if (h.unread) { h.unread = 0; hSave(); renderBadges(); } renderHuman(); renderPresence(); }

  async function humanPresence() {
    try {
      const r = await fetch("/api/chat/presence", {cache: "no-store"});
      if (r.ok) { h.online = !!(await r.json()).online; renderPresence(); }
    } catch {}
  }

  async function humanPoll() {
    if (!h.id) { humanSchedule(); return; }
    try {
      const r = await fetch("/api/chat/poll?thread=" + encodeURIComponent(h.id) + "&after=" + h.last, {cache: "no-store"});
      if (r.status === 404) { humanReset(); return; }          // the conversation expired
      if (!r.ok) throw new Error();
      const d = await r.json();
      h.online = !!d.online; h.closed = !!d.closed;
      let fresh = 0;
      for (const m of d.messages || []) {
        if (m.seq <= h.last) continue;
        h.msgs.push(m); h.last = m.seq;
        if (m.from === "operator") fresh++;
      }
      if (fresh) {
        h.quiet = 0;
        if (!(open && tab === "human")) h.unread += fresh;
      } else h.quiet++;
      hSave(); renderBadges(); renderPresence(); renderHuman();
    } catch {}
    humanSchedule();
  }

  // Poll fast while the person is looking at the chat, slowly in the background, and not at all with no conversation.
  let hTimer = null;
  function humanSchedule() {
    clearTimeout(hTimer);
    if (!h.id) return;
    let d = 25000;
    if (document.hidden) d = 60000;
    else if (open && tab === "human") d = h.quiet > 10 ? 8000 : 3000;
    hTimer = setTimeout(humanPoll, d);
  }
  document.addEventListener("visibilitychange", () => { if (!document.hidden) humanSchedule(); });

  async function humanSend(text, retried) {
    text = (text || "").trim();
    if (!text || (h.sending && !retried)) return;
    h.sending = true; h.error = ""; h.pending = [text];
    hSendBtn.disabled = true; hInput.value = ""; syncHReady(); renderHuman();
    try {
      const r = await fetch("/api/chat/send", {
        method: "POST", headers: {"Content-Type": "application/json"},
        body: JSON.stringify({thread: h.id, message: text.slice(0, 600), name: h.name.trim().slice(0, 40), email: h.email.trim().slice(0, 200)})
      });
      const d = await r.json().catch(() => ({}));
      if (r.ok && d.thread) {
        h.id = d.thread; h.online = !!d.online; h.pending = []; h.closed = false; h.quiet = 0;
        hSave(); await humanPoll();
      } else if ((r.status === 404 || r.status === 409) && h.id && !retried) {
        h.id = ""; h.msgs = []; h.last = 0; h.pending = [];   // the old conversation is gone: start a new one with the same text
        h.sending = false;
        return humanSend(text, true);
      } else {
        h.pending = []; hInput.value = text; syncHReady();
        h.error = typeof d.detail === "string" ? d.detail : "Sorry, that message was not sent. Please try again.";
      }
    } catch {
      h.pending = []; hInput.value = text; syncHReady();
      h.error = "Network error. Please check your connection and try again.";
    }
    h.sending = false; hSendBtn.disabled = false; renderHuman(); renderPresence(); humanSchedule(); hInput.focus();
  }
  const syncHReady = () => hForm.classList.toggle("ready", hInput.value.trim().length > 0);
  hInput.addEventListener("input", syncHReady);
  hForm.addEventListener("submit", e => { e.preventDefault(); humanSend(hInput.value); });
  $("sw-h-new").addEventListener("click", () => { if (!h.sending) humanReset(); });

  /* ---------- start ---------- */
  messages = load();
  hLoad();
  renderBadges(); renderPresence();
  schedule();
  humanSchedule();
  setTimeout(fetchStatus, 800);
  setTimeout(humanPresence, 1200);
  if (location.hash === "#support") openChat();
  if (location.hash === "#chat") openHuman();
})();
