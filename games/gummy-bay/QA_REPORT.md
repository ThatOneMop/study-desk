# Gummy Bay QA — one in-game morning (v123, save version still 3)

Played on latest `main` (`87341e2`) in headless Chromium with SwiftShader. New story used the title button **STORY / CONTINUE → New game → Skip introduction**. Old version-3 slots used the keys `gummybay-v3-{story|free}-{1|2|3}`. The Study Desk home page and the other catalog games were booted the same way. Gummy Bay’s version number was not changed.

## Fixed in this pass

- **Control hint never appeared.** After the litter/mixer UI pass, every HUD refresh set `#hint` back to an empty string, so “Drag to look · aim at an object and press E · Esc for menu” never stayed on screen. The empty assignment is gone. A later sample in the same story run showed that sentence on the HUD.
- **A blocked gardener or seller was described as the gummy maker.** Both field workers reused the status `Route blocked`, and the roster always answered with the workshop-trolley advice and a craft-table shortcut. The gardener now says `Garden route blocked` (path inside the property, crop stays put, shortcut to the tent). The seller says `Delivery route blocked` (straight line stopped, agreed packs stay in the bag). The gummy maker still says `Route blocked` and still points at the worktable. Co-op still accepts the two new status strings from the host.
- **Seller stock menu used the gummy maker’s route labels.** On a hired seller, Stockroom / Carried were labeled “Walks the workshop” and “Background timer”. Those options now say **Stockroom packs** and **Carried packs**. The gummy maker’s stock labels are unchanged. Route (Walks the route / Background timer) is still its own control.

## What the playthrough actually did

Story boot reached a WebGL title (SwiftShader) in about 12s with no page errors. The only console error on that page was a missing favicon. Skip introduction left a normal day-1 save: $400, 09:00, RV at `-58, 26.7`, gardener and seller routes already `walk`.

The camper is a tight collision box. The east door gap is only about two metres wide (around z 25.5–27.5). With the town running at about **1 FPS** (frame gaps around 1.7–4s even on the Performance preset, shadows off), key taps shorter than a frame never moved the player. Holding a key did: strafe carried the player from the doorway back into the north-east corner (`z ≈ 30.1`, against the rear wall). From there the east wall is solid, so the rest of the morning was spent inside the camper. Cash stayed $400. No room, tent, craft, sale, or police stop happened on the fresh story. That is a low-FPS hotspot plus a narrow doorway, not a second movement bug. A held key still changes position; a tap does not, because movement is sampled once per frame.

The clock still advanced, slowly. About twelve real minutes of an open, unpaused game moved the story from roughly 10:25 to **11:32**. It did not reach 20:00, so the evening resident wind-down was not visible. Nothing in the session mentioned a curfew, and there is no curfew lock in the sim. Shops do not close. Residents do change places during the morning (their saved positions moved). One of the five stayed on the same corner the whole time.

Police officers were placed on their routes and **did not walk**. Patrol movement returns immediately until `made` or `sold` is non-zero, so the street is full of stationary officers until the first gummy exists. Searches are documented to start then; the standing patrols are not called out in the notebook.

Old saves behaved. A version-3 story slot with no `staffConfig` loaded as day 4, $860, xp 90, a mature Pine Pop, three packs, and **timer** routes for the gardener and seller. A version-3 free slot loaded the same way. A truncated story slot (`{not json`) was left byte-for-byte alone and reported as unreadable. A partial free slot missing `bank` was rejected (“Invalid bank”). Another partial free slot missing seed inventory was rejected (“Invalid seeds”). None of those writes replaced the stored text.

Hiring did not go through from the camper. The Helping Hand row still showed **$650** and accepted the click, then the approach check refused it: “Walk to a clear approach at the correct shop or workstation. Nothing was consumed.” Cash stayed $860 and the gardener stayed unhired, so the new walk route was never switched on in this session. The refusal is the right outcome away from the counter. The enabled price button is the confusing part.

## Left for the people building those systems

- **SwiftShader is not a playable town.** Performance mode was still about 1 FPS for the whole morning, so a full day (20:00 wind-down, police after a sale) did not fit in the session. The hotspot is the whole campsite view, not one prop.
- **No curfew.** Residents wind down at 20:00 in their routines. The player is not sent home, and the servo stays open. “No night deliveries” on a parcel is flavor text.
- **Seller does not pathfind the town.** A blocked straight line keeps the packs in the bag. That limit is already the v123 design; the new status text only tells the truth about it.
- **First morning cannot hire.** Gardener is level 3 and $650. The $400 start, after the $350 first-batch shopping list, has $50 left.
- **Shop buttons stay enabled out of reach.** Price and hire controls still look ready. The action then no-ops and says nothing was consumed. Same pattern for the other counters.
- **Patrols are frozen until the first made or sold gummy.** Worth a pass if officers are supposed to be walking the town from 09:00.
- **Catalog boots that are not the Gummy Bay scene.** These pages throw before play and belong to the collection shells, not this gameplay pass:
  - `games/nightshift-{garden,rent,wash,mine,magnet,leaves,parcel,crusher,moths,slime}/` load `../nightshift/app.js` but omit `save-store.js` and the export/restore buttons that script binds. Result: `NightshiftSaves is not defined` and `Cannot set properties of null (setting 'onclick')`. The hub `games/nightshift/index.html` includes both.
  - `games/{harbourlight,kiln-kind,velvet-circuit,cloud-courier,copper-steam,tidal-glass,orchard-atelier,moonwell,the-quiet-cut,lumen-grove}/` call `start(0)` without `../afterlight/save-store.js`. Result: `AfterlightSaves is not defined` and `Cannot access 'saves' before initialization`. The hub includes the store script.
- **Other games.** Home page flipped a card and listed 64 games. Its only error was `favicon.ico` 404. Most catalog games reached a title at 30–60 FPS with no page errors. Short samples sat near 10 FPS for Autumn Drift, Underleaf, and Moon Salvage, and near 13–14 for After Hours and Forge Arena. Those five were not re-sampled; the first number may be a cold SwiftShader frame rather than a stuck game.

## Checks

`node tests/qa-play.mjs`, `node tests/staff-status.mjs`, and `node tests/field-crew.mjs` passed before the full `tests/run-all.py` run recorded in the PR.
