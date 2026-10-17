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
  assert.strictEqual(doc.querySelectorAll("#themeRow .tdot").length, 15, "15 themes offered");
  assert.strictEqual(doc.querySelectorAll("#fontRow .fchip").length, 15, "15 fonts offered");
  click(doc.querySelector('#themeRow [data-theme="sunset"]'));
  assert.strictEqual(doc.documentElement.dataset.theme, "sunset", "theme switching works");
  click(doc.querySelector('#themeRow [data-theme="blood"]'));
  click(doc.querySelector('#fontRow [data-font="horror"]'));
  assert.strictEqual(doc.documentElement.dataset.font, "horror", "font switching works");
  click(doc.querySelector('#fontRow [data-font="sans"]'));

  const custom = doc.getElementById("customColor");
  custom.value = "#123456";
  custom.dispatchEvent(new window.Event("input", { bubbles: true }));
  click(doc.getElementById("dualBtn"));

  const addPlayer = name => {
    doc.getElementById("pname").value = name;
    click(doc.getElementById("addBtn"));
  };

  addPlayer("A");
  assert.strictEqual(evalState("S.players[0].color"), "#123456", "custom color picker applies");
  assert.strictEqual(evalState("isDual(S.players[0])"), true, "dual tone enabled via button");
  const aDot = doc.querySelector('#playerList [data-cid="' + evalState("S.players[0].id") + '"]');
  aDot.value = "#22d3ee";
  aDot.dispatchEvent(new window.Event("change", { bubbles: true }));
  assert.strictEqual(evalState("S.players[0].color"), "#22d3ee", "per-player main color edit works");
  const aDot2 = doc.querySelector('#playerList [data-cid2="' + evalState("S.players[0].id") + '"]');
  aDot2.value = "#654321";
  aDot2.dispatchEvent(new window.Event("change", { bubbles: true }));
  assert.strictEqual(evalState("S.players[0].color2"), "#654321", "per-player second color edit works");
  assert.strictEqual(evalState("isDual(S.players[0])"), true);

  click(doc.getElementById("solidBtn"));
  addPlayer("B");
  assert.strictEqual(evalState("isDual(S.players[1])"), false, "solid mode gives one color");

  const custom2 = doc.getElementById("customColor2");
  custom2.value = "#ff00ff";
  custom2.dispatchEvent(new window.Event("input", { bubbles: true }));
  addPlayer("C");
  assert.strictEqual(evalState("S.players[2].color2"), "#ff00ff", "second color picker applies");
  assert.strictEqual(evalState("isDual(S.players[2])"), true);
  click(doc.getElementById("solidBtn"));
  addPlayer("D");
  assert.strictEqual(evalState("isDual(S.players[3])"), false);
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
    const ids = evalState("S.players.map(p => p.id)");
    for (let i = 0; i < ids.length; i++) {
      const id = ids[i];
      assert.strictEqual(evalState("S.votingId"), id, "voter order must follow player order");
      const selfTile = doc.querySelector('#voteGrid [data-t="' + id + '"]');
      assert.ok(selfTile && selfTile.disabled, "cannot vote for yourself");
      click(doc.querySelector('#voteGrid [data-t="' + plan[id] + '"]'));
      assert.strictEqual(evalState("S.pendingTarget"), plan[id]);
      assert.ok(doc.querySelector("#voteBox .votedChip"), "voted chip must show before confirm");
      click(doc.getElementById("vConfirm"));
      assert.strictEqual(doc.querySelectorAll("#voteBox .voteList .vrow").length, i + 1, "who-voted-who list grows as votes are cast");
    }
  };

  const realRandom = window.Math.random;
  window.Math.random = () => 0;
  click(doc.getElementById("startBtn"));
  window.Math.random = realRandom;
  assert.strictEqual(evalState("S.phase"), "reveal");
  const impId = evalState("S.current.imposterId");
  assert.strictEqual(impId, evalState("S.players[0].id"), "random number 0 picks the first numbered player");
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

  assert.strictEqual(evalState("S.phase"), "finalize", "all votes in opens the finalize step");
  assert.strictEqual(doc.querySelectorAll("#voteBox [data-ch]").length, 4, "everyone can change their vote");
  assert.ok(doc.getElementById("vFinal"), "finalize button exists");

  click(doc.querySelector('#voteBox [data-ch="' + others[1] + '"]'));
  assert.ok(doc.getElementById("voteGrid"), "change view shows the voting grid");
  click(doc.querySelector('#voteGrid [data-t="' + impId + '"]'));
  click(doc.getElementById("vConfirmChange"));
  assert.strictEqual(evalState("S.phase"), "finalize");
  assert.strictEqual(evalState("S.players.find(p => p.id === '" + others[1] + "').vote"), impId, "changed vote saved");

  click(doc.querySelector('#voteBox [data-ch="' + others[1] + '"]'));
  click(doc.querySelector('#voteGrid [data-t="' + others[2] + '"]'));
  click(doc.getElementById("vConfirmChange"));
  assert.strictEqual(evalState("S.players.find(p => p.id === '" + others[1] + "').vote"), others[2], "vote changed back");

  click(doc.getElementById("vFinal"));
  assert.strictEqual(evalState("S.phase"), "results");
  assert.ok(doc.getElementById("resultsBox").textContent.includes("Final Ranking"), "results show a ranking");
  assert.ok(doc.getElementById("resultsBox").textContent.includes("#1"), "ranking is numbered");
  const scores1 = evalState("JSON.parse(JSON.stringify(S.players))");
  for (const p of scores1) {
    if (p.id === singleCorrect) assert.strictEqual(p.score, 2, "sole correct guesser gets +2");
    else if (p.id === impId) assert.strictEqual(p.score, 2, "imposter gets +2 when not caught by majority");
    else assert.strictEqual(p.score, 0, "wrong voters get 0");
  }

  window.Math.random = () => 0.999999;
  click(doc.getElementById("nextBtn"));
  window.Math.random = realRandom;
  assert.strictEqual(evalState("S.phase"), "reveal");
  const imp2 = evalState("S.current.imposterId");
  assert.strictEqual(imp2, evalState("S.players[3].id"), "random number near 1 picks the last numbered player");
  revealAll();

  click(doc.getElementById("toVoteBtn"));
  const plan2 = {};
  for (const id of allIds) plan2[id] = (id === imp2) ? allIds.find(x => x !== imp2) : imp2;
  voteAll(plan2);
  assert.strictEqual(evalState("S.phase"), "finalize");
  click(doc.getElementById("vFinal"));
  assert.strictEqual(evalState("S.phase"), "results");

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

  click(doc.getElementById("resetBtn"));
  assert.strictEqual(evalState("S.phase"), "reveal", "reset button starts a fresh round");
  assert.strictEqual(evalState("S.round"), 1, "reset button restarts at round 1");
  assert.ok(evalState("S.players.every(p => p.score === 0)"), "reset keeps players but clears scores");
  assert.strictEqual(evalState("S.players.length"), 4, "reset keeps the players");

  console.log("Smoke test passed: 15 themes, 15 fonts, dual colors, random imposter, vote changes, finalize step, ranking, play again, reset");
}

main().catch(e => { console.error(e); process.exit(1); });
