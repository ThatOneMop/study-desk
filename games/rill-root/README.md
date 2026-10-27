# Rill & Root

Third collection slot 58. Original terrain-shaping water puzzle, kept off the public catalogue. Move soil between plots with a four-scoop bucket, then send a stream to two planted root beds. This is height-field earthwork, not pipe rotation or a colony-production reskin: terrain determines water descent; cutting and filling conserve soil; hollow filling competes with maintaining downhill routes and balanced branches.

## Core loop

Select a plot, cut or fill one step, and release water to test the result. Heights range from zero to eight. Rocks, the spring and root beds are fixed. Each cut puts a scoop in the bucket; each fill spends one. The bucket must be empty when finishing. No arbitrary time or resource-generation loop.

Water chooses the lowest orthogonal neighbour strictly below its current height. Tied lowest neighbours split it evenly. Flat ground blocks flow, hollows trap it, and planted beds absorb it. Every bed must receive its required share; extra at another bed cannot substitute. Failed pours keep the layout and consume no edit slots. Optional preview shows downstream arrows, wet plots and individual basin amounts without changing the save. Undo and retry allow free experimentation; records reward fewer earthworks.

Three authored gardens introduce a blocked high step, a side hollow stealing the stream, then an earlier fork with two banks that can supply a deep hollow. Test routes finish in 2/4/8 earthworks. These are feasible examples, not optimality, duration or human-enjoyment claims. This is a compact prototype, not a finished long-form progression game.

## Controls and visuals

Original CSS layered soil, numbered ground heights, wet overlays and flow arrows; no external assets. Buttons and controls have minimum 44px targets. Two-column desktop layout stacks below 700px. Native Tab/Enter/Space works through buttons; on the page or selected terrain, C cuts, F fills, W pours, Z undoes, and arrows select adjacent plots. Global shortcuts avoid other native controls. Pause, confirmation and same-origin parent visibility guards prevent edits. Actual layout, native activation and touch remain unverified because rendering is blocked.

## Saves

Only `study-desk-rill-root-v1` is written. A bounded journal of exact `{p,delta}` edits is replayed to derive heights and bucket contents; the save also records garden, whether water has been tested, and best edit counts. The 200-action technical storage bound is not a target: unlimited undo/retry remain available and pouring consumes no journal entries. Decoder validates shapes, ranges, soil/bucket constraints, progression and completed records. Corrupt storage stays untouched until confirmed recovery/reset. Quota failures allow temporary play. Records are local and not authenticated.

## Tests and limits

`node --test tests/rill-root-engine.cjs`

`NODE_PATH=/path/to/node_modules node --test tests/rill-root-dom.cjs` with jsdom 26.1.0.

13 tests pass: seven engine and six DOM. All authored routes, progression, per-action reload, repeated failed pours, soil conservation, lowest-neighbour/tie/plateau behavior, fractional-flow conservation across 900 deterministic legal-edit attempts, bucket/height/fixed-plot/action validation, read-only forecasts, record retention, journal bound/recovery, controls/pause/modal/parent guards, corrupt-save recovery, reset isolation and storage failure are covered. Both scripts pass syntax checks, and relative JS/CSS references resolve locally. No production runtime dependencies or full repository build is claimed from this partial checkout.

No rendered browser play, screenshots, native keyboard/touch validation, human enjoyment evidence or improvement-pass credit. Next: naturally play and inspect desktop/mobile screenshots, assess whether height/flow readability and free preview support satisfying choices, deepen progression from observed weaknesses, and verify navigation, loss/retry, saves and restart before integration. Failures are dry-bed attempts rather than life loss. Keep unlisted until the required playtest-led improvement and review are complete.


## Portable low weir — source refinement

The initial game only allowed cutting and filling, so closing a hollow meant bringing its lip fully level with the channel. One reusable low weir now offers another option: block the edge between two neighbouring ground plots that differ by at most one height step. Water searches for the next lowest unblocked route, retaining the original splitting rules. The spring, root beds and rocks cannot anchor a weir. Only one exists; moving it removes the old barrier, and it may also be removed. Placement, movement and removal each count as one action but use no soil. Duplicate placements and invalid edges are rejected freely.

The weir remains tied to its chosen edge through later earthworks. If the height gap grows above one, it is overtopped and stops blocking; returning the gap to one or less restores it. This keeps soil shaping relevant to deep hollows. Undo restores both terrain and barrier state. UI edge marks show its two anchors, with dashed amber styling and explanatory text when overtopped. A direction selector chooses the neighbouring edge from the selected plot; a read-only forecast gives the resulting root-bed amounts before commit. Pause and native-selector key ownership are preserved.

