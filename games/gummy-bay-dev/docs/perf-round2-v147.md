# Gummy Bay v147 — perf round 2 (Low draw calls)

Measured in shot mode (`?shot=city&quality=low&hour=12`, 1280×720, SwiftShader), with one page visiting the
views in order (spawn → overview → Old Town → main street), which is the worst case for batch splits.

| View (cam) | v146 cold | v146 after visiting views | v147 |
|---|---|---|---|
| Spawn street `0,1.7,8 → 0,1.6,-40` | 258 | 338 | **213** |
| Overview `16,11.5,46 → -36,2.2,18` | 334 | 410 | **243** |
| Main street `-46,1.7,5 → 30,1.5,3` | 314 | 465 | **231** |
| Main east `10,1.7,1 → 60,1.4,5` | — | 321 | **178** |
| Old Town `-20,1.7,-85 → 30,1.6,-85` | — | 230 | **178** |

Phone (390×844 at DPR 2, Low, in-game, SwiftShader so only the relative change counts): 252 → 176 draw calls.
Median frame time went from 405 to 393 ms, and p95 from 715 to 411 ms.

## Changes
- **Batch splits fixed.** The small-details distance cull toggled `visible` on meshes that the static batcher had
  merged, so each toggle split the whole batch. The distance cull now skips batched sources, and every small detail
  is made visible before the build.
- **Sky clouds**: 21 sprites became one camera-facing quad mesh, using a 2×2 canvas atlas with per-vertex
  tint and opacity, sorted back to front.
- **Static signs**: 53 boards are packed into 3 canvas atlases with one mesh each. A sign splits back out when
  its visibility, material or texture changes (checked every 60 frames). Debug hook: `window.__signAtlas`.
- **Litter**: about 22 child meshes became about 4 InstancedMeshes, and hidden groups get zero-scale instances.
- **Contact shadows**: 11 transparent quads became one mesh. They share one colour, so the blend result is the
  same in any draw order.
- **Kickflip lightbox**: the 6-material box became a frame box (batched) plus one lit face plane.
- **Payphone and Sugar Squad props** now opt in to static batching.

There was no visual change in the side-by-side Low shots of spawn, overview, Old Town, the sky and the Kickflip sign (front and back).
