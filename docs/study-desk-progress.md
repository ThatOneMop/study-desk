# Study Desk improvement ledger

## 2026-10-20 — pass 10

Base Sites source: 42cdba60480bf441cdc4fe5e04e3e6d51ff42ef9 (live version 18). GitHub base: 3614abc6c1b3cf5780096617e47b0c97230e60dc. Latest source opened through Sites helper; shared bridge matched GitHub before editing.

### Implemented
- Shared pause cleanup previously emitted anonymous mouse-shaped pointer events on document, missing element-only pointer handlers and leaving native pointer capture unreleased. This affects gesture cleanup in games that use canvas/button capture (including Autumn Drift and Moon Salvage).
- Track active pointer identities, coordinates and capture owners. Pause now sends pointercancel to each connected capture owner/original control (document fallback if detached), then explicitly releases capture. Completed/native-cancelled pointers are removed from tracking. Multiple touch/pen pointers are handled independently.
- Cancellation does not synthesize pointerup on the control, avoiding accidental gesture completion there. Existing global resets, mouse/key cleanup, study features, catalogue, saves and audience remain unchanged.

### Validation
- Added bridge-pointer.cjs. Capture-release assertion failed on prior code and passed after the fix. Covers target/identity, touch and pen, simultaneous pointers, capture transfer, native completion/cancel, detached targets, idempotence and no element pointerup activation. jsdom uses an explicit PointerEvent/capture model; this is not physical-device verification.
- All existing .cjs regression tests passed (After Hours, Underleaf, flashcards/bridge, curation and launcher suites). Asset check resolved 10 bundled routes/17 HTML references; bridge syntax and diff checks passed.
- Desktop Chrome preview: Autumn Drift started, loading status cleared, Pause hid the frame, Resume restored it, and PPP returned to flashcards. Physical touch/pen capture, mobile layout and full playthroughs remain unverified.

### Tiny Fishing source review (20 October 2026)
- https://github.com/MajesticWafer/tiny-fishing at tree/ref 4928e7aa099eaf1ac4ddfb05b6e6ff6b86d2af67: inspected full recursive inventory, README and entry HTML. Contains a roughly 1.9 MB TinyFishing.js GameMaker HTML5 export, five texture PNGs, audio and Poki/GameAnalytics/GameSnacks extension files; no editable GameMaker project/build instructions or licence file in the complete tree.
- Entry calls GameMaker_Init and references /js/main.js, which is absent from that repository; html5game/load.png is zero bytes. A self-contained/reliable launch has not been established. The README's contribution instructions do not provide a reuse licence or an original-creator asset grant. Not run or integrated.
- No new games added. Other requested-title identity/provenance/reuse blockers remain; After Hours remains accurately labelled Balatro-inspired. Preserve independent game/community work and the separately paused cleanup task.

## 2026-10-20 — pass 9

Base Sites source: 9bbdc1be0c9e49edb6b8a26be85a2e44e2054705 (live version 17). GitHub base: 179fb3f33cb3dab1ee7d57d76c8dc3d614025b34. Recovered fresh source through the Sites helper after workspace maintenance; HTML/save module matched GitHub. Prior progress was intact.

### Implemented
- Completed Underleaf recovery with Import colony (JSON file) and Restore previous colony. Both validate a complete colony and show worker/chamber/food totals in a confirmation before replacement. The existing stored colony is backed up before the new save is written.
- File reads pause local simulation and provide Cancel import; cancellation or leaving the game page invalidates late async results. Previous manual pause is preserved. Restoring rebuilds ants, clears old transient effects/timers and refreshes the UI without reloading.
- Added size and complete-export checks; partial legacy saves can still load through the existing compatibility path but cannot silently be imported as a complete exported colony. Invalid backups remain downloadable, not automatically discarded.
- Replacement can reject a stored-save change made during confirmation. If the primary write fails after backing up, the older backup is restored on a best-effort basis. This is not an atomic multi-key/cross-tab transaction; storage failure can also prevent rollback.
- Existing reset/export functions, colony balance/content, all other games, study features, catalogue and audience preserved.

