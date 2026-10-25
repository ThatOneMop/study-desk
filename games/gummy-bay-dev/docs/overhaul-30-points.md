# Gummy Bay: 30-point overhaul tracker — v25

The 30 reference observations are design goals, not 30 completed changes. First gate: a working game on the user's phone. v23 fixes the duplicate stationStatus import/declaration that prevented module startup, removes a duplicate hotkey handler, improves portrait layout, adds touch flavour cycling and a recoverable startup error screen. Retains v22 equipped items and idle activities.

| Point | Existing or delivered foundation | Next acceptance test / remaining work |
|---|---|---|
| 1 In-world business | Real inventory, workshop, deliveries | Play RV-to-first-sale uninterrupted on device |
| 2 Shared setting | Original coastal identity | Audit every street/material together |
| 3 Simple readable art | Existing Blender town plus simple scenery | Eye-height silhouette audit |
| 4 Coherent people | Rigged citizens; consistent high/low detail size | Rework faces/proportions in Blender |
| 5 Character identity | Named customers, colours, hair variants | More distinct clothing and original faces |
| 6 Recurring roles | Individual scheduled town visits and meeting priority | Render/playtest errands; work/home simulation still absent |
| 7 Everyday activities | Scheduled break props attached to animated hands | Verify visual hand contact |
| 8 Person-first dialogue | Compact lower customer panel | Phone/tablet/desktop rendered clearance |
| 9 Town depth | Distant instanced hills | Inspect skyline from starter and outer roads |
| 10 Connected roads | Existing network; kerbs and crossings | Walk every shop entrance and corner |
| 11 Landmarks | Shop signs, payphone, bus stops | Test unaided navigation with new players |
| 12 Vegetation | Revised crowns and grass variation | Check intersections, density and shadows |
| 13 Building depth | Retained imported architectural details | Remove observed duplicate/overlapping details |
| 14 Materials | Existing material palette and surface maps | Compare stock, metal, wood and glass in daylight |
| 15 Lighting | Existing day/night and settings | Render interior and exterior at matched times |
| 16 Activity-led interiors | Distinct supported shop shelves, workflow labels | Validate aisles and counter heights |
| 17 Physical stock | Inventory-derived workshop display and held packs | Confirm representative displays are understood |
| 18 Hands-on work | Existing task interactions preserved | Test complete production on touch and keyboard |
| 19 Varied work | Directional spreading, rightward wrapping, circular stirring, keyboard/touch assistance | Rendered gesture usability still unverified |
| 20 Useful upgrades | Press adds a timed sealing action plus steady-seal alternative; batch commit tested | Playtest upgrade pacing and touch timing |
| 21 Hotbar | Management shortcuts plus can/packs; touch cycling | Full equipment shortcut consistency and held scale |
| 22 Money | Wallet/card, transient changes | Match buy/deliver/transfer feedback to transactions |
| 23 Phone | Activity contact cards and deadline delivery board | Real-device one-handed usability test |
| 24 First-person presence | Retained tools; optional station focus | Inspect clipping and comfort in actual rendering |
| 25 Travel | Existing walking, vehicle, buses | Play errands with reliable collision and reach |
| 26 Growing responsibility | Staff and physical stockroom crafter | Live co-op interrupted logistics test |
| 27 Pressure | Existing enforcement | Tune fairness through gameplay, not guessed values |
| 28 Humour | Gramps and original customers | Add context-sensitive lines after reliable loops |
| 29 Technical coherence | v23 full module-graph linking; inventory tests | Browser/real-device regression before visual signoff |
| 30 Unified experience | Foundations connected in existing game | Full continuous playtest; broad overhaul remains open |

## Verification and correction
The screenshot's stationStatus failure was reproduced using Node's explicit ES-module parser. The previous boot harness removed imports and therefore hid this collision. v23 checks all 12 browser modules with imports intact through tests/module-link.cjs; this checks syntax and exports, not rendering. Existing boot harness still covers real GLB parsing and gameplay paths with mocked DOM/WebGL. Both now pass, including workshop status content.

Business, worker conservation/interruption, starter economy and save checks pass. The starting $400 and save key schema remain unchanged. No browser, screenshots, live multiplayer, measured frame times or Blender modelling were performed in this pass. New portrait layout must still be checked on device.

## Standing mission — 20 October 2026
The user's exact thirty observations are the governing design direction, not optional inspiration. Continue improving the existing Gummy Bay until each row has implemented behaviour and its acceptance evidence. An existing feature is not a completed overhaul. Code checks cannot sign off appearance, control feel, audio, performance or live co-op. Preserve original gummy/coastal identity, assets, saves, $400 start, story/free slots and Study Desk integration. Do not call a partial release the completed transformation.

## v25 evidence
Production uses distinct motions: horizontal spreading/soil levelling, rightward wrapper placement, and direction-changing stirring. The existing press upgrade now adds a forgiving timing window for sealing, with an explicit steady-seal alternative. Both paths retain the authoritative stock transaction. Integration checks cover misses, batch success, no duplicate commit, cancellation, and steady-seal completion. Existing tests now locate source relative to the checkout instead of requiring a vanished /workspace/sites/nightshift directory.

**Open acceptance gate:** this managed environment has no supported control-browser capability. The Sites workflow forbids substituting an improvised browser. No rendered visual, touch, audio, frame-time or live multiplayer signoff is claimed. Points 4–5 still need original character art refinement; the other remaining checks above remain open.
