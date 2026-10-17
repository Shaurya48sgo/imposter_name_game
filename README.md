# Who is the Imposter?

A pass-the-phone party word game. Everyone secretly receives the same word — except the imposter, who only gets a vague hint. Discuss, accuse, and vote to find them.

Play it here: **https://shaurya48sgo.github.io/imposter_name_game/** (GitHub Pages, phone-friendly)

## How to play

1. Add 3–12 players and let each pick a name and color.
2. Pick a word category and how close the imposter's hint should be, then start the round.
3. Pass the phone around. Each player taps their own colored box, presses and holds the circle to peek at their note, and hits **Got it**. Seen boxes turn into colored outlines.
4. Once everyone has seen their note, tap **Continue**.
5. Pass the phone again: each player votes for who they think is the imposter. They see their choice and confirm it before the phone moves on.
6. Results reveal the imposter, the word, everyone's votes, and the points. Then start the next round.

Playing in person? Discuss out loud between reveal and voting. Playing remotely? Hop in a call while using the same link.

## Scoring

| Situation | Points |
|---|---|
| Each player who correctly guesses the imposter | +1 |
| The *only* player who correctly guesses the imposter | +2 (instead of +1) |
| Imposter, if a strict majority guessed correctly | +0 |
| Imposter, if a strict majority did NOT guess correctly | +2 |

Edge cases, decided for fairness (easy to change in `logic.js`):

- The imposter votes too — their vote (always for someone else) is counted like any other.
- "Majority" means strictly more than half of all votes. A tie counts as the imposter not being caught, so the imposter scores +2.
- Scores accumulate across rounds until you start a new game.

## Hint closeness (configurable each round)

- **Close** — a very similar thing ("Lasagna" for *Pizza*)
- **Medium** — describes it ("Cheesy Italian flatbread")
- **Vague** — barely a clue ("Something you eat")

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
| `style.css` | Dark neon party theme |
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

Add entries to `words.js` — every word needs three hints:

```js
{ w: "Pizza", close: "Lasagna", medium: "Cheesy Italian flatbread", vague: "Something you eat" }
```