### Validation
- New underleaf-recovery.cjs runs actual game/recovery scripts in jsdom and covers valid import/previous restore, confirmation cancellation, incomplete/malformed/oversized files, slow-read cancellation, pagehide, manual pause retention, optimistic conflict checks, backup failure and primary-write failure.
- Existing Underleaf saves, flashcards/bridge/mouse, curation, launcher/navigation/loading/switching and After Hours save/control/engine checks passed; all 10 routes and 17 HTML asset references resolved; syntax/diff checks passed.
- Desktop Chrome preview: wake/feed produced 8 food and one egg; confirmed New colony reset to 20 food/no eggs; confirmed Restore previous colony returned to 8 food/one egg with success feedback. Native confirmation handling produced browser-automation timeouts, but checking and accepting the existing dialogs completed each action without repeating clicks.
- Actual browser file selection/upload/download completion, mobile layout and full colony progression remain unverified. File import was tested with simulated File.text inputs, not a real OS picker.

### Pending
- No new game sources vetted or added this pass. Requested original-game identity/provenance/reuse blockers remain in earlier entries; no random substitutes. Continue focused source review and gameplay QA.
- Keep independent game/community work and the separately paused cleanup task unchanged.

## 2026-10-20 — pass 8

Base Sites source: 7ee8101bfa4ed8d1aa746090e39d6f6ef8f4ce10 (live version 16). GitHub base: e54ebdcd4acef396177b0397a32c84f0a1d927a1. Opened latest clean source through Sites helper; Underleaf HTML matched GitHub exactly before editing.

### Observed and fixed
- Underleaf loaded any object with workers >= 3 without validating the remaining fields. A save containing eggs:null reproduced a startup crash in the actual game script; malformed JSON could silently fall back to a fresh colony and later overwrite the stored bytes.
- Added save-store.js: validates finite resources, worker/room/upgrade limits and egg timers/capacity; accepts legacy missing defaults; keeps existing underleaf-v1 key. Invalid saves start a clearly labelled temporary colony with autosaving disabled and exact original bytes retained.
- Persistent save status now explains corruption, storage failure and detected cross-tab changes. Autosave compares stored bytes to the last loaded/written value before writing (optimistic conflict detection, not an atomic cross-tab transaction).
- Added current-colony export, loaded-save download, and previous-colony backup download. Confirmed New colony writes the previous raw save to underleaf-v1.backup before replacement; a failed backup/write keeps the current in-memory colony. Only the latest reset backup is retained. Import/one-click restoration is not yet implemented; downloads preserve data for recovery.
- No changes to colony balance/content, other game assets, catalogue, study features or sharing. Invalid data is never automatically deleted.

### Validation
- New underleaf-saves.cjs reproduced the startup failure before integration and passed afterward. Covers numeric/brood bounds, legacy defaults, malformed/oversized/raw preservation, reset cancellation, backup-first reset, read/quota/write failure, optimistic conflicts, three download initiations, actual startup/feed/pagehide handlers, and a controlled hatch simulation with valid saved state.
- All previous shell/bridge/mouse, curation, launcher/loading/switching, After Hours save/control/engine tests passed; 10 game routes and 16 HTML asset references resolved; save-module syntax/diff checks passed.
- Desktop Chrome preview: save panel rendered clearly; colony wake/feed reduced food from 20 to 8 and created one egg; confirmed launcher reload restored 8 food and one egg with loading status cleared. Corruption/quota/conflict scenarios were simulated, not injected into browser storage. Actual download completion, mobile layout and full colony progression remain unverified.

### Pending
- No requested-game repository newly vetted/qualified this pass; prior identity/provenance/reuse blockers remain. Do not imply that public mirrors or repository-level licences establish rights to copied original game assets.
- Continue gameplay/save QA and targeted source review. Preserve other tasks' game/community work and the separately paused cleanup task.

## 2026-10-20 — pass 7

