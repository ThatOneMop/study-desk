# Wellward — optional repair kit

25 October 2026. Source commit: [5b0fb766926891c874870f04331198f3802d1a16](https://github.com/ThatOneMop/study-desk/commit/5b0fb766926891c874870f04331198f3802d1a16). Development branch only. Additional round remains **6/20 verified**.

## Hypothesis and change

Source-based hypothesis: damaged straps offer only retreat or risking the entire load, with no loadout choice to reserve capacity for recovery. No new rendered observation while preview access remains blocked.

Before: All hooks carry relics; straps only repair on returning to the landing.

After: At the landing, optionally pack a single repair kit that reserves one cargo hook. After impact cooldown clears and speed falls below 20, repair restores one strap and consumes the kit, releasing the hook. R/button repair pauses for safe replanning. Full-health, fast, lost and repeated repairs reject; returning resets the loadout.

The kit is free but its opportunity cost is one fewer relic per load until consumed. It cannot be replenished during a dive, repair a broken bucket or exceed three straps. Cooldown prevents immediate repair at the moment of impact. Returning, changing wells or retrying clears the kit; players choose again at the landing. Existing relic economy, upgrades, physics and unique save key remain unchanged. Legacy saves default to no kit; validation accounts for reduced cargo capacity before accepting snapshots.

## Validation

- 26 engine + 16 jsdom checks pass, including all four original complete wells and sixteen relics. A natural 117-frame rightward collision followed by settling permits one repair; position and saved physics remain exact. The original first cargo route banks one relic instead of two with a packed kit, proving the capacity cost; skipped relic remains available.
- Checks include packed/used/legacy saves, invalid flags and overcapacity rejection, single-use/health/speed/cooldown/phase gates, no mutation on rejection, keyboard R, pause/dialog guards, reload, retry, isolated reset and navigation markup. JavaScript syntax passes. DOM uses a null canvas and simulated animation frames, not rendering; no screenshot, actual touch, human enjoyment or full-repository check claim.

Command: `NODE_PATH=/tmp/well-check/node_modules node --test tests/wellward-engine.cjs tests/wellward-dom.cjs`, jsdom 26.1.0, **42/42 passed**. No build step in this static app. Initial test exposed missing packed-kit text on dock reload; decoder now restores that feedback. No files from the original collection, public catalogue or third batch changed.

## Remaining

Perform supported rendered before/after play, evaluate kit versus cargo choices, inspect desktop/phone controls and feedback, and iterate. Verify actual keyboard/touch, progression, loss/retry, saves, restart/navigation and screenshots before counting.

Rendering remains blocked by the existing browser security rejection. No alternative browser surface or CI render used; commits use `[skip ci]`. No repeated publication attempt or live URL claim. Workspace-control/publication audit remains unchanged, with main still at `85d941d59e8897585606e5a67f4413a710643067` before writes. Third-batch head `ab12bd0d63f2a4cdc4579be3f811a6f4693c1161` remains six built prototypes and zero completed improvements/browser-tested/integrated/live. The new kit is pending verification, not a ninth verified additional pass.
