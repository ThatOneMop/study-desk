# Rill & Root treadle pump — 28 October 2026

Source: [b32fdd8d1d23e46028c3578860d78e64a729c4ec](https://github.com/ThatOneMop/study-desk/commit/b32fdd8d1d23e46028c3578860d78e64a729c4ec).

## Gameplay change
Source inspection found no way to cross flat ground without earthwork, or redirect a stream along a chosen ground edge regardless of the lowest neighbour. One portable pump now carries all inlet water to an adjacent ground outlet, up at most one height step. It can cross a weir. Placement, movement and removal each cost one action and no soil. It cannot anchor on a rock, spring or root bed.

Changing terrain to make the outlet more than one higher disables pumping; normal flow resumes. Pump-driven paths that revisit a plot trap their water instead of duplicating it or looping forever. Native controls show exact root-bed forecasts before placement. IN/OUT markers and accessible labels identify endpoints. Undo restores pump, barrier and terrain.

The v1 journal adds optional {pump:[inlet,outlet]} or {pump:null} actions. Legacy boards and descending-flow behavior stay unchanged without a pump; old records and saves remain valid. No public entry added.

## Verification
29 tests pass (17 engine, 12 jsdom 26.1.0), including original 21:
NODE_PATH=/tmp/rill-fan/node_modules node --test tests/rill-root-engine.cjs tests/rill-root-dom.cjs

Three pump-inclusive routes run through controls with each action saved/reloaded. They finish in 1/3/9 actions versus original soil-only 2/4/8. First crosses the blocked plateau; second bypasses the hollow. Third is deliberately redundant pump compatibility coverage, not an improved solution or optimality claim. Fixtures: tests/fixtures/rill-root-pump.json.

Coverage includes plateau and uphill transfer, genuine cycle trapping, disabled high outlets, water/soil conservation through varied legal edits and weirs, crossing barriers, single-pump relocation/removal, undo/retry, strict validation, pure previews, markers, native selector ownership and pause/dialog guards. Original tests retain progression, dry-bed retry, saves/recovery/quota/reset and Games navigation.

The first cycle fixture accidentally left a valid downhill escape and failed. It was corrected to test both successful uphill transport and a real loop; final tests pass. Both scripts parse. Unique/used IDs, assets, bridge-first loading and no workspace-switch controls pass static checks.

## Boundaries and next step
Source-informed refinement only: no rendered play, screenshot inspection, native touch/dialog test, enjoyment rating, full-repository build or live release. Existing browser security-policy rejection was not retried or bypassed. Rendered assessment must check whether the pump trivializes the opening garden, whether rise/loop behavior is clear, and whether phone controls remain readable. No qualified improvement credit.

First-batch final report, latest third tree/ledger and candidate source/README inspected. No AGENTS.md in third tree. Static conventions retained. Starting heads: third 4ea7845c9fe544cf096e5a54c00e8e57365a381f; main 55c330d9ec493afc40e81e89a371f64cbd5bd8b0; second 3949e3d9f8e2e9846dc4c91c436d90b19bbbd341. Main and second unchanged; no deployment retry. Clean prior launcher audit remains applicable to unchanged source; no fresh rendered navigation claim.

Exactly 50 third slots remain: **22 built, 0 qualified improved, 0 browser-tested, 0 integrated, 0 live**. Second additional round remains **6/20 verified; 14 pending**. First collection and concurrent work preserved. No automation changes.