Base Sites source: a2e57cb1adb724cd0cd8089a92d7fa5f0aa6812e (live version 15). GitHub base: 73de885be1335b47d2bff5b197afc03805e77ff4. Reopened the clean checkout through the Sites helper and confirmed the launcher base matches GitHub.

### Implemented
- Switching to a different bundled game previously replaced the live iframe immediately, with no warning about unsaved progress. Added a confirmation naming both games before changing the iframe, current game or recent list.
- Cancel preserves the current document/session, manual pause, collection view and focused launch button. First launch, returning to the same game and external links remain prompt-free. Existing restart confirmation is unchanged. Bumped app.js cache version to 8.
- Added launcher-switching.cjs; reproduced the missing-confirmation failure before the fix. No game counts, rules, saved data, study features or audience changes.

### Validation
- New switching regression passed: initial/same-game launch, named warning, cancel with retained session marker/focus/pause/history, approved switch, stored game/study data untouched.
- All existing flashcard/bridge/mouse, curation, loading/navigation, 10 route, After Hours save/control/engine and 15 HTML asset-reference checks passed; syntax/diff checks passed.
- Desktop Chrome preview: selected A of spades in After Hours, attempted Underleaf, cancelled the native confirmation, returned and verified the same selected card. Then approved a second switch and verified Underleaf's intro rendered and loading status cleared. Mobile and full gameplay remain unverified.

### Snow Rider repository review (20 October 2026)
- https://github.com/arcadeclash/snow-rider-3d-unblocked: root inventory, LICENSE, index.html, Build inventory and Unity JSON inspected. Actual prebuilt Unity loader references about 12.5 MB of compressed data/WASM, WebGL 1/2 and a 256 MiB memory setting; root has no editable Unity project/build instructions. MIT text names gamehippy (2025), while the build identifies Snow Rider/Snow Rider 3D. The inspected files do not establish an original-creator grant covering the game/assets; kept pending, not integrated or run.
- https://github.com/Especially43/snow-rider: README/index/root inspected. It is a small wrapper loading Unity scripts and the game from drippy-cat/snowrider3D through jsDelivr, plus third-party analytics; not a self-contained game source. Its licence label does not establish permission for those remote game assets. Not integrated.
- No new game qualified. Prior identity/reuse blockers remain for other requested titles; no random substitutes or empty cards. After Hours stays accurately labelled Balatro-inspired. Preserve independent game/community work and the paused cleanup task.

## 2026-10-20 — pass 6

Base Sites source: 09625ce3585feaebdac7566f417c218427426a12 (live version 14). GitHub base: ef71a9c705d8ac82eb28c12731cc9c5cd60699b6. Opened a fresh checkout and confirmed the shared bridge matched both sources.

### Observed and fixed
- Shared pause cleanup emitted only a default left-button mouseup on document. Forge Arena's current release handler explicitly checks button 0 and button 2, leaving right fire held after suspension. Added per-button mouse tracking and release to the original connected target, with document fallback for detached targets.
- Snapshot and clear tracked input before dispatch; preserve bubbling to window handlers and legacy left-button reset. No synthetic clicks, save changes, game-rule changes or catalogue changes.
- Added bridge-mouse.cjs using the actual extracted Forge Arena release handler. The right-button regression failed before the fix and passed afterward. Coverage includes simultaneous buttons, original element listeners, detached targets, already-released buttons, repeated pause, no click generation, and rejected foreign/non-parent visibility messages.

### Validation
- Passed new mouse regression plus all existing shell/bridge, curation, launcher/navigation/loading, 10 launch-route, After Hours save/control/engine, and 15 HTML asset-reference checks; bridge syntax and diff checks passed.
- Desktop Chrome preview: Forge Arena hangar/academy loaded, loading status cleared, Pause removed the game from the accessibility tree, and Resume restored it. The held-button regression was simulated in jsdom with the real release handler, not reproduced through a full browser combat session. Mobile/touch capture and full game playthroughs remain unverified.
- Requested-game identity/provenance/reuse blockers remain as recorded below; no new eligibility claims or new games this pass. After Hours remains accurately labelled as the user's Balatro-inspired game. Retired random selections remain absent.
- Preserved study features, saves, audience, independent game/community work, and the separate paused cleanup task. Future passes can continue targeted repository vetting and gameplay QA.

