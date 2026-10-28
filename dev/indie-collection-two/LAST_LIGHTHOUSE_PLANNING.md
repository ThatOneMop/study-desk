# Last Lighthouse: readable prism planning

28 October 2026. Implementation: `fcc1da11ad19c5b84f88af22d8253a87e15a8e71`. Development branch only; no catalogue or production update.

## Observed weakness and change

The previous portable-prism implementation introduced useful alternate beam paths but required choosing coordinates and paying power before the beam changed. Rendered play made that commitment difficult to reason about on a phone. The revised chart has directly selectable water, a free dashed beam preview, orientation changes before payment, explicit placement and free cancellation. Signal cannot fire an old route while planning. Keyboard focus survives redraws; hiding a game cancels staged placement and pending confirmation callbacks.

The one-power placement still competes with rescue signals and hull-costing cranking. No levels or timers were added. Three fixed harbours remain a compact campaign, not a claim of long-form content.

## Evidence

- 15 engine and 8 DOM tests pass locally. Exact preview, orientation journals, old journals, all three prism-dependent rescues/convoys, cost/cancel, focus and visibility guards are covered.
- Direct rendered desktop and 390px iframe walkthroughs completed all three prism rescues and convoys. Inspected screenshots show current gold beam versus prospective turquoise beam and phone controls. Saved rescue and all three pennants survived reload.
- Loss after three missed signals, undo, retry cancellation/confirmation, pause/resume, guide and keyboard relay control were exercised. These phone-width clicks are not native touch evidence.
- [Exact-source CI 40631660878](https://github.com/ThatOneMop/study-desk/actions/runs/40631660878) checks job passes **516 engine + 353 DOM = 869 checks**, assets/syntax, first-batch selected-source hashes and ledger gates.
- Native Chrome 155 desktop/emulated-touch prism campaigns and original campaigns pass in job 122629895098, including saves/reload, loss/undo/retry, pause, reset/recovery and navigation. Artifact 12791424605 holds 52 Last Lighthouse screenshots; desktop-prism-plan-0, touch-prism-placed-1 and touch-prism-win-2 were inspected. ZIP SHA256 a5d7b17bfc6edd857682063de31ed953646c925ed2d4b854fe893eea8dc80a10. Additional-round completion is now **7/20**. Other native groups are still running at checkpoint.
- Automated routes and agent walkthroughs establish function/reliability, not measured human enjoyment.

## Launcher and publication audit

Current main is `55c330d9ec493afc40e81e89a371f64cbd5bd8b0`. Its 65 catalogue entries include thirteen concurrently integrated second-batch games; all are preserved. Gummy Bay v180 is preserved. No Switch workspace controls remain in launcher source or the 44 audited second/third-batch shells. Current main catalogue tests already handle their removal.

[Pages run 40486136506](https://github.com/ThatOneMop/study-desk/actions/runs/40486136506) passes Configure and Publish; the old permission failure is superseded. Direct live desktop and phone-width iframe tests verified search → Reefwright launch → Collection return at https://thatonemop.github.io/study-desk/. Screenshots were inspected. This verifies the existing live route, not the newer Reefwright development upgrade or all catalogue entries. No publishing configuration retries were needed.

## Counts and next increment

First batch preserved: 20 finished, nine selected. Second: 20 initially finished/improved; 20 additional upgrades implemented, seven fully verified including Last Lighthouse. Thirteen initial versions already exist on main through concurrent work; zero new integrations in this increment. Third: 24/50 built, 0 improved/browser-tested/integrated/live. No new game added this run.

Inspect the final overall CI outcome, then finish the thirteen remaining rendered upgrade reviews and comparative selection. Preserve branch concurrency and re-read main before integration. Do not pause the existing schedule.
