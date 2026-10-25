# Island neighbourhood extension

Adds 121 deterministic solid exterior buildings to previously sparse road blocks, using existing varied architecture and all-sided window/roof dressing. New sites reserve street/pavement clearance, existing colliders, interaction approaches and hillside support. These are exterior homes and shopfronts; no new purchasable-property or shop transactions are introduced.

Adds a closed, irregular sloping shoreline surrounding the existing world bounds, completes the south land foundation, expands the animated sea to all four sides, removes the mainland hill backdrop and northern ridge, and updates the map coastline and building footprints. Existing playable limits, traversable hills and western river remain.

Old saves embedded in new buildings are moved to nearby clear ground on load/reset. Saves retain version 3. New buildings use shared instanced architecture with quality-mode detail control.

Validation: 95 test commands (92 module tests plus boot, resident-world and module-link); browser graph contains 88 modules. Placement/coast/rescue tests and the full real-asset boot checks cover road and interaction clearance, save flow, existing production/economy, co-op authority and stable resources. DOM, renderer and network are mocked. The preview explicitly reports Error creating WebGL context, so rendered appearance and GPU/FPS are not verified.
