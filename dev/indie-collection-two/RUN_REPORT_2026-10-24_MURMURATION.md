# Murmuration development increment — 24 October 2026

Achieved: **15/20 playable, meaningfully improved and finished**. Murmuration passed its final native desktop/touch campaigns. Five concepts remain. Exactly twenty new candidate slots remain in the separate ledger; no first-batch, Nightshift or Afterlight game counts here.

## What changed

Murmuration is a real-time migration game: shape a wind destination, split twelve individual birds around reed islands to gather food, then regroup through narrow channels. Four authored routes introduce changing lanes and crosswinds. Arrival needs at least six birds and the route's food goal. Best feather, bird and feeding records persist; replay-validated input trails restore an in-progress flight paused at its saved position.

The meaningful improvement adds pure two-second survival forecasts, dotted individual flight paths, explicit collision-risk warnings, approaching-passage cues and pause-to-plan with the map still visible. Desktop and phone layout revisions bring the scene and controls together. Pointer steering restores keyboard focus; cancellation, blur and host visibility suspension release controls and preserve the journal. Unreadable saves remain protected until explicit recovery.

A conservative gathered wing can take a single feeding lane: a verified first-route alternative arrives with twelve birds, ten feeding spots and two feathers. A wider detour arrives with all twelve birds but only six feeding spots and loses from inadequate food. The all-food route uses splitting to earn its third feather. These are different outcomes within one game, not additional candidates.

## Durable source and commit trail

- Initial playable: [ff29e8c](https://github.com/ThatOneMop/study-desk/commit/ff29e8caf09a3df32b06a36db6d5e82590bfeb16), 11 engine + seven interface checks.
- Forecast, pause-planning and responsive-control pass: [1a7ab92](https://github.com/ThatOneMop/study-desk/commit/1a7ab925e6db1404606db3f1bd27df7154e8582a).
- Pointer focus and natural food-shortfall coverage: [7d9d64](https://github.com/ThatOneMop/study-desk/commit/7d9d644fb6eabe22b50d236fe0b4dc602eb3a3e3).
- Separate native flock group: [8ee1304](https://github.com/ThatOneMop/study-desk/commit/8ee13044e2bcb050fe9417b2eee921c45b4c1dec). Gameplay is identical to 7d9d64.
- Development launch: serve the repository root and open `/games/murmuration/`. This is a development route, not a verified live link.

## Verification

The final local source passes **23 focused checks: 14 engine and nine DOM**. Coverage includes four complete twelve-bird/all-food migrations, split/gather collision loss, natural low-food arrival failure, conservative victory, route unlocks, pure exact forecasts, paused planning, replay saves, bounded malformed input rejection, restart, recovery, blocked storage, keyboard focus and pointer cancellation. Public assets/routes, all nine selected first-batch source hashes, the exact-twenty-slot gate, current shell, bridge-pointer and relaxed-collection checks pass.

The earlier gameplay revision passed 569 aggregate engine/interface checks. Final exact-source CI is [40023020207](https://github.com/ThatOneMop/study-desk/actions/runs/40023020207); all six jobs passed, covering **570 engine/interface checks (328 engine + 242 DOM) and all fifteen complete desktop/touch game suites**. The intervening focus-only run 40022888321 was replaced while pending by the final workflow revision. All fifteen native game suites remain enabled across five browser groups, with at most three concurrent jobs.

Cloud browser review inspected the desktop scene and the 390-pixel phone frame, exercised start/split/pause, and confirmed that regrouping while paused changes a clear-air preview into a twelve-bird risk warning without moving the flock. This was a layout and control review, not a physical-device or complete-campaign claim. Final native Chromium desktop (1280×1000) and touch emulation (390×844) completed all four migrations with twelve birds, fourteen feeding spots and three feathers. Each migration reloads at an exact paused midpoint. Additional cases cover preview changes while paused, pointer/keyboard focus, touch cancellation, bridge visibility suspension, natural collision and underfed-arrival failures, restart/cancel, corrupt recovery, reset preserving another key, navigation and zero browser errors. A separate unmocked RAF flight smoke passed. Runner browser: Google Chrome 155.0.8059.39.

The [26-image screenshot artifact](https://github.com/ThatOneMop/study-desk/actions/runs/40023020207/artifacts/12531686836) was downloaded and its ZIP SHA-256 verified as `95c3ae1c41ffb50bf9b013fb99c20e3b3bcfb7afc6da4d0debd7b46b0044b3bd`. Desktop route-four completion, phone pause-planning and phone natural food-shortfall images were visually inspected: readable scene, controls, forecasts and results, without horizontal overflow.

## Quality and limits

The design adds simultaneous formation control and food/survival tradeoffs to the slate. Original Canvas estuary art uses two contrasting wings, gold feeding rings and hatched reeds. The four short routes share two obstacle families and offer route unlocks and feather records rather than an expansive progression system. No audio, endless mode, physical-device testing, human enjoyment study or long-playtime claim is made. Final curatorial selection remains separate.

## Preservation and publishing

The first-batch report still records twenty finished games and nine selections. No first-batch source, save key, catalogue entry or test changed. Main was reread at `ed2cf603aa47fc26e4f04216d5704351b72a32a9`; unrelated Study Desk, requested-game, Gummy Bay and separate all-created-games work is untouched.

No public catalogue or hosting write was made by this increment. The latest GitHub Pages run remains [39925660833](https://github.com/ThatOneMop/study-desk/actions/runs/39925660833), failed during Pages configuration before upload/deployment. The recorded error is Get Pages site: Not Found, followed by Create Pages site: Resource not accessible by integration. This is separate from any independently hosted Study Desk site. No newly published game link is claimed.

Next: implement Night Clerk (slot 36). Reserve later work for broader improvements, selection, integration and release testing. The additional batch is not complete, so the task remains active.
