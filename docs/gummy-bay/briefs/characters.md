# Characters brief

Original models only. Do not copy, download, or rip Schedule I meshes, textures, or other assets.

The look to hit: chunky low-poly people, oversized heads, flat-shaded faces, blocky hands, flat colours, and enough variety that the town is not full of clones. Roles should read at a distance. Police wear mint uniforms and caps, runners wear hoodies, workers wear aprons or overalls, and a rival crew shares one colour.

## Proportions and faces

About 5.5 heads tall. The head is about 1.3 times the shoulder width, with short legs, a slightly chunky torso, and mitten hands. Flat shaded, and at most about 1.5k triangles per character at the near level of detail.

Faces are a 256 px canvas decal — eyes, brows, and mouth — on a smooth capsule skull with a tiny nose. Expressions: neutral, smile, frown, angry, shocked, sleepy, and high (red eyes), plus blinking. That replaces per-feature sphere meshes.

## Appearance, effects, animation

Parameters: genderBlend, height 0.9–1.1, weight 0–1, skin tone, eight or more hair meshes and colours, five facial hair styles, clothing tint layers, and accessories (cap, beanie, glasses, bandana, tie).

Gummy effects show on an NPC for a few in-game hours after a deal. Read the names from the systems agent's mix data when that lands. The set to support: Shiny Dome (bald), Chonky, Big Brain (head ×1.4), Taffy Neck, Hot Head (fire particles), Neon glow, Fun Size (×0.6), Headlights (eye spotlights), Carrot Top, and Sour Skin (green). Expose `applyEffect(npc, effect)` for the systems agent.

Animation: a stiff walk and run, idle sway, phone-to-ear, sit, lean, a hand-off, and a knockout topple. Render each NPC head once to a cached 128 px mugshot for the phone apps.

## This increment

The first playable slice is the instanced chunky cast (residents and the player mitten) plus a 32-person street crowd. The crowd keeps a readable face inside 40 m and a shorter silhouette past that, on one shared box batch. Daytime plans put people at work, on the sidewalk, on benches, at ATMs, and at vending machines. At night they sit at home. Saves and the existing resident rig stay untouched.
