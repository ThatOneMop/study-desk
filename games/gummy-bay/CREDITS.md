# Gummy Bay — third-party asset credits & licences

Only public-domain (CC0) or openly licensed third-party assets are used. No assets from Schedule I
or any other commercial game are included.

## Fonts
- **Nunito** — SIL Open Font License 1.1. Licence: `assets/fonts/OFL.txt`.

## 3D models (added v160)

### Rigged townsfolk — `assets/people/people-*.glb`
Author: **Quaternius** (https://quaternius.com). Licence: **CC0 1.0 Universal (public domain)**,
https://creativecommons.org/publicdomain/zero/1.0/ — as stated on each model page on poly.pizza.

| Game file | Source model page (poly.pizza) |
|---|---|
| people-man.glb | https://poly.pizza/m/fjHyMd5Wxw |
| people-woman.glb | https://poly.pizza/m/AQsd9ngvKU |
| people-suit.glb | https://poly.pizza/m/mQnGoME1ez |
| people-sleeves.glb | https://poly.pizza/m/DLptRuewTn |
| people-tank.glb | https://poly.pizza/m/XqzeZGB7iU |
| people-dress.glb | https://poly.pizza/m/zMyPlQXBzq |
| people-womancasual.glb | https://poly.pizza/m/jpKRgGDxhk |
| people-police.glb | recoloured copy of https://poly.pizza/m/DLptRuewTn |

Modifications (CC0 needs no attribution; credited anyway): material colours baked into vertex
colours and recoloured, primitives merged into one mesh, normals smoothed, unused animation clips
removed (kept: Idle, Walk, Run, Sit, Wave), clips renamed, geometry quantised
(KHR_mesh_quantization). In game the head bone is scaled up slightly for a chunkier look.

## City buildings (added v162)

### Kenney City Kit (Commercial) 2.1 — `assets/kenney/city-commercial.glb`
Author: **Kenney** (https://www.kenney.nl). Licence: **CC0 1.0 Universal (public domain)**,
https://creativecommons.org/publicdomain/zero/1.0/ — see `assets/kenney/License-city-kit-commercial.txt`
(the licence file shipped in the pack). Source: https://kenney.nl/assets/city-kit-commercial

Models used: building-a to building-n. Modifications: merged into one GLB that shares the pack's single colour atlas,
quantised (KHR_mesh_quantization). In game they are fitted to each city lot, tinted with soft
pastel wall colours and baked into a few merged meshes.

### Kenney City Kit (Suburban) 2.0 — `assets/kenney/city-suburban.glb`
Author: **Kenney** (https://www.kenney.nl). Licence: **CC0 1.0 Universal (public domain)** — see
`assets/kenney/License-city-kit-suburban.txt`. Source: https://kenney.nl/assets/city-kit-suburban

Models used: building-type-a to building-type-u (houses). Same modifications as above.

## Dodgy town dressing (added v163)
- The Blender town blocks are now dressed with the same Kenney City Kit pieces (CC0, credited above).
- Grime, rust and rain streaks, spray tags, roller shutters, posters, puddles, litter, AC units, fire escapes, bins, crates, alley lamps and rooftop shop signs are all generated in code (`dodgy-dressing.mjs`, `kenney-city.mjs` grime shader). No new third-party assets.

## World dressing (added v179)

Kenney CC0 models replace the box trees, box cars and box shop clutter. Each kind is one instanced mesh, with a shared sign atlas and a distance LOD. Licence files are the ones shipped in each pack.

- **Car Kit 3.1** — `assets/kenney/dressing-kit.glb` (hatchback, delivery van, tyre and plate litter). Author: **Kenney** (https://www.kenney.nl). Licence: **CC0**. See `assets/kenney/License-car-kit.txt`. Source: https://kenney.nl/assets/car-kit
- **Survival Kit 2.0** — trees, grass, crates and barrels in the same GLB. Licence: **CC0**. See `assets/kenney/License-survival-kit.txt`. Source: https://kenney.nl/assets/survival-kit
- **Fantasy Town Kit 2.0** — crooked trees and the market stall used as a shop awning. Licence: **CC0**. See `assets/kenney/License-fantasy-town-kit.txt`. Source: https://kenney.nl/assets/fantasy-town-kit
- **Food Kit 2.0** — apples and cans in the window displays. Licence: **CC0**. See `assets/kenney/License-food-kit.txt`. Source: https://kenney.nl/assets/food-kit

Modifications: meshes merged per prop, scaled to the street, vertex colours baked from each pack's colormap and shifted toward the town's tired, dark palette. Wheels stay part of the car.

## Narrower streets and varied blocks (added v164)
- Kerb build-outs, street clutter, asymmetric block columns and the window styles (blinds, curtains, boarded, dark) are generated in code. No new third-party assets.

## Controls and street conversations (added v165)
- Street talk (names, moods, replies), the conversation panel, reaction gestures and portraits are original code. Portraits are live snapshots of the existing CC0 townsfolk models (see the v160 entry); no new third-party assets.
