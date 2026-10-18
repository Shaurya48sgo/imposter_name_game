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

  assert.strictEqual(doc.getElementById("themePanel").classList.contains("hidden"), true, "theme panel starts closed");
  click(doc.getElementById("themeBtn"));
  assert.strictEqual(doc.getElementById("themePanel").classList.contains("hidden"), false, "theme button opens the panel");
  assert.strictEqual(doc.querySelectorAll("#themeRow [data-theme]").length, 17, "17 themes offered");
  assert.strictEqual(doc.querySelectorAll("#fontRow .fchip").length, 15, "15 fonts offered");
  assert.strictEqual(doc.documentElement.dataset.theme, "blood", "blood theme is default");
  click(doc.querySelector('#themeRow [data-theme="night"]'));
  assert.strictEqual(doc.documentElement.dataset.theme, "night", "night sky theme works");
  click(doc.querySelector('#themeRow [data-theme="forest"]'));
  assert.strictEqual(doc.documentElement.dataset.theme, "forest", "forest theme works");
  click(doc.querySelector('#themeRow [data-theme="noir"]'));
  assert.strictEqual(doc.documentElement.dataset.theme, "noir", "noir theme works");
  click(doc.querySelector('#themeRow [data-theme="blood"]'));
  assert.ok(doc.getElementById("uiLabel").textContent.includes("Blood"), "active theme is labelled");
  click(doc.querySelector('#fontRow [data-font="honey"]'));
  assert.strictEqual(doc.documentElement.dataset.font, "honey", "dafont font applies");
  assert.ok(doc.getElementById("uiBadge").textContent.includes("Honey"), "top badge shows the font");
  click(doc.querySelector('#fontRow [data-font="auto"]'));
  click(doc.getElementById("panelClose"));
  assert.strictEqual(doc.getElementById("themePanel").classList.contains("hidden"), true, "panel closes");
  assert.ok(doc.getElementById("uiBadge").textContent.includes("Blood"), "top badge shows the theme");

  const custom = doc.getElementById("customColor");
  custom.value = "#123456";
  custom.dispatchEvent(new window.Event("input", { bubbles: true }));

  const addPlayer = name => {
    doc.getElementById("pname").value = name;
    click(doc.getElementById("addBtn"));
  };

  addPlayer("A");
  assert.strictEqual(evalState("S.players[0].color"), "#123456", "custom color picker applies");
  const aDot = doc.querySelector('#playerList [data-cid="' + evalState("S.players[0].id") + '"]');
  aDot.value = "#22d3ee";
  aDot.dispatchEvent(new window.Event("change", { bubbles: true }));
  assert.strictEqual(evalState("S.players[0].color"), "#22d3ee", "per-player color edit works");
  addPlayer("B");
  addPlayer("C");
  addPlayer("D");
  assert.strictEqual(evalState("S.players.length"), 4);
  assert.strictEqual(doc.querySelectorAll("#playerList .pdot").length, 4, "one color dot per player");
  assert.strictEqual(doc.querySelectorAll("#playerList [data-cid2]").length, 0, "no second color inputs");

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

  click(doc.querySelector('#closenessRow [data-cl="vague"]'));
  assert.strictEqual(evalState("S.settings.closeness"), "vague", "vague closeness selected");

  const realRandom = window.Math.random;
  const realCrypto = window.crypto ? window.crypto.getRandomValues : null;
  const stubRandom = value => {
    window.Math.random = () => value;
    if (window.crypto) window.crypto.getRandomValues = arr => { arr[0] = Math.floor(value * 4294967296); return arr; };
  };
  const restoreRandom = () => {
    window.Math.random = realRandom;
    if (window.crypto && realCrypto) window.crypto.getRandomValues = realCrypto;
  };

  stubRandom(0);
  click(doc.getElementById("startBtn"));
  restoreRandom();
  assert.strictEqual(evalState("S.phase"), "reveal");
  const impId = evalState("S.current.imposterId");
  assert.strictEqual(impId, evalState("S.players[0].id"), "lowest random value picks the first listed player");

  const hint = evalState("S.current.hint");
  assert.ok(/^[a-z]+$/.test(hint), "vague hint is a single trait word, got: " + hint);
  assert.ok(!["food", "drink", "animal", "place", "object", "sport", "game"].includes(hint), "vague hint never reveals the category");

  const playerIds = evalState("S.players.map(p => p.id)");
  const draws = evalState("Array.from({ length: 60 }, () => drawImposter())");
  assert.ok(draws.every(id => playerIds.includes(id)), "imposter draws only real players");
  assert.ok(draws.every(id => id !== impId), "a fresh draw never repeats the current imposter");

  let allIds = revealAll();
  assert.strictEqual(evalState("S.players.every(p => p.seen)"), true);

  const toVote = doc.getElementById("toVoteBtn");
  assert.strictEqual(toVote.disabled, false);
  click(toVote);
  assert.strictEqual(evalState("S.phase"), "vote");
  assert.strictEqual(doc.getElementById("vContinue").disabled, true, "continue disabled until a vote is cast");

  const others = allIds.filter(id => id !== impId);
  const singleCorrect = others[0];

  const meTile = id => doc.querySelector('#voteGrid [data-me="' + id + '"]');
  const openVoter = id => {
    click(meTile(id));
    assert.strictEqual(evalState("S.voteSelectId"), id, "own card opens the target picker");
    const selfTile = doc.querySelector('#voteGrid [data-t="' + id + '"]');
    assert.ok(selfTile && selfTile.disabled, "cannot vote for yourself");
  };
  const pick = tid => click(doc.querySelector('#voteGrid [data-t="' + tid + '"]'));

  assert.ok(meTile(impId).querySelector(".ptSub").textContent.includes("TAP YOUR CARD"), "unvoted card shows prompt");

  openVoter(impId);
  click(doc.getElementById("vAbstain"));
  assert.strictEqual(evalState("S.players.find(p => p.id === '" + impId + "').vote"), "abstain", "abstain recorded");
  assert.ok(meTile(impId).querySelector(".ptSub").textContent.includes("ABSTAINED"));
  openVoter(impId);
  pick(singleCorrect);
  assert.strictEqual(evalState("S.players.find(p => p.id === '" + impId + "').vote"), singleCorrect, "re-vote after abstaining works");
  assert.ok(meTile(impId).querySelector(".ptSub").textContent.includes("VOTED:"));

  openVoter(others[0]);
  pick(impId);

  openVoter(others[1]);
  pick(others[2]);
  openVoter(others[1]);
  pick(impId);
  assert.strictEqual(evalState("S.players.find(p => p.id === '" + others[1] + "').vote"), impId, "vote can be changed any time");
  openVoter(others[1]);
  pick(others[2]);

  openVoter(others[2]);
  click(doc.getElementById("vBack"));
  assert.strictEqual(evalState("S.players.find(p => p.id === '" + others[2] + "').vote"), null, "back leaves the vote empty");
  openVoter(others[2]);
  pick(others[1]);
  assert.ok(meTile(others[2]).querySelector(".ptSub").textContent.includes("C"), "card shows who was voted");

  assert.strictEqual(doc.getElementById("vContinue").disabled, false, "continue enabled once votes are in");
  click(doc.getElementById("vContinue"));
  assert.strictEqual(evalState("S.phase"), "results");
  assert.ok(doc.getElementById("resultsBox").textContent.includes("Final Ranking"), "results show a ranking");
  assert.ok(doc.getElementById("resultsBox").textContent.includes("#1"), "ranking is numbered");

  const scores1 = evalState("JSON.parse(JSON.stringify(S.players))");
  for (const p of scores1) {
    if (p.id === singleCorrect) assert.strictEqual(p.score, 2, "sole correct guesser gets +2");
    else if (p.id === impId) assert.strictEqual(p.score, 2, "imposter gets +2 when not caught by majority");
    else assert.strictEqual(p.score, 0, "wrong voters get 0");
  }

  stubRandom(0.999999);
  click(doc.getElementById("nextBtn"));
  restoreRandom();
  assert.strictEqual(evalState("S.phase"), "reveal");
  const imp2 = evalState("S.current.imposterId");
  assert.notStrictEqual(imp2, impId, "the same imposter never repeats back-to-back");
  assert.strictEqual(imp2, evalState("S.players[3].id"), "highest random value picks the last remaining player");
  revealAll();

  click(doc.getElementById("toVoteBtn"));
  for (const id of allIds) {
    const tid = id === imp2 ? allIds.find(x => x !== imp2) : imp2;
    openVoter(id);
    pick(tid);
  }
  click(doc.getElementById("vContinue"));
  assert.strictEqual(evalState("S.phase"), "results");

  const scores2 = evalState("JSON.parse(JSON.stringify(S.players))");
  for (const p of scores2) {
    const before = scores1.find(x => x.id === p.id).score;
    if (p.id === imp2) assert.strictEqual(p.score, before, "caught imposter scores 0 this round");
    else assert.strictEqual(p.score, before + 1, "each correct voter gets +1");
  }

  click(doc.getElementById("playAgainBtn"));
  assert.strictEqual(doc.getElementById("confirmModal").classList.contains("hidden"), false, "confirm modal opens");
  click(doc.getElementById("confirmYes"));
  assert.strictEqual(evalState("S.phase"), "reveal");
  assert.strictEqual(evalState("S.round"), 1, "play again restarts at round 1");
  assert.ok(evalState("S.players.every(p => p.score === 0)"), "play again resets scores");

  const roundBefore = evalState("S.round");
  click(doc.getElementById("resetBtn"));
  click(doc.getElementById("confirmNo"));
  assert.strictEqual(evalState("S.round"), roundBefore, "cancelling reset changes nothing");

  click(doc.getElementById("resetBtn"));
  click(doc.getElementById("confirmYes"));
  assert.strictEqual(evalState("S.phase"), "reveal", "reset button starts a fresh round");
  assert.strictEqual(evalState("S.round"), 1, "reset button restarts at round 1");
  assert.ok(evalState("S.players.every(p => p.score === 0)"), "reset keeps players but clears scores");

  console.log("Smoke test passed: theme panel (17 themes, 15 fonts), solid colors, single-trait vague hints, no-repeat crypto-random imposter, self-serve voting with abstain + changes, rare-catch scoring, ranking, reset");
}

main().catch(e => { console.error(e); process.exit(1); });
