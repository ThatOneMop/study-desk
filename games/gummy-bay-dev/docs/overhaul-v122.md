# Gummy Bay v122: fixed simulation steps and a walking gummy maker

v121 simplified residents, varied wall materials, darkened alleys, and kept v120 parcel handling. Its own notes left the WebGL preview unverified and did not open a new alley or roof pass. The milestone still described hired workers as timer automation, with spatial logistics unfinished. The 30-point tracker still asked for an uninterrupted first-sale loop and errands with reliable reach.

Checked against v121 before this pass:

- Simulation time was still one slice of at most 60 ms per rendered frame, so a slow frame froze movement, the clock, police and workers.
- The stockroom walk already existed, but a new or unconfigured gummy maker defaulted to the instant carried-stock timer. The walking route was an option.
- Shaping and packing still use the close-up bench attached to the camera.
- Customer deals, relationship memory and the delivery van are already in the v121 loop.
- Town collision is still the authored collider set, not a new match against the Blender town.
- Performance mode already hides the v121 cladding batch. This pass adds no meshes or textures.

## Implemented

- `sim-clock.mjs` steps the frame loop at 1/60 second. Thirty and 120 FPS runs of one real second emit the same steps. A frame longer than a quarter second simulates only that quarter second, then renders. Tab-away still drops the gap, because the existing visibility handler clears the frame timestamp.
- A gummy maker with no saved stock mode walks supplies to the worktable and finished packs to storage. The roster calls that mode "Walks the workshop". "Background timer" is the previous instant loop. Gardener and seller defaults stay carried timers.
- Version-3 saves load unchanged. `staffConfig` that already says `carried` or `stored` is kept. Only a missing or invalid stock mode for the gummy maker becomes the walking route. No save version bump.

## Limits

Plant timers still use the wall clock. A single direct call into movement or a worker tick still clamps itself at 60 ms; the frame loop no longer relies on that clamp. Below about 4 FPS the world still runs slower than real time, because catch-up stops at a quarter second per frame. This is not a rendered performance budget or a Blender collision pass.
