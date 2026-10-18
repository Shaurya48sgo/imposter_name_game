const assert = require("assert");
global.WORDS = require("../words.js");
const { pickWord, computeScoring, luminance, opposite } = require("../logic.js");

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
  const r = computeScoring({ a: "imp", b: "x", c: "x", d: "x", e: "x", f: "x", g: "x", h: "x" }, "imp");
  assert.strictEqual(r.rareCatch, true, "1 of 8 is under a quarter");
  assert.strictEqual(r.deltas.a, 2, "rare correct guess scores 2");
  assert.strictEqual(r.deltas.imp, 2);
}

{
  const r = computeScoring({ a: "imp", b: "imp", c: "x", d: "x", e: "x", f: "x", g: "x", h: "x" }, "imp");
  assert.strictEqual(r.rareCatch, false, "2 of 8 is exactly a quarter, not under");
  assert.strictEqual(r.deltas.a, 1);
  assert.strictEqual(r.deltas.b, 1);
}

{
  const r = computeScoring({ a: "imp", b: "imp", c: "x", d: "x", e: "x", f: "x", g: "x", h: "x", i: "x", j: "x", k: "x", l: "x" }, "imp");
  assert.strictEqual(r.rareCatch, true, "2 of 12 is under a quarter");
  assert.strictEqual(r.deltas.a, 2);
  assert.strictEqual(r.deltas.b, 2);
  assert.strictEqual(r.deltas.imp, 2);
}

{
  const r = computeScoring({ a: "x", b: "x", c: "x", d: "x", e: "x", f: "x", g: "x", h: "x" }, "imp");
  assert.strictEqual(r.correctCount, 0);
  assert.strictEqual(r.deltas.imp, 2, "nobody caught the imposter");
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
  const catWords = ["food", "drink", "animal", "place", "object", "sport", "game"];
  Object.values(WORDS).flat().forEach(e => {
    assert.ok(/^[a-z]+$/.test(e.vague), e.w + " vague hint must be a single trait word: " + e.vague);
    assert.ok(!catWords.includes(e.vague), e.w + " vague hint must not be the category");
    assert.notStrictEqual(e.vague, e.w.toLowerCase(), e.w + " vague hint must not be the word itself");
  });
}

{
  assert.ok(luminance("#ffffff") > 0.9);
  assert.ok(luminance("#000000") < 0.01);
  assert.ok(luminance("#22d3ee") > 0.4);
}

{
  assert.strictEqual(opposite("#ff0000"), "#00ffff");
  assert.strictEqual(opposite("#000000").length, 7);
  assert.strictEqual(opposite("#ffffff").length, 7);
  const o = opposite("#22d3ee");
  assert.match(o, /^#[0-9a-f]{6}$/);
  assert.notStrictEqual(o, "#22d3ee");
}

console.log("All logic tests passed");
