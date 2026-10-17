const assert = require("assert");
global.WORDS = require("../words.js");
const { pickWord, computeScoring, luminance } = require("../logic.js");

{
  const r = computeScoring({ a: "imp", b: "imp", c: "imp", d: "x" }, "imp");
  assert.strictEqual(r.majorityCorrect, true);
  assert.strictEqual(r.deltas.a, 1);
  assert.strictEqual(r.deltas.b, 1);
  assert.strictEqual(r.deltas.c, 1);
  assert.strictEqual(r.deltas.d, 0);
  assert.strictEqual(r.deltas.imp, 0);
}

{
  const r = computeScoring({ a: "imp", b: "imp", c: "x", d: "y" }, "imp");
  assert.strictEqual(r.majorityCorrect, false);
  assert.strictEqual(r.deltas.a, 1);
  assert.strictEqual(r.deltas.b, 1);
  assert.strictEqual(r.deltas.imp, 2);
}

{
  const r = computeScoring({ a: "imp", b: "x", c: "y", d: "z" }, "imp");
  assert.strictEqual(r.correctCount, 1);
  assert.strictEqual(r.deltas.a, 2);
  assert.strictEqual(r.deltas.imp, 2);
}

{
  const r = computeScoring({ a: "x", b: "y", c: "z" }, "imp");
  assert.strictEqual(r.correctCount, 0);
  assert.strictEqual(r.deltas.imp, 2);
  assert.strictEqual(r.deltas.a, 0);
}

{
  const r = computeScoring({ a: "imp", b: "imp", c: "imp" }, "imp");
  assert.strictEqual(r.majorityCorrect, true);
  assert.strictEqual(r.deltas.a, 1);
  assert.strictEqual(r.deltas.imp, 0);
}

{
  const r = computeScoring({ imp: "x", b: "imp", c: "x", d: "x" }, "imp");
  assert.strictEqual(r.correctCount, 1);
  assert.strictEqual(r.deltas.b, 2);
  assert.strictEqual(r.deltas.imp, 2);
}

{
  for (let i = 0; i < 50; i++) {
    const e = pickWord("Food");
    assert.ok(e.w && e.close && e.medium && e.vague);
    assert.strictEqual(e.cat, "Food");
  }
  const all = pickWord("All");
  assert.ok(Object.keys(WORDS).includes(all.cat));
}

{
  assert.ok(luminance("#ffffff") > 0.9);
  assert.ok(luminance("#000000") < 0.01);
  assert.ok(luminance("#22d3ee") > 0.4);
}

console.log("All logic tests passed");
