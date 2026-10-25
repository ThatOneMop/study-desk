# Reference research and implementation evidence — v18
Research date: 19 October 2026. This is a focused production-presentation milestone, not a completed town overhaul.

## Evidence and limits
- TVGS official press kit, undated, retrieved 19 October: https://www.scheduleonegame.com/presskit/schedule-one/index.html . Confirms the production/distribution/property/employee progression and co-op product scope; credits Tyler for design, programming and art. These are product claims, not documentation of networking internals.
- Unity, Michael Saver, 1 April 2025: https://unity.com/blog/games-made-with-unity-march-2025-releases . Includes Schedule I among Unity releases. Confirms engine, not render pipeline or optimisation techniques.
- Official v0.4.6 announcement: https://store.steampowered.com/news/app/3164500/view/684135019607754378 . Title confirms an optimisation/gamepad update. Article body was not retrievable; no detailed performance claims taken from it.
- Official gameplay trailer linked by the press kit: https://www.youtube.com/watch?v=GUPZ2xMey6Q . Retrieval throttled; not watched.
- Developer interview: https://www.youtube.com/watch?v=BLE3OrzZcHM . Indexed chapters identify workflow (05:16), refactoring (15:59), art (22:49), audio (24:13), map layout (35:11) and vehicle AI (31:47). Chapter metadata was inspected; interview content was not accessible and is not treated as evidence of implementation details.
- Independent developer-stream replay: https://www.youtube.com/watch?v=K6JiiWhFkJM (4 May 2025 replay per description). Located, not watched. No technical claims derived from the title.
- User-supplied screen recording: inspected an extracted contact sheet, not continuous playback or audio. Visible examples show a small hotbar, strong pavement boundaries, shelved containers, readable workstations, a phone overlay and late-game equipment with visible contents. Still samples do not establish responsiveness or animation quality.

A focused second search sought primary evidence for Blender/texturing and optimisation. An unofficial mirror attributes Blender/Photoshop/Substance to a developer post, but the original could not be verified. Model workflow, exact rendering pipeline, multiplayer transport, navigation architecture and optimisation implementation therefore remain unconfirmed. Gummy Bay stays in its existing Three.js engine; no Unity port or copied assets.

## Observed code issues and completion checks
| Priority | Observed problem | Change | Completion check | Result |
|---|---|---|---|---|
| 1 | Sealer shown without ownership | Group sealer components and gate by packStation | Unowned false, owned true | Passed isolated scene test |
| 1 | Generic old visuals overlap new task rig | Suppress old piece/wrapper/tool in final renderer for replaced tasks | Source order and syntax check | Checked; browser unverified |
| 2 | Packaging only moved a generic cube | Original wrapper, product transfer, closing flaps, seal bar, band | Stage progression, cancellation, stable resources | Passed isolated scene test |
| 2 | Mixing final step targets bowl | Separate mould, fill levels and bowl-to-tray stream | Correct target stage, finite transforms and half-fill | Passed isolated scene test |
| 2 | All close-up gummies use one colour | Apply selected product colour to contents and moulds | Green product stays green | Passed isolated scene test |
| 2 | Workshop availability is buried in menus | Read-only shape/package/delivery status | Supplies and reservations project accurately | Passed isolated test |
| 3 | Green ambient bounce affects neutral interiors | Neutral ground bounce and slightly higher ambient floor | Final lighting wrapper updated | Source only |

Existing kerbs, gutters, window reveals, Blender buildings and rigs are retained. A proposed additional façade layer was removed after discovering it would duplicate existing geometry. No map expansion, collision change or save schema change.

## Verification
Node scene tests construct meshes without WebGL; they are not screenshots or gameplay tests. Tested ownership, mould fill, packaging stages, cancellation visibility, finite transforms, colour and resource identity through 300 updates. Business-core tests cover atomic batches, missing supplies, reservations, invalid saves, older array lengths and backup failure. Base route test simulates growth and verifies purchase economics, sale, duplicate delivery and press upgrade; it is not a full runtime playthrough.

Browser access unavailable under the supported Sites workflow. Rendered quality, collision feel, actual audio, live PPP, fullscreen, pointer lock, multiplayer and FPS remain unverified. No before/after images fabricated. Worker logistics remain timer based. Full first-sale visual audit and broader art treatment remain next work.
