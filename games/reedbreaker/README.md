# Reedbreaker

Original third-collection game, slot 48. Three compact turn-based wetland banks with deterministic clockwork beetles, authored CSS art and no runtime dependencies.

Walk restores energy. Dash shoves; hook draws a beetle backward; vault crosses it; directional brace blocks and counters one faced attacker. Other beetles still respond. Inspect the complete-turn forecast or enable touch-friendly planning before committing. Undo (U) rewinds the whole turn, including shield, energy and enemy responses. Records and unlocks survive undo and retry. No timer.

Arrows move; W/D/H/B/V choose a mode. Buttons support touch. Games returns to the Collection when embedded. Native Escape dismisses confirmation safely. Hidden games cancel pending plans and destructive dialogs and remain paused until visible and explicitly resumed.

Only `study-desk-reedbreaker-v1` is read or changed. Version-one journals remain compatible, decode validates actions and unlocks, unreadable bytes are preserved until explicit recovery, and storage failure leaves a temporary playable session. The 300-action ceiling bounds storage; it is not a gameplay target.

## Validation

38 engine/DOM checks; CI Chromium plays all four route families through all three banks on desktop and 390px touch emulation, with exact forecasts, reloads, victory/defeat undo, records, retry, native dialogs, hidden-shell guards, scoped corruption recovery and quota failures. The catalogue suite separately checks search, grouping, sorting, favourites, iframe launch/pause/restart and Collection navigation. Run `node --test tests/reedbreaker-engine.cjs tests/reedbreaker-dom.cjs` with jsdom 26.1.0 and run the browser scripts with Playwright 1.58.2 in CI.

Rendered improvement: the baseline did not name damaging attackers and offered only whole-bank retries. Added reversible turns and named beetle response notes, then fixed hidden confirmations and the native Escape control lock found during qualification.

## Limits

Three authored banks, two beetles each. Four verified route families are alternate approaches, not twelve levels. Best-turn records offer modest replay; no long campaign, audio, physical-device coverage, measured content hours or human-enjoyment claim. Phone layout scrolls vertically. Original code/CSS/SVG assets only.