## 2026-10-20 — pass 5

Base Sites source: 0f003c25cc63df3600c37444bf4db4d78fe96706 (live version 13). GitHub base: 8eb4fda43fd4dc371bd3008230efa5629b1f7f30. Restored fresh source after workspace maintenance; repository history and prior improvements were intact.

### Implemented
- Launcher previously treated every iframe load event as success, including error/fallback pages. It now checks the expected same-origin route and the existing StudyBridge integration before clearing loading status. All 10 current game HTML pages include that bridge. This verifies the page/integration, not successful engine startup or every game asset.
- Added actionable Retry game and Back to collection controls for missing integration, inspection errors and a 15-second slow load. Retry confirms unsaved-progress risk and never deletes save storage. A slow-load warning does not take focus away from a game that may already be playable.
- Isolated attempts by generation and ignored stale route events; late timers cannot replace a successful/new launch state. Preserved manual pause and inactive-view focus. Added iframe busy state and bumped shell asset cache versions.
- No changes to game content/rules, requested-game catalogue, audience, or the paused cleanup task.

### Validation
- New launcher-loading.cjs simulates missing bridge/error pages, delayed loads, cancel/retry, recovery, stale routes/timers, directory/index equivalence, paused/inactive focus, inspection exceptions and preserved preferences. Updated catalogue test executes the real bridge before its simulated successful load.
- All new loading, existing launcher/navigation, curation, flashcard/bridge, After Hours control/save/engine, 10 launch-route and 15 HTML asset-reference checks passed; source syntax and diff checks passed.
- Desktop Chrome preview successfully launched After Hours with its prior saved run and Autumn Drift with the loading status cleared. Failure/timeout branches were simulated in jsdom, not induced over a real failing network. Mobile, full gameplay and engine-error detection remain outside this verification.

### Requested source research
- A GitHub search for MIT-licensed Tiny Fishing candidates returned DinkySnep/Final-Project-Tiny-Fishing-Club. Its README describes a separate month-long fishing-game beta with skill minigames/collection, not the requested original Tiny Fishing. Rejected on identity; did not integrate or run it. Other hits were different named fishing projects, not authorised original-game evidence.
- No new games added. Previously recorded identity/provenance/reuse blockers remain for the requested titles. Continue focused source vetting and meaningful reliability work; do not re-add retired selections or silently substitute similar games. Preserve GitHub's community link and independent game assets when syncing.

Sites publication succeeded at source commit 09625ce3585feaebdac7566f417c218427426a12. Live URL: https://study-desk-after-class.work-7072.chatgpt.site.

## 2026-10-20 — pass 4

Base Sites source: 885da166cfa81c59dc6fac3694b9ba8c4cb5642b (live version 12). GitHub base: ee9f2be1459292292d4cc53775f6653b7022ef6d. Separate checkout; other game assets and community work were untouched.

### Observed and fixed
- Desktop browser QA reproduced After Hours losing keyboard focus on every card selection because rendering replaced the focused button. Preserve focused card identity across selection, sorting and clearing, or move to a remaining card when it leaves the hand. Do not steal focus from an inactive game document.
- Added Left/Right and Home/End navigation within the hand. Space uses normal button activation to select; Enter from a card plays the selected hand. Ordinary buttons keep native Enter behavior. Existing number/discard shortcuts remain, with typing/composition/modifier guards.
- Shop purchase/reroll and round transitions also dropped focus. Keep a surviving shop control focused, otherwise focus Next round; starting the next round focuses its first card. Added accessible hand grouping and matching in-game control instructions.
- No engine/rules, saves, game catalogue, sharing, or standalone ThatOneMop/Balatro changes.

