# Gummy Bay QA — scripted day

Playable build stays **v125** (`game.js?v=125`). Save version stays 3. This pass does not bump either.

The harness is test-only. It runs only when the page is opened with `?qa=day`, and it writes `gummybay-qa-day` instead of `gummybay-v3-{story|free}-{1|2|3}`. A fresh story is loaded with `load('story', 1, true)`. Headless frames inject extra `update(1/60)` steps so a ~1 FPS SwiftShader session can cross a whole day. Growing crops have `plant.end` moved into the past while the director is waiting; that skip exists only in the harness.

## Played before this rebase

Both browser runs were on the tree at `5a508ef` plus the harness, before v125, the kinematic walk, the town-shell collision, and the phone/HUD pass. They were not repeated on current `main`.

One run finished. It left the camper, took Gramps’s call, rented Palm Court ($400 → $325), bought the tent, can, trimmers, and pack station at Hank’s (cash $100), installed the tent in Room 04, bought Pine Pop seed and soil at Milo’s (cash $60), grew and harvested 4, made 4 gummies on the south side of the worktable, bought wrappers (cash $50), packed 4, listed them at $34, and texted Jules. The story slot sentinel was still `SENTINEL-STORY-SLOT` at the end. The control hint stayed “Drag to look · aim at an object and press E · Esc for menu”. The only console error was the missing favicon.

The sale did not complete. The walker treated Jules’s home node (`-7, 22`) as the destination and stood there. Officer 1’s patrol passes that corner. A search at about 14:55 seized 4 carried products and $50, cancelled the deal, and cleared the listing. `sold` stayed 0, cash stayed 0, level stayed 1, and the Helping Hand hire was never attempted. The clock still reached curfew: the edge fired at time 1320.1 (22:00 on that build). Jules, Benji, Nina, Oz, and Frankie were already “Indoors for curfew · the usual meeting spot.” The player was not movement-locked. Later empty searches toasted “Search clear. No illegal gummies found.” The harness then reported `done`. Wall clock for that failed-sale day was about 7.5 minutes.

A follow-up commit aims past a waypoint the player is already standing on, so a delivery continues to the customer’s live position. The unit test covers that. The rerun was stopped during wrap-up while walking to Milo’s after the tent install (cash $100, about one real minute in). It did not reach a sale, an empty-pocket stop, a hire, or curfew.

## Catalogue

On that same pre-v125 main, all ten Nightshift pages and all ten Afterlight pages booted with `save-store.js` present: nightshift-garden, rent, wash, mine, magnet, leaves, parcel, crusher, moths, slime, and harbourlight, kiln-kind, velvet-circuit, cloud-courier, copper-steam, tidal-glass, orchard-atelier, moonwell, the-quiet-cut, lumen-grove. 20/20, no page errors, `store` was an object. They were not booted again after v125 and the phone/HUD merge.

## Left unfinished on current main

- **The scripted day was not replayed after the rebase.** v125 grants four packed Pine Pops and an agreed Jules text (2 at $30) on an untouched save. The director still buys the Hank list before it looks at packs, so it can walk past that handoff. Curfew in `resident-life.mjs` is now 21:00–05:00 (`1260`–`300`); the played edge was 22:00. Walk speed is 3.6 and sprint is 6.2, and town shells collide differently. The route graph was tuned against the older movement. `make` and `pack` are station steps; the hook can drive a station, but that craft loop was not repeated here.
- **Hire at the counter never happened.** Gardener is still level 3 and $650. On the played build one crop could not pay it. Leave the fee, the level gate, and seller pathfinding to the systems builder. The seller’s straight line was not exercised.
- **Shop buttons.** On the played build the $650 hire control stayed enabled away from Helping Hand, then the approach check refused it and consumed nothing. PR #18 added named cart confirms. Whether those controls are disabled out of range was not rechecked. Leave button states to the HUD builder.
- **Police timing.** On the played build, patrols did not walk until `made` or `sold` was set. After packs existed, standing on the patrol line produced an automatic search inside 1.8 m and the seizure above. v125 still holds daytime patrols until the first product, and curfew notice is 45 m. Not replayed, and not retuned here.
- **`LAW_TARGET` in `sim-formulas.mjs` is 21:00–05:00**, which now matches resident curfew. The played 22:00 window is the old build. Nothing here retunes it.
