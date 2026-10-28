# Lanternwake: choose the light — pending native verification

29 October 2026. Source `1146af1f7864acb3d1dfc4ca5d1c2cac4abb2c57`. Additional round remains **17/20 verified**.

## Observed weakness

Inspected retained native touch-crossing-4-mid.png from CI 40769551504/artifact 12851884887. Phone map and risk controls are readable, but only a generic Lantern hood/Reclaim pair is exposed. Source and a naturally reached two-light fixture confirm both actions force oldest-first selection, preventing deliberate choice of which nearby lure to keep. This is agent screenshot/source assessment, not fresh human play.

## Concrete upgrade

The prior hood mechanic (`237c2d8fbae76778b706f0681fdcc76b86e240b9`) reduced light radius and moth attraction, but both hood and reclaim always chose the oldest adjacent lamp. Players can now choose either lamp explicitly. Each nearby-light card shows coordinates, remaining turns, open/closed state, and separate hood/reclaim controls. Planning remains free until confirmation. Choices consume the existing turn/life costs and targeted reclamation recovers exactly one oil; no new levels or timers were added.

The natural fixture `bs, s, bs, s` on crossing one places the boat at 28 with lamps at 28 (three turns left) and 37 (five). `hood:37` protects the newer light while leaving the older open; H still chooses 28. `snuff:37` recovers the newer light rather than forcing reclamation of 28. Explicit position actions replay deterministically in version-one saves; existing unqualified actions keep their old behavior.

## Evidence and boundaries

- **58 focused checks pass:** 31 engine + 27 jsdom, including five original routes and three hood routes, selection, invalid targeting, old ordering, save replay, preview/cancel/commit, reload, undo and recovery. JavaScript/browser syntax checks pass.
- Baseline screenshot inspected: `touch-crossing-4-mid.png`, native run 40769551504, artifact 12851884887. Source inspection established the forced selection limitation; the screenshot establishes the visible control layout.
- Native browser tests now exercise two-light selection, exact journal isolation, cancellation, selected-hood reload, undo, targeted reclaim, three hood-assisted crossings with targeted actions, and original progression/loss/retry/restart/navigation on desktop and emulated touch.
- New native run and final screenshots remain pending. No additional verified pass, human enjoyment study or physical-device test is claimed yet.

Only Lanternwake source/tests and second-batch records changed. First-batch sources, saves and tests, main catalogue, Gummy Bay and third-batch work are preserved. Second batch: 20 initially finished, 17/20 additional upgrades verified. Third batch: 24/50 built, zero qualified improved/browser-tested/integrated/live. No new public integration or live release. Existing Pages/workspace audit remains applicable to unchanged main; no unchanged failure retried.

Exact-source CI: [40784599336](https://github.com/ThatOneMop/study-desk/actions/runs/40784599336), running at this checkpoint.
