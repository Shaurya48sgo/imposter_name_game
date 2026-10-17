function pickWord(cat) {
  const cats = Object.keys(WORDS);
  const pool = (!cat || cat === "All")
    ? cats.flatMap(c => WORDS[c].map(e => ({ ...e, cat: c })))
    : WORDS[cat].map(e => ({ ...e, cat }));
  return pool[Math.floor(Math.random() * pool.length)];
}

function computeScoring(votes, imposterId) {
  const voters = Object.keys(votes);
  const total = voters.length;
  const correct = voters.filter(v => votes[v] === imposterId);
  const deltas = {};
  voters.forEach(v => { deltas[v] = 0; });
  if (correct.length === 1) deltas[correct[0]] = 2;
  else correct.forEach(v => { deltas[v] = 1; });
  const majorityCorrect = correct.length > total / 2;
  deltas[imposterId] = (deltas[imposterId] || 0) + (majorityCorrect ? 0 : 2);
  return { deltas, majorityCorrect, correctCount: correct.length, total };
}

function luminance(hex) {
  const h = hex.replace("#", "");
  const r = parseInt(h.slice(0, 2), 16) / 255;
  const g = parseInt(h.slice(2, 4), 16) / 255;
  const b = parseInt(h.slice(4, 6), 16) / 255;
  const f = c => (c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4));
  return 0.2126 * f(r) + 0.7152 * f(g) + 0.0722 * f(b);
}

if (typeof module !== "undefined") module.exports = { pickWord, computeScoring, luminance };
