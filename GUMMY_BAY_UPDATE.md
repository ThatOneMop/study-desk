# Gummy Bay v121

The playable game in `games/gummy-bay/` is the v121 web build (`dist/` from the ChatGPT export). Study Desk still opens it at `games/gummy-bay/index.html`. The Study Desk bridge script is included before `game.js`, which the exported `index.html` did not contain. Save keys stay `gummybay-v3-{story|free}-{1|2|3}`.

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
