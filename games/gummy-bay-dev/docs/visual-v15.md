# v15 — original workshop and shopfront geometry
Base: v14 (0afe8a2210de86f38e8c4c274bce244d548b7001).

Implemented actual Three.js geometry: metal worktop and legs within existing furniture footprint; 12-recess mould tray; compact bag sealer, animated lever and supply indicator; sign backboards/supports; entrance fixtures and rooftop ventilation details; first-person mixing bowl, contents, paddle and ingredient container. Shared material palette separates painted metal, metal, wood and glossy contents. Existing Blender environment, citizen rigs and clips retained. Shelf packs aligned into four columns to eliminate previous overlap. Menu backdrop blur removed and HUD made more compact.

Animation updates run immediately before the base renderer, after previous animation layers, avoiding overwrite. Extras are hidden in Performance mode. Decorative geometry adds no colliders or inventory behaviour. Save schema, economy, multiplayer and story are unchanged.

Verified: JS/module syntax; Three.js construction of new mesh geometry and finite positions; task/workshop/quality visibility transitions; existing pure state tests; base-action economy simulation. None of these checks is a rendered gameplay test.

Unavailable: supported browser control. No preview server or replacement browser was installed. Consequently no genuine before/after screenshots, visual comparison, GPU profiling, full route/collision test, save round trip, multiplayer or PPP/audio/fullscreen test was performed.

Remaining: broader town/character art audit, measured lighting adjustments, final visual placement and clipping QA, physical worker logistics. Study Desk bundle remains on its prior version pending separate collection update. This focused visual pass is not completion of the entire requested overhaul.
