# Clockwork Tide — counterweight energy storage

25 October 2026. Source commit: [2fecaad67037611daa8f410ae723e35992b3ac2d](https://github.com/ThatOneMop/study-desk/commit/2fecaad67037611daa8f410ae723e35992b3ac2d). Development only; no catalogue or live release. Additional round remains **6/20 verified**.

## Design hypothesis and implemented behaviour

Source-based hypothesis: the flywheel only permits immediate use, decay or disposal of energy, with no alternative reserve to manage across idle tide marks. No new rendered observation while preview access remains blocked.

Before: Flywheel energy loses one or two each stroke; excess speed can only be discarded with the brake/governor. Four fixed commissions remain.

After: A counterweight banks up to six existing flywheel energy before the wheel turns, capped at eight stored without friction. Release returns up to six before capacity/brake/governor/load calculations. Banking can stall a load; releasing can scorch one or overflow. Exact forecasts, one-stroke native selector, reserve meter, undo and replay saves expose the tradeoff.

The mechanism transfers existing energy rather than generating any. Water routing, tide length, product costs, tools, records and saved key remain unchanged. Hold is the default for legacy commands. The journal reconstructs the reserve through legal strokes rather than trusting a serialized balance. Restart empties the store; undo recovers the previous transfer choice. Transfer selection returns to Hold after every stroke so a player cannot accidentally keep banking a queued load. Empty/full transfers are explicit in the preview.

The native select uses the established Tab/arrows/Enter interaction and pointer events. Four meters now use two columns; the phone control panel has bounded scrolling and increased content clearance. Those layout changes need rendered inspection and are not claimed as verified touch controls.

## Scoped evidence

- `NODE_PATH=/tmp/tide-check/node_modules node --test tests/clockwork-tide-engine.cjs tests/clockwork-tide-dom.cjs`: **42 passed (28 engine, 14 DOM)** with jsdom 26.1.0.
- Syntax checks pass for both changed scripts. Static app, no build step. Full repository checks were not run from this partial source recovery.
- Original four delivery routes, workshop purchases and records still pass. Four new fixture routes in `tests/clockwork-tide-storage-routes.json` use legal earned resources, bank and release energy, and deliver with three seals. They are automated reachability/reliability evidence, not evidence of human enjoyment or increased campaign length.
- First commission banks five energy after its first delivery, preserves it through four idle strokes, then releases it on the ebb. Later banking lowers current speed. Tests also find reachable cases where banking stalls a successful load and releasing causes overspeed, overflow or governor venting.
- Tests cover exact preview purity, per-action reload, eight-energy capacity and six-energy transfer, partial/full/empty stores, conservation through consumption/friction/venting, invalid controls/logs, one-shot selection, undo/retry, progression and legacy defaults. A signed-zero empty-release mismatch found during testing was fixed before commit.
- DOM simulations cover four full storage campaigns with reloads, reserve/readout agreement, disabling controls after completion, focus, pause/dialog guards, cancelled and confirmed retry, existing natural loss, recovery, isolated reset and catalogue link markup.

## Evidence boundary and next step

Perform supported rendered before/after play, assess energy allocation and balance, inspect the enlarged phone panel and reserve readability, and iterate. Verify actual keyboard/touch, progression/loss/retry, saves, restart/navigation and screenshots before counting.

Existing browser security rejection remains in force. No alternative browser surface, indirect execution or CI render was used. Commits use `[skip ci]`. No screenshot or browser-play claim. Existing workspace-control/publication audit is unchanged; no repeated publishing attempt.

Main remained `85d941d59e8897585606e5a67f4413a710643067`; third-batch branch remained `ab12bd0d63f2a4cdc4579be3f811a6f4693c1161` at the pre-write check. Third batch remains six built prototypes, zero completed improvements/browser-tested/integrated/live. All first-batch files and unrelated work are outside this change.
