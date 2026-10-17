const LS_KEY = "imposter_name_game_v1";
const UI_KEY = "imposter_ui_v1";
const COLORS = ["#22d3ee", "#e879f9", "#a3e635", "#fb7185", "#fbbf24", "#8b5cf6", "#34d399", "#f97316", "#60a5fa", "#f472b6", "#4ade80", "#facc15"];
const CATS = ["All", "Food", "Animals", "Places", "Objects", "Sports"];
const CLOSENESS = [["close", "Close"], ["medium", "Medium"], ["vague", "Vague"]];
const MIN_PLAYERS = 3, MAX_PLAYERS = 12;
const THEMES = [
  ["blood", "Blood", "#ff3b52", "#0b0203"],
  ["neon", "Neon", "#22d3ee", "#0a0a14"],
  ["toxic", "Toxic", "#39ff14", "#050a04"],
  ["abyss", "Abyss", "#4f7cff", "#03060f"],
  ["ember", "Ember", "#ff8c1a", "#0c0502"],
  ["royal", "Royal", "#b06bff", "#0d0518"],
  ["rose", "Rose", "#ff4d94", "#12030a"],
  ["gold", "Gold", "#f5c445", "#0c0903"],
  ["frost", "Frost", "#67e8f9", "#061018"],
  ["ghost", "Ghost", "#e5e7eb", "#0a0a0a"],
  ["hazard", "Hazard", "#facc15", "#0d0d05"],
  ["ocean", "Ocean", "#2dd4bf", "#02121a"],
  ["mocha", "Mocha", "#c08552", "#0f0906"],
  ["vapor", "Vapor", "#ff71ce", "#120a24"],
  ["sunset", "Sunset", "#ff8a4c", "#140612"],
  ["forest", "Forest", "#86efac", "#020a04"],
  ["night", "Night Sky", "#8ab4ff", "#030616"]
];
const FONTS = [
  ["sans", "Sans", "system-ui,-apple-system,'Segoe UI',Roboto,sans-serif"],
  ["rounded", "Rounded", "ui-rounded,'Varela Round','Nunito','Trebuchet MS',system-ui,sans-serif"],
  ["serif", "Serif", "Georgia,'Times New Roman',serif"],
  ["mono", "Mono", "ui-monospace,'Cascadia Mono','Roboto Mono',Consolas,monospace"],
  ["display", "Display", "Impact,'Arial Black','Franklin Gothic Medium',sans-serif"],
  ["comic", "Comic", "'Comic Neue','Comic Sans MS','Chalkboard SE',cursive"],
  ["typewriter", "Typewriter", "'Special Elite',Courier,'Courier New',monospace"],
  ["horror", "Horror", "'Creepster',Impact,'Arial Black',fantasy"],
  ["gothic", "Gothic", "'Pirata One','UnifrakturMaguntia',Papyrus,serif"],
  ["bangers", "Bangers", "'Bangers','Comic Sans MS',cursive"],
  ["marker", "Marker", "'Permanent Marker','Bradley Hand',cursive"],
  ["manuscript", "Manuscript", "'IM Fell English',Georgia,serif"],
  ["deco", "Deco", "'Monoton','Copperplate',fantasy"],
  ["scifi", "Sci-Fi", "'Orbitron',system-ui,sans-serif"],
  ["pixel", "Pixel", "'Press Start 2P',monospace"],
  ["zombie", "Zombie", "'Curse of the Zombie',Impact,fantasy"],
  ["hill", "Haunted Hill", "'Haunted Hill','Creepster',fantasy"],
  ["christmare", "Christmare", "'Christmare','Creepster',cursive"],
  ["eleanor", "Eleanor", "'Haunting Eleanor',Georgia,serif"],
  ["walking", "Dead Walking", "'Dead Font Walking',Impact,fantasy"],
  ["crawlers", "Crawlers", "'Creepy Crawlers','Comic Sans MS',cursive"],
  ["cute", "Cute Notes", "'Cute Notes','Comic Sans MS',cursive"],
  ["chasing", "Chasing Cars", "'KG Chasing Cars','Comic Sans MS',cursive"],
  ["moonstar", "Moonstar", "'Moonstar',Georgia,serif"]
];

