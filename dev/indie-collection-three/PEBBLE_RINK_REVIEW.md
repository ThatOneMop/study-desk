# Pebble Rink — shot review and control repairs

Date: 25 October 2026. Implementation: [db3b0fa00d19be493cfe6fcea0619443497cff9f](https://github.com/ThatOneMop/study-desk/commit/db3b0fa00d19be493cfe6fcea0619443497cff9f).

## Evidence and before/after

This increment follows source inspection and reproduced engine/DOM behavior. It is not based on rendered playtesting and does not count as the required improvement pass.

- Previously every animation callback advanced one film frame, so playback speed changed with display refresh rate. Playback now consumes 50 ms per sampled frame (three 60 Hz simulation ticks), only while active. Pause, guide/confirmation dialogs and hidden-tab handling reset the playback clock; long callbacks are capped to prevent skipping an entire shot.
- Previously the global Space handler could release a stone while a button or navigation link had focus. Interactive controls now keep their native key behavior. The rink is keyboard-focusable and retains the aiming/release shortcuts.
- Previously players could only inspect settled stones. **Replay last shot** reconstructs the previous collision sequence without changing progress, medals or the saved journal. Shot notes give its angle/weight/curl and each stone's points before and after the shot, including points lost when another stone knocks it away.
- Previously undo discarded a shot but left whatever settings were currently selected. Undo now recalls the removed shot's settings and restores earlier positions, allowing one-variable adjustments.
- Guide cancellation now restores disabled controls; rink navigation retains focus through rerenders.

The physics, three rink layouts, scoring thresholds, unlock rules and save key/version are unchanged. Existing valid journals remain compatible. No new game or repetitive content is counted.

## Validation

Command: `NODE_PATH=/tmp/pebble-deps/node_modules node --test tests/pebble-rink-engine.cjs tests/pebble-rink-dom.cjs`.

**14 checks passed: 7 engine + 7 DOM.** Coverage includes all three authored rink solutions/unlocks, exact save/reload, curl/collision/bank/island behavior, natural loss and retry, malformed-save preservation, isolated reset, replay without save mutation, before/after scoring totals, undo setup recall, equal playback positions at different callback rates, no catch-up after pause, native keys on controls/navigation, focused-rink input and help cancellation. Two initial new test expectations were corrected against the unchanged deterministic physics: weight 75 scores two points, and the explicit knock-out fixture uses weights 73 then 90.

JavaScript syntax, local asset references and exact 50-slot ledger/count checks passed. Only the six Pebble Rink source/test files plus this report and the third-batch ledger are included in this increment. Main and the first/second collections are untouched. The full repository build/preservation suite was not run from the partial checkout.

Canvas, dialogs and animation timestamps are mocked in the DOM suite. These checks do **not** establish actual browser rendering, screenshot review, native dialog behavior, physical touch usability or human enjoyment. No new browser attempt or alternative rendering route was used to bypass the previously recorded policy denial.

## Status and next work

Third batch: **3 built / 0 improved / 0 browser-tested / 0 integrated / 0 verified live**, across exactly 50 slots. Second batch remains 20 initially built/improved/browser-tested, with **6/20 additional upgrades verified**. Pebble Rink remains an unlisted prototype.

Once permitted rendered access is available, play the actual aiming/curl/collision loop, inspect replay speed and scoring readability on desktop/touch, identify the main enjoyment weakness, implement a substantive upgrade, and verify progression, loss/retry, saves/reload, reset and real navigation. No publication was attempted; this commit is not a live release.
