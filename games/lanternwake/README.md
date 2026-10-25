# Lanternwake

An original, compact turn-based light-routing game. Bring firefly jars across five marshes using temporary floating lanterns. The same light that permits movement attracts moth swarms; successful crossings depend on placing lures, timing expiry, avoiding close contact and recovering oil. This is distinct from Tidepost's cargo/fuel routes and Echo Vault's exposure/stealth rules.

Open `index.html` from a static server rooted at the repository. There is no build step, outside asset dependency or runtime package dependency. All pixel illustrations are authored SVG rectangles and paths; styles and engine are local. Study Desk's bridge and return link are retained. The candidate is intentionally absent from the public catalogue until selected.

## Controls and progression

- WASD/arrows row one water space. Shift + direction throws a lantern two clear water spaces away.
- R reclaims the oldest adjacent lantern; H toggles its hood; Space holds position; Z undoes for free. H selects the least remaining life, then lowest map position. Hooded lanterns light one water step and do not attract moths. Toggling spends a turn and life; it does not restore oil.
- Optional planning mode stages an action, shows the precise next boat/moth positions, then commits with its button or Enter. Previewing never advances the game or saves progress.
- All actions also have touch buttons, permanent risk labels, and descriptive focus/hover previews.
- Complete crossings to unlock the next one. Earn medals for delivery, a clean crossing and meeting the turn/throw targets. Replay unlocked crossings to improve records.
- Lanterns illuminate three water steps, home/start docks two, and reed refuges one. Light travels around rocks. Each refuge supplies one oil once per attempt.
- Moths choose the closest unhooded lantern by water-path length (oldest first on ties), move one step (north/east/south/west tie order), then eat any lantern they reach. Contact with any number of adjacent moths loses one hull per turn.
- No real-time clock. The 180-action limit bounds stored route history; it is not advertised playtime or content.

## Saving

`study-desk-lanternwake-v1` stores action history and independent completed-route proofs. Loading replays and verifies actions and recomputes records rather than trusting stored score claims. Restart/undo retain earned medals. Corrupt data is protected until explicit replacement; other games' keys are untouched. Unavailable storage shows a warning while play continues. Data stays in the current browser.

## Verification

`node --test tests/lanternwake-engine.cjs` covers all five complete no-damage reference routes, lighting/path constraints, oil recovery, expiry, moth decisions, damage/loss/undo, progression, records and forecast equivalence.

`NODE_PATH=/path/to/dependencies node --test tests/lanternwake-dom.cjs` requires jsdom 26.1.0 and covers UI campaigns, save/reload/recovery, input guards, dialogs and optional planning.

`NODE_PATH=/path/to/dependencies node tests/lanternwake-browser.cjs` requires Playwright 1.58.2 and Chromium. The repository CI runs desktop and touch-emulated campaigns with forecast assertions, real UI input, midgame reloads, failure/undo, restart, navigation and screenshots. Browser verification in the Work environment uses the managed preview and cloud-browser tooling instead.

The reference route generator `tests/lanternwake-solve.cjs` is a bounded deterministic beam search for clean crossings, not a shortest-path proof. Never replace fixtures to hide an outcome regression.

## Boundaries

Five small authored maps; no procedural campaign, audio, physical touch-device verification or long-playtime claim. Quality ratings in the batch ledger are agent design review, not human playtesting results. The second-batch report records the exact source commit and test evidence.
