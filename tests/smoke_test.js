const path = require("path");
const assert = require("assert");

let JSDOM;
try {
  ({ JSDOM } = require("jsdom"));
} catch (e) {
  console.log("jsdom not installed - skipping smoke test (npm i -D jsdom to run)");
  process.exit(0);
}

const htmlPath = path.join(__dirname, "..", "index.html");

function click(el) {
  assert.ok(el, "element to click must exist");
  el.click();
}

async function main() {
  const dom = await JSDOM.fromFile(htmlPath, {
    runScripts: "dangerously",
    resources: "usable",
    pretendToBeVisual: true
  });
  const { window } = dom;
  await new Promise(r => window.addEventListener("load", r));
  const doc = window.document;
  const evalState = expr => window.eval(expr);

  assert.strictEqual(doc.documentElement.dataset.theme, "blood", "blood theme is default");
  assert.strictEqual(doc.querySelectorAll("#themeRow .tdot").length, 5);
  assert.strictEqual(doc.querySelectorAll("#fontRow .fchip").length, 5);
  click(doc.querySelector('#themeRow [data-theme="abyss"]'));
  assert.strictEqual(doc.documentElement.dataset.theme, "abyss", "theme switching works");
  click(doc.querySelector('#themeRow [data-theme="blood"]'));

  const custom = doc.getElementById("customColor");
  custom.value = "#123456";
  custom.dispatchEvent(new window.Event("input", { bubbles: true }));

  const addPlayer = name => {
    doc.getElementById("pname").value = name;
    click(doc.getElementById("addBtn"));
  };

  addPlayer("A");
  assert.strictEqual(evalState("S.players[0].color"), "#123456", "custom color picker applies to new player");
  const aDot = doc.querySelector('#playerList [data-cid="' + evalState("S.players[0].id") + '"]');
  aDot.value = "#22d3ee";
  aDot.dispatchEvent(new window.Event("change", { bubbles: true }));
  assert.strictEqual(evalState("S.players[0].color"), "#22d3ee", "per-player color picker works");

  addPlayer("B");
  addPlayer("C");
  addPlayer("D");
  assert.strictEqual(evalState("S.players.length"), 4);

  const revealAll = () => {
    const ids = evalState("S.players.map(p => p.id)");
    for (const id of ids) {
      click(doc.querySelector('#revealGrid [data-p="' + id + '"]'));
      click(doc.getElementById("ovStart"));
      const zone = doc.getElementById("holdZone");
      zone.dispatchEvent(new window.Event("pointerdown", { bubbles: true }));
      zone.dispatchEvent(new window.Event("pointerup", { bubbles: true }));
      const got = doc.getElementById("gotBtn");
      assert.strictEqual(got.disabled, false, "Got it must unlock after holding");
      click(got);
    }
    return ids;
  };

  const voteAll = plan => {
    for (const id of evalState("S.players.map(p => p.id)")) {
      assert.strictEqual(evalState("S.votingId"), id, "voter order must follow player order");
      const selfTile = doc.querySelector('#voteGrid [data-t="' + id + '"]');
      assert.ok(selfTile && selfTile.disabled, "cannot vote for yourself");
      click(doc.querySelector('#voteGrid [data-t="' + plan[id] + '"]'));
      assert.strictEqual(evalState("S.pendingTarget"), plan[id]);
      assert.ok(doc.querySelector("#voteBox .votedChip"), "voted chip must show before confirm");
      click(doc.getElementById("vConfirm"));
    }
  };

  click(doc.getElementById("startBtn"));
  assert.strictEqual(evalState("S.phase"), "reveal");
  const impId = evalState("S.current.imposterId");
  assert.strictEqual(evalState("S.players.some(p => p.id === S.current.imposterId)"), true);

  let allIds = revealAll();
  assert.strictEqual(evalState("S.players.every(p => p.seen)"), true);

  const toVote = doc.getElementById("toVoteBtn");
  assert.strictEqual(toVote.disabled, false);
  click(toVote);
  assert.strictEqual(evalState("S.phase"), "vote");

  const others = allIds.filter(id => id !== impId);
  const singleCorrect = others[0];
  const plan1 = {
    [impId]: others[0],
    [singleCorrect]: impId,
    [others[1]]: others[2],
    [others[2]]: others[1]
  };
  voteAll(plan1);

  assert.strictEqual(evalState("S.phase"), "results");
  const scores1 = evalState("JSON.parse(JSON.stringify(S.players))");
  for (const p of scores1) {
    if (p.id === singleCorrect) assert.strictEqual(p.score, 2, "sole correct guesser gets +2");
    else if (p.id === impId) assert.strictEqual(p.score, 2, "imposter gets +2 when not caught by majority");
    else assert.strictEqual(p.score, 0, "wrong voters get 0");
  }

  click(doc.getElementById("nextBtn"));
  assert.strictEqual(evalState("S.phase"), "reveal");
  const imp2 = evalState("S.current.imposterId");
  assert.notStrictEqual(imp2, impId, "imposter rotates through everyone before repeating");
  revealAll();

  click(doc.getElementById("toVoteBtn"));
  const plan2 = {};
  for (const id of allIds) plan2[id] = (id === imp2) ? allIds.find(x => x !== imp2) : imp2;
  voteAll(plan2);

  const scores2 = evalState("JSON.parse(JSON.stringify(S.players))");
  for (const p of scores2) {
    const before = scores1.find(x => x.id === p.id).score;
    if (p.id === imp2) assert.strictEqual(p.score, before, "caught imposter scores 0 this round");
    else assert.strictEqual(p.score, before + 1, "each correct voter gets +1");
  }

  window.confirm = () => true;
  click(doc.getElementById("playAgainBtn"));
  assert.strictEqual(evalState("S.phase"), "reveal");
  assert.strictEqual(evalState("S.round"), 1, "play again restarts at round 1");
  assert.ok(evalState("S.players.every(p => p.score === 0)"), "play again resets scores");

  console.log("Smoke test passed: themes, color pickers, full 2-round game, play again");
}

main().catch(e => { console.error(e); process.exit(1); });