window.APP_V = 5;

let S = null;
let UI = { theme: "blood", font: "sans" };
let pickColor = COLORS[0], heldOnce = false, audioCtx = null, toastT = null;

const $ = id => document.getElementById(id);
const bind = (id, prop, fn) => { const el = $(id); if (el) el[prop] = fn; };
const esc = s => String(s).replace(/[&<>"']/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
const byId = id => S.players.find(p => p.id === id);
const darkText = hex => luminance(hex) > 0.55;
const ink = hex => darkText(hex) ? "#08131c" : "#f4f7ff";

function newState() {
  return {
    v: 2, phase: "setup", players: [], round: 0,
    settings: { category: "All", closeness: "medium" },
    current: null, openId: null, revealStep: "handoff",
    voteSelectId: null, lastResult: null
  };
}

function save() {
  try { localStorage.setItem(LS_KEY, JSON.stringify(S)); } catch (e) {}
}

function loadState() {
  try {
    const raw = localStorage.getItem(LS_KEY);
    if (!raw) return null;
    const s = JSON.parse(raw);
    if (!s || (s.v !== 1 && s.v !== 2) || !Array.isArray(s.players)) return null;
    const VALID = ["setup", "reveal", "vote", "results"];
    if (!VALID.includes(s.phase)) s.phase = "setup";
    if (!s.settings || !s.settings.category) s.settings = { category: "All", closeness: "medium" };
    if (!s.current) s.phase = "setup";
    if (s.phase === "setup") { s.current = null; s.lastResult = null; }
    s.players.forEach(p => {
      if (!p.color) p.color = "#ff3b52";
      if (typeof p.score !== "number") p.score = 0;
      p.seen = !!p.seen;
      if (p.vote === undefined) p.vote = null;
      delete p.color2;
    });
    s.voteSelectId = null;
    s.v = 2;
    return s;
  } catch (e) { return null; }
}

function loadUI() {
  try {
    const raw = localStorage.getItem(UI_KEY);
    if (!raw) return;
    const u = JSON.parse(raw);
    if (THEMES.some(t => t[0] === u.theme)) UI.theme = u.theme;
    if (FONTS.some(f => f[0] === u.font)) UI.font = u.font;
  } catch (e) {}
}

function saveUI() {
  try { localStorage.setItem(UI_KEY, JSON.stringify(UI)); } catch (e) {}
}

function applyUI() {
  document.documentElement.dataset.theme = UI.theme;
  document.documentElement.dataset.font = UI.font;
  const t = THEMES.find(t => t[0] === UI.theme);
  const meta = document.querySelector('meta[name="theme-color"]');
  if (meta && t) meta.content = t[3];
  renderTopbar();
  saveUI();
}

function renderTopbar() {
  const tr = $("themeRow");
  tr.innerHTML = THEMES.map(([id, label, c, bg]) =>
    `<button class="tchip${UI.theme === id ? " on" : ""}" data-theme="${id}" title="${label}">` +
    `<span class="tdot" style="background:${c};color:${c};border-color:${bg}"></span>${label}</button>`
  ).join("");
  tr.querySelectorAll("[data-theme]").forEach(b => b.onclick = () => { UI.theme = b.dataset.theme; applyUI(); });
  const tEntry = THEMES.find(t => t[0] === UI.theme) || THEMES[0];
  const tLabel = tEntry[1];
  const fLabel = (FONTS.find(f => f[0] === UI.font) || FONTS[0])[1];
  const uiLabel = $("uiLabel");
  if (uiLabel) uiLabel.textContent = tLabel + " theme \u00b7 " + fLabel + " font";
  const badge = $("uiBadge");
  if (badge) badge.innerHTML =
    `<span class="tbTheme" style="color:${tEntry[2]}">&#9679; ${tLabel}</span>` +
    `<span class="tbSep">&middot;</span><span class="tbFont">${fLabel} font</span>`;
  const fr = $("fontRow");
  fr.innerHTML = FONTS.map(([id, label, stack]) =>
    `<button class="fchip${UI.font === id ? " on" : ""}" data-font="${id}" style="font-family:${stack}">${label}</button>`
  ).join("");
  fr.querySelectorAll("[data-font]").forEach(b => b.onclick = () => { UI.font = b.dataset.font; applyUI(); });
}

function tone(f, d) {
  try {
    audioCtx = audioCtx || new (window.AudioContext || window.webkitAudioContext)();
    const o = audioCtx.createOscillator(), g = audioCtx.createGain();
    o.type = "triangle"; o.frequency.value = f;
    g.gain.value = 0.06;
    o.connect(g); g.connect(audioCtx.destination);
    o.start();
    g.gain.exponentialRampToValueAtTime(0.0001, audioCtx.currentTime + d);
    o.stop(audioCtx.currentTime + d + 0.03);
  } catch (e) {}
}

function toast(m) {
  const t = $("toast");
  t.textContent = m;
  t.classList.add("show");
  clearTimeout(toastT);
  toastT = setTimeout(() => t.classList.remove("show"), 1900);
}

addEventListener("visibilitychange", () => { if (S) save(); });
addEventListener("pagehide", () => { if (S) save(); });

function drawImposter() {
  const idx = Math.floor(Math.random() * S.players.length);
  return S.players[idx].id;
}

function render() {
  if (!S) return;
  ["setup", "reveal", "vote", "results"].forEach(p => $("screen-" + p).classList.toggle("hidden", S.phase !== p));
  $("roundBadge").textContent = S.round > 0 ? "Round " + S.round : "";
  $("roundBadge").classList.toggle("hidden", S.phase === "setup");
  $("abandonBtn").classList.toggle("hidden", S.phase === "setup");
  if (S.phase === "setup") renderSetup();
  else if (S.phase === "reveal") { renderReveal(); renderOverlay(); }
  else if (S.phase === "vote") renderVote();
  else if (S.phase === "results") renderResults();
  save();
}

function renderSetup() {
  $("pcount").textContent = S.players.length + "/" + MAX_PLAYERS;
  $("startBtn").textContent = "START ROUND " + (S.round + 1);
  $("startBtn").disabled = S.players.length < MIN_PLAYERS;
  $("startNote").classList.toggle("hidden", S.players.length >= MIN_PLAYERS);
  const list = $("playerList");
  list.innerHTML = S.players.map(p =>
    `<div class="prow"><input type="color" class="pdot" data-cid="${p.id}" value="${p.color}" title="Player color">` +
    `<b>${esc(p.name)}</b>` +
    (p.score ? `<span class="miniScore">${p.score} pts</span>` : "") +
    `<button class="xbtn" data-del="${p.id}">&#10005;</button></div>`
  ).join("") || `<div class="muted small">No players yet.</div>`;
  list.querySelectorAll("[data-del]").forEach(b => b.onclick = () => {
    S.players = S.players.filter(p => p.id !== b.dataset.del);
    render();
  });
  list.querySelectorAll("[data-cid]").forEach(inp => inp.onchange = () => {
    const p = byId(inp.dataset.cid);
    if (p) { p.color = inp.value; save(); render(); }
  });
  const sw = $("swatches");
  sw.innerHTML = COLORS.map(c => `<button class="sw${c === pickColor ? " sel" : ""}" data-c="${c}" style="background:${c};color:${c}"></button>`).join("");
  sw.querySelectorAll("[data-c]").forEach(b => b.onclick = () => { pickColor = b.dataset.c; render(); });
  const custom = $("customColor");
  custom.value = /^#[0-9a-fA-F]{6}$/.test(pickColor) ? pickColor : COLORS[0];
  custom.classList.toggle("sel", !COLORS.includes(pickColor));
  const cat = $("catRow");
  cat.innerHTML = CATS.map(c => `<button class="chip${S.settings.category === c ? " on" : ""}" data-cat="${c}">${c}</button>`).join("");
  cat.querySelectorAll("[data-cat]").forEach(b => b.onclick = () => { S.settings.category = b.dataset.cat; render(); });
  const cl = $("closenessRow");
  cl.innerHTML = CLOSENESS.map(([k, l]) => `<button class="chip${S.settings.closeness === k ? " on" : ""}" data-cl="${k}">${l}</button>`).join("");
  cl.querySelectorAll("[data-cl]").forEach(b => b.onclick = () => { S.settings.closeness = b.dataset.cl; render(); });
}

function addPlayer() {
  if (S.players.length >= MAX_PLAYERS) return toast("Max " + MAX_PLAYERS + " players");
  const inp = $("pname");
  const name = inp.value.trim().slice(0, 12) || ("Player " + (S.players.length + 1));
  S.players.push({
    id: "p" + Date.now().toString(36) + Math.random().toString(36).slice(2, 6),
    name, color: pickColor, score: 0, seen: false, vote: null
  });
  pickColor = COLORS.find(c => !S.players.some(p => p.color === c)) || pickColor;
  inp.value = "";
  render();
}

function startRound() {
  if (S.players.length < MIN_PLAYERS) return toast("Need at least " + MIN_PLAYERS + " players");
  const entry = pickWord(S.settings.category);
  const impId = drawImposter();
  S.current = { word: entry.w, hint: entry[S.settings.closeness], imposterId: impId, category: entry.cat };
  S.players.forEach(p => { p.seen = false; p.vote = null; });
  S.round++;
  S.phase = "reveal"; S.openId = null; S.revealStep = "handoff";
  S.voteSelectId = null; S.lastResult = null;
  heldOnce = false;
  render();
}

function renderReveal() {
  const seen = S.players.filter(p => p.seen).length;
  $("seenProgress").textContent = seen + " / " + S.players.length + " notes seen";
  $("toVoteBtn").disabled = seen < S.players.length;
  $("toVoteBtn").textContent = seen < S.players.length
    ? "CONTINUE (" + seen + "/" + S.players.length + " SEEN)"
    : "CONTINUE TO VOTING \u2192";
  const grid = $("revealGrid");
  grid.innerHTML = S.players.map(p =>
    `<button class="ptile ${p.seen ? "seen" : "unseen"}" data-p="${p.id}" style="--pc:${p.color};${p.seen ? "" : "background:" + p.color + ";"}color:${p.seen ? p.color : ink(p.color)}">` +
    `<span class="ptName">${esc(p.name)}</span>` +
    `<span class="ptSub">${p.seen ? "SEEN \u2713" : "TAP TO VIEW"}</span></button>`
  ).join("");
  grid.querySelectorAll("[data-p]").forEach(b => b.onclick = () => {
    const p = byId(b.dataset.p);
    if (p.seen) return toast(p.name + " already saw their note");
    S.openId = p.id; S.revealStep = "handoff"; heldOnce = false;
    render();
  });
}

function renderOverlay() {
  const ov = $("overlay");
  const p = S.openId ? byId(S.openId) : null;
  if (!p) { ov.classList.add("hidden"); ov.innerHTML = ""; return; }
  ov.classList.remove("hidden");
  if (S.revealStep === "handoff") {
    ov.innerHTML =
      `<div class="ovCard">
        <div class="ovPass">Pass the phone to</div>
        <div class="ovName" style="color:${p.color}">${esc(p.name)}</div>
        <div class="ovNote muted small">Make sure nobody else can see!</div>
        <button class="btn big full" id="ovStart">I'M ${esc(p.name.toUpperCase())} &mdash; OPEN MY NOTE</button>
        <button class="btn ghost full" id="ovCancel">Cancel</button>
      </div>`;
    $("ovStart").onclick = () => { S.revealStep = "hold"; render(); };
    $("ovCancel").onclick = () => { S.openId = null; S.revealStep = "handoff"; render(); };
  } else {
    const imp = p.id === S.current.imposterId;
    ov.innerHTML =
      `<div class="ovCard">
        <div class="ovPass">${esc(p.name)}'s note</div>
        <div class="holdZone" id="holdZone" style="--pc:${p.color}">
          <div class="holdHint" id="holdHint">PRESS &amp; HOLD</div>
          <div class="holdResult" id="holdResult"></div>
        </div>
        <div class="ovNote muted small">${heldOnce ? "Let go when done &mdash; nobody should see this!" : "Hold the circle to reveal your note"}</div>
        <button class="btn big full" id="gotBtn" ${heldOnce ? "" : "disabled"}>GOT IT &mdash; I'LL REMEMBER</button>
      </div>`;
    $("gotBtn").onclick = () => {
      p.seen = true;
      tone(700, 0.09);
      S.openId = null; S.revealStep = "handoff";
      render();
    };
    bindHoldZone(p, imp);
  }
}

function bindHoldZone(p, imp) {
  const z = $("holdZone"), res = $("holdResult"), hint = $("holdHint"), got = $("gotBtn");
  const show = e => {
    if (e) e.preventDefault();
    z.classList.add("holding");
    hint.style.display = "none";
    res.innerHTML = imp
      ? `<div class="impCard"><div class="impTitle">YOU ARE THE IMPOSTER</div><div class="impHint">Your hint: &ldquo;${esc(S.current.hint)}&rdquo;</div></div>`
      : `<div class="wordCard">${esc(S.current.word)}</div>`;
    if (!heldOnce) { heldOnce = true; got.disabled = false; tone(imp ? 196 : 520, 0.14); }
  };
  const hide = e => {
    if (e) e.preventDefault();
    z.classList.remove("holding");
    hint.style.display = "";
    res.innerHTML = "";
  };
  z.addEventListener("pointerdown", show);
  z.addEventListener("pointerup", hide);
  z.addEventListener("pointercancel", hide);
  z.addEventListener("pointerleave", hide);
  z.addEventListener("contextmenu", e => e.preventDefault());
  z.addEventListener("touchstart", show, { passive: false });
  z.addEventListener("touchend", hide, { passive: false });
  z.addEventListener("touchcancel", hide, { passive: false });
}

function renderVote() {
  const voted = S.players.filter(p => p.vote !== null).length;
  const realVotes = S.players.filter(p => p.vote && p.vote !== "abstain").length;
  const sel = S.voteSelectId ? byId(S.voteSelectId) : null;

  if (!sel) {
    $("voteTurn").innerHTML = "Voting is open \u2014 <b>tap your own card</b> to vote";
    $("voteProgress").textContent = voted + " / " + S.players.length + " done \u00b7 anyone can vote or change any time";
    $("voteBox").innerHTML =
      `<div class="pGrid small" id="voteGrid">` + S.players.map(p => {
        const t = p.vote && p.vote !== "abstain" ? byId(p.vote) : null;
        const sub = p.vote === null ? "TAP YOUR CARD TO VOTE"
          : p.vote === "abstain" ? "ABSTAINED \u00b7 TAP TO CHANGE"
          : "VOTED: " + esc(t ? t.name : "?") + " \u00b7 TAP TO CHANGE";
        return `<button class="ptile ${p.vote === null ? "unseen" : "voted"}" data-me="${p.id}" style="--pc:${p.color};background:${p.color};color:${ink(p.color)}">` +
          `<span class="ptName">${esc(p.name)}</span><span class="ptSub">${sub}</span></button>`;
      }).join("") + `</div>` +
      `<div class="votedBar"><button class="btn big full" id="vContinue">CONTINUE \u2014 CHECK WHO GOT IT RIGHT</button>` +
      `<div class="muted small">Enabled once at least one vote is cast \u00b7 abstaining is allowed</div></div>`;
    $("voteGrid").querySelectorAll("[data-me]").forEach(b => b.onclick = () => {
      S.voteSelectId = b.dataset.me;
      render();
    });
    $("vContinue").disabled = realVotes === 0;
    $("vContinue").onclick = () => {
      if (realVotes === 0) return toast("At least one player must vote");
      finishVoting();
    };
    return;
  }

  $("voteTurn").innerHTML = "Pass the phone to <b style=\"color:" + sel.color + "\">" + esc(sel.name) + "</b> \u2014 who do you want to vote?";
  $("voteProgress").textContent = sel.vote && sel.vote !== "abstain" && byId(sel.vote)
    ? "Current vote: " + byId(sel.vote).name
    : "No vote recorded yet";
  $("voteBox").innerHTML =
    `<div class="pGrid small" id="voteGrid">` + S.players.map(p => {
      const isSelf = p.id === sel.id;
      const cur = sel.vote === p.id;
      return `<button class="ptile ${cur ? "voted" : "unseen"}" data-t="${p.id}" ${isSelf ? "disabled" : ""} style="--pc:${p.color};background:${p.color};color:${ink(p.color)}">` +
        `<span class="ptName">${esc(p.name)}</span>` +
        `<span class="ptSub">${isSelf ? "YOU" : (cur ? "CURRENT VOTE" : "TAP TO VOTE")}</span></button>`;
    }).join("") + `</div>` +
    `<div class="votedBar">` +
    `<button class="btn full" id="vAbstain">ABSTAIN \u2014 NO VOTE</button>` +
    `<button class="btn ghost full" id="vBack">Back</button></div>`;
  $("voteGrid").querySelectorAll("[data-t]").forEach(b => b.onclick = () => {
    sel.vote = b.dataset.t;
    S.voteSelectId = null;
    tone(440, 0.06);
    render();
  });
  $("vAbstain").onclick = () => {
    sel.vote = "abstain";
    S.voteSelectId = null;
    render();
  };
  $("vBack").onclick = () => { S.voteSelectId = null; render(); };
}

function finishVoting() {
  const votes = {};
  S.players.forEach(p => {
    if (p.vote !== null && p.vote !== "abstain") votes[p.id] = p.vote;
  });
  const r = computeScoring(votes, S.current.imposterId);
  S.players.forEach(p => { p.score += (r.deltas[p.id] || 0); });
  S.lastResult = {
    imposterId: S.current.imposterId, word: S.current.word, hint: S.current.hint,
    category: S.current.category, votes, deltas: r.deltas,
    majorityCorrect: r.majorityCorrect, correctCount: r.correctCount, total: r.total, rareCatch: r.rareCatch
  };
  S.phase = "results";
  S.voteSelectId = null;
  tone(r.majorityCorrect ? 620 : 180, 0.2);
  render();
}

function renderResults() {
  const R = S.lastResult;
  if (!R) { S.phase = "setup"; render(); return; }
  const imp = byId(R.imposterId);
  const sorted = [...S.players].sort((a, b) => b.score - a.score);
  let rank = 0, prev = null;
  const ranked = sorted.map((p, i) => {
    if (prev === null || p.score !== prev) rank = i + 1;
    prev = p.score;
    return { p, rank };
  });
  $("resultsBox").innerHTML =
    `<div class="revealWrap">
      <div class="muted small">THE IMPOSTER WAS</div>
      <div class="impName" style="color:${imp.color}">${esc(imp.name)}</div>
      <div class="muted small">The word was <b class="wordInline">${esc(R.word)}</b> &middot; ${esc(imp.name)}'s hint: &ldquo;${esc(R.hint)}&rdquo;</div>
      <div class="badge ${R.majorityCorrect ? "good" : "bad"}">${R.majorityCorrect
        ? "Majority guessed right &mdash; imposter scores 0"
        : "Majority guessed wrong &mdash; imposter scores +2"}</div>
      ${R.rareCatch ? `<div class="badge good">Rare catch &mdash; under 1/4 guessed right, correct guessers score +2</div>` : ""}
    </div>
    <div class="card"><h3>Votes</h3>${S.players.map(p => {
      const cast = R.votes[p.id];
      const t = cast ? byId(cast) : null;
      const ok = cast === R.imposterId;
      const d = R.deltas[p.id] || 0;
      const tag = !cast
        ? `<span class="vtag">${p.vote === "abstain" ? "abstained" : "no vote"}</span>`
        : `<span class="vtag ${ok ? "ok" : "no"}">${ok ? "correct" : "wrong"}</span>`;
      return `<div class="vrow"><span class="dot" style="background:${p.color}"></span><span class="vname">${esc(p.name)}</span>` +
        `<span class="arrow">&rarr;</span><span class="vname">${t ? esc(t.name) : "&mdash;"}</span>` +
        tag + `<span class="vpts">+${d}</span></div>`;
    }).join("")}</div>
    <div class="card"><h3>Final Ranking</h3>${ranked.map(({ p, rank }) =>
      `<div class="srow"><span class="rank${rank === 1 ? " top" : ""}">#${rank}</span>` +
      `<span class="dot" style="background:${p.color}"></span><b>${esc(p.name)}</b>` +
      `<span class="spacer"></span><b class="score">${p.score}</b></div>`).join("")}</div>`;
  $("nextBtn").onclick = () => startRound();
  $("playAgainBtn").onclick = () => {
    askConfirm("Play again? Scores reset, same players.", () => {
      S.round = 0;
      S.players.forEach(p => { p.score = 0; });
      startRound();
    });
  };
  $("setupBtn").onclick = () => {
    S.phase = "setup";
    S.players.forEach(p => { p.seen = false; p.vote = null; });
    S.openId = null; S.voteSelectId = null;
    render();
  };
}

let confirmCb = null;

function askConfirm(msg, cb) {
  confirmCb = cb;
  $("confirmMsg").textContent = msg;
  $("confirmModal").classList.remove("hidden");
}

function closeConfirm() {
  confirmCb = null;
  $("confirmModal").classList.add("hidden");
}

function init() {
  try {
    loadUI();
    applyUI();
    S = loadState() || newState();
    if (S.openId) { S.openId = null; S.revealStep = "handoff"; }
    heldOnce = false;
    pickColor = COLORS.find(c => !S.players.some(p => p.color === c)) || COLORS[0];
    render();
  } catch (err) {
    if (window.console && console.error) console.error("init failed, resetting state", err);
    try { localStorage.removeItem(LS_KEY); } catch (e) {}
    S = newState();
    pickColor = COLORS[0];
    try { render(); } catch (e) {}
  }
}

bind("addBtn", "onclick", addPlayer);
bind("pname", "onkeydown", e => { if (e.key === "Enter") addPlayer(); });
bind("startBtn", "onclick", startRound);
bind("customColor", "oninput", () => { pickColor = $("customColor").value; render(); });
bind("themeBtn", "onclick", () => { $("themePanel").classList.remove("hidden"); $("themeScrim").classList.remove("hidden"); });
const closeThemePanel = () => { $("themePanel").classList.add("hidden"); $("themeScrim").classList.add("hidden"); };
bind("panelClose", "onclick", closeThemePanel);
bind("themeScrim", "onclick", closeThemePanel);
bind("resetBtn", "onclick", () => {
  if (S.players.length < MIN_PLAYERS) return toast("Need at least " + MIN_PLAYERS + " players");
  askConfirm("Reset the game? Same players, scores back to 0, brand new round.", () => {
    S.round = 0;
    S.players.forEach(p => { p.score = 0; });
    startRound();
    toast("Game reset \u2014 scores cleared, round 1");
  });
});
bind("toVoteBtn", "onclick", () => {
  if (S.players.some(p => !p.seen)) return toast("Everyone must see their note first");
  S.phase = "vote"; S.voteSelectId = null;
  render();
});
bind("newGameBtn", "onclick", () => {
  askConfirm("Clear all players and scores?", () => {
    S = newState();
    pickColor = COLORS[0];
    render();
  });
});
bind("abandonBtn", "onclick", () => {
  askConfirm("Abandon this round? Finished rounds keep their scores.", () => {
    if (S.phase === "reveal" || S.phase === "vote") S.round--;
    S.phase = "setup"; S.current = null; S.lastResult = null;
    S.openId = null; S.voteSelectId = null;
    S.players.forEach(p => { p.seen = false; p.vote = null; });
    render();
  });
});
bind("confirmYes", "onclick", () => {
  const cb = confirmCb;
  closeConfirm();
  if (cb) cb();
});
bind("confirmNo", "onclick", closeConfirm);

init();
