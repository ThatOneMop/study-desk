# Rill & Root initial implementation — 27 October 2026

Source commit: `c0cb277acc2f032d5b654f2619ec760130261bba` on `indie-collection-three-dev`. Slot 58; not a renamed existing game.

## Implemented
Original height-field earthwork loop: select a tile, cut/fill a height step with a four-scoop bucket, then test a downhill stream. Soil is conserved. Water goes to the lowest strictly lower neighbour, splits equal minima, stalls on flats and collects in hollows; both root beds must receive their share with the bucket empty. This differs from pipe routing and colony production through free terrain reshaping and conserved soil.

Three small authored gardens introduce a high step, an off-route hollow and an earlier fork/deep hollow supplied by two banks. Demonstrated routes use 2/4/8 edits, not proven minima. Failed pours keep terrain and can be repeated freely; undo and retry support experiments. Progression unlocks the next garden; records track edit efficiency.

Original CSS layered soil, height numbers, root beds, wet overlays and directional flow arrows; optional read-only preview and text forecasts. Native buttons, terrain/page shortcuts, pause/modal/parent guards, responsive CSS and Games navigation implemented. These are implementation facts, not rendered usability evidence.

Only the game's v1 save key is written. Journal replay validates heights, bucket, fixed plots and allowed actions. Corrupt data stays preserved pending explicit recovery; quota failure leaves a temporary session. The 200-edit storage bound is not a gameplay quota and cannot block undo/retry.

## Verification
13 tests pass (7 engine, 6 jsdom 26.1.0):
- All three wins, progression, exact per-edit/pour reload and persistent records.
- Failed-pour recovery, bucket-empty requirement, undo/retry, immutable previews, individual basin water and downstream arrows.
- Soil conservation, steepest descent, ties, plateaus, traps, and total-water conservation through 900 deterministic edit attempts.
- Invalid/fixed/occupied-by-role plots, capacity and height guards, strict action/save schema, journal bound and repeated free pours.
- Keyboard/native-control ownership guards, pause/modal/parent visibility, corrupt recovery, reset isolation and storage failure.
- Both scripts pass syntax checks. Local JS/CSS references and Games route valid.

No rendering, inspected screenshots, native touch/keyboard testing, full repository build, human enjoyment assessment or content-hour claim. The source is a prototype, not a finished or improved candidate.

## Baseline and preservation
Re-read first-batch FINAL_REPORT: 20 finished/improved; nine source-selected; zero verified live. Second branch `3949e3d9f8e2e9846dc4c91c436d90b19bbbd341` remains at 20 built/initially improved and 20 additional source upgrades, six additional rendered verifications and fourteen pending.

Third parent `8008bacdfdc7c562d70db71f190ad5d9c3b8c09f` has no AGENTS.md. Main `d9e77a6bcbb7a8c4b43e976618efbecd2ff38527` was checked: changes since prior observation affect only Gummy Bay and credits. No launcher or Switch workspace control was reintroduced. Shared catalogue, prior games and concurrent work are untouched; the new shell retains Games navigation. No fresh desktop/mobile navigation result claimed.

The previously recorded browser security-policy rejection and publication barrier were not retried or bypassed. This commit does not imply deployment.

## Counts and next steps
Exactly 50 third-batch slots remain: 18 built prototypes, 0 qualified improved, 0 browser-tested, 0 integrated, 0 live; 32 unassigned. No public entry added. Initial tests do not count toward the required rendered improvement pass.

Next: play naturally on desktop/touch, inspect screenshots and flow readability, identify the most important weakness, implement a substantial improvement to choices/progression/controls/feedback, and verify saves/restart/navigation before comparing and integrating. Continue independent development while rendering is blocked; the overall goal is incomplete.
