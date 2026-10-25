# Gummy Bay v21 — Town and everyday interactions

Base: hosted v20, source af4a615b913814707ab78a05cf59a8c262745311. Study Desk base f37b72afdcc8ab6ae1e831d64bede21d461c3e66. GitHub main checked: a21930e2d79c709cd6d2a77d43ea7f36ad7ee2d3.

## Delivered
- Animated Blender citizens rendered at 86% scale, approximately 1.92 m rather than 2.23 m. High/low detail scales agree; walk/run clips retimed. Original assets and rigs retained.
- Smooth customer travel turns and nearby facing; conversation facing; host customers pause for nearby guests.
- Compact customer dialogue with transparent upper view. No forced player camera rotation.
- Read-only stock strip: supplies, loose gummies, wrappers, carried/available/reserved/stored stock and worker transit. Opens the existing inventory; not an equipped-item hotbar.
- Wallet/card change feedback with load reset; phone subpanel selection.
- Walking subdivides travel into collision checks no longer than 0.16 m, retaining axis sliding.
- Existing shop shelves gain supports and distinct representative garden, hardware and packaging displays, on the same footprints. Not collectible stock.
- Revised procedural trees, grass colour variation without increasing clump count, central street kerbs with junction gaps.
- Twenty distant hills in one instanced mesh outside playable bounds. No playable expansion.
- Host worker presentation reaches guests, with interpolation, invalid-pose/disconnect/stale hiding. Guests never simulate production. Cargo survives model installation and has a carry pose.

## Evidence
Passed tests: experience.mjs, boot.cjs, business-core.mjs, logistics.mjs, workshop.mjs, visual.mjs, presentation.mjs, route.mjs and JS syntax.

Boot test parses real GLB files with mocked DOM/WebGL; checks asset loading, both character LOD scales, cargo attachment, HUD and conversation transitions, $400 save/reload, host worker packet and guest visibility/disconnect. This is not a rendered playtest.

Study Desk DOM tests passed: 100 entries, PPP both directions, held-key release, timer pause/resume, search, favourites, flashcard editing/mastery. Changed runtime files match standalone byte-for-byte; bundled index retains its bridge.

Historical v12 harnesses failed on a missing restoreComfort import; not counted as passing. Current boot harness imports current modules.

## Research
Read https://www.scheduleonegame.com/ and https://www.scheduleonegame.com/presskit/schedule-one/index.html this turn. They establish distinct production processes, traversal, property/employee progression and co-op. User-provided image notes guide original coastal art and readable management UI. No new footage review or claims about Schedule I physics internals.

## Unverified and unfinished
Blender executable and supported control-browser capability unavailable. No rendered screenshots, real-device input test, live two-player session or frame-time comparison. New scenery is runtime geometry, not newly exported Blender work.

Inspect RV exit, kerbs, all shop fixtures, tree crowns, outer-road horizon, character feet/proportions/LOD changes, carry pose, compact dialogue and HUD at phone/tablet/desktop sizes. Test sustained corner walking and co-op reconnect/PPP switching.

New facial modelling, richer NPC daily activities, redesigned production minigames, expanded playable map/buildings, held-item equipment hotbar and full Blender overhaul remain unfinished. Existing economy, introduction, production, settings and save keys are preserved, not claimed as new features.