Test routes use place/remove on the first garden and active diversion on the next two, completing in 4/3/7 actions. The original soil-only examples remain 2/4/8. These are feasible demonstrations, not proven global minima or content-hour claims. The trade-off is one movable barrier versus further permanent earthworks; no extra garden or game is counted.

Exact new journal entries are `{gate:[p,q]}` or `{gate:null}`. Replayed anchors are canonicalized; the new derived `gate` field is absent from legacy boards until a gate action occurs. Old save state shapes, terrain, records and v1 key remain unchanged. The existing 200-action bound covers both soil and weir edits; undo/retry remain available. Displayed efficiency records now say actions to include weir work.

21 checks pass (12 engine, 9 jsdom 26.1.0), retaining all original 13. Additional coverage: rerouting ties, single-weir relocation/removal, soil immutability, overtopping and restoration, invalid anchors/gaps/duplicates/journals, all three routes with per-action reload, legacy shape preservation, water conservation, read-only previews, edge marks, pause, native selector ownership, completion/retry and reset isolation. Both scripts pass syntax checks.

This responds to a source-level limitation, not a weakness observed in rendered play. It earns no completed improvement-pass or browser-tested credit. Actual desktop/mobile layout, native input, visual feedback, balance and enjoyment still need rendered play and inspected screenshots. In particular assess whether the additional direction selector is clear on touch and whether the barrier creates worthwhile decisions before integration.

## Portable treadle pump — pending rendered review

Source inspection found that flat steps always blocked water, and a deep unwanted descent could not be bypassed without reshaping or a shallow weir. One portable pump now directs all water arriving at its inlet to a neighbouring ground outlet. The outlet may be flat, downhill or at most one step uphill. Placement, relocation and removal each cost one action without changing soil. Inlet/outlet order matters. Fixed spring/bed/rock tiles cannot anchor it. The pump carries water over a weir on its edge. If reshaping makes the rise exceed one, pumping stops and ordinary flow resumes.

Pump-driven flow follows branch paths; water returning into its own path is trapped, not duplicated or circulated indefinitely. The original descending-flow implementation and board shape remain unchanged when no pump exists. Optional v1 journal actions are {pump:[inlet,outlet]} and {pump:null}; the derived pump field is absent in untouched old journals. Undo restores pump, weir and terrain together; retry retains records.

The native outlet selector previews resulting root-bed amounts. IN/OUT markers and accessible plot labels identify endpoints. Controls respect pause, dialogs, completion and the existing storage bound. A single pump cannot feed two different edges simultaneously; earthwork and the separate weir remain available.

29 tests pass (17 engine, 12 jsdom 26.1.0), retaining all original 21. Three pump-inclusive routes complete with per-action UI save/reload in 1/3/9 actions, versus original soil-only examples 2/4/8. The first crosses a plateau; the second bypasses the hollow. The third deliberately includes a redundant downhill placement for compatibility coverage, not a claimed strategic improvement. No optimality or duration claim. Tests cover plateau/one-step rise, actual loops, disabled high outlet, weir crossing, relocation/removal/undo/retry, strict action validation, conservation across varied terrain and barrier arrangements, read-only forecasts, markers, native keys and pause/modal guards. Both scripts parse; IDs/assets/bridge-first and absence of Switch workspace controls pass static checks. Fixtures: tests/fixtures/rill-root-pump.json.

No rendered play, screenshot inspection, native touch/dialog verification, human enjoyment rating, full repository build or live release evidence. This is source-informed and earns no qualified improvement credit. The existing browser security-policy blocker was not retried or bypassed. Rendered review must check whether the pump makes the first garden too trivial, whether placement/rise/loop feedback is clear, and whether the added selector is comfortable on phones before qualification. The public catalogue remains unchanged.

## Embedded keyboard repair

Release water uses **W**, including the visible button hint and aria-keyshortcuts. P is reserved by Study Desk's shared bridge for workspace navigation when embedded. Earlier standalone jsdom tests omitted the bridge and therefore missed that the advertised P action was swallowed in the launcher. The engine, journals, mouse/touch button action and save key are unchanged.

34 tests pass: 17 engine, 12 standalone DOM, five bridge-integrated DOM checks. Run all three tests/rill-root-{engine,dom,bridge}.cjs files with jsdom 26.1.0 on NODE_PATH. The new harness loads the real bridge before the game with a simulated parent window and visual-timer APIs. It checks P navigation without pouring, W pouring, a keyboard-completed garden plus save/reload, native selector/button/input ownership, modifiers/repeats, pause/dialog guards and bridge visibility suspension/resume. This is DOM simulation, not a real rendered iframe, screenshot or physical-touch test. The bridge is identical on the inspected main and development heads and is not modified.

The W regression test failed before the handler change and passed afterwards. This is a concrete reliability fix, not a substantive rendered-play-led improvement pass. No catalogue entry or completion count changes.
