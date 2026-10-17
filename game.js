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
  ["ember", "Ember", "#ff8c1a", "#0c0502"]
];
const FONTS = [
  ["sans", "Sans", "system-ui,-apple-system,'Segoe UI',Roboto,sans-serif"],
  ["rounded", "Rounded", "ui-rounded,'Varela Round','Nunito','Trebuchet MS',system-ui,sans-serif"],
  ["serif", "Serif", "Georgia,'Times New Roman',serif"],
  ["mono", "Mono", "ui-monospace,'Cascadia Mono','Roboto Mono',Consolas,monospace"],
  ["display", "Display", "Impact,'Arial Black','Franklin Gothic Medium',sans-serif"]
];

let S = null;
let UI = { theme: "blood", font: "sans" };
let pickColor = COLORS[0], heldOnce = false, audioCtx = null, toastT = null;

const $ = id => document.getElementById(id);
const esc = s => String(s).replace(/[&<>"']/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
const byId = id => S.players.find(p => p.id === id);
const darkText = hex => luminance(hex) > 0.55;
const ink = hex => darkText(hex) ? "#08131c" : "#f4f7ff";

function newState() {
  return {
    v: 1, phase: "setup", players: [], round: 0,
    settings: { category: "All", closeness: "medium" },
    current: null, openId: null, revealStep: "handoff",
    votingId: null, pendingTarget: null, lastResult: null, bag: []
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
    return s && s.v === 1 ? s : null;
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
  tr.innerHTML = THEMES.map(([id, label, c]) =>
    `<button class="tdot${UI.theme === id ? " on" : ""}" data-theme="${id}" title="${label}" style="background:${c};color:${c}"></button>`
  ).join("");
  tr.querySelectorAll("[data-theme]").forEach(b => b.onclick = () => { UI.theme = b.dataset.theme; applyUI(); });
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

function shuffled(a) {
  const r = [...a];
  for (let i = r.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [r[i], r[j]] = [r[j], r[i]];
  }
  return r;
}

function drawImposter() {
  S.bag = (S.bag || []).filter(id => S.players.some(p => p.id === id));
  if (!S.bag.length) {
    S.bag = shuffled(S.players.map(p => p.id));
    if (S.current && S.bag.length > 1 && S.bag[S.bag.length - 1] === S.current.imposterId) {
      const j = S.bag.findIndex(id => id !== S.current.imposterId);
      [S.bag[j], S.bag[S.bag.length - 1]] = [S.bag[S.bag.length - 1], S.bag[j]];
    }
  }
  return S.bag.pop();
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
    `<div class="prow"><input type="color" class="pdot" data-cid="${p.id}" value="${p.color}" title="Change color">` +
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
    if (p) { p.color = inp.value; save(); }
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
  S.votingId = null; S.pendingTarget = null; S.lastResult = null;
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
    `<button class="ptile ${p.seen ? "seen" : "unseen"}" data-p="${p.id}" style="--pc:${p.color};color:${p.seen ? p.color : ink(p.color)}">` +
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
  const voter = S.players.find(p => p.vote === null);
  if (!voter) { finishVoting(); return; }
  S.votingId = voter.id;
  $("voteTurn").innerHTML = "Pass the phone to <b style=\"color:" + voter.color + "\">" + esc(voter.name) + "</b>";
  $("voteProgress").textContent = voted + " / " + S.players.length + " votes cast";
  const target = S.pendingTarget ? byId(S.pendingTarget) : null;
  $("voteBox").innerHTML =
    `<div class="pGrid small" id="voteGrid">` + S.players.map(p => {
      const isSelf = p.id === voter.id;
      const sel = S.pendingTarget === p.id;
      return `<button class="ptile ${sel ? "voted" : "unseen"}" data-t="${p.id}" ${isSelf ? "disabled" : ""} style="--pc:${p.color};color:${ink(p.color)}">` +
        `<span class="ptName">${esc(p.name)}</span>` +
        `<span class="ptSub">${isSelf ? "YOU" : "TAP TO VOTE"}</span></button>`;
    }).join("") + `</div>` +
    `<div class="votedBar">` + (target
      ? `<div class="votedChip" style="--pc:${target.color}"><span class="dot" style="background:${target.color}"></span>` +
        `<span class="muted small">${esc(voter.name)} voted:</span><b>${esc(target.name)}</b></div>` +
        `<button class="btn big full" id="vConfirm">CONFIRM VOTE</button>` +
        `<button class="btn ghost full" id="vChange">Change</button>`
      : `<div class="muted small">Tap the player you suspect, then confirm.</div>`) + `</div>`;
  $("voteGrid").querySelectorAll("[data-t]").forEach(b => b.onclick = () => {
    S.pendingTarget = b.dataset.t;
    render();
  });
  if (target) {
    $("vConfirm").onclick = () => {
      voter.vote = target.id;
      S.pendingTarget = null;
      tone(440, 0.06);
      render();
    };
    $("vChange").onclick = () => { S.pendingTarget = null; render(); };
  }
}

function finishVoting() {
  const votes = {};
  S.players.forEach(p => { votes[p.id] = p.vote; });
  const r = computeScoring(votes, S.current.imposterId);
  S.players.forEach(p => { p.score += (r.deltas[p.id] || 0); });
  S.lastResult = {
    imposterId: S.current.imposterId, word: S.current.word, hint: S.current.hint,
    category: S.current.category, votes, deltas: r.deltas,
    majorityCorrect: r.majorityCorrect, correctCount: r.correctCount, total: r.total
  };
  S.phase = "results";
  S.votingId = null; S.pendingTarget = null;
  tone(r.majorityCorrect ? 620 : 180, 0.2);
  render();
}

function renderResults() {
  const R = S.lastResult;
  if (!R) { S.phase = "setup"; render(); return; }
  const imp = byId(R.imposterId);
  const sorted = [...S.players].sort((a, b) => b.score - a.score);
  $("resultsBox").innerHTML =
    `<div class="revealWrap">
      <div class="muted small">THE IMPOSTER WAS</div>
      <div class="impName" style="color:${imp.color}">${esc(imp.name)}</div>
      <div class="muted small">The word was <b class="wordInline">${esc(R.word)}</b> &middot; ${esc(imp.name)}'s hint: &ldquo;${esc(R.hint)}&rdquo;</div>
      <div class="badge ${R.majorityCorrect ? "good" : "bad"}">${R.majorityCorrect
        ? "Majority guessed right &mdash; imposter scores 0"
        : "Majority guessed wrong &mdash; imposter scores +2"}</div>
    </div>
    <div class="card"><h3>Votes</h3>${S.players.map(p => {
      const t = byId(R.votes[p.id]);
      const ok = R.votes[p.id] === R.imposterId;
      const d = R.deltas[p.id] || 0;
      return `<div class="vrow"><span class="dot" style="background:${p.color}"></span><span class="vname">${esc(p.name)}</span>` +
        `<span class="arrow">&rarr;</span><span class="vname">${t ? esc(t.name) : "&mdash;"}</span>` +
        `<span class="vtag ${ok ? "ok" : "no"}">${ok ? "correct" : "wrong"}</span>` +
        `<span class="vpts">+${d}</span></div>`;
    }).join("")}</div>
    <div class="card"><h3>Scoreboard</h3>${sorted.map((p, i) =>
      `<div class="srow"><span class="rank">${i === 0 ? "\u2605" : (i + 1)}</span>` +
      `<span class="dot" style="background:${p.color}"></span><b>${esc(p.name)}</b>` +
      `<span class="spacer"></span><b class="score">${p.score}</b></div>`).join("")}</div>`;
  $("nextBtn").onclick = () => startRound();
  $("playAgainBtn").onclick = () => {
    if (!confirm("Play again? Scores reset, same players.")) return;
    S.round = 0; S.bag = [];
    S.players.forEach(p => { p.score = 0; });
    startRound();
  };
  $("setupBtn").onclick = () => {
    S.phase = "setup";
    S.players.forEach(p => { p.seen = false; p.vote = null; });
    S.openId = null; S.votingId = null; S.pendingTarget = null;
    render();
  };
}

function init() {
  loadUI();
  applyUI();
  S = loadState() || newState();
  if (S.openId) { S.openId = null; S.revealStep = "handoff"; }
  heldOnce = false;
  pickColor = COLORS.find(c => !S.players.some(p => p.color === c)) || COLORS[0];
  render();
}

$("addBtn").onclick = addPlayer;
$("pname").addEventListener("keydown", e => { if (e.key === "Enter") addPlayer(); });
$("startBtn").onclick = startRound;
$("customColor").oninput = () => { pickColor = $("customColor").value; render(); };
$("toVoteBtn").onclick = () => {
  if (S.players.some(p => !p.seen)) return toast("Everyone must see their note first");
  S.phase = "vote"; S.pendingTarget = null;
  render();
};
$("newGameBtn").onclick = () => {
  if (!confirm("Clear all players and scores?")) return;
  S = newState();
  pickColor = COLORS[0];
  render();
};
$("abandonBtn").onclick = () => {
  if (!confirm("Abandon this round? Finished rounds keep their scores.")) return;
  if (S.phase === "reveal" || S.phase === "vote") S.round--;
  S.phase = "setup"; S.current = null; S.lastResult = null;
  S.openId = null; S.votingId = null; S.pendingTarget = null;
  S.players.forEach(p => { p.seen = false; p.vote = null; });
  render();
};

init();
