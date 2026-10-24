# Ember Parcel — initial playable checkpoint, 24 October 2026

Slot 38, second collection. This is an unfinished prototype, not a selected release, and does not count among the third collection's 50 games.

## What exists

Four authored turn-based flame-delivery routes. Movement consumes warmth; dry timber restores it, water drains it, ice can be melted and flares consume nearby fuel at the risk of burning gardens. Delivering sufficient warmth opens the next route. The first delivery unlocks two equipment options. Records reward efficient, garden-preserving routes. Free undo includes loss recovery. Retry retains delivery records. Saves use the isolated `study-desk-ember-parcel-v1` key and replay validated action history; malformed data stays intact until explicit recovery. Art is original CSS and text symbols, without imported assets.

Development launch: serve the repository root and visit `/games/ember-parcel/`. No build or runtime dependency is required. It has not been added to `catalog.json`, main or a hosting deployment.

## Rendered observations and next improvement

Desktop browser play completed the sleeping-cottage route in four steps and the ice route in seven actions, including keyboard movement and melting. Reload retained the melted tile and completed delivery. At 390×844 iframe dimensions, ordinary button clicks completed the glasshouse route in eight actions with one garden burned. A deliberate seven-step dry-ground loop exhausted the ember; undo recovered one warmth, retry restored seven and kept all three delivery records. Return navigation reached the real Games catalogue with search, filters, grouping, sorting and Gummy Bay preserved.

Desktop and phone-size screenshots were inspected. The palette and terrain symbols are readable, but the phone title/route list push the map below the first screen, and controls require scrolling away from it. Native confirmation dialogs interrupt route switching. More importantly, the compact routes have too few worthwhile decisions: a four-move straight line solves the opening and early equipment choices are largely optional.

The next substantive **initial** pass should deepen resource decisions (for example choosing when to carry or consume timber), keep the map/warmth/controls together, and replace blocking confirmations. These observations do not count as an improvement. After the initial pass, slot 38 still needs its own distinct additional-round upgrade. No extra levels, artificial timers or content-hour claims have been added.

## Tests and evidence boundary

- 8 focused engine checks passed: solver-completed four routes with save roundtrips after every action, atomic invalid moves, route locks, natural loss/undo, flare cost, melting, cloak water cost and corrupt-save rejection.
- 2 focused DOM checks passed: keyboard delivery, equipment unlock, pause, undo, reload, isolated reset and malformed-save preservation/recovery.
- Complete second-batch engine and DOM regression: **411 + 288 = 699 passing checks** locally. These include the ten new checks; they are not 699 separate play sessions.
- Rendered review used real browser UI actions. The 390×844 iframe check verifies a narrow layout, not actual touch input or a physical phone. A dedicated native desktop/touch campaign suite is still required before finishing this candidate. No human enjoyment study is claimed.
- Static Orchard's preceding exact-source run [40061003554](https://github.com/ThatOneMop/study-desk/actions/runs/40061003554) was rechecked: all seven jobs succeeded. It verifies the prior 17-game slate, not Ember Parcel.

## Collection checkpoint

Second batch: **18 playable, 17 initially improved/finished, 6/20 additional upgrades verified**. Windup Wrestling and Last Lighthouse remain unbuilt. Third batch remains **0/50 built, improved, browser-tested, integrated or live** in its separate 50-slot ledger. The 13 initial second-batch entries independently integrated into main remain untouched; final additional-round selection is still pending. This increment adds zero public entries and zero verified live releases.

Main was reread at `b311b35c85c267b25fd94164d0b6d2606bcf2032`; development started at `8191d003f41aa061ec4d8b2a6ddcedc3af1651dc`. The existing workspace-control audit and repaired tests are on main. No repeated publishing attempt was made: the known GitHub Pages configuration permission blocker and separate hosted-site authentication limit are documented in `docs/WORKSPACE_CONTROL_AUDIT_2026-10-24.md` on main. Neither implies this development source is live.
