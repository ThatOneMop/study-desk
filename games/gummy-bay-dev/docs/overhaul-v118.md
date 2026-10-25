# Character art direction — v118

The user's requested direction is closer to Schedule I's stylised people. This pass changes Gummy Bay's existing original rigged models rather than importing characters from the reference game.

- Reshaped the skull into a longer oval with a broader, less pointed jaw.
- Strengthened the nose projection and flattened protruding cheek primitives.
- Reduced upper-arm, forearm, thigh and shin bulk in weighted rest space, preserving joint lengths, weights and animation topology.
- Lengthened the body through the pelvis hierarchy, compensating root height to keep the resting feet planted and counter-scaling head height so the face does not stretch with the body.
- Increased differences between five narrow, broad and long head/torso profiles.
- Added individual resting eyelid openness and brow offsets. Upper lids now close downward from the top of the eye rather than expanding from its centre. Talking opens the eyes slightly; full blinks still close fully and hide glints.
- Applied the same model pipeline to all NPCs and the co-op player, across high and low detail rigs. No first-person full body or avatar editor is claimed.

`evidence/v118-character-study.png` is a CPU projection of posed game geometry, not a screenshot or a faithful preview of game lighting. It was used to inspect silhouette differences and exposed face geometry. `evidence/v118-final-tests.json` records automated tests. Foot attachment, all six rig assets, blink synchronization, shared resources, LOD and actual-game regressions are included. Earlier art-bound fixtures were updated to the intentional new dimensions; foot-ground and finite-animation checks remain.

The character wardrobe and first-person hands remain as before. Actual WebGL appearance, movement quality and resemblance require gameplay review; the preview browser cannot create a WebGL context. This is not acceptance of the complete 160-point overhaul.
