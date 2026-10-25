# Gummy Bay — interaction and character-motion corrections

This pass follows the user's priorities: characters, movement and interaction feel rather than extra vehicles or economy systems.

## Changes

- Interaction prompts now score reachable objects by view direction and distance. Objects behind the player are excluded except directly underfoot. A small focus-retention margin limits flicker between neighbouring targets; deliberate turns still retarget. E rechecks view direction and range so a stale prompt cannot open an object after turning away. Existing line-of-sight, reach, ownership and host transaction guards remain separate.
- The work-target floor ring uses actual terrain/floor height instead of a fixed world height, preventing it from being buried on slopes or elevated work areas.
- Fresh jump presses are remembered for 120 ms through a landing. Holding Space cannot repeatedly jump. Crouching/work restrictions, menus and input-loss/reset clear the queue. Existing jump height, gravity and headroom checks remain in use.
- Character gait scaling uses model height instead of body width. Horizontal travel determines walking speed, avoiding vertical terrain corrections being interpreted as steps. Speed smoothing uses an exponential response and large repositioning resets gait speed.
- Occupational accessories use the active rig's animated Head transform. They follow head movement and switch correctly with high/low detail bodies. Culled residents no longer leave their work hats floating independently. Fallback characters without a rig retain the original placement.
- Corrected the outdated hover-to-look hint to describe drag-to-look and aiming at interactions.

## Evidence and limits

`docs/evidence/v117-final-tests.json` contains exact test commands and results. New checks cover focus retention/retargeting, reach and stale target rejection, jump buffering/nonrepeat, actual character gait scaling, hat animation matrices, high/low LOD switching and culling. Existing saves, inventory, progression, collision, co-op and rendering-resource tests remain in the suite.

This is source/CPU/mocked-game verification. No claim is made that the graphics or handling are aesthetically accepted. WebGL remains unavailable in the preview browser, and real laptop gameplay footage is still needed. This does not complete all 160 points or add new slope/ledge physics.
