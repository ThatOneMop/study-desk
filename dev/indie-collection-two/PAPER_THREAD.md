# Paper Odyssey — recoverable bridge thread

Implemented in [5d51916](https://github.com/ThatOneMop/study-desk/commit/5d519169d661956a7ccb138ccb166da328667638).

## Observed weakness and change

Reviewed retained native phone chart-four gameplay screenshot from CI 40694980007, artifact 12819072834. The bridge controls expose a one-use choice; source confirms no way to reclaim or reposition it. Five short fixed charts offer limited route experimentation. Screenshot review is not new direct interactive play or a player enjoyment study.

Before: A stitched connection is permanent until rewind/restart, spending two creases. Extra thread cannot be redirected during a continuing route.

After: Unpick a bridge from either endpoint while play remains active to recover one crease, remove the connection and free thread for a different crossing. Preview shows the lost connection and remaining destinations before confirming. Each new stitch costs two creases and two permanent par points; undo restores the exact prior bridge and resources. Existing version-one routes still replay.

This adds a resource/route choice rather than extra repetitive charts. Five compact authored charts still constrain depth. Recovery is available during active play only; ended journeys still use rewind or fresh-sheet retry.

## Evidence and pending work

70 focused tests pass: 39 engine and 31 DOM, including all five recovered-thread deliveries, pure forecast/replay, relocation sunk cost, endpoint restriction, undo, retained medal costs, preview/cancel/Enter and reload. Native suite extended to five original, five stitched and five unpicked deliveries per desktop/touch context; CI pending. No changed screenshots inspected yet.

Baseline screenshot inspected: `touch-chart-4-mid.png`, [artifact 12819072834](https://github.com/ThatOneMop/study-desk/actions/runs/40694980007/artifacts/12819072834). Phone chart and controls are readable but require scrolling. Native regression for the mechanic began in [40701713972](https://github.com/ThatOneMop/study-desk/actions/runs/40701713972); a following commit corrects obsolete rejection text and checkpoints this report. Inspect the latest source run before crediting completion.

Inspect exact-source native CI and new desktop/touch unpick previews/deliveries; assess route value, controls, saves, loss/retry, restart/navigation before counting. Additional round remains 13/20.

First-batch baseline remains 20 finished/nine selected. Second batch remains 20 initially finished, 13/20 additional verified, 33 recorded passes. Third branch unchanged at fb0ed7a: 24/50 built, zero qualified improved/browser-tested/integrated/live. Main remains 55c330d with 65 catalogue entries, including 13 earlier second-batch integrations. No new public integration or live upgrade here. Existing saves, first-batch sources and concurrent work preserved. Earlier Switch-workspace audit and successful Pages publication are unchanged; no repeat publishing failure claimed.
