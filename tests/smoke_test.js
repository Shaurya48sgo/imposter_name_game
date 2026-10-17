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

  const addPlayer = name => {
    doc.getElementById("pname").value = name;
    click(doc.getElementById("addBtn"));
  };

  addPlayer("A");
  addPlayer("B");
  addPlayer("C");
  addPlayer("D");
  assert.strictEqual(evalState("S.players.length"), 4);
  assert.strictEqual(doc.getElementById("startBtn").disabled, false);

  click(doc.getElementById("startBtn"));
  assert.strictEqual(evalState("S.phase"), "reveal");
  const impId = evalState("S.current.imposterId");
  assert.ok(impId);
  assert.strictEqual(evalState("S.players.some(p => p.id === S.current.imposterId)"), true);

  const revealAll = ids => {
    for (const id of ids) {
      const tile = doc.querySelector('#revealGrid [data-p="' + id + '"]');
      click(tile);
      click(doc.getElementById("ovStart"));
      const zone = doc.getElementById("holdZone");
      zone.dispatchEvent(new window.Event("pointerdown", { bubbles: true }));
      zone.dispatchEvent(new window.Event("pointerup", { bubbles: true }));
      const got = doc.getElementById("gotBtn");
      assert.strictEqual(got.disabled, false, "Got it must unlock after holding");
      click(got);
    }
  };

  const allIds = evalState("S.players.map(p => p.id)");
  revealAll(allIds);
  assert.strictEqual(evalState("S.players.every(p => p.seen)"), true);

  const toVote = doc.getElementById("toVoteBtn");
  assert.strictEqual(toVote.disabled, false);
  click(toVote);
  assert.strictEqual(evalState("S.phase"), "vote");

  const voteAll = plan => {
    for (const id of allIds) {
      click(doc.getElementById("vStart"));
      assert.strictEqual(evalState("S.votingId"), id, "voter order must follow player order");
      const target = plan[id];
      click(doc.querySelector('#voteBox [data-t="' + target + '"]'));
      assert.strictEqual(evalState("S.pendingTarget"), target, "selected target must show before confirm");
      assert.ok(doc.querySelector("#voteBox .votedChip"), "voted chip must be visible before confirm");
      click(doc.getElementById("vConfirm"));
    }
  };

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
  assert.notStrictEqual(imp2, impId, "imposter should rotate when possible");
  revealAll(allIds);

  click(doc.getElementById("toVoteBtn"));
  const plan2 = {};
  for (const id of allIds) plan2[id] = (id === imp2) ? allIds.find(x => x !== imp2 && x !== id) : imp2;
  voteAll(plan2);

  const scores2 = evalState("JSON.parse(JSON.stringify(S.players))");
  for (const p of scores2) {
    const before = scores1.find(x => x.id === p.id).score;
    if (p.id === imp2) assert.strictEqual(p.score, before, "caught imposter scores 0 this round");
    else assert.strictEqual(p.score, before + 1, "each correct voter gets +1");
  }

  console.log("Smoke test passed: full 2-round game flow through the real UI");
}

main().catch(e => { console.error(e); process.exit(1); });
