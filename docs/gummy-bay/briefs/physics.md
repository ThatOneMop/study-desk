# Gummy Bay physics

This is the movement slice aimed at a Schedule I-like feel in the browser. Exact Schedule I speeds are not published; the numbers below are the tuning targets. The authored standing eye stays **1.72 m** so the RV, tents, and v3 saves keep their existing headroom. A 1.62 m eye would drop the camera through those contracts.

## Shipped in this increment

1. Vertical motion. Gravity is 16 while rising and 20 while falling, with a terminal speed of -30. Drops deeper than 0.4 m become a fall instead of a teleport. Steps up to 0.35 m are allowed. Slopes steeper than 45° over a half-metre sample slide back at 4 m/s². Landing adds a dip of `-0.06 * impact / 8` that recovers at k=10 and settles to exactly 0, so a finished jump leaves the camera on the eye.
2. Speed. Walk 3.6, sprint 6.2, crouch 1.8. Backpedal is ×0.8 and strafe is ×0.95. Acceleration uses k=14, stopping k=18, and air control k=3 without gaining speed past takeoff. A 1 m jump launches at about 5.66 m/s. Releasing jump early multiplies upward speed by 0.55. Coyote time is 0.10 s after stepping off a ledge past the 0.4 m snap. A press during the last millimetres of a jump stays in the 0.12 s buffer and fires once on landing, without a second hop while the key is held. Stamina drains at 10/s, waits 1 s, then regenerates at 15/s. A jump costs 5.
3. Collision. Movement is a capsule slide of up to 3 iterations on the existing sweep, with an 0.02 skin. Static boxes are queried through an 8 m spatial hash. Town shells from the Blender glTF still fill gaps the authored footprints miss.
4. Camera. Base field of view is 75, sprint adds 5 with easing k=6, and the settings slider runs from 60 to 100. Look sensitivity defaults to 0.0022 rad/px (slider 0.0005–0.008). Pitch clamps at ±88°. Head bob is 70% of a 0.035 m stride by default, with its own slider, and is absent in the air.
5. Spawns. Loading a save or importing one, and any teleport that resets the view, checks `blocked()`. A point inside geometry — including the payphone at (-47, 28.6) — is moved to the nearest open cell within 6 m and the corrected spot is what gets saved. The manual recover control still prefers the last safe position.

Simulation stays on a fixed 1/60 s step. A one-second frame, which is what headless Chromium often produces, is caught up as 60 slices instead of one long move, so the body cannot tunnel a padded wall. The shared stepper helper still defaults to a 0.25 s hitch cap for its own tests; the game opts into a 1 s cap.

## Still ahead

Rapier (lazy, vehicles and props only, arcade van as the fallback), the hover skateboard, vehicle suspension and chase camera, carry-and-throw weights, NPC knockouts, and swinging doors. Player and NPC bodies stay on this capsule either way.

## Effect hooks for a later systems pass

Athletic ×1.30 speed, Energizing ×1.15, Sneaky ×0.95 speed and ×0.60 visibility, Anti-Gravity for a higher jump and slower fall, Slippery for low friction, Disorienting for inverted input. Not wired into products yet.
