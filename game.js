const LS_KEY = "imposter_name_game_v1";
const COLORS = ["#22d3ee", "#e879f9", "#a3e635", "#fb7185", "#fbbf24", "#8b5cf6", "#34d399", "#f97316", "#60a5fa", "#f472b6", "#4ade80", "#facc15"];
const CATS = ["All", "Food", "Animals", "Places", "Objects", "Sports"];
const CLOSENESS = [["close", "Close"], ["medium", "Medium"], ["vague", "Vague"]];
const MIN_PLAYERS = 3, MAX_PLAYERS = 12;

let S = null, pickColor = COLORS[0], heldOnce = false, audioCtx = null, toastT = null;

const $ = id => document.getElementById(id);
const esc = s => String(s).replace(/[&<>"']/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
const byId = id => S.players.find(p => p.id === id);
const darkText = hex => luminance(hex) > 0.55;
const ink = hex => darkText(hex) ? "#08131c" : "#f4f7ff";

const fx = document.getElementById("fx");
const fctx = fx.getContext ? fx.getContext("2d") : null;
let parts = [], raf = null;

function newState() {
  return {
    v: 1, phase: "setup", players: [], round: 0,
    settings: { category: "All", closeness: "medium" },
    current: null, openId: null, revealStep: "handoff",
    voteStep: "handoff", votingId: null, pendingTarget: null, lastResult: null
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

function resizeFx() {
  if (!fctx) return;
  const dpr = window.devicePixelRatio || 1;
  fx.width = innerWidth * dpr;
  fx.height = innerHeight * dpr;
  fctx.setTransform(dpr, 0, 0, dpr, 0, 0);
}

function burst(n) {
  if (!fctx) return;
  resizeFx();
  for (let i = 0; i < n; i++) {
    parts.push({
      x: innerWidth / 2, y: innerHeight * 0.32,
      vx: (Math.random() - 0.5) * 11, vy: Math.random() * -10 - 2, g: 0.36,
      rot: Math.random() * 6.3, vr: (Math.random() - 0.5) * 0.35,
      c: COLORS[i % COLORS.length], s: 6 + Math.random() * 7,
      life: 100 + Math.random() * 50
    });
  }
  if (!raf) raf = requestAnimationFrame(fxLoop);
}

function fxLoop() {
  fctx.clearRect(0, 0, innerWidth, innerHeight);
  parts = parts.filter(p => p.life-- > 0);
  for (const p of parts) {
    p.vy += p.g; p.x += p.vx; p.y += p.vy; p.rot += p.vr;
    fctx.save();
    fctx.translate(p.x, p.y);
    fctx.rotate(p.rot);
    fctx.globalAlpha = Math.min(1, p.life / 40);
    fctx.fillStyle = p.c;
    fctx.fillRect(-p.s / 2, -p.s / 2, p.s, p.s * 0.6);
    fctx.restore();
  }
  if (parts.length) raf = requestAnimationFrame(fxLoop);
  else { raf = null; fctx.clearRect(0, 0, innerWidth, innerHeight); }
}

addEventListener("resize", () => { if (fx.width) resizeFx(); });
addEventListener("visibilitychange", () => { if (S) save(); });
addEventListener("pagehide", () => { if (S) save(); });

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
    `<div class="prow"><span class="dot" style="background:${p.color}"></span><b>${esc(p.name)}</b>` +
    (p.score ? `<span class="miniScore">${p.score} pts</span>` : "") +
    `<button class="xbtn" data-del="${p.id}">&#10005;</button></div>`
  ).join("") || `<div class="muted small">No players yet.</div>`;
  list.querySelectorAll("[data-del]").forEach(b => b.onclick = () => {
    S.players = S.players.filter(p => p.id !== b.dataset.del);
    render();
  });
  const sw = $("swatches");
  sw.innerHTML = COLORS.map(c => `<button class="sw${c === pickColor ? " sel" : ""}" data-c="${c}" style="background:${c};color:${c}"></button>`).join("");
  sw.querySelectorAll("[data-c]").forEach(b => b.onclick = () => { pickColor = b.dataset.c; render(); });
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
  let imp = S.players[Math.floor(Math.random() * S.players.length)];
  if (S.round > 0 && S.current && S.players.length > 2 && imp.id === S.current.imposterId) {
    imp = S.players[(S.players.indexOf(imp) + 1) % S.players.length];
  }
  S.current = { word: entry.w, hint: entry[S.settings.closeness], imposterId: imp.id, category: entry.cat };
  S.players.forEach(p => { p.seen = false; p.vote = null; });
  S.round++;
  S.phase = "reveal"; S.openId = null; S.revealStep = "handoff";
  S.voteStep = "handoff"; S.votingId = null; S.pendingTarget = null; S.lastResult = null;
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
  $("voteProgress").textContent = voted + " / " + S.players.length + " votes cast";
  const box = $("voteBox");
  if (S.voteStep === "handoff") {
    box.innerHTML =
      `<div class="ovCard inline">
        <div class="ovPass">Pass the phone to</div>
        <div class="ovName" style="color:${voter.color}">${esc(voter.name)}</div>
        <button class="btn big full" id="vStart">I'M ${esc(voter.name.toUpperCase())} &mdash; VOTE NOW</button>
      </div>`;
    $("vStart").onclick = () => { S.voteStep = "choose"; render(); };
  } else if (S.voteStep === "choose") {
    box.innerHTML =
      `<div class="ovCard inline">
        <div class="q">${esc(voter.name)}, who is the IMPOSTER?</div>
        <div class="pGrid small">${S.players.filter(p => p.id !== voter.id).map(p =>
          `<button class="ptile unseen" data-t="${p.id}" style="--pc:${p.color};color:${ink(p.color)}">` +
          `<span class="ptName">${esc(p.name)}</span></button>`).join("")}</div>
      </div>`;
    box.querySelectorAll("[data-t]").forEach(b => b.onclick = () => {
      S.pendingTarget = b.dataset.t;
      S.voteStep = "confirm";
      render();
    });
  } else {
    const t = byId(S.pendingTarget);
    if (!t) { S.voteStep = "choose"; render(); return; }
    box.innerHTML =
      `<div class="ovCard inline">
        <div class="q">${esc(voter.name)}, you voted:</div>
        <div class="votedChip" style="--pc:${t.color}"><span class="dot" style="background:${t.color}"></span><b>${esc(t.name)}</b></div>
        <button class="btn big full" id="vConfirm">CONFIRM VOTE</button>
        <button class="btn ghost full" id="vChange">Change</button>
      </div>`;
    $("vConfirm").onclick = () => {
      voter.vote = S.pendingTarget;
      S.pendingTarget = null;
      S.voteStep = "handoff";
      tone(440, 0.06);
      render();
    };
    $("vChange").onclick = () => { S.pendingTarget = null; S.voteStep = "choose"; render(); };
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
  S.voteStep = "handoff"; S.votingId = null; S.pendingTarget = null;
  tone(r.majorityCorrect ? 620 : 180, 0.2);
  render();
  burst(90);
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
  $("setupBtn").onclick = () => {
    S.phase = "setup";
    S.players.forEach(p => { p.seen = false; p.vote = null; });
    S.openId = null; S.votingId = null; S.pendingTarget = null;
    render();
  };
}

function init() {
  S = loadState() || newState();
  if (S.openId) { S.openId = null; S.revealStep = "handoff"; }
  if (S.votingId) { S.voteStep = "handoff"; S.pendingTarget = null; }
  heldOnce = false;
  pickColor = COLORS.find(c => !S.players.some(p => p.color === c)) || COLORS[0];
  render();
  if (S.phase === "results" && S.lastResult) burst(70);
}

$("addBtn").onclick = addPlayer;
$("pname").addEventListener("keydown", e => { if (e.key === "Enter") addPlayer(); });
$("startBtn").onclick = startRound;
$("toVoteBtn").onclick = () => {
  if (S.players.some(p => !p.seen)) return toast("Everyone must see their note first");
  S.phase = "vote"; S.voteStep = "handoff"; S.pendingTarget = null;
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
