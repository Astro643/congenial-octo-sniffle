/* Shared helpers for human-support.html and team.html. Everything the visitors type is shown with textContent, never as HTML. */
(function () {
  "use strict";
  var NS = "http://www.w3.org/2000/svg", INK = "#1B1A1C";
  var COLORS = { amber: "#F5B63D", coral: "#F26B5B", mint: "#4FD1A1", sky: "#5AB2F2", violet: "#9A7BF0", rose: "#EE7FB0", lime: "#A6D84B", slate: "#8B93A3" };
  var eyes = function (y, x1, x2, r) { return '<circle cx="' + x1 + '" cy="' + y + '" r="' + r + '" fill="' + INK + '"/><circle cx="' + x2 + '" cy="' + y + '" r="' + r + '" fill="' + INK + '"/>'; };
  var FACES = {
    fox: function (c) { return '<polygon points="5,17 9,2 19,10" fill="' + c + '"/><polygon points="35,17 31,2 21,10" fill="' + c + '"/><circle cx="20" cy="22" r="16" fill="' + c + '"/><ellipse cx="20" cy="29" rx="8" ry="5.5" fill="#fff" fill-opacity=".92"/>' + eyes(21, 14, 26, 2.2) + '<circle cx="20" cy="27" r="1.8" fill="' + INK + '"/>'; },
    owl: function (c) { return '<polygon points="7,12 9,2 17,9" fill="' + c + '"/><polygon points="33,12 31,2 23,9" fill="' + c + '"/><circle cx="20" cy="21" r="17" fill="' + c + '"/><circle cx="13.5" cy="19" r="6" fill="#fff"/><circle cx="26.5" cy="19" r="6" fill="#fff"/>' + eyes(19, 13.5, 26.5, 2.6) + '<polygon points="20,23 17,28 23,28" fill="' + INK + '"/>'; },
    bear: function (c) { return '<circle cx="8" cy="9" r="5.5" fill="' + c + '"/><circle cx="32" cy="9" r="5.5" fill="' + c + '"/><circle cx="20" cy="22" r="16" fill="' + c + '"/><ellipse cx="20" cy="27.5" rx="7" ry="5" fill="#fff" fill-opacity=".92"/>' + eyes(19, 14, 26, 2) + '<ellipse cx="20" cy="25" rx="2.6" ry="1.9" fill="' + INK + '"/>'; },
    cat: function (c) { return '<polygon points="6,16 8,2 19,9" fill="' + c + '"/><polygon points="34,16 32,2 21,9" fill="' + c + '"/><circle cx="20" cy="22" r="16" fill="' + c + '"/>' + eyes(20, 14, 26, 2.2) + '<polygon points="20,25 18,27 22,27" fill="' + INK + '"/><path d="M4 25h9M4 29l9-2M36 25h-9M36 29l-9-2" stroke="#fff" stroke-opacity=".85" stroke-width="1" fill="none"/>'; },
    frog: function (c) { return '<circle cx="20" cy="24" r="15" fill="' + c + '"/><circle cx="11.5" cy="11" r="6.5" fill="' + c + '"/><circle cx="28.5" cy="11" r="6.5" fill="' + c + '"/><circle cx="11.5" cy="11" r="4" fill="#fff"/><circle cx="28.5" cy="11" r="4" fill="#fff"/>' + eyes(11, 11.5, 28.5, 2) + '<path d="M11 28q9 6 18 0" stroke="' + INK + '" stroke-width="1.8" fill="none" stroke-linecap="round"/>'; },
    bunny: function (c) { return '<ellipse cx="13.5" cy="9" rx="4" ry="9" fill="' + c + '"/><ellipse cx="26.5" cy="9" rx="4" ry="9" fill="' + c + '"/><circle cx="20" cy="24" r="14.5" fill="' + c + '"/>' + eyes(22, 14.5, 25.5, 2) + '<ellipse cx="20" cy="27.5" rx="2.2" ry="1.6" fill="' + INK + '"/>'; }
  };
  function h(tag, cls, text) { var e = document.createElement(tag); if (cls) e.className = cls; if (text != null) e.textContent = text; return e; }
  function svg(size, inner, vb) { var s = document.createElementNS(NS, "svg"); s.setAttribute("viewBox", vb || "0 0 40 40"); s.setAttribute("width", size); s.setAttribute("height", size); s.setAttribute("aria-hidden", "true"); s.setAttribute("class", "av"); s.innerHTML = inner; return s; }
  // Only whitelisted names are drawn, so a doctored avatar value can never inject markup.
  function avatar(key, size) { var p = String(key || "").split("-"); var a = FACES[p[0]] ? p[0] : "fox"; return svg(size || 30, FACES[a](COLORS[p[1]] || COLORS.slate)); }
  function supportAvatar(size) { return svg(size || 30, '<rect x="2" y="2" width="36" height="36" rx="10" fill="#2D2B2D" stroke="#555" /><path d="M11 14h18L20 28z" fill="#2EFF9B"/>'); }
  function bell(dot) { var s = h("span", "bell"); s.innerHTML = '<svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor" aria-hidden="true"><path d="M12 22a2.5 2.5 0 0 0 2.4-1.8H9.6A2.5 2.5 0 0 0 12 22zm7-5.5-1.5-1.6V10a5.5 5.5 0 0 0-4-5.3V4a1.5 1.5 0 0 0-3 0v.7a5.5 5.5 0 0 0-4 5.3v4.9L5 16.5V18h14z"/></svg>'; if (dot) s.appendChild(h("i")); return s; }
  function time(iso) { var d = new Date(iso); if (isNaN(d)) return ""; var n = new Date();
    return d.toDateString() === n.toDateString() ? d.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }) : d.toLocaleDateString([], { month: "short", day: "numeric" }); }
  function api(path, opt) {
    opt = opt || {};
    return fetch(path, { method: opt.method || "GET", credentials: "same-origin", headers: { "Content-Type": "application/json", "X-Requested-With": "support" },
      body: opt.body ? JSON.stringify(opt.body) : undefined }).then(function (res) {
      return res.json().catch(function () { return null; }).then(function (data) {
        if (!res.ok) { var e = new Error((data && data.detail) || "Something went wrong (" + res.status + ")"); e.status = res.status; throw e; }
        return data; });
    });
  }
  // Draws the messages of one thread. who(m) -> {name, av} for visitor/operator messages; system messages are centred notes.
  function renderThread(box, msgs, who) {
    var near = box.scrollHeight - box.scrollTop - box.clientHeight < 80; box.textContent = "";
    msgs.forEach(function (m) {
      if (m.sender === "system") { box.appendChild(h("div", "sys", m.body)); return; }
      var w = who(m), row = h("div", "msg"), tx = h("div", "tx"), nm = h("div", "nm", w.name);
      nm.appendChild(h("time", "", time(m.at))); tx.append(nm, h("div", "bd", m.body)); row.append(w.av, tx); box.appendChild(row);
    });
    if (near) box.scrollTop = box.scrollHeight;
  }
  function composer(opt) {
    var root = h("form", "compose"), err = h("div", "err"), row = h("div", "row"), ta = h("textarea"), btn = h("button", "btn", "Send"), busy = false;
    err.hidden = true; ta.rows = 1; ta.maxLength = opt.max; ta.placeholder = opt.placeholder; ta.setAttribute("aria-label", opt.placeholder); btn.type = "submit";
    row.append(ta, btn); root.append(err, row);
    function setError(t) { err.textContent = t || ""; err.hidden = !t; }
    ta.addEventListener("input", function () { ta.style.height = "auto"; ta.style.height = Math.min(ta.scrollHeight, 120) + "px"; });
    ta.addEventListener("keydown", function (e) { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); root.requestSubmit(); } });
    root.addEventListener("submit", function (e) {
      e.preventDefault(); var t = ta.value.trim(); if (!t || busy) return; busy = true; btn.disabled = true; setError("");
      Promise.resolve(opt.onSend(t)).then(function () { ta.value = ""; ta.style.height = "auto"; })
        .catch(function (x) { setError(x.message); }).then(function () { busy = false; btn.disabled = false; ta.focus(); });
    });
    return { root: root, focus: function () { ta.focus(); } };
  }
  window.CU = { h: h, avatar: avatar, supportAvatar: supportAvatar, bell: bell, time: time, api: api, renderThread: renderThread, composer: composer };
})();
