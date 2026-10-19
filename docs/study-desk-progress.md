# Study Desk improvement ledger

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
