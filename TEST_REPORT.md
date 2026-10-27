# Validation — 22 October 2026

## Active Study Desk catalogue

Passed:

- Exactly 19 unique active catalogue IDs, all bundled: 10 recovered games and 9 selected original indie games.
- All 19 launch routes and 55 referenced HTML assets resolve locally; every route includes the Study Desk bridge.
- Shell syntax, catalogue equality, dynamic counts, group filters, search, favourites, study/card editing and PPP switching pass in jsdom.
- All 19 catalogue cards launch the expected iframe route and pass pause/resume plus return-to-study navigation in jsdom. This checks launcher wiring, not rendered game engines.
- Retired favourites, recent IDs and saved data remain preserved; the archived third-party catalogue is not silently restored.

## Selected indie games

Tidepost, Deep Pocket, Queen of Cinders, Little Foundry, Scrap Orbit, Inkline, Pocket Expedition, Echo Vault and Glasshouse pass the release integrity gate:

- The published engine, game and stylesheet hashes exactly match the finished development candidates.
- Each game has one working catalogue-return link, one Study Desk bridge, a credits entry and no development-only or not-selected release copy.
- All nine engine suites and all nine DOM/save suites pass against those exact logic files: complete campaigns, progression or win/loss states, save/reload, restart, undo where supported, keyboard/touch-emulated controls and invalid/concurrent storage protection.
- Prior exact-source Chromium campaign evidence is recorded on the development branch. The release-only HTML wording and relative navigation changes were not rendered in a local Chromium runtime during this integration run.

## Still not claimed

- Physical touch hardware, full screen-reader output, independent human enjoyment testing or a content-hours guarantee.
- Audible output, fullscreen/pointer-lock behaviour and performance on every device.
- GitHub Pages deployment until the `main` workflow completes successfully and the live routes are checked.

Serve the repository over HTTP for local manual testing. Browser storage is origin-specific; existing development saves do not automatically migrate to the published paths.
