# Gummy Bay graphics v11

## Art direction and references
Original coastal-town assets. Reference: TVGS official Schedule I Steam store screenshots and developer description, https://store.steampowered.com/app/3164500/Schedule_I/ . Reviewed character/street screenshots via image search; store embedded gameplay videos could not be retrieved. No game assets copied.

Art decisions: large readable heads, shaped torsos, restrained earth colours, matte clothing/walls, selective metal/glass reflections, roof and facade depth, room-scale interior trim. Keep the existing layout, saves and gameplay.

## Delivered
- Three Blender citizen variants, 14-bone armature, seven exported action clips: Idle, Walk, Run, Talk, Work, Search, Surrender. Blink morph. Four material batches and 15,756 triangles per actor. Palette varies per NPC. Original art remains on load failure.
- Clips connected to displacement, conversations, merchant work gestures, officer searches and remote-player surrender. Locomotion playback speed follows measured displacement; animation crossfades are 0.18 seconds. No claim of verified foot locking.
- Blender RV shell/interior with existing open doorway, bunks and cabinets. Existing RV collider footprint retained.
- Architectural additions on the original street and expanded districts: door casings, piers, gutters, roof forms, canopies and plinths. Rental-room floorboards, headboard, bedding seams, interior skirting, crown moulding, ceilings and radiators.
- Environment exported in 70 groups, 210 material meshes, 126,340 triangles. Material colours converted to linear space; outward normals recalculated. Explicit surface UVs and baked vertex colours.
- Blender tent, mixer and payphone. Tent replacement preserves crop objects, installation visibility, saved positions and rotations. Mixer visibility still follows ownership and property.
- Actor and building distance culling. Balanced remains default; Performance and High retain separate render settings. Existing sky, water, nearby shadow system and bounded interior lights retained. Daylight intensity reduced to complement the corrected material colours.
- Editable .blend sources, generation scripts and glTF integration checks retained under art/v11.

## Verification
- JavaScript syntax passes.
- Real GLTFLoader parses all assets; all character instances receive independent skeletons. Clip bounds finite and within expected character scale.
- Real exported assets loaded into the game logic harness. Environment, characters and equipment install successfully. Crops remain attached. Existing collider/interaction data unchanged.
- Regression suite: $400 starter path and $50 remaining, production and first sale, customer negotiations, upgrades, automation, migration, isolated saves, co-op save protection, police, storage, movement, equipment relocation, shop access, shuttle arrivals and exact 10x world bounds pass.
- Blender renders inspected. These are asset checks, not browser gameplay screenshots.

Commands:
node art/v11/check-assets.mjs
node art/v11/test-integration.cjs

## Blocked and unfinished
- The managed Sites environment has no required control-browser skill. Its workflow forbids improvising another preview/browser route. Therefore matching before/after gameplay captures, visual clipping review, actual frame rate and Intel-laptop performance are unverified.
- Full animation polish, inverse-kinematic foot locking, facial speech animation, additional body/outfit diversity, mesh LODs, every vehicle/vegetation asset remodel and consistent commercial-level finish remain unfinished.
- Browser and two-device multiplayer visual verification remain outstanding. Gameplay tests use a stub renderer and do not prove graphics quality.
- This is a substantial asset/integration update, not a completed near-commercial recreation.
