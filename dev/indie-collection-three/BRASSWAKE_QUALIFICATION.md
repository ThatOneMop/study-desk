# Brasswake qualification — 3 November 2026

Fixed a keyboard ownership bug: Space on a focused floor button used the board's Wait shortcut instead of the button's normal move action. Native Space/Enter now belong to floor buttons; board-focused shortcuts remain available. This is a qualification repair, not a second substantial improvement pass or a new game.

Implementation: [47c07604098cfdbb25cdee3041281cf9cd80d907](https://github.com/ThatOneMop/study-desk/commit/47c07604098cfdbb25cdee3041281cf9cd80d907).

## Evidence

CI41477692640 at 47c07604098cfdbb25cdee3041281cf9cd80d907 passed eight engine checks, twelve desktop/touch court clears and two full keyboard stored-shot clears, plus new desktop/touch shell checks. Authentic legacy completed saves migrate; Space on a focused floor tile now walks exactly once instead of waiting. Repeat/composition/modifier events do not advance turns. Loss while carrying, reload, restart and records pass. Actual bridge.js in a same-origin fixture blocks hidden restart/recovery acceptance and requires explicit resume after returning; Collection messages and unrelated-save preservation pass.74 bundled routes/286 references, source syntax and nine first-batch release integrity checks pass. Artifact13156979790 sha256:06de98237425e71a57e3f05df6c8475914703eed8f7a1a4f3c17913bdd2002ae verified; desktop-shell.png and touch-shell.png visually inspected. This is automated Chromium touch emulation and agent visual assessment, not physical-device or human-enjoyment testing.

[Passing workflow](https://github.com/ThatOneMop/study-desk/actions/runs/41477692640). The shell fixture uses the actual game and bridge, not a substitute pause implementation. Legacy/corrupt payloads are deliberately injected only for persistence tests; gameplay clears use controls. Hidden dialog acceptance is tested through direct DOM click attempts. After return, cancel the still-paused dialog, explicitly resume, and reopen it to confirm. No claim of live catalogue integration is made.

Inspected phone screenshot: entire seven-row board is visible, hostile direction/landing markers are distinct, controls follow the board without covering it; lower controls require scrolling. Desktop screenshot shows Collection message received by the fixture, readable court and action panel, and saved recovered session. The fixture is generated only during CI and removed afterward.

## Selection

Qualified reserve, not selected. Catch/carry/fire creates real timing, shield-resource and positioning choices distinct from simple immediate reflection. However, three deterministic compact courts and mastery badges offer limited long-term progression. Bell Diver's equipment/charters and Mycelium Yard's reinvestment better serve the user's progression preference. No numerical enjoyment rating or unmeasured duration is claimed.

## Durable status

Third batch:29/50 built,29 improved,29 fully browser-qualified;21 unbuilt. Currently integrated/live0/0 under PR110, with25 historical releases preserved. Exactly50 ledger slots remain. Second batch's20/20 additional improvement round and historical nine releases remain unchanged. First-batch integrity checks pass.

Main was freshly observed at fa57730f70904ae5f15e47fe0c7e55dc28144c88 and left untouched. Its14-game curation is still the release-scope hold; no unchanged publishing attempt was retried. Numberworks, Gummy Bay, requested-GitHub-games and other concurrent work were not edited. No automation was changed or paused.

Next: build original slots70–90 with rendered baseline, substantive improvement and qualification. Preserve qualified reserves, historical sources and saves. Catalogue regression and live verification remain required if release scope later permits integration.
