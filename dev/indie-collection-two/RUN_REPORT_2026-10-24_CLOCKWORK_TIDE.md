# Clockwork Tide — second batch, slot 37

Date: 24 October 2026 (Australia/Sydney).

**17 playable, meaningfully improved and finished candidates out of 20**. Clockwork Tide’s native desktop/touch verification passed. The ledger retains exactly twenty new slots, with three still planned. First-batch games and other collections are excluded.

## Game and improvement

Clockwork Tide is a compact tidal-mill operating game. Open a bypass to store rising water, hold the basin, then release it through the waterwheel against a lower sea. The starting head and gate opening determine generated energy. Three linked-gear settings trade stone speed against torque; grain, meal and flour each require a different operating range and spend stored energy. A twelve-mark tide advances only when the player runs a stroke—there is no real-time waiting.

Four authored commissions change the tide profile and product mix. First deliveries earn tokens for oiled bearings and a centrifugal governor. Bearings reduce energy loss; the governor trims overspeed but cannot supply missing torque. Replaying a paid commission cannot mint additional tokens.

Initial playable source: [3f5276b](https://github.com/ThatOneMop/study-desk/commit/3f5276be1a439d5c5abb1606e704d7d93c367ac6), after 12 engine and seven DOM checks passed.

The separate [improvement commit 2858383](https://github.com/ThatOneMop/study-desk/commit/28583831dc5a72398865bc1665eabbd367e6dd2f) adds exact next-stroke previews, manual braking, undo that restores water and queued settings, a fixed phone control panel and water-driven wheel animation. Undo can recover a damaged load or an exhausted tide; completed paid deliveries remain final. The initial implementation also fixed workshop-history saving: buying an upgrade after delivery preserves the tool configuration used during that completed tide, so saved history replays exactly.

All visual assets are original inline SVG/CSS. The isolated save key is `study-desk-clockwork-tide-v1`; bounded validated replay data protects against malformed records and commands. Existing initial unbraked commands remain compatible.

## Verification

- **30 focused checks passed: 19 engine and 11 DOM.** All four commissions deliver the full order with no damage or flywheel overflow; reference routes earn three seals in 8, 9, 10 and 10 strokes. These are verified routes, not shortest-route claims.
- Exhaustive physical-state search proves the first commission cannot finish without admitting high water through the bypass. The manual brake prevents a naturally reachable overspeed. Governor tests cover its energy removal and inability to fix insufficient torque.
- Every reference stroke’s forecast is pure and matches the resulting basin, energy, wear, product counts, phase, overflow and machine feedback. Tests cover expired tides, three damaged loads, undo, workshop funding, exact midgame/completed replay, old commands, malformed saves, recovery/reset isolation, blocked storage, keyboard focus, bridge pause and navigation.
- First-batch hashes and selected routes, public assets, syntax, exact twenty-slot ledger, and current Study Desk shell/bridge/relaxed-collection checks passed locally.
- Cloud UI checked desktop and 390-pixel layouts, ran the first stroke, reloaded it and completed the first commission through the phone-width controls with three seals.
- [CI 40031851485](https://github.com/ThatOneMop/study-desk/actions/runs/40031851485) tests exact gameplay commit `28583831dc5a72398865bc1665eabbd367e6dd2f`. All **630 engine/interface checks** passed (365 engine, 265 DOM). All seventeen native desktop/touch suites passed; all seven jobs succeeded. No earlier candidate source was altered.
- Native Chrome 155.0.8059.39 completed all four commissions on desktop 1280×1000 and touch emulation 390×844. Both workshop tools, every exact forecast, mid-plan/won reloads, native keyboard/touch/cancel, brake/undo, natural three-load failure/retry, bridge pause, isolated recovery/reset and navigation passed with zero browser errors.
- [Artifact 12535651649](https://github.com/ThatOneMop/study-desk/actions/runs/40031851485/artifacts/12535651649) retains 22 Clockwork Tide images alongside Night Clerk captures. ZIP SHA256 `031c256d25edde9fc28111f4b04814eac4ede044ef116be7d12d1d9862a7603d` verified. Desktop final delivery and phone high-water-planning images visually inspected. Source hashes are in the ledger. No physical-device certification claim.

## Assessment

Agent ratings on the ledger’s five-point scale: enjoyment 3, depth 2.5, polish 3.5, reliability 4.5, variety 4. The main strength is the interaction between stored water, changing head, flywheel energy and gear choice. The important limitation is its small fixed campaign: four tidal commissions and two tools, without generated coastlines, a wider economy or audio. This is an abstract discrete operating model, not an engineering-accurate hydraulic simulator or a long-playtime claim. Automated wins do not establish human enjoyment.

Keep Clockwork Tide unselected until the full slate is compared. Its machinery differs from Copper Cadence’s bead routing, but both need to earn their place rather than filling similar catalogue roles automatically.

## Preservation and publication

The first-batch report was reread: 20 finished, nine selected, 66 meaningful passes and zero verified live URLs. All first-batch source, saves, catalogue entries and tests remain preserved. This increment changes only Clockwork Tide, its tests, the second-batch regression workflow and development documentation.

Remote main remains `ed2cf603aa47fc26e4f04216d5704351b72a32a9`. Separate all-created-games catalogue work, requested GitHub games and Gummy Bay files are untouched. Reread that concurrent work before eventual promotion; this ledger’s curatorial selection count does not override a separately requested catalogue inclusion.

On 24 October, the latest [Pages release 39925660833](https://github.com/ThatOneMop/study-desk/actions/runs/39925660833) is still failed at configuration. Its recorded error is “Get Pages site: Not Found,” then “Create Pages site: Resource not accessible by integration.” No new public game URL, catalogue integration or deployment is claimed here. This does not determine the status of a separately hosted Study Desk site.

The two legacy shell tests that still target removed `playerStudy` remain a documented pre-existing limitation; they were neither changed nor claimed to pass.

Next: implement Ember Parcel (slot 38). Three planned candidates remain before the full-slate improvement, comparison and integration work. The task stays active because the additional batch is incomplete.
