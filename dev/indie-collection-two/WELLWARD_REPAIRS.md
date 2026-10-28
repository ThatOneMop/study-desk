# Wellward — deliberate field repair

## Observation and change

Inspected touch-well-2-mid.png from native run 40702051106 artifact 12823556898. Repair sits below the movement controls and is disabled while paused; no changing speed/cooldown readout explains readiness. Source confirms the player must manage braking and reach Repair during live movement. This is retained automated gameplay and screenshot review, not new direct interactive play.

Before: Optional kit reserves one hook and repairs a strap, but the player must manually brake through impact cooldown and activate repair during live movement. Pausing prevents repair.

After: Steady for repairs applies the real brake with neutral steering until speed is at most 20 and impact cooldown clears, then pauses without consuming the kit. Cancel pauses immediately; keyboard/pointer steering takes over and immediately updates feedback. Repair now works from the stable paused state, with exact strap/hook changes and live readiness text. The original manual R flow remains. No physics teleport, free health, or automatic kit spending.

The repair kit retains its capacity cost: one hook stays reserved until the kit is spent. Preparation is an optional brake assist, not route autopilot, and still advances normal physics. Existing saves, cabinet, upgrades and version-one decoding remain unchanged. Four compact wells and sixteen relics still limit depth; no content-hours claim.

## Implementation and validation

- Earlier kit mechanics: [5b0fb76](https://github.com/ThatOneMop/study-desk/commit/5b0fb766926891c874870f04331198f3802d1a16).
- Preparation, readiness, paused repair and takeover feedback: [696e6c0](https://github.com/ThatOneMop/study-desk/commit/696e6c07a2947a613f99f193a1d058bb5ffe2157).
- 44 focused engine/DOM checks pass; source and browser-test syntax checks pass. A new takeover test initially exposed stale Cancel settling text and now passes after immediate feedback refresh.
- [Native regression 40722093364](https://github.com/ThatOneMop/study-desk/actions/runs/40722093364) is pending; do not infer success or changed visual quality yet.
- Baseline phone screenshot reviewed from [artifact 12823556898](https://github.com/ThatOneMop/study-desk/actions/runs/40702051106/artifacts/12823556898). New screenshot routes are committed. No new direct interactive-browser play, human-enjoyment or physical-device testing claimed.

## Checkpoint

Review exact-source CI 40722093364 and inspect repair-impact/ready/complete desktop and touch screenshots. Verify progression, loss/retry, save/reset/navigation and assess the repair/capacity tradeoff before credit. Additional count stays 14/20.

Second collection remains 20 initially finished, 14/20 additional verified, 34 meaningful passes. Third collection remains 24/50 built and zero qualified improved/browser-tested/integrated/live. No new catalogue entry or live upgrade. Main 55c330d and third branch fb0ed7a remain unchanged; existing first-batch sources/saves and concurrent work preserved. The earlier Switch-workspace audit and resolved Pages publication remain unchanged.
