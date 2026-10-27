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
