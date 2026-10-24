# Moon Dial: optional mechanical guidance
25 October 2026. [Implementation 86cded4d921af68656fc13ab3304d7de161be834](https://github.com/ThatOneMop/study-desk/commit/86cded4d921af68656fc13ab3304d7de161be834).

## Change
Source inspection identified a recovery gap: a player who lost track of the connected dials could only experiment or restart. The new **Show a next step** control searches the current angles and clutch position and explains one legal action. It shows a shortest route by total actions, counting clutch changes; this is deliberately different from the fewest-turn record. Players still perform the move themselves or ignore the advice. The hint clears after a move, undo, restart or reset.

The search explores at most 38,880 mechanical states for the largest existing mechanism. It does not enumerate journals or grow with play duration. It leaves selection, progress, records and saves unchanged. A journal too full to accommodate the route receives an undo/restart explanation. Won and paused states disable guidance. Existing save format/key, mechanics, unlocks and catalogue are preserved.

## Evidence
`NODE_PATH=/tmp/moon-deps/node_modules node --test tests/moon-dial-engine.cjs tests/moon-dial-dom.cjs`: **13 passing checks (7 engine, 6 DOM)**.

Coverage includes original three mechanism wins and reloads; clutch isolation, undo/retry and malformed saves; existing focus/selection/rotation regressions; initial shortest action counts of 3/6/11; solutions from 24 legal detours; no state mutation; hint clearing; pause/won handling; corrupt-save preservation and full-journal recovery. Syntax checks passed. DOM tests use jsdom, not a rendered browser. The full repository build/preservation suite was not run from the partial checkout.

## Quality gate and scope
This is a source-led gameplay addition, **not a verified rendered-play-led improvement**. It adds recovery support, not campaign content. Rendered desktop/touch assessment, screenshot inspection and substantial playtest-led improvement remain required. The recorded browser-policy denial was not retried or bypassed.

Third-batch counts remain **3/50 built; 0 improved/browser-tested/integrated/live**. Second batch remains **20 initially complete; 6/20 additional upgrades verified**. No first-batch source, public catalogue, deployment configuration or concurrent main changes are included. No live release is claimed.