### Validation
- Real desktop Chrome preview: After Hours launch/render, three scored pairs (120, 96 and 108), first blind cleared at 324, two joker purchases with correct balances, next round launch, card focus after selection, arrow/Space/Enter controls, Saves dialog, reload retaining score, Pause excluding the iframe from the accessibility tree, and PPP study/return. This is one blind plus next-round entry, not a complete run. Mobile, audio, all other rendered games and actual export/import file transfer remain unverified.
- New after-hours-controls.cjs passes selection/sort/clear focus, navigation boundaries, Enter scoring, modal/typing/modifier guards, inactive-document focus, and controlled shop/next-round transitions. The forced transition test checks UI state, not difficulty/balance.
- Existing After Hours save/engine, launcher/navigation, curation, study-card/bridge, 10 route and 15 asset-reference checks passed. Managed preview was free when started; stop it after publishing.

### Repository follow-up
- https://github.com/gafaua/PolyTrack is an MIT-licensed computer-vision tracking project, not the racing game; rejected on identity.
- https://github.com/Hexcein-moonsters/polytrack README identifies an unaffiliated copy of Kodub's game, with archived modified builds, CORS/server limitations and version-specific replay bugs. Root inventory contains 0.3.1/0.5.0 bundles and a package.json with Redis but no useful build/test workflow. LICENSE says MIT, copyright 2024 Chrome Extensions; this does not establish the original creator's grant for the copied game/assets. No integration until provenance/reuse permission is verified; do not label it as an authorised original.
- Other requested-game blockers from earlier passes remain. No placeholders, random alternatives or new game entries added. Preserve the separate paused play-count cleanup and GitHub Pages permission boundary.

Sites publication succeeded at source commit 0f003c25cc63df3600c37444bf4db4d78fe96706. Live URL: https://study-desk-after-class.work-7072.chatgpt.site.

## 2026-10-20 — pass 3

Base Sites source: 01dacd248e8ef0fb237f83025ad2947c789815ce (live version 11). GitHub base: 7053d01fc3831078acfa9280b144953d936d237c. Isolated checkout again; unrelated Gummy Bay edits and its running preview were not changed or stopped.

### Implemented
- Fixed Browse games reopening the last player instead of the collection. PPP still returns to the open player when used from a game/study session.
- Added a return-to-current-session button above filters, available even when the running game is hidden by search, genre or favourites. Returning retains the iframe and manual pause state; this is session continuity, not a new cross-reload save system.
- Preserved keyboard focus after filter/favourite redraws and returning from a game; provided clear-filter recovery for empty results. Play buttons and iframe now identify the game by name.
- Pausing focuses Resume and makes the iframe inert/out of the tab sequence. Late iframe load does not steal focus from study, collection, or the pause control. Pause releases pointer lock/fullscreen.
- No game additions, removals, save-key changes, or standalone Balatro repository edits. Existing study features and owner-only audience preserved.

### Validation
Passed new launcher-navigation.cjs (Browse vs PPP, unchanged iframe on return, hidden-tile session return, focus restoration, paused inert/tabindex flags, late-load focus guards), existing shell/bridge, curation, all 10 catalogue launch routes, After Hours engine and save regressions, syntax, and all 15 active HTML asset references. Node/jsdom does not prove native inert behavior or rendered gameplay. Browser QA was deferred because the shared managed preview was already serving another task's Gummy Bay work; it was left undisturbed. Responsive CSS added but visual/mobile verification remains pending.

### Pending
The requested-game identity/permission blockers in passes 1–2 are unchanged; no new repository eligibility claims were made this pass. Continue targeted authorised-source research or browser/gameplay checks when the shared preview is free. GitHub Pages permission blocker remains separate from functioning Sites publishing. Preserve GitHub's community link when syncing the launcher. Do not resume the paused play-count task.

Published through Sites successfully at source commit 885da166cfa81c59dc6fac3694b9ba8c4cb5642b. Live URL: https://study-desk-after-class.work-7072.chatgpt.site.

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
