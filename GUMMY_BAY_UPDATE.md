# Gummy Bay v125

The playable game in `games/gummy-bay/` is the v124 build plus a Day 1 starter sale and a 21:00–05:00 curfew. Study Desk still opens it at `games/gummy-bay/index.html`. Entry script is `game.js?v=125`. Save keys stay `gummybay-v3-{story|free}-{1|2|3}` and the save version stays 3.

A new game, and an untouched version-3 save, starts with four packed Pine Pops. After about 20 seconds of play Jules texts an agreed deal: two at $30, at the usual spot. The notebook leads with that handoff, then growing and crafting. Making a gummy by hand still waits on `made`, so the starter packs do not skip that step. From 21:00 to 05:00 residents stay in, heat does not cool off, and patrols run even before the first gummy is made. Notice range is 45 m during curfew. `gameplaySnapshot().police` is `{range, suspicion}`.

# Gummy Bay v124

The playable game in `games/gummy-bay/` is the v123 build plus customer cravings and a 22:00–06:00 curfew. Study Desk still opens it at `games/gummy-bay/index.html`. Entry script is `game.js?v=124`. Save keys stay `gummybay-v3-{story|free}-{1|2|3}` and the save version stays 3.

A repeat sale raises a customer’s craving for that gummy. The effective level eases off after a missed day, a matching craving pays a little more on the next offer, and a strong craving writes a price request into the existing message thread without reserving packs. During curfew customers stay at their usual spot and heat does not cool off. `gameplaySnapshot()` and `subscribeGameplay` are there for the phone and HUD. This pass does not add a screen. See `games/gummy-bay-dev/docs/overhaul-v124.md` and `games/gummy-bay-dev/docs/schedule-i-parity.md`.

# Gummy Bay v123

The playable game in `games/gummy-bay/` is the v122 build plus walking field staff. Study Desk still opens it at `games/gummy-bay/index.html`. Entry script is `game.js?v=123`. Save keys stay `gummybay-v3-{story|free}-{1|2|3}` and the save version stays 3.

A new gardener walks between installed tents to harvest, water and plant. A new seller walks an agreed order to that customer and pays the agreed price once. The old instant loops remain on the roster as Background timer. A version-3 save that never stored a route keeps the timer, so existing businesses do not change crews by surprise. See `games/gummy-bay-dev/docs/overhaul-v123.md`.

v122 runs the world in fixed 1/60 second steps. One real second matches at 30 FPS and 120 FPS. A hitch catches up at most a quarter second instead of freezing the clock, movement, police and workers at 60 ms. A new gummy maker walks the workshop. A save that already chose carried or stored stock keeps that choice. See `games/gummy-bay-dev/docs/overhaul-v122.md`.

## v121 import

The playable files began as the v121 web build (`dist/` from the ChatGPT export). Study Desk still opens it at `games/gummy-bay/index.html`. The Study Desk bridge script is included before `game.js`, which the exported `index.html` did not contain. Save keys stay `gummybay-v3-{story|free}-{1|2|3}`.

Blender files, the v121 test suite, and the version notes live in `games/gummy-bay-dev/`. `games/gummy-bay-dev/dist` points at the playable folder so those tests keep their `../dist` imports. GitHub Pages excludes `games/gummy-bay-dev/` so the Blender sources and evidence images are not part of the site upload.

`dist/assets/town-v7.glb` (about 6.4 MB) is an older town export. v121 loads `environment-v11-final.glb` and does not reference `town-v7.glb`, so that file is not in the playable folder. The exporter that writes it remains in `games/gummy-bay-dev/art/build-town.py`.

The ChatGPT hosting file `.openai/hosting.json` was not imported.

## v121 notes

# Gummy Bay v121: simpler residents and worn architecture

Residents: remove the protruding skin nose/cheek triangles from all six high/low meshes, narrow and lengthen the skull, preserve smooth skull normals, and hide the extra cheek/nose accents and block brows. Eyes, mouth, blink behaviour, clothing and hats remain. Animation skin weights and morph lengths remain checked against real GLBs.

Town: room wall segments receive brick, worn plaster, corrugated metal, concrete or timber treatments. Corrugated texture includes rib highlights and rust streaks. Shop names use narrower subdued signs; repeated planter decoration is reduced. District sheds have fewer windows and raised metal seams, walkups have fewer windows and staggered brick courses, and houses have horizontal timber seams. Dark plinths and rain streaks break up side walls. Existing varied roofs remain; no claim of new roof archetypes in this pass.

Alleys: enable existing screen shadows at balanced quality and add soft ground contact darkening. Existing walkable routes and colliders are preserved. No new alley routes in this pass.

Gameplay: retains v120 parcel grab/throw/place and notebook discoveries; no economy/save format change.

Verification: full CPU/asset/mocked browser suite in evidence/v121-final-tests.json. Preview attempted at terminal.local:4173; WebGL context creation still fails. Appearance and performance on the user's machine remain unverified. Added cladding uses the existing instanced detail batch and is hidden in performance mode.
