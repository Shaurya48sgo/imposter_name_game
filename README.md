# Who is the Imposter?

A pass-the-phone party word game. Everyone secretly receives the same word — except the imposter, who only gets a vague hint. Discuss, accuse, and vote to find them.

Play it here: **https://shaurya48sgo.github.io/imposter_name_game/** (GitHub Pages, phone-friendly)

## How to play

1. Add 3–12 players and let each pick a name and color — presets, or any custom color. Tap a player's circle any time to recolor them.
2. Pick a word category and how close the imposter's hint should be, then start the round.
3. Pass the phone around. Each player taps their own colored box, presses and holds the circle to peek at their note, and hits **Got it**. Seen boxes turn into colored outlines.
4. Once everyone has seen their note, tap **Continue**.
5. Voting: all players are shown at once, like the word grid. The phone is passed to whoever's turn it is (shown at the top), they tap the player they suspect, review "X voted: Y" and confirm. You cannot vote for yourself.
6. Results reveal the imposter, the word, everyone's votes, and the points. **Next Round** keeps scores, **Play Again** restarts with the same players and reset scores.

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

Hints are deliberately cryptic — never a direct description:

- **Close** — a strong association ("Comes in a box" for *Pizza*)
- **Medium** — context only ("Friday night order")
- **Vague** — a single cryptic fragment ("Slices")

The imposter is picked with a shuffle bag: everyone gets a turn before anyone repeats, and never purely by seat order.

## Themes & fonts

Top of the page has quick switches, saved to your browser:

- **Themes:** Blood (default red/black), Neon, Toxic, Abyss, Ember
- **Fonts:** Sans, Rounded, Serif, Mono, Display

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
| `style.css` | Theme system (5 themes, 5 fonts) + all screens |
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

Add entries to `words.js` — every word needs three hints, kept cryptic on purpose:

```js
{ w: "Pizza", close: "Comes in a box", medium: "Friday night order", vague: "Slices" }
```
