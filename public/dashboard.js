(() => {
  "use strict";
  const LABELS = {
    processing: "Processing",
    waiting: "Waiting",
    cancelled: "Cancelled",
    completed: "Completed",
    blocked_by_traffic: "Traffic stall",
    rejected: "Rejected",
    failed: "Failed",
    stalled: "No response",
    unknown: "Expired"
  };
  const FINAL_STATES = new Set(["cancelled", "completed", "blocked_by_traffic", "failed", "rejected", "unknown", "stalled"]);
  const POLL_MS = 1500, GIVE_UP_MS = 26 * 60 * 60 * 1000, STORE_KEY = "console_history_v1", MAX_ITEMS = 50;

  const feed = document.getElementById("feed");
  const form = document.getElementById("form");
  const input = document.getElementById("prompt");
  const btn = document.getElementById("go");
  const hint = document.getElementById("hint");

  let items = [];

  const load = () => { try { return JSON.parse(localStorage.getItem(STORE_KEY) || "[]"); } catch { return []; } };
  const save = () => { try { localStorage.setItem(STORE_KEY, JSON.stringify(items.slice(-MAX_ITEMS))); } catch {} };

  function setHint(msg, isErr) { hint.textContent = msg || ""; hint.className = isErr ? "err" : ""; }

  function el(tag, cls, text) {
    const n = document.createElement(tag);
    if (cls) n.className = cls;
    if (text !== undefined) n.textContent = text;
    return n;
  }

  function render(item) {
    let node = feed.querySelector(`[data-id="${item.id}"]`);
    const fresh = !node;
    if (fresh) { node = el("article", "op"); node.dataset.id = item.id; feed.appendChild(node); }
    node.replaceChildren();
    node.appendChild(el("div", "bubble", item.prompt));

    const row = el("div", "status-row");
    const badge = el("span", "badge s-" + item.status);
    badge.appendChild(document.createElement("i"));
    badge.appendChild(document.createTextNode(LABELS[item.status] || item.status));
    row.appendChild(badge);
    row.appendChild(el("span", "op-id", item.id));
    row.appendChild(el("span", "op-time", new Date(item.ts).toLocaleTimeString([], {hour: "2-digit", minute: "2-digit"})));
    if (item.status === "waiting") {
      const cancel = el("button", "op-cancel", "Cancel");
      cancel.type = "button"; cancel.title = "Cancel this waiting request. Steps that already ran are not undone.";
      cancel.addEventListener("click", async () => {
        cancel.disabled = true;
        try {
          const r = await fetch("/api/cancel/" + encodeURIComponent(item.id), {method: "POST"});
          const d = await r.json().catch(() => ({}));
          if (r.ok) { item.status = "cancelled"; item.note = ""; render(item); save(); }
          else { setHint(typeof d.detail === "string" ? d.detail : "Could not cancel.", true); cancel.disabled = false; }
        } catch { setHint("Network error. Please try again.", true); cancel.disabled = false; }
      });
      row.appendChild(cancel);
    }
    node.appendChild(row);

    if (item.note) node.appendChild(el("div", "op-note", item.note));
    if (fresh) window.scrollTo({top: document.body.scrollHeight, behavior: "smooth"});
  }

  async function poll() {
    const pending = items.filter(i => !FINAL_STATES.has(i.status));
    await Promise.all(pending.map(async item => {
      if (Date.now() - item.ts > GIVE_UP_MS) { item.status = "stalled"; render(item); return; }
      try {
        const r = await fetch("/api/status/" + encodeURIComponent(item.id), {cache: "no-store"});
        if (r.status === 401) { setHint("Session expired. Open a fresh link from your bot.", true); return; }
        if (!r.ok) return;
        const data = await r.json();
        const note = data.error || data.result || "";
        if (data.status !== item.status || note !== item.note) {
          item.status = data.status; item.note = note; render(item);
        }
      } catch {}
    }));
    save();
  }

  const syncReady = () => form.classList.toggle("ready", input.value.trim().length > 0);
  input.addEventListener("input", syncReady);

  form.addEventListener("submit", async e => {
    e.preventDefault();
    const prompt = input.value.trim();
    if (!prompt) return;
    btn.disabled = true; setHint("");
    
    // First, generate preview (dry run)
    try {
      const previewR = await fetch("/api/preview", {method: "POST", headers: {"Content-Type": "application/json"}, body: JSON.stringify({prompt})});
      const previewData = await previewR.json().catch(() => ({}));
      
      if (!previewR.ok) {
        const msg = typeof previewData.detail === "string" ? previewData.detail : "Could not generate preview.";
        setHint(msg, true);
        btn.disabled = !active; if (active) input.focus();
        return;
      }
      
      // Show preview modal
      showPreview(previewData, prompt);
    } catch {
      setHint("Network error. Please try again.", true);
      btn.disabled = !active; if (active) input.focus();
    }
  });
  
  // Preview modal functionality
  let previewTimeout = null;
  let currentPreviewPrompt = "";
  
  function createPreviewModal(previewData) {
    const plan = previewData.complete && !previewData.incomplete ? {summary: previewData.summary, steps: previewData.steps} : null;
    const modal = document.getElementById("preview-modal");
    if (modal) modal.remove();
    
    const m = el("div", "preview-modal", null);
    m.id = "preview-modal";
    
    const card = el("div", "preview-card");
    
    const title = el("h2", "preview-title", "Preview (Dry Run)");
    card.appendChild(title);
    
    if (previewData.incomplete || !previewData.complete) {
      const question = el("p", "preview-question", previewData.question || "Can you clarify your request?");
      card.appendChild(question);
    }
    
    if (previewData.summary) {
      const summary = el("p", "preview-summary", previewData.summary);
      card.appendChild(summary);
    }
    
    const stepsTitle = el("h3", "preview-h", "Planned steps");
    card.appendChild(stepsTitle);
    
    const stepsList = el("div", "preview-steps");
    
    if (previewData.steps && previewData.steps.length > 0) {
      previewData.steps.forEach((step, idx) => {
        const stepEl = el("div", "preview-step");
        
        const stepNum = el("span", "preview-step-num", (idx + 1).toString());
        
        const stepLabel = el("span", "preview-step-label", step.label || step.action);
        
        stepEl.appendChild(stepNum);
        stepEl.appendChild(stepLabel);
        stepsList.appendChild(stepEl);
      });
    } else {
      const noSteps = el("p", "preview-empty", "No steps generated.");
      stepsList.appendChild(noSteps);
    }
    card.appendChild(stepsList);
    
    const actions = el("div", "preview-actions");
    
    const cancelBtn = el("button", "preview-btn preview-cancel", "Cancel");
    cancelBtn.type = "button";
    cancelBtn.addEventListener("click", () => {
      clearTimeout(previewTimeout);
      m.remove();
      btn.disabled = !active; if (active) input.focus();
    });
    
    const confirmBtn = el("button", "preview-btn preview-confirm", previewData.incomplete ? "Answer Question" : "Execute");
    confirmBtn.type = "button";
    confirmBtn.addEventListener("click", async () => {
      clearTimeout(previewTimeout);
      m.remove();
      
      if (previewData.incomplete || !previewData.complete) {
        // Ask the question
        executeWithPrompt(currentPreviewPrompt, plan);
      } else {
        // Auto-execute after preview
        executeWithPrompt(currentPreviewPrompt, plan);
      }
    });
    
    actions.appendChild(cancelBtn);
    actions.appendChild(confirmBtn);
    card.appendChild(actions);
    
    m.appendChild(card);
    document.body.appendChild(m);
    
    // Auto-hide and execute after 9 seconds if complete
    if (previewData.complete && !previewData.incomplete) {
      previewTimeout = setTimeout(() => {
        if (m.parentNode) {
          m.remove();
          executeWithPrompt(currentPreviewPrompt, plan);
        }
      }, 9000);
    }
    
    return m;
  }
  
  function showPreview(previewData, prompt) {
    currentPreviewPrompt = prompt;
    createPreviewModal(previewData);
  }
  
  function executeWithPrompt(prompt, plan) {
    btn.disabled = true; setHint("");
    fetch("/api/execute", {method: "POST", headers: {"Content-Type": "application/json"}, body: JSON.stringify(plan ? {prompt, plan} : {prompt})})
      .then(r => r.json().catch(() => ({})))
      .then(data => {
        if (!r.ok) {
          const msg = typeof data.detail === "string" ? data.detail : "Could not queue that goal.";
          setHint(msg, true);
          return;
        }
        const item = {id: data.command_id, prompt, ts: Date.now(), status: data.status || "processing", note: ""};
        items.push(item); save(); render(item);
        input.value = ""; syncReady();
      })
      .catch(() => {
        setHint("Network error. Please try again.", true);
      })
      .finally(() => {
        btn.disabled = !active; if (active) input.focus();
      });
  }

  const chip = document.getElementById("agent-chip");
  const active = true;
  chip.textContent = "Agent ready";
  chip.classList.add("show");

  items = load();
  items.forEach(render);
  setInterval(poll, POLL_MS);
  poll();
  input.focus();


})();
