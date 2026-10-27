# Rill & Root

Third collection slot 58. Original terrain-shaping water puzzle, kept off the public catalogue. Move soil between plots with a four-scoop bucket, then send a stream to two planted root beds. This is height-field earthwork, not pipe rotation or a colony-production reskin: terrain determines water descent; cutting and filling conserve soil; hollow filling competes with maintaining downhill routes and balanced branches.

## Core loop

Select a plot, cut or fill one step, and release water to test the result. Heights range from zero to eight. Rocks, the spring and root beds are fixed. Each cut puts a scoop in the bucket; each fill spends one. The bucket must be empty when finishing. No arbitrary time or resource-generation loop.

Water chooses the lowest orthogonal neighbour strictly below its current height. Tied lowest neighbours split it evenly. Flat ground blocks flow, hollows trap it, and planted beds absorb it. Every bed must receive its required share; extra at another bed cannot substitute. Failed pours keep the layout and consume no edit slots. Optional preview shows downstream arrows, wet plots and individual basin amounts without changing the save. Undo and retry allow free experimentation; records reward fewer earthworks.

Three authored gardens introduce a blocked high step, a side hollow stealing the stream, then an earlier fork with two banks that can supply a deep hollow. Test routes finish in 2/4/8 earthworks. These are feasible examples, not optimality, duration or human-enjoyment claims. This is a compact prototype, not a finished long-form progression game.

## Controls and visuals

Original CSS layered soil, numbered ground heights, wet overlays and flow arrows; no external assets. Buttons and controls have minimum 44px targets. Two-column desktop layout stacks below 700px. Native Tab/Enter/Space works through buttons; on the page or selected terrain, C cuts, F fills, P pours, Z undoes, and arrows select adjacent plots. Global shortcuts avoid other native controls. Pause, confirmation and same-origin parent visibility guards prevent edits. Actual layout, native activation and touch remain unverified because rendering is blocked.

## Saves

Only `study-desk-rill-root-v1` is written. A bounded journal of exact `{p,delta}` edits is replayed to derive heights and bucket contents; the save also records garden, whether water has been tested, and best edit counts. The 200-action technical storage bound is not a target: unlimited undo/retry remain available and pouring consumes no journal entries. Decoder validates shapes, ranges, soil/bucket constraints, progression and completed records. Corrupt storage stays untouched until confirmed recovery/reset. Quota failures allow temporary play. Records are local and not authenticated.

## Tests and limits

`node --test tests/rill-root-engine.cjs`

`NODE_PATH=/path/to/node_modules node --test tests/rill-root-dom.cjs` with jsdom 26.1.0.

13 tests pass: seven engine and six DOM. All authored routes, progression, per-action reload, repeated failed pours, soil conservation, lowest-neighbour/tie/plateau behavior, fractional-flow conservation across 900 deterministic legal-edit attempts, bucket/height/fixed-plot/action validation, read-only forecasts, record retention, journal bound/recovery, controls/pause/modal/parent guards, corrupt-save recovery, reset isolation and storage failure are covered. Both scripts pass syntax checks, and relative JS/CSS references resolve locally. No production runtime dependencies or full repository build is claimed from this partial checkout.

No rendered browser play, screenshots, native keyboard/touch validation, human enjoyment evidence or improvement-pass credit. Next: naturally play and inspect desktop/mobile screenshots, assess whether height/flow readability and free preview support satisfying choices, deepen progression from observed weaknesses, and verify navigation, loss/retry, saves and restart before integration. Failures are dry-bed attempts rather than life loss. Keep unlisted until the required playtest-led improvement and review are complete.
