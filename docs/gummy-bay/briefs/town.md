# Town and visuals

Original assets only. This is the look roadmap for Gummy Bay. The systems agent owns unlock state and the version number. The physics agent owns colliders. Character count and NPC models stay with the characters agent.

## This increment

- The opening frame is an exterior establishing shot, then the player steps onto the campsite instead of waking inside the solid RV shell.
- Sun, sky, fog and exposure take their hue from the day timeline. Morning intensity still peaks at noon. Afternoon light now holds through golden hour and reaches the night floor at 20:00, so 18:45 stays warm instead of dropping to the midnight sun. Street-lamp intensity and the two practical lights keep their existing budget.
- High adds bloom, a grade and a vignette. Low is the phone and software path: no composer, no shadows, a CSS vignette, and a shorter town draw distance.

## Ranked follow-ups

1. Time-of-day colour keyframes for sun, sky, fog and exposure.
2. Colour grade and vignette, with zone LUTs.
3. Bloom on emissives, signs, lamps and sirens.
4. Night lighting: few real pooled lights, decals beyond, flashlight.
5. Fitted, texel-snapped shadows. No shadows from small clutter.
6. World-space tiled textures and grime instead of flat colour.
7. Static batches per district chunk, with LOD.
8. Four presets, auto-detect, and graphics toggles.
9. Rain: streaks, wet roads, splashes, lightning, fog.
10. A small particle kit and stronger ambient occlusion on High.

Fog distance stays on the existing crisp-foreground plan so nearby streets do not disappear into night haze. Density changes that would pull that fog inside the play space are still open.
