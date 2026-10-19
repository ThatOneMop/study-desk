# Validation — 2026-10-19

Passed:
- Exactly 100 unique catalogue IDs: 99 bundled, 1 official external link.
- All 99 bundled route files and 680 HTML asset references resolve locally; each bundled entry includes the early keyboard bridge. Underleaf's missing bridge was found and fixed.
- Syntax checks for shell, catalogue, bridge and all 82 microgame main.js files.
- jsdom DOM tests: study-first default, PPP in both directions, typing exclusion, search, favourite persistence, deck/card creation, card editing, deck deletion and mastered progress.
- jsdom bridge tests: held movement-key release, paused timers, frozen clock, timer resume without a large elapsed-time jump.
- Freedoom WAD header/directory boundaries and WebAssembly magic header validated.
- Source inspection confirms Little Lake procedural counts and Gummy Bay v12 exported assets/save-key compatibility.

Not tested in a real browser:
- Loading and basic gameplay controls for each game, graphical rendering, mobile layout and performance.
- Actual audio output/suspension, fullscreen/pointer-lock exit, keyboard delivery during WebGL play, native pause interactions and game-specific simulation recovery.
- Network multiplayer, external services, PolyTrack gameplay, GitHub Pages deployment.

Reason: this managed environment has no supported browser-control integration. Tests used jsdom and static source/file inspection, not a real browser. This report deliberately does not claim all games are runtime-tested.

Before relying on the site, serve over HTTP and smoke-test each game. For a playing game, hold movement, trigger PPP, wait, resume and check movement is released; repeat with audio, fullscreen and pointer lock enabled. Verify sound stops in study and no simulation jump occurs. Check on the final Pages domain because saves and permissions are origin-specific.
