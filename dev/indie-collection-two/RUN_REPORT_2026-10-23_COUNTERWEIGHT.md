# Second collection — Counterweight completed

**2/20 playable · 2/20 improved · 2/20 finished · 0 selected · 0 integrated · 0 verified live.** Exactly twenty new slots remain in the ledger, overall 21–40. Eighteen remain concepts, not counted games. The completed first twenty and separate Nightshift ten are excluded.

## Counterweight, slot 22

Operate a harbour crane by hand: hook cargo at the central supply dock, raise it, balance its weight against shifting ballast, move it to a marked berth, lower and release. Sideways movement creates cable swing; hoist and ballast adjustments damp it. Fragile lanterns need a motionless release. Supporting crates carry the combined weight above them, so mixed towers require planning. Wind changes the balance equation. Three overloads halt the crane, with free undo for recovery.

Five authored jobs progress from two simple deliveries through heavy frames, long reaches, mixed-support towers and a six-load windy finale. Best medals and move records persist independently of the current attempt. The compact campaign rewards clean deliveries and efficient moves; it does not claim substantial hours of content or continuous physical simulation.

Original pixel-art scenery includes the working gantry, moving counterweight, crane cabin, distinctive cargo sprites, harbour buildings, lanterns and animated water. Reduced-motion settings stop the water animation. No third-party assets or game collection was imported.

## Initial implementation and meaningful improvement

- Initial implementation: [`922d502`](https://github.com/ThatOneMop/study-desk/commit/922d502a8e59c5df7637e008e10802f7f2faea26).
- Improved final gameplay: [`a7f2564`](https://github.com/ThatOneMop/study-desk/commit/a7f25641eb9a7957a35d580c3d905066234a32ee).
- [Development source](https://github.com/ThatOneMop/study-desk/tree/indie-collection-two-dev/games/counterweight).

The improvement corrects the original ballast-control direction so physical weight moves with the indicated arrows, opposite the cargo being counterbalanced. Initial v1 save routes migrate by reversing ballast commands; resulting cargo routes, move counts and medals remain unchanged. The isolated `study-desk-counterweight-v1` storage key remains, with version 2 data inside it.

Every control now previews the exact resulting balance and swing, with explicit overload/damage warnings and detailed hover/focus descriptions. A landing strip states the current load, target bay heights, support problems and safe swing. A compact scene/header/control layout followed visual inspection of the first version, where the controls sat too far below the crane.

## Verification

[Exact-source CI 39930163890](https://github.com/ThatOneMop/study-desk/actions/runs/39930163890) fully passed on `a7f2564`:

- Counterweight: **23 engine tests + 17 DOM/save/input tests**.
- Reefwright: all **21 engine + 19 DOM/save tests**, unchanged.
- Counterweight's five jobs completed on Chromium desktop (1280×1000) and touch emulation (390×844), all with three medals. Each action's outcome matched its displayed forecast. Midgame reload was checked on every job.
- Browser checks also covered overload failure/undo, keyboard control, restart/cancel, campaign progression, corrupt-save replacement with another key preserved, launch/return navigation and zero uncaught browser errors.
- Both full Reefwright desktop/touch five-coast campaigns passed unchanged.
- [Screenshot artifact 12491785522](https://github.com/ThatOneMop/study-desk/actions/runs/39930163890/artifacts/12491785522): **36 images**, comprising 22 Counterweight and 14 Reefwright captures. Representative Counterweight desktop completion and phone midgame images were visually inspected. The first Counterweight job was also completed through cloud-browser UI controls.
- Public routes/assets, nine first-batch selected-source hashes, exact twenty-slot ledger gate and syntax checks passed. Local shell, pointer bridge and relaxed-collection checks also passed.

| Job | Verified clean route | Three-medal move target |
| --- | ---: | ---: |
| First light | 17 | 22 |
| Heavy company | 38 | 48 |
| The long reach | 46 | 58 |
| Fragile skyline | 51 | 65 |
| Last boat home | 63 | 80 |

The deterministic solver finds shortest clean routes per delivery for fixed authored destination plans; these are not claims of globally optimal campaign play. Fixtures were regenerated because the ballast control direction intentionally changed, with all five route lengths and medal results preserved. Engine tests compare every available control forecast throughout all reference routes, not only the successful chosen actions.

## Assessment and selection

Agent design review (1–5, not player survey scores): enjoyment **3.5**, depth **3.5**, polish **3.5**, reliability **4.5**, variety **4.5**. The strongest feature is combining balance planning with swing damping and cumulative stack loads. Pixel scenery and anticipatory feedback make the rules legible. Limits: five fixed jobs, discrete movement, no sound, no physical-device verification and no full screen-reader audit.

Counterweight and Reefwright remain finished candidates for wider comparison. Neither is automatically selected. Their crane balancing and spatial reef restoration loops are distinct from each other, the first collection and Nightshift games.

## Preservation and publishing

Only second-batch source, tests, workflow and records changed on `indie-collection-two-dev`. First-batch sources, save keys, catalogue entries and tests are unchanged. No public-main write occurred. Current main `ed2cf603aa47fc26e4f04216d5704351b72a32a9` includes concurrent private-messaging and movie/TV work, preserved for future integration.

[Latest public release 39925660833](https://github.com/ThatOneMop/study-desk/actions/runs/39925660833) passed route/assets and failed at **Configure GitHub Pages**. Prepare, upload and deployment were skipped. No new live game link is claimed. Earlier Pages logs identified integration access as the blocker. This does not prevent further development.

Two inherited launcher tests still reference the removed `playerStudy` control; their source and the public shell were not changed in this run. The maintained relaxed-collection, shell and bridge checks pass. See the first increment report for the inherited failure evidence.

## Next work

Build and evaluate Lanternwake, slot 23, around temporary beacons that reveal sailing routes and attract moth swarms. Keep it distinct from Tidepost logistics and Echo Vault stealth. Eighteen concepts remain to implement, improve and test. Later runs must compare the full slate, integrate selected winners into fresh main and verify deployment if Pages access becomes available. The batch remains incomplete and active.
