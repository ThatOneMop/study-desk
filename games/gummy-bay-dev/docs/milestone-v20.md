# Living Workshop — Gummy Bay v20

## Implemented
- Existing crafter's **Stockroom packs** assignment now collects real supplies, walks to the worktable, processes a pack and carries it to the stockroom. No new hire cost or replacement of the existing role.
- Saved `crafterCargo` holds one in-transit input (including its wrapper) or finished output. It is excluded from available stock but included in property capacity. It survives save/reload. Pausing preserves it; switching to carried-stock mode returns unfinished supplies or puts the finished pack in the bag. Property changes also recover cargo.
- Host-only simulation uses bounded four-neighbour routes with sampled edges, current colliders and tent footprints. Routes are checked before pickup. Blocked routes, missing supplies, occupied stations, pause and full output produce explicit statuses. Idle workers do not pathfind every frame.
- Blender citizen rigs and animation clips are reused when loaded, with the existing fallback retained. The worker's carried parcel reflects real saved cargo. Physical worker appearance is currently shown on the host; remote worker pose replication is not implemented. Shared inventory still follows existing host authority.
- Production hold/assist progress moved out of render wrappers to a single simulation-frame input update. Draw calls no longer advance these tasks. Pointer/tap/drag events retain their existing input path.
- Placement additionally checks workshop source-to-station, station-to-storage and storage-to-exit grid routes; a cargo-carrying worker must retain a route to storage. This is bounded grid connectivity, not a full navmesh proof.
- Dedicated supply trolley replaces overlapping source containers at the sealer. Stock remains a representative inventory display, not individually collectible containers. Close-up packaging housing now matches the world sealer.
- Optional station-facing view turns toward the actual craft/mix target without moving the player; cancellation restores prior yaw/pitch. Off by default; existing comfort defaults retained.
- Existing Room 04 sign updated to identify the workshop, plus a supported campsite payphone direction sign. No map expansion, replacement rigs or extra façade layers.

## Preservation
Same v3 save keys and format. Optional cargo field is validated on load/import/network acceptance. Old saves without cargo remain accepted. Fresh cash remains exactly $400. Production transaction and multiplayer command handling remain in place. Carried-stock crafter, gardener and seller retain timer automation.

## Verification
Passed isolated Node tests: complete physical-worker pickup/process/delivery; item conservation at every tick; duplicate pickup/process/deposit rejection; cargo JSON reload; output full; pause and mid-task resume; assignment/property recovery; blocked and alternate routes; invalid cargo; competition with manual production; no idle path search. Existing business, workshop, presentation, geometry and simulated economy-route tests passed. JS syntax passed.

No supported browser QA available. No direct gameplay tests, screenshots, rendered-animation inspection, FPS figures, live co-op or audio/fullscreen/pointer-lock testing. The route test simulates growth; it is not a first-person playthrough. The new physical worker needs actual town playtesting, including player/NPC overlap and blocked-aisle behaviour. It uses fixed workstation/source/storage points; stations themselves are not newly movable. In-progress task animations still use a close-up overlay, now matching equipment. No claim of a complete town art overhaul.

Views awaiting inspection: RV interior/exit, payphone route, shop counter scale, workshop entrance, supply trolley/worktable, complete production, stockroom, customer delivery. Next priority is supported browser playtesting of these exact views and the worker route, then refinement from observations.

## Research
Official TVGS press kit (undated; checked 19 Oct 2026): https://www.scheduleonegame.com/presskit/schedule-one/index.html . Confirms product-specific production, deliveries, properties, employees and co-op as product features. Does not establish internal navigation/networking implementation.
Developer interview: https://www.youtube.com/watch?v=BLE3OrzZcHM . Retrieved page contained no usable transcript/video content; not watched. No claims about its technical details.
Previously inspected samples of user footage show equipment inputs/outputs, shelves and compact interface, but do not establish responsiveness. The new worker architecture is our own implementation, not an asserted copy of Schedule I internals. Earlier evidence log remains research-v18.md.
