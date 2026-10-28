# Counterweight lift rehearsal — verified

29 October 2026. Source: `2bc91453985c3def8b6f51b4c8f696220873a444`. Additional round is now **17/20 verified** after the evidence below.

## Observed weakness and change

Reviewed retained native Chromium touch-job-3-mid.png from run 40751257296 / artifact 12843054368. The crane and controls fit the phone width, but forecasts show only one action; the added cradle changes torque throughout a delivery. This is an agent screenshot/source assessment supported by earlier automated rendered routes, not a new human play session.

The prior padded-cradle implementation (`66e77e8d2e7a50acab5e99228cd92be17d958f63`) creates a +1 tonne / +3 safe-swing tradeoff, but a single-step forecast does not communicate its full delivery cost. The new **Rehearse this lift** mode allows players to test a delivery before committing. It uses the same rules, keyboard/tap controls and normal action costs. It stops after delivery; the player can apply, undo or discard. No extra authored levels or timer padding were added.

The preview has an explicit visual frame and summary of moves, deliveries, overloads, damage and cradles. The saved journal and best records remain unchanged until application. Undo cannot cross the starting point. Reload discards an uncommitted preview. A lost route cannot be applied until revised. Completing the manifest in rehearsal cannot award medals or unlock jobs early. Existing engine rules, original route fixtures, save key and migration are unchanged.

## Evidence and limits

- Baseline inspected: `touch-job-3-mid.png`, native run [40751257296](https://github.com/ThatOneMop/study-desk/actions/runs/40751257296), planning artifact 12843054368; archive SHA256 `3f5623479a303a54e4364ab485483f4c7589368286799e7f394c5cc4955130e8`.
- **60 focused checks pass:** 32 engine and 28 jsdom. Five original and five cradle campaigns retain their outcomes. New tests cover preview isolation, exact journal application, overload recovery, undo boundaries, discard/reload, cradle refunds and record/unlock safety.
- Browser suite expanded to run all five cradle routes through native rehearsal controls on desktop and emulated touch, with every delivery applied and reloaded. Original campaign, restart, loss/undo, corrupt-save recovery and navigation checks remain.
- Exact-source CI and final screenshot inspection are pending. This checkpoint does not claim a new verified pass, human enjoyment study, physical-device test, catalogue integration or live release.

First collection, public catalogue, Gummy Bay, requested games and third-batch source are preserved. Third batch remains 24/50 built with zero qualified improved/browser-tested/integrated/live. Remaining additional reviews after Counterweight: Lanternwake, Copper Cadence, Hollow Keeper.

Native verification queued/running: [40769551504](https://github.com/ThatOneMop/study-desk/actions/runs/40769551504), source `2bc91453985c3def8b6f51b4c8f696220873a444`.

## Completed native verification — 29 October 2026

Exact source 2bc91453985c3def8b6f51b4c8f696220873a444: CI 40769551504 passed all seven jobs, 537 engine + 379 DOM = 916 checks, syntax/assets, exact twenty-slot and nine first-batch integrity gates. Native planning job 123104095098 passed five original plus five cradled/rehearsed three-medal jobs in each desktop/emulated-touch context. Every delivery was applied and reloaded; exact previews, journal isolation, draft overload/loss/revision/discard/reload, keyboard, original restart/cancel, loss/undo, corrupt-save recovery and navigation passed without browser errors.

Inspected desktop-rehearsal-risk.png, touch-rehearsal-delivery.png and touch-rehearsal-complete.png from 28 Counterweight screenshots in artifact 12851884887. Desktop shows the padded 3t load and next-move overload warnings. Phone preview distinctly labels the unchanged save, displays a ten-move/one-cradle clean delivery and readable apply/discard controls; final fifth job shows 63 moves, no damaged loads/overloads, and all jobs complete. No horizontal overflow; phone layout requires vertical scrolling. Archive SHA256 a0540ef86e7e71394b4c5458df6cc406fc777b63a191fc5f33a429fdaa4b3799. Automated rendered gameplay plus agent visual review; not human-enjoyment or physical-device evidence.

[CI](https://github.com/ThatOneMop/study-desk/actions/runs/40769551504) · [Screenshots](https://github.com/ThatOneMop/study-desk/actions/runs/40769551504/artifacts/12851884887). The pending statements above describe the implementation checkpoint; this section supersedes them. This verification credits the existing substantial cradle/rehearsal upgrade once, not documentation or tests as a new improvement. The second collection has 20 initially finished games, 17 verified additional upgrades and 37 meaningful passes. No new catalogue integration or verified live upgrade. Third collection remains 24/50 built, zero qualified improved/browser-tested/integrated/live. Next: Lanternwake, Copper Cadence, Hollow Keeper, then slate selection.
