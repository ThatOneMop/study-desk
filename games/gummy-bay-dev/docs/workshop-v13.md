# Gummy Bay v13 — workshop readability pass

Base: published v12, source 8463637b06e8a5796696998219a7684a5e69e2a0 (latest returned by Sites on 19 October 2026).

Audit: v12 already has original Blender environment/equipment, animated citizen variants and LODs, tactile station tasks, four-item batches, worker assignments, three rendering qualities and audio sliders. These remain. Existing roads, facades, materials and interior lights are retained.

Implemented: inventory-backed shelf packs (up to 12 representative boxes), glossy loose gummies, harvested-input containers, production-stage signs; contextual floor ring; task completion percentage and retained-supplies note; task-dependent tool/stream/wrapper presentation; selected hotbar state and carried-pack count; phone business summary; independent walking-bob and sprint-FOV switches; storage-safe audio/comfort preferences; cleared motion and station-held input on pointer cancellation and Study Desk visibility messages.

Compatibility: unchanged v3 save keys/schema, fresh balance $400, story/free slots, story text, multiplayer protocol and production economics. New optional preferences use gummybay-comfort. Stock visuals project inventory and do not consume it. No new collision geometry. Bundled deployment must retain the existing Study Desk bridge before the game module.

Checks: JavaScript syntax; pure projection/progress/preferences tests, including bounded allocation for huge inventories and no inventory mutation. No browser gameplay test, render screenshots, measured FPS, audio/fullscreen/pointer-lock test, complete first-sale route, old-save round-trip or multiplayer session was available. Do not interpret code checks as those tests.

Remaining requested work: visual QA and before/after screenshots; complete route playtest; broader town art refinement; new equipment-specific Blender animations; NPC crowd separation; measured performance and tablet testing. This is a focused incremental build, not completion of every requested improvement.
