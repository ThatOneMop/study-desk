# Study Desk / After Class — 19 curated games

19 active catalogue entries: 10 recovered user-created games plus 9 selected original indie collection games. Tiny Wilds' fishing and ant colony modes count as one game. The previously imported community collection remains archived and is not silently restored to the active catalogue.

## Upload to GitHub Pages

Create a dedicated repository such as `study-desk`. Extract this archive and upload its contents with index.html at the repository root. Do not upload the ZIP as the website. Settings → Pages → Deploy from a branch → main → / (root) → Save. Alternatively use the included .github/workflows/pages.yml and select GitHub Actions as Pages source. Paths support repository subfolders. No build or backend is needed for solo games. GitHub's web uploader has individual-file limits: freedoom1.wad is approximately 28 MB, so use GitHub Desktop or git to commit the complete folder if web upload rejects it. Do not omit the WAD or source archives.

This delivery was not published: the connected GitHub integration did not expose dedicated repository creation or Pages configuration. No unrelated existing repository was modified. Use the URL GitHub displays after deployment; no live URL has been verified.

For local use, run `python -m http.server 8000` in this folder and visit http://localhost:8000. Double-clicking index.html is not supported for games requiring fetch or modules.

## Flashcards

Study opens first. Create, edit and delete cards and decks in Create cards. Flip, shuffle, navigate, and mark mastered or review again. Export/import JSON backups; old array exports and new version-2 exports are supported. Imports append without overwriting cards. Empty decks are retained. Storage failures show a warning; keep an export before closing the tab. Original study-desk-v1 card storage is preserved.

## Switching

Press P three times within one second, or use the touch-friendly Study / Switch workspace buttons. Text fields, held-key repeats and modifier shortcuts are excluded. Plain P is reserved inside bundled games to avoid triggering their native P actions during the sequence; use the toolbar Pause button or in-game menu instead.

The current iframe stays loaded when switching to study or the collection. Opening a different game unloads the previous one, so use that game's save feature first. The bridge pauses animation frames, timers and tracked audio, releases held keys, requests exit from pointer lock/fullscreen, and freezes its simulation clock to prevent a large resume jump. Some games may additionally open their own pause menu after losing focus. Browser audio autoplay rules can require a click to resume sound. Workers, networking and third-party simulation clocks are not guaranteed to pause; this is not a multiplayer suspension system.

Lucky Company's optional original online-site link opens separately. Return to the Study Desk tab manually. All 19 active catalogue games are bundled and include the Study Desk bridge; real-browser fullscreen, pointer-lock and audio behaviour still varies by game and device.

## Recovered versions and implemented features

- Gummy Bay: Sites v12, source 8463637b06e8a5796696998219a7684a5e69e2a0. Includes exported Blender town/van, v11 environment/equipment/rigged character variants and v12 character detail levels, animation and audio settings. Compiled game assets are included; original Blender authoring files remain in the source project. Original gummybay-v3 mode/slot save keys are retained.
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

The files and licence records for 2048, Hextris, Astray, Radius Raid, Chrome-style Dino, Pac-Man, the Freedoom-compatible browser engine and 82 ABA Games microgames remain preserved, but those entries are retired from the active catalogue. `docs/retired-catalog-2026-10-20.json` retains their metadata. Forge Arena remains active and requires its existing online dependencies.

Read credits.html. Preserve copyright notices, licences and source files when publishing. Hextris GPL corresponding source is in hextris-source.zip. DOOM engine corresponding source and build scripts are in doom-engine-source.zip; Freedoom notices accompany the WAD. JavaScript games retain source directly. Microgame runtime package archives retain upstream dependency source and licence notices.

## Saves and domain changes

Existing game keys/formats are unchanged. All bundled games share this site's origin, as before. Browser local storage is tied to protocol and hostname, so saves on original Sites URLs do not automatically transfer to GitHub Pages. Changing only a repository path on the same username.github.io origin does not isolate or migrate storage. Use the original game's export/import where available (Gummy Bay supports this), and flashcard exports. Games without export support require manual storage transfer; this package does not claim universal save migration. Never overwrite a populated destination save without a backup. Some games do not provide persistent progress at all.

## Verification

See TEST_REPORT.md. Automated DOM/bridge and static checks passed; no real browser was available for this build. Do not treat static validation as gameplay certification.
