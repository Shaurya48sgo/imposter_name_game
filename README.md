# Who is the Imposter?

A pass-the-phone party word game. Everyone secretly receives the same word — except the imposter, who only gets a vague hint. Discuss, accuse, and vote to find them.

Play it here: **https://shaurya48sgo.github.io/imposter_name_game/** (GitHub Pages, phone-friendly)

## How to play

1. Add 3–12 players and let each pick a name and color — presets or any custom color. Tap a player's circle any time to recolor them.
2. Pick a word category and how close the imposter's hint should be, then start the round.
3. Pass the phone around. Each player taps their own colored box, presses and holds the circle to peek at their note, and hits **Got it**. Seen boxes turn into colored outlines.
4. Once everyone has seen their note, tap **Continue**.
5. Voting is open and self-serve: all players are shown at once. Whoever wants to vote taps **their own card** (pass the phone), picks the player they suspect, and the card then shows "voted: X" under that player's name. Anyone can vote, change their vote, or **abstain** at any time — no fixed turn order.
6. Tap **Continue — check who got it right** when voting is done (enabled once at least one vote is cast). Abstaining is allowed and counted as no vote.
7. Results reveal the imposter, the word, everyone's votes, the points, and the **Final Ranking** (ties share a rank). **Next Round** keeps scores, **Play Again** restarts with the same players and reset scores, and the **Reset** button top-right calls the whole thing off and starts fresh (same players, scores back to 0).

Playing in person? Discuss out loud between reveal and voting. Playing remotely? Hop in a call while using the same link.

## Scoring

| Situation | Points |
|---|---|
| Each player who correctly guesses the imposter | +1 |
| Correct guessers, when fewer than 1/4 of voters caught the imposter (rare catch) | +2 each |
| The *only* player who correctly guesses the imposter | +2 (instead of +1) |
| Imposter, if a strict majority guessed correctly | +0 |
| Imposter, if a strict majority did NOT guess correctly | +2 |

Edge cases, decided for fairness (easy to change in `logic.js`):

- The imposter votes too — their vote (always for someone else) is counted like any other.
- "Majority" means strictly more than half of all votes. A tie counts as the imposter not being caught, so the imposter scores +2.
- "Rare catch" means correct guessers < 1/4 of all voters (or exactly one correct guesser). Example: 2 of 12 catching the imposter earns both +2.
- Abstaining (or not voting before **Continue**) removes you from the vote math entirely — majority and rare-catch are calculated over actual votes only.
- Scores accumulate across rounds until you start a new game.

## Hint closeness (configurable each round)

Hints are **category tags, never a clue to the exact word** — they tell the imposter what kind of thing it is, not which one:

- **Close** — category + extra tags ("food, baked, round" for *Pizza*; "wildlife, animal, tall, spots" for *Giraffe*)
- **Medium** — category + one tag ("food, baked")
- **Vague** — just the category ("food", "animal", "place", "object", "sport")

The imposter is decided secretly **before** the reveal starts: every player is numbered and one random number is drawn — a plain uniform random pick, so anyone can be the imposter (including twice in a row). If you prefer forced rotation, that is easy to change in `drawImposter()` in `game.js`.

## Themes & fonts

Tap **THEME** (centered at the top, next to RESET) to open the style panel on the right — every theme and font is listed by name, and your pick is applied instantly and saved to your browser.

- **Themes (17):** Blood (default red/black), Forest (light green on black), Night Sky (starry navy), **Noir** (flat monochrome), **Casefile** (flat sepia), **Paper** (light cream), **Holo** (pastel iridescent), Neon, Toxic, Abyss, Royal, Rose, Gold, Frost, Ghost, Vapor, Sunset
- **Fonts (16):** Default (system), Display, plus bundled offline fonts: Comic, Typewriter, Horror, Marker, Manuscript, Sci-Fi, Pixel, Haunted Hill, Lemon Tea, Honey, Vampire Wars, Black Mustang, Stay With Me, Paper Notes

Lemon Tea, Honey, Vampire Wars, Black Mustang, Stay With Me, Paper Notes and Haunted Hill come from downloads on [DaFont](https://www.dafont.com) — they are mostly free for personal use; check each font's license page before any commercial use. All fonts are bundled locally, so the game stays fully offline.

## Run it locally

No build step, no backend, no dependencies. Any static file server works:

```bash
python3 -m http.server 8000
# open http://localhost:8000
```

or just double-click `index.html`.

The whole game state (players, scores, current round) is saved in the browser's localStorage, so an accidental refresh or tab close doesn't lose the game.

## Development

```bash
node tests/logic_test.js    # pure scoring/word-picking rules
node tests/smoke_test.js    # full 2-round game through a simulated browser (needs jsdom)
```

To run the smoke test, install jsdom first: `npm i -D jsdom`.

## Project structure

| File | Purpose |
|---|---|
| `index.html` | Screens for setup, reveal, voting, results |
| `style.css` | Theme system (17 themes, 16 fonts) + all screens |
| `words.js` | Word bank: 60 words x 5 categories, 3 hint levels each |
| `logic.js` | Pure rule functions (word picking, scoring) |
| `game.js` | UI, state machine, localStorage persistence |
| `tests/` | Node tests for the rules and the full flow |

## Roadmap

- [ ] Android APK (wrap the web app, e.g. with Capacitor — it is already fully offline-capable)
- [ ] Optional Discord integration for sharing results/screenshots
- [ ] More word categories and custom word packs
- [ ] Sound/haptic polish on reveal

## Adding words

Add entries to `words.js` — every word needs three tag-style hints (category plus loose traits, never a clue to the exact word):

```js
{ w: "Giraffe", close: "wildlife, animal, tall, spots", medium: "animal, wildlife", vague: "animal" }
```
