# v17 — production reliability and collection integration

Base: v16 / 2e26a64855fae0c3d8514b991ebe8651bfa928c1. Source history checked before editing. See MILESTONE.md for observed issues and completion checks.

## Implemented
- Pure production planner and single authoritative make/pack/mix/batch commit path. Final supplies and unreserved stock checked before any mutation. Batch failure leaves inventory unchanged.
- Protected local save loading: invalid data cannot fall through into fresh-game autosave. Original slot remains available through raw-slot download.
- Import validation and pre-import destination backup. Backup storage failure cancels import. Existing v3 slot names and format retained, no schema conversion.
- Active-delivery cards show product, quantity, unit price, total, reserved quantity, deadline and distance, with tracking/cancellation.
- Corrected original starter notebook requirements; removed old primitive tabletop decorations where new workshop equipment occupies the same footprint.
- Study Desk bundled source updated from its older version, preserving bridge-before-module order and relative module paths. Catalog remains 100 games.

## Verification
Passed direct isolated tests: atomic batches, insufficient wrappers, reserved packs in mixing, invalid request rejection, planning without mutation, legacy six-item inventory arrays, malformed inventory/property/orders, pre-import backup and quota failure.
Passed geometry tests: new Three.js meshes construct with finite transforms; workshop, quality, task and pouring visibility transitions. No WebGL draw was performed.
Passed existing simulated base-action economy test: $350 starter purchases, first sale, duplicate-delivery rejection and second-crop press upgrade. Growth transitions and later equipment costs simulated explicitly; not full runtime playthrough.
Passed Study Desk jsdom tests: default study page, PPP both directions, typing exclusion, search/favourites, card/deck CRUD/mastery, held-key release, suspended/resumed timers and frozen bridge clock. Real audio/fullscreen/pointer-lock were not tested.
Passed asset/source checks: 99 bundled routes, local HTML references, microgame syntax, WAD/wasm structure; seven Gummy Bay relative module imports; bundled source bytes match standalone except the intentional bridge tag.

## Remaining limits
Supported browser control unavailable. No rendered audit, before/after screenshots, GPU/FPS measurement, real movement/collision route, real save-round-trip UI test, touch device test or multiplayer session. Full physical worker logistics, crowd navigation and broader town/character art work remain incomplete. Workers retain their existing clearly labelled timer automation. No claim that this release completes the entire requested simulator overhaul.

## Saves across sites
Standalone and Study Desk are separate origins: browser saves do not automatically transfer. Export from Gummy Bay's Menu and import into the destination game. Import creates a local pre-import backup; existing other slots remain unchanged. GitHub Pages publication remains separate from the Sites deployments.
