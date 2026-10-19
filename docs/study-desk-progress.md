# Study Desk improvement ledger

## 2026-10-20 — pass 2

Base Sites source: 94353a1f1c1d006ca93879b4bb62b882d3ed4385 (live version 10). Worked in an isolated checkout because another checkout contained unrelated Gummy Bay edits; those edits were left untouched.

### Implemented
- Fixed After Hours loading incomplete saves: old shallow validation accepted missing pile/levels/counters, risking startup errors. New save-store.js validates canonical card IDs, unique cards, phase, shop entries and numeric fields; supports legacy missing optional counters and sanitises imported history text.
- Added a mobile-accessible Saves button alongside Run info/New run, JSON export/import, previous-save restore and raw stored-save download. Replacing a run saves the previous raw value first; backup-write failure leaves the original untouched.
- Invalid local saves are preserved with autosave paused and a recovery dialog. Storage failures offer export. Concurrent writes from another tab stop autosave instead of silently replacing newer progress. Cancelling a dialog during a file read cancels the import.
- Kept the existing save key/version and original game identity. No catalogue additions or removals in this pass.

### Targeted repository review
- cocoa-1012/tiny-fishing-game and ubg98/TinyFishing: read current repository metadata and root inventories; HTML5 builds exist but neither has a verified licence. Do not integrate merely because a public mirror exists.
- willmil11/GeometryDash: metadata describes an HTML recreation, no licence found in metadata/root. Not the original commercial game and not added as a substitute.
- Other requested titles remain pending as documented in pass 1. Do not add placeholder cards or random alternatives.

### Validation
Passed save-module syntax, active asset references (10 routes, 15 references), existing After Hours engine checks, and new Node/jsdom regression tests: missing/duplicate/malformed cards, malformed/oversized saves, injected log text, legacy counters, 480 forced-clear state transitions including shop polish, corrupt-save preservation, backup-before-replace, two-tab conflicts, quota/read failures, recovery UI, download initiation, import/restore and cancellation. Forced-clear tests check state validity, not game balance or hundreds of human playthroughs. Browser visuals, mobile layout and actual download completion remain unverified; no browser-control skill is available.

### Hosting and next steps
Previous pass published successfully through Sites. GitHub source commit 3dd1a5146c7bb1e1d846c9a143e78b3ecb39d377 passed its route checks, but Pages run 39325533987 failed at Configure GitHub Pages: Resource not accessible by integration. Do not attempt credential workarounds or change repository permissions; keep the existing Sites URL as the verified playable destination. Future source commits may trigger that unchanged workflow; a failed Pages setup does not mean Sites publication failed.

Continue from latest source and this ledger, preserve concurrent game/community work, and target observed gameplay/control issues or verified requested repositories. Do not repeat already completed cleanup. Original standalone ThatOneMop/Balatro is not modified by this Study Desk task.

## 2026-10-20 — pass 1

Base Sites source: 9476238baac84cd8376883e2dbd722bd389c362c, live version 9 when opened. Project: appgprj_6ad5778b65ac819182d572abc52e0cc9. Live URL: https://study-desk-after-class.work-7072.chatgpt.site.

### Implemented
- Removed 7 community classics, 82 imported microgames, and the external PolyTrack shortcut from the active catalogue: 100 -> 10 entries. Metadata archived in retired-catalog-2026-10-20.json; files, licences, source archives and saves are retained. No play-count cleanup performed; that separate task remains paused.
- Removed stale 100/99-game claims. Buttons, counts and group filters now reflect the actual catalogue. Filter selection exposes aria-pressed.
- Preserved retired favourites/recent IDs, trimmed search whitespace and added Balatro/poker aliases for After Hours without mislabelling it as the original commercial game.
- Added background-tab suspension through the existing bridge and retained manual-pause state on return. Improved preference-storage failure wording.
- Confirmed After Hours matches the user's GitHub source exactly except for the existing bridge tag. Upstream ThatOneMop/Balatro commit bfbffaa3e9c2ce5d651831bcec2506e22bcc6f61; index.html blob 69a21d423feb6c2a18ab8a1189a39defc5a9d4d4. No new game added in this pass.

### Repository review
| Requested game | Checked evidence | Result / next step |
| --- | --- | --- |
| Tiny Fishing | https://github.com/MajesticWafer/tiny-fishing: README, repository metadata and root inventory | HTML5 assets present, no licence or redistribution grant verified. Review other candidates or publisher permission; not integrated. Other search hits: cocoa-1012/tiny-fishing-game and ubg98/TinyFishing, not yet vetted. |
| polytack / PolyTrack | https://github.com/Joe-The-Chicken/polytrack: metadata, README and root inventory | Racing game by Kodub, uploaded v0.4 bundle. Uploader says it is not theirs; no licence verified. Exact spelling polytack search included empty/unrelated repos. Assume intended racing game PolyTrack but do not substitute another game. |
| Balatro | https://github.com/ThatOneMop/Balatro | Existing After Hours is the user's inspired implementation; checked and retained. Original commercial Balatro has not been sourced. |
| geo dash / Geometry Dash | https://github.com/geode-sdk/geode README | Search result is explicitly a mod loader/SDK, not a playable base game. Other results included a private server and an iOS launcher. Need actual authorised playable source; not integrated. |
| Snow Rider | https://github.com/focus-solutions/snow-rider: metadata, root inventory and @source.txt | Unity build files present, no licence verified. Source marker points to a GameDistribution game. Need verified permission for code and assets; not integrated. |
| Minecraft | https://github.com/ManiaDevelopment/Minecraft-Classic-Forever README | README attributes original code to Mojang while licensing contributor source MIT; this does not verify rights to republish all original assets/code. ClassiCube is a separate project and was not silently substituted. Need appropriate actual game source and build; not integrated. |

### Validation
Passed JS syntax and active HTML asset references (10 routes, 14 references, none missing); DOM checks for flashcards, deck edits, mastery, search, favourites and PPP; all 10 launch routes/pause/resume/study return; retired preference preservation; hidden-tab pause with manual pause retained; After Hours deterministic scoring, discard, invalid input rejection, serialised-state consistency, shop purchase, next round and loss. Existing retained Freedoom/WASM archive structure checks also passed.

No browser-control skill was available; rendered gameplay, mobile layout, WebGL, fullscreen and audible resume remain unverified. jsdom 26 was installed only in temporary test-deps, outside published source. Source/asset checks do not certify every game's playability.

### Next pass
Read this ledger and latest source before editing. Reconcile concurrent work; keep original games and community features. Continue targeted requested-repository checks, or improve an observed launcher/game defect with meaningful validation. Do not repeatedly remove games, invent additions or count a scheduled invocation as a complete game overhaul. Preserve current audience. Stop new work at 2026-10-23 15:00 Australia/Sydney.

GitHub mirror: shell changes and curated catalogue applied while retaining that repository's original game metadata (except After Hours clarification), game assets, community page/link and workflow. Sites game assets and GitHub game assets are independent versions; do not overwrite them blindly.
