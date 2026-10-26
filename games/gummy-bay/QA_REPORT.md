# Gummy Bay QA — one in-game morning

The play session ran on `87341e2` (Gummy Bay v123) in headless Chromium with SwiftShader. New story used **STORY / CONTINUE → New game → Skip introduction**. Old slots used `gummybay-v3-{story|free}-{1|2|3}`. The home page and the other catalog games were booted the same way. This branch was then rebased onto current `main`, which already moved the playable build to v124. This pass does not change that version, and the save version stays 3.

## Fixed in this pass

- **Control hint never appeared.** After the litter/mixer UI pass, every HUD refresh set `#hint` back to an empty string, so “Drag to look · aim at an object and press E · Esc for menu” never stayed on screen. The empty assignment is gone. A later sample in the same story run showed that sentence on the HUD.
- **A blocked gardener or seller was described as the gummy maker.** Both field workers reused the status `Route blocked`, and the roster always answered with the workshop-trolley advice and a craft-table shortcut. The gardener now says `Garden route blocked` (path inside the property, crop stays put, shortcut to the tent). The seller says `Delivery route blocked` (straight line stopped, agreed packs stay in the bag). The gummy maker still says `Route blocked` and still points at the worktable. Co-op still accepts the two new status strings from the host.
- **Seller stock menu used the gummy maker’s route labels.** On a hired seller, Stockroom / Carried were labeled “Walks the workshop” and “Background timer”. Those options now say **Stockroom packs** and **Carried packs**. The gummy maker’s stock labels are unchanged. Route (Walks the route / Background timer) is still its own control.

## What the playthrough actually did

Story boot reached a WebGL title (SwiftShader) in about 12s with no page errors. The only console error on that page was a missing favicon. Skip introduction left a normal day-1 save: $400, 09:00, RV at `-58, 26.7`, gardener and seller routes already `walk`.

The camper is a tight collision box. The east door gap is only about two metres wide (around z 25.5–27.5). With the town running at about **1 FPS** (frame gaps around 1.7–4s even on the Performance preset, shadows off), key taps shorter than a frame never moved the player. Holding a key did: strafe carried the player from the doorway back into the north-east corner (`z ≈ 30.1`, against the rear wall). From there the east wall is solid, so the rest of the morning was spent inside the camper. Cash stayed $400. No room, tent, craft, sale, or police stop happened on the fresh story. That is a low-FPS hotspot plus a narrow doorway, not a second movement bug. A held key still changes position; a tap does not, because movement is sampled once per frame.

The clock still advanced, slowly. About twelve real minutes of an open, unpaused game moved the story from roughly 10:25 to **11:32**. It did not reach evening. On that v123 build, residents changed places during the morning and one of the five stayed on the same corner. v124, which landed on `main` after the session, gives residents a curfew from 22:00 to 06:00. This pass did not play that window.

Police officers were placed on their routes and **did not walk**. Patrol movement returns immediately until `made` or `sold` is non-zero, so the street is full of stationary officers until the first gummy exists. Searches are documented to start then; the standing patrols are not called out in the notebook.

Old saves behaved. A version-3 story slot with no `staffConfig` loaded as day 4, $860, xp 90, a mature Pine Pop, three packs, and **timer** routes for the gardener and seller. A version-3 free slot loaded the same way. A truncated story slot (`{not json`) was left byte-for-byte alone and reported as unreadable. A partial free slot missing `bank` was rejected (“Invalid bank”). Another partial free slot missing seed inventory was rejected (“Invalid seeds”). None of those writes replaced the stored text.

Hiring did not go through from the camper. The Helping Hand row still showed **$650** and accepted the click, then the approach check refused it: “Walk to a clear approach at the correct shop or workstation. Nothing was consumed.” Cash stayed $860 and the gardener stayed unhired, so the new walk route was never switched on in this session. The refusal is the right outcome away from the counter. The enabled price button is the confusing part.

## Left for the people building those systems

- **SwiftShader is not a playable town.** Performance mode was still about 1 FPS for the whole morning, so a sale, a hire at the Helping Hand, police movement, and the evening did not fit in the session. The hotspot is the whole campsite view, not one prop.
- **Curfew was not played.** v124 keeps residents at their usual spot from 22:00 to 06:00. The session stopped at 11:32 on the previous build. Whether the player can still shop, deliver, or be searched after 22:00 is untested here.
- **Seller does not pathfind the town.** A blocked straight line keeps the packs in the bag. The new status text only says that; it does not add town pathfinding.
- **First morning cannot hire.** Gardener is level 3 and $650. The $400 start, after the $350 first-batch shopping list, has $50 left.
- **Shop buttons stay enabled out of reach.** Price and hire controls still look ready. The action then no-ops and says nothing was consumed. Same pattern for the other counters.
- **Patrols are frozen until the first made or sold gummy.** Worth a pass if officers are supposed to be walking the town from 09:00.
- **Catalog boots, on the tree that was played.** Before the later main fixes, all ten `games/nightshift-*` catalog pages threw `NightshiftSaves is not defined` and `Cannot set properties of null (setting 'onclick')`, and the ten Afterlight catalog pages (`harbourlight`, `kiln-kind`, `velvet-circuit`, `cloud-courier`, `copper-steam`, `tidal-glass`, `orchard-atelier`, `moonwell`, `the-quiet-cut`, `lumen-grove`) threw `AfterlightSaves is not defined`. Current `main` includes `save-store.js` on those pages. They were not booted again after the rebase.
- **Other games.** Home page flipped a card and listed 64 games. Its only error was `favicon.ico` 404. Most catalog games reached a title at 30–60 FPS with no page errors. Short samples sat near 10 FPS for Autumn Drift, Underleaf, and Moon Salvage, and near 13–14 for After Hours and Forge Arena. Those five were not re-sampled; the first number may be a cold SwiftShader frame rather than a stuck game.

## Checks

On the rebased tree, `tests/run-all.py` passed 108 of 108, including `qa-play.mjs`, `staff-status.mjs`, `field-crew.mjs`, and `logistics.mjs`.
