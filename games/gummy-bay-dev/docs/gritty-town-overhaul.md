# Gritty town graphics revision

This revision responds to the requested smaller building signs, darker streets, terrain, litter, police, rounded people and device/UI changes. It follows the existing 30-point work without declaring that entire ledger visually accepted.

## Five change groups

1. Shop signs: reduce large fascia widths to at most 6.2 metres, reduce static sign heights, narrow the backing plates, shrink shop logo panels, and replace the common heavy frame with weathered enamel colours and slimmer typography. Existing shop identities and dynamic stock text remain functional.
2. Streets and atmosphere: world-space grain, cracks and seams on asphalt, concrete and earth; worn asphalt patches; roadside paper, cans and bottles; darker lighting and exposure. Decorative debris uses shared instanced batches and does not add pickup items or collision.
3. Terrain and scenery: two walkable grassy hills at (-190,-64) and (190,-64), 2.8 and 3.4 metres high, a winding west-edge river with raised banks, and a northern ridge. Player support, residents and vans follow hill elevation. The river and northern ridge are scenery outside the playable boundary, not a new explorable river district.
4. Residents and police: replace angular skull surfaces on all six high/low citizen assets with smoothly rounded geometry while retaining rig and facial data; smooth the procedural hair; add caps, beanies and bucket hats to eligible residents. Preserve job-specific headwear. Increase patrol routes from six to ten, appending four officers to existing host saves without resetting the original six. Guests wait for authoritative host state.
5. Phone and street hardware: charcoal/olive HUD and hotbar treatment, a six-app phone home screen with live cash/order summaries, a home button across phone screens, and a payphone hood, shelf, coin slot and coiled handset cord.

## Verification and limits

The 94-file Node suite covers the real GLB geometry, skin weights/morph consistency, unchanged animation clips, hill support, river boundaries, litter transforms, existing-save police migration, six phone app actions, and existing economy/co-op interactions. The boot fixture loads actual assets with mocked DOM/WebGL/networking. Module linking is also checked.

A rendered WebGL playtest is unavailable in this environment (the supported browser cannot create a WebGL context). These checks therefore establish source/CPU behavior, not rendered appearance, GPU performance, clothing fit or visual similarity to Schedule I. No external game assets are copied.
