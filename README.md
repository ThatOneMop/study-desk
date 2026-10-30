# Study Desk — 52 games

The curated catalogue has 52 games: 51 bundled entries and the external Nightshift — Town Empire link. The 20 short Nightshift/Afterlight minigames have been removed from browsing; their source and saves remain intact. See `docs/curation-2026-10-29.md` for the selection and six gameplay upgrades.

## Upload to GitHub Pages

Create a dedicated repository such as `study-desk`. Extract this archive and upload its contents with index.html at the repository root. Do not upload the ZIP as the website. The included `.github/workflows/pages.yml` publishes this static site with GitHub Actions. It does not create the Pages site: in Settings → Pages, set Source to GitHub Actions first. Until that setting is on, the workflow cannot deploy. After it is on, a push to main runs the asset checks and publishes. Paths support repository subfolders. No build or backend is needed for solo games. GitHub's web uploader has individual-file limits, so use GitHub Desktop or git to commit the complete folder if web upload rejects a large file. Do not omit the source archives.

This delivery was not published: the connected GitHub integration did not expose dedicated repository creation or Pages configuration. No unrelated existing repository was modified. Use the URL GitHub displays after deployment; no live URL has been verified.

For local use, run `python -m http.server 8000` in this folder and visit http://localhost:8000. Double-clicking index.html is not supported for games requiring fetch or modules.

## Flashcards

Study opens first. Create, edit and delete cards and decks in Create cards. Flip, shuffle, navigate, and mark mastered or review again. Export/import JSON backups; old array exports and new version-2 exports are supported. Imports append without overwriting cards. Empty decks are retained. Storage failures show a warning; keep an export before closing the tab. Original study-desk-v1 card storage is preserved.

Monday pick chooses one bundled game for the calendar week, starting each Monday, on the study page and the game collection. Export all saves downloads every local save on this origin as `study-desk-saves.json`. Import all saves lists each key that will change, replaces only those keys after confirmation, then reloads. Identical keys are left alone. Keys missing from the file stay. Card export still downloads the open flashcard collection, including temporary edits. The all-saves file contains stored values only.

The game collection is a storefront on this device: a featured carousel led by Gummy Bay, then continue playing, the Monday pick, games opened most often here, six freshly improved games, genres, and favourites. Search and the collection filters narrow that same catalogue. Random game, sound, and the light or dark theme stay in this browser. Study remains its own section.

## Switching

Press P three times within one second, to move between study and games. The games screens have no workspace-switch buttons. Text fields, held-key repeats and modifier shortcuts are excluded. Plain P is reserved inside bundled games to avoid triggering their native P actions during the sequence; use the toolbar Pause button or in-game menu instead.

The current iframe stays loaded when switching to study or the collection. Opening a different game unloads the previous one, so use that game's save feature first. The bridge pauses animation frames, timers and tracked audio, releases held keys, requests exit from pointer lock/fullscreen, and freezes its simulation clock to prevent a large resume jump. Some games may additionally open their own pause menu after losing focus. Browser audio autoplay rules can require a click to resume sound. Workers, networking and third-party simulation clocks are not guaranteed to pause; this is not a multiplayer suspension system.

Lucky Company's optional original online-site link opens separately. Return to the Study Desk tab manually. 51 catalogue games are bundled and include the Study Desk bridge. Nightshift — Town Empire stays an external link. Real-browser fullscreen, pointer-lock and audio behaviour still varies by game and device.

## Recovered versions and implemented features

- Gummy Bay: playable build is v125 in games/gummy-bay/ (a Day 1 starter sale, a 21:00–05:00 curfew, and effect mixing on the bench). Blender sources, tests and version notes are in games/gummy-bay-dev/ and are excluded from the Pages upload. SOURCE_VERSIONS.json index 5 still records the older recovered commit 8463637b06e8a5796696998219a7684a5e69e2a0. Original gummybay-v3 mode/slot save keys are retained.
- Little Lake: Sites v2, source 76a7e268536bc28b2598c54c04a5521dd638604b. Code actually implements 7,000 generated species and 8,000,000 generated area indices. These are procedural combinations, not millions of hand-built scenes. littleLakeV1 saves retained.
- Autumn Drift: recovered v2 implements individual leaf collection, 5,000 generated areas and 20,000 upgrade ranks.
- Underleaf: recovered Sites v2 colony game.
- Lost & Found and Lost & Found on the Moon: both distinct recovered v1 games retained.
- Tiny Wilds: recovered v2, fishing and ant colony modes.
- After Hours: saved 50-joker poker roguelike, matching the recovered ThatOneMop/Balatro source commit bfbffaa (2026-10-16).
- Lucky Company 3D: downloadable solo build retained. Its newer online/server project is not misrepresented as statically hosted multiplayer.
- Forge Arena: recovered v26.2 download; internal title still says V26.1. Existing online dependencies retained, internet required.

SOURCE_VERSIONS.json records recovered source commits; its indices 0–7 map to Lost & Found, Little Lake, Moon, Underleaf, Autumn Drift, Gummy Bay, Lucky Company and Tiny Wilds. Builds checked 2026-10-19. Requested features are counted as completed only when present in recovered source, not merely mentioned in chats. No other completed distinct games were recovered.

## Selected indie collection

Tidepost, Deep Pocket, Queen of Cinders, Little Foundry, Scrap Orbit, Inkline, Pocket Expedition, Echo Vault and Glasshouse were developed as original candidates, improved, completed through agent-driven campaigns and selected for their distinct loops, requested-taste fit and test evidence. Each is a compact authored game rather than a content-hours promise. Their durable development evidence remains on the `indie-collection-dev` branch.

## Archived community additions and licences

The files and licence records for 2048, Hextris, Astray, Radius Raid, Chrome-style Dino, Pac-Man and 82 ABA Games microgames remain preserved, but those entries are retired from the active catalogue. `docs/retired-catalog-2026-10-20.json` retains their metadata. Forge Arena remains active and requires its existing online dependencies.

Read credits.html. Preserve copyright notices, licences and source files when publishing. Hextris GPL corresponding source is in hextris-source.zip. JavaScript games retain source directly. Microgame runtime package archives retain upstream dependency source and licence notices.

## Saves and domain changes

Existing game keys/formats are unchanged. All bundled games share this site's origin, as before. Browser local storage is tied to protocol and hostname, so saves on original Sites URLs do not automatically transfer to GitHub Pages. Changing only a repository path on the same username.github.io origin does not isolate or migrate storage. Use Export all saves to carry every stored key to another browser on a file, or the original game's export/import where available (Gummy Bay supports this), and flashcard exports. Games without export support require manual storage transfer; this package does not claim universal save migration. Never overwrite a populated destination save without a backup. Some games do not provide persistent progress at all.

## Verification

See TEST_REPORT.md. Automated DOM/bridge and static checks passed; no real browser was available for this build. Do not treat static validation as gameplay certification.


## Lane Eight

Lane Eight is bundled at `games/lane-eight/index.html`: manage training load, earn places at six fictional clubs, plan meets and control every race with chase/overhead cameras. Career progression continues into retirement and squad coaching. Use Export career / Import career to move a save from the standalone site. Save keys remain compatible. See `docs/lane-eight.md` for implementation and verification evidence.


## Third collection

Stencil Studio is the first selected third-collection game: three compact printmaking commissions with colour mixing, selective ink repair, preview guidance and saved records. Moon Dial adds three coupled clockworks with turn rehearsal. Pebble Rink adds three tabletop curling rinks with optional collision forecasts, replay and saved club cards. The remaining candidates stay on indie-collection-three-dev until individually qualified. No content-duration claim.


