# Gummy Bay v24 — Familiar faces and delivery rounds

## Implemented in the existing game
- Five individual daily schedules use the existing motel, seed shop, hardware store, corner store, laundry and waterfront. These are visits/breaks, not simulated employment or home interiors.
- Agreed orders override ordinary routines and send customers toward their established meeting spots. Players may still meet them along the route through the existing delivery rules.
- Routes check actual colliders, never teleport on failure, retry blocked routes, and plan incrementally (at most 48 A* expansions per planning slice, one slice per update across the customer group). Existing save positions remain authoritative; no new save schema.
- Phone contacts show their activity/location and provide a Find in town action. In-person lines reflect their current errand and existing relationship score.
- Delivery board sorts commitments by deadline and displays the payout, remaining time, distance and available versus missing stock. Stock allocation in this display is read-only; it never reserves, consumes or pays again.
- Personal phone/cup meshes attach to the active animated Hand1 bone and transfer when character detail level changes. They appear only at the scheduled break destination, lower during nearby conversation and do not represent business inventory.
- v23 module startup repair, phone layout, touch flavour cycling, existing production, saves, multiplayer commands and graphics/comfort settings retained.

## Verification
- Browser module graph: 13 ES modules parse and link with imports intact.
- Real GLB / mocked DOM and WebGL boot checks pass.
- 20 consecutive scheduled route legs tested against the real starter-town collision geometry. Continuous customer movement reaches Palm Court without crossing a collider or exceeding its movement allowance.
- Schedule switching, agreed-meeting priority, blocked path handling, deadline order and nonduplicated read-only stock allocation tested.
- Hand parentage, character detail-level transfer and conversation prop hiding tested with loaded rigs.
- Business-core, physical worker conservation/interruption, first-sale economy, save handling and existing presentation helper checks pass.

These are source and isolated integration checks, not a browser playthrough. No actual browser frame-time claims, new screenshots, real-device touch test, live peer-to-peer session or Blender re-export. Original assets are retained. Bone attachment is verified; exact hand/prop orientation remains a visual acceptance item.

## 30-point tracker progress
Advances points 5–8 (recognisable people, routines, activity and conversations), 21–25 (information and delivery travel), and 29–30 (coherence and regression checks). It does not complete all 30 points. Character face/clothing art, larger interior redesigns, richer production gestures and the comprehensive town graphics pass remain open in overhaul-30-points.md.
