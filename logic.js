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
  const rareCatch = correct.length === 1 || correct.length < total / 4;
  correct.forEach(v => { deltas[v] = rareCatch ? 2 : 1; });
  const majorityCorrect = correct.length > total / 2;
  deltas[imposterId] = (deltas[imposterId] || 0) + (majorityCorrect ? 0 : 2);
  return { deltas, majorityCorrect, correctCount: correct.length, total, rareCatch };
}

function luminance(hex) {
  const h = hex.replace("#", "");
  const r = parseInt(h.slice(0, 2), 16) / 255;
  const g = parseInt(h.slice(2, 4), 16) / 255;
  const b = parseInt(h.slice(4, 6), 16) / 255;
  const f = c => (c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4));
  return 0.2126 * f(r) + 0.7152 * f(g) + 0.0722 * f(b);
}

function opposite(hex) {
  const h = hex.replace("#", "");
  let r = parseInt(h.slice(0, 2), 16) / 255;
  let g = parseInt(h.slice(2, 4), 16) / 255;
  let b = parseInt(h.slice(4, 6), 16) / 255;
  const max = Math.max(r, g, b), min = Math.min(r, g, b);
  const l = (max + min) / 2;
  let hue = 0, s = 0;
  if (max !== min) {
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
    if (max === r) hue = (g - b) / d + (g < b ? 6 : 0);
    else if (max === g) hue = (b - r) / d + 2;
    else hue = (r - g) / d + 4;
    hue /= 6;
  }
  hue = (hue + 0.5) % 1;
  const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
  const p = 2 * l - q;
  const ch = t => {
    t = (t + 1) % 1;
    if (t < 1 / 6) return p + (q - p) * 6 * t;
    if (t < 1 / 2) return q;
    if (t < 2 / 3) return p + (q - p) * (2 / 3 - t) * 6;
    return p;
  };
  const toHex = v => Math.round(v * 255).toString(16).padStart(2, "0");
  return "#" + toHex(ch(hue + 1 / 3)) + toHex(ch(hue)) + toHex(ch(hue - 1 / 3));
}

if (typeof module !== "undefined") module.exports = { pickWord, computeScoring, luminance, opposite };
