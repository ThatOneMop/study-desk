# Study Desk improvement ledger

+## 2026-10-24 — Nightshift save protection

Base Sites source: 936e1580161ec0a1e7f611d1c1584222d07caff0 (live version 33). GitHub base: 18b81b1d0a3c73a04268c84ba734b12ffd9bf37a. Opened the latest Site and current GitHub head before editing; the 64-entry catalogue, study tools, all game routes and owner-only audience are preserved.

### Implemented
- Fixed a reproduced Nightshift data-loss path across its ten original games: malformed or out-of-bounds stored progress is no longer silently replaced by fresh state on launch. The exact loaded text is preserved, autosaving pauses, and the warning explains the recovery choice.
- Added optimistic conflict detection so an older open tab cannot overwrite newer coins, upgrades or completed contracts. Storage failures now produce an accurate session-only warning instead of claiming progress was saved.
- Added a downloadable save copy for healthy, conflicted and damaged states. Confirmed New save is now the only path that replaces protected data, keeping the previous stored value in a per-game backup first. Existing save keys, valid progress format, contract rules and balance are unchanged.

### Validation
- New save-module regression coverage passed normal writes, strict schema bounds, exact malformed-data preservation/export, two-tab conflict blocking, unavailable storage, explicit replacement and previous-save backup.
- The complete regression suite passed, including every 64-entry launch route and all existing game, study, bridge, navigation and save-protection checks. Asset validation passed all 63 bundled routes and 232 HTML references with no missing files; JavaScript syntax and `git diff --check` passed.
- Browser preview rendered Garden Gone Rogue with the healthy save notice and new copy control. A real save download completed, the destructive reset confirmation was displayed and cancelled, and the stored-save notice remained healthy. No Nightshift console errors were observed; the browser extension emitted unrelated metadata errors. Damaged-save UI is covered by the automated module test; physical mobile and screen-reader output remain unverified.

### Pending
- No requested commercial-title repository was added in this pass. The documented identity, licence, original-asset, startup, or redistribution blockers remain for Tiny Fishing, polytack/PolyTrack, commercial Balatro, Geometry Dash, Snow Rider, and Minecraft. No unrelated replacement or empty card was added.


## 2026-10-24 — Reefwright dialog keyboard recovery

Base Sites source: eddd9cc9eedc37019d131a215fac2fefac27e732 (live version 32). GitHub base: 39b7c4be06b2307d26cded378ef8324950640726. Opened the latest Site and current GitHub head before editing; the Tiny Wilds save-safety work, 64-entry catalogue, study tools, game saves and owner-only audience are preserved.

### Implemented
- Fixed Reefwright's confirmation and field-guide dialogs dropping keyboard focus after button close, Escape cancellation, or a confirmed restart. Each dialog now records the exact opener, moves focus to its safe first action, and restores the opener after closing.
- Dynamic grid, offer and coast controls are resolved again by stable data attributes before focus restoration, so redraws do not target detached buttons. Focus restoration is skipped while the document is inactive to avoid stealing focus from another tab or app.
- Native Escape cancellation now clears the pending confirmation action before closing. Dialogs have explicit accessible names, and the confirmation description is programmatically connected. Reef layouts, scoring, records, save keys and progression are unchanged.

### Validation
- New DOM regression coverage passed dialog names/descriptions, initial focus, close-button and Escape cancellation, confirmed-action return, stable opener recovery and the inactive-document guard.
- The complete regression suite passed, including every 64-entry launch route and all existing game, study, bridge, navigation and save-protection checks. Asset validation passed all 63 bundled routes and 232 HTML references with no missing files; JavaScript syntax and `git diff --check` passed.
- Browser preview confirmed Field guide and Restart this reef both focus their safe action, Escape closes them, and focus returns to the exact opener. No Reefwright console errors were observed; the browser extension emitted unrelated metadata errors. Physical mobile and screen-reader output remain unverified.

### Pending
- No requested commercial-title repository was added in this pass. The documented identity, licence, original-asset, startup, or redistribution blockers remain for Tiny Fishing, polytack/PolyTrack, commercial Balatro, Geometry Dash, Snow Rider, and Minecraft. No unrelated replacement or empty card was added.

## 2026-10-24 — Tiny Wilds save protection

Base Sites source: 203d50b25fdb5e8078b7c66bf4d8c9f8707ddcc3 (live version 31). GitHub base: e89fe39b8e969300e3fb25ffa36c00af029e2f11. Opened the latest Site and current GitHub head before editing; the 64-entry catalogue, study tools, all existing game data formats, and owner-only audience are preserved.

### Implemented
- Fixed a reproduced Tiny Wilds data-loss path: malformed current save text was silently ignored and then overwritten by the one-second autosave. Current save data now receives bounded shape validation before use; unreadable text is preserved byte-for-byte and autosave remains paused.
- Added optimistic conflict detection so an older Tiny Wilds tab cannot overwrite a newer tab's progress. Storage read/write failure produces a persistent session-only warning instead of falsely claiming that local saving is enabled.
- Added a current-world backup download, preserved-data export, an explicit confirmed replacement choice for unreadable data, and a reload path for newer saves. The fishing and ant-colony rules, progression, legacy migration and save key remain unchanged.
- Added responsive, accessible status messaging. Healthy saves keep the compact existing badge; warnings explain the exact state and expose only the relevant recovery controls.

### Validation
- New save-module tests passed malformed-text preservation, schema bounds, explicit replacement, conflict blocking, unavailable storage, normal writes and backup wiring. New DOM tests passed warning visibility, cancelled and confirmed replacement, healthy-state recovery and two-tab conflict protection.
- The complete regression suite passed, including every 64-entry launch route and all existing After Hours, Autumn Drift, Underleaf, study, bridge and navigation checks. Asset validation passed all 63 bundled routes and 232 HTML references with no missing files; JavaScript syntax and `git diff --check` passed.
- Browser preview rendered Tiny Wilds with its healthy save notice correctly hidden, backup control visible, no game console errors, and successful fishing/ant-colony tab switching. Damaged-save UI was exercised in the DOM regression fixture rather than by modifying the preview browser's stored data. Completed file downloads, physical mobile and screen-reader output remain unverified.

### Pending
- No requested commercial-title repository was added in this pass. The documented identity, licence, original-asset, startup, or redistribution blockers remain for Tiny Fishing, polytack/PolyTrack, commercial Balatro, Geometry Dash, Snow Rider, and Minecraft. No unrelated replacement or empty card was added.

## 2026-10-24 — active credits cleanup

Base Sites source: 969b15fc199382152a6c2b9908238bb3d64a0b62 (live version 30). GitHub base: b311b35c85c267b25fd94164d0b6d2606bcf2032. Opened the latest Sites source and current GitHub head before editing. The 64-entry curated collection, study tools, saves, and the later user-requested removal of workspace-switch controls are preserved.

### Implemented
- Removed stale public credit blocks and links for retired GitHub imports, the retired random-game catalogue, and the obsolete PolyTrack official-site shortcut. Retired source and licence files remain in the repository for recoverability; they are no longer presented as active Study Desk games.
- Updated After Hours attribution to state that it is a user-created Balatro-inspired poker roguelike, not the commercial Balatro game, and linked the exact `ThatOneMop/Balatro` source at commit `bfbffaa3e9c2ce5d651831bcec2506e22bcc6f61`.
- Added an active-credits regression check that resolves every current catalogue credit anchor and rejects the retired public sections and wording. Repaired stale catalogue/navigation tests to use the current grouped 64-entry collection and the PPP study-return shortcut; runtime game code is unchanged.

### Validation
- The new credits check first failed against the retired 2048 credit, then passed after cleanup. The full regression suite passed, including all 64 catalogue launch routes, After Hours, Autumn, Underleaf, study storage/import/conflict coverage, bridge controls, collection navigation, and source syntax checks.
- Asset validation passed for all 63 bundled routes and 231 HTML references with no missing files. `git diff --check` passed.
- Browser preview rendered the revised credits page; accessibility inspection confirmed the current-only introduction, active game sections, accurate After Hours wording/source, and absence of retired credits and PolyTrack. Physical mobile and screen-reader testing were not performed in this pass.

### Pending
- No requested commercial-title repository was added in this pass. The documented identity, licence, original-asset, startup, or redistribution blockers remain for Tiny Fishing, polytack/PolyTrack, commercial Balatro, Geometry Dash, Snow Rider, and Minecraft. No unrelated replacement or empty card was added.

## 2026-10-22 — selected indie collection integration

GitHub base: 42e32a7efa25a120f579dbef6a706d8588a2c3a8. The active ten-game catalogue and retired-catalogue archive were preserved. Nine finished, original candidates were copied from `indie-collection-dev` into a separate **Indie collection** group; unfinished candidates remain development-only.

### Selected games and reasons

| Game | Selection reason |
| --- | --- |
| Tidepost | Distinct fishing-and-weather planning loop, strong route progression and the deepest verified campaign. |
| Deep Pocket | Tactile mining decisions, risk/reward extraction and a complete upgrade progression. |
| Queen of Cinders | Readable colony economy with meaningful worker allocation, crises and a verified ending. |
| Little Foundry | Satisfying production routing with clear bottlenecks, upgrades and multi-order progression. |
| Scrap Orbit | Responsive action loop, differentiated weapon choices and short-run replayability. |
| Inkline | Original line-drawing territory puzzle with undo, scoring and escalating authored stages. |
| Pocket Expedition | Compact roguelike exploration with resource decisions, encounters and persistent unlocks. |
| Echo Vault | Audio-free memory/action hybrid with readable telegraphs, upgrades and a complete route. |
| Glasshouse | Calm spatial growing puzzle with constrained placement, seasons and persistent progression. |

### Release changes

- Added the nine self-contained routes, catalogue metadata, credits and launcher group, bringing the active catalogue from 10 to 19. No retired third-party entry was restored.
- Kept each selected engine, game module and stylesheet byte-identical to the reviewed development candidate. Release-only HTML changes standardise the catalogue return link, add the Study Desk bridge exactly once and remove development labels.
- Added a source-integrity gate covering the 27 reviewed engine/game/style files and all nine routes. GitHub Pages now runs that gate and the existing asset audit before deployment.
- Updated README, route counts, cache version, curation regression and test report to match the active catalogue.

### Validation before publication

- Selected-source integrity: 9 routes and 27 exact source hashes; JS syntax, bridge, catalogue links and credits passed.
- Asset audit: 19 bundled routes and 55 HTML references, with no missing files; Freedoom WAD/WebAssembly structure passed.
- Launcher DOM suites: 19 entries, search/favourites, deck/card CRUD, mastery, PPP, all 19 launch routes, pause/resume and return navigation passed.
- Curation and After Hours engine regressions passed.
- All nine candidate engine and DOM suites passed from their hash-identical development sources: 145 engine assertions and 179 DOM assertions. Their prior exact-source Chromium review remains the rendered-play evidence; the release-only HTML wrappers have not yet been rendered from the public deployment.

### Remaining verification

Publication commit, GitHub Pages workflow and the live release URL are pending at this checkpoint. Physical touch-device testing, screen-reader testing and long-form balance testing remain unverified. Roof Runner, Last Match and Threadbound remain unfinished and are not exposed publicly.

## 2026-10-21 — pass 20

Base Sites source: 17fd929a7774a397d31694e24f4eab224d016324 (live version 28). GitHub base: 8f99173d29bcbcf429247766a605ca5cd39e9a54. Opened latest Sites source and verified app.js matched GitHub. After a browser-check interruption cleared the temporary workspace, reopened the same unchanged source, recovered the exact implementation and regression test, and revalidated. Independent community/Gummy Bay work and each ledger's previous history are preserved.

### Implemented
- Fixed a reproduced study-backup import defect: more than 10,000 incoming deck names were accepted and saved even though the next startup rejects that deck list. Import now validates both incoming and combined deck counts before changing cards or decks.
- Reuses the startup deck validator, rejects malformed deck metadata, and bounds both file size and decoded text to the existing 10 MB limit. Legacy card-array imports remain supported.
- Prepares every imported card and ID before mutating the in-memory collection, preventing partial imports if preparation throws. Copies only supported card fields, retaining mastery and assigning fresh IDs.
- Import success now distinguishes persisted data from temporary in-tab changes when a conflict or storage failure prevents saving. The open card editor is refreshed to match the imported deck. Existing cards/decks are retained; storage keys, game catalogue, games and audience are unchanged.
- This is validation/preparation safety, not a transactional storage rewrite: the existing separate card/deck writes and optimistic concurrency limitations remain.

### Validation
- New study-import.cjs first reproduced the excessive-deck write, then passed incoming/combined deck bounds, malformed metadata, file-size rejection, failed-ID preparation with no partial in-memory import, conflict and quota warnings, supported-field filtering, mastery, and legacy arrays.
- Full regression suites, asset checks (10 bundled game routes, 19 HTML references), app.js syntax and diff checks passed before the interruption; recovered source was checked again before packaging.
- Desktop preview rendered the study screen with the existing decks and mastery. Browser file-picker validation was interrupted before a result; actual file selection/import, completed downloads, mobile and screen-reader checks are NOT verified in this pass. No browser retry or claim of end-to-end import success.

### Pending
- No new requested-title repository was vetted or added this pass. Tiny Fishing, polytack/PolyTrack, commercial Balatro, Geometry Dash, Snow Rider and Minecraft retain the documented identity/reusable-source/assets blockers. After Hours remains Balatro-inspired, not the commercial game. No random replacements.
- Continue focused improvements and source vetting, preserve separately paused cleanup, and stop edits after 2026-10-23 15:00 Australia/Sydney.

## 2026-10-21 — pass 19

Base Sites source: ab6fda58534deeb59ee1c6ba1daf0826334c0f5d (live version 27). GitHub base: 08f4526696c9542d60c96b634f256da618495623. Reopened latest source through Sites workflow and verified the complete After Hours HTML matched GitHub. Preserve independent community/Gummy Bay changes and each progress log's history.

### Implemented
- Fixed keyboard focus loss when replacing joker-dialog contents. Detail views keep focus inside the dialog; All jokers returns focus to the exact catalogue item inspected.
- Reordering keeps focus on the same move control, or the opposite usable control at an ordering boundary. Closing resolves the current live opener by stable joker ID after rendering rather than a detached button.
- Selling a joker renders before closing and returns focus to Next round in the shop when the original joker is gone. Focus restoration is guarded when the document is inactive.
- Shop purchase buttons now include the specific item and price in their accessible names, including full-slot status. Prices, game rules, save keys, catalogue, study features and audience are unchanged.

### Validation
- New after-hours-dialog-focus.cjs first reproduced lost focus after detail replacement, then passed catalogue/detail/back navigation, exact opener restoration, repeated reorder/boundary focus, inactive-document guard, item-specific purchase names and sale fallback.
- Full regression suites passed. Asset audit verified 10 bundled routes and 19 HTML references; diff and source checks passed.
- Desktop Chrome launched After Hours from Study Desk. Keyboard checks confirmed catalogue/detail/back focus, Escape to the original catalogue or owned-joker control, live-shop reorder boundary focus and Next round focus after selling a joker.
- Normal play scored 192 with a pair, then 336 with three sixes, clearing the blind at 528. Bought Double Trouble, reordered the two jokers and sold it using the UI; no production state injection or rule changes. One short selector wait timed out during animation; subsequent UI inspection confirmed successful play.
- Physical mobile and screen-reader output remain unverified; these focused checks do not establish full accessibility conformance.

### Pending
- No new requested-title repository was vetted or added this pass. Existing identity and authorized-source/assets blockers remain for Tiny Fishing, polytack/PolyTrack, commercial Balatro, Geometry Dash, Snow Rider and Minecraft. After Hours remains accurately Balatro-inspired, not the commercial game.
- Continue targeted quality work and source vetting without random replacements. Preserve separately paused cleanup and stop edits after 2026-10-23 15:00 Australia/Sydney.

## 2026-10-21 — pass 18

Base Sites source: e3b80ab6c088dd13842dd512f694c61c8a56caaa (live version 26). GitHub base: ff03e826dd26a0e49ebd374201d2a46664b24d51. Reopened latest clean source through Sites workflow and verified the complete After Hours HTML matched GitHub before editing. Preserve independent community/Gummy Bay work and divergent progress-log history.

### Implemented
- Added a Copy or paste backup text section in After Hours Saves. Current validated run JSON and exact stored raw text can be displayed in a labelled read-only, selected textarea without relying on file download completion. Stored damaged data is shown unchanged, not repaired or executed.
- Added labelled pasted-backup input with the existing 1 MB bound and full AfterHoursSaves validation. Restoration uses the existing confirmation and backup-first replacement path; the confirmation now identifies round, game cash and phase. Cancellation leaves the current run and input intact.
- Download exceptions now reveal copyable text when possible. Successful download initiation points users to the text option if no file appears. No automatic clipboard access, external upload, account or new dependency was added.
- The panel uses responsive full-width text areas, resize support and visible keyboard focus. Existing file import/export, game rules, catalogue, study features, save keys and sharing remain intact.

### Validation
- New after-hours-backup-text.cjs reproduced the absent text control, then passed read-only export/focus, valid restore and previous backup, cancellation, malformed/oversized input, exact damaged raw preservation, failed-download fallback, failed-storage replacement and clean reopening.
- Full regression suites passed, including existing After Hours save/engine/keyboard coverage; asset audit verified 10 bundled routes and 19 HTML references. Diff/source checks passed.
- Desktop Chrome launched After Hours from the collection, displayed an 8,840-character valid backup, and played a pair for 192 points with 3 hands remaining. Invalid pasted JSON was rejected; cancelling the valid restore kept 3 hands. Confirming restored the captured 4-hand/0-point run, with previous-save restoration available. Text was transferred through the visible fields; OS clipboard roundtrip was not tested.
- Screenshot inspection confirmed the expanded scrollable panel, selected backup text, labels and focus outline. Physical mobile, screen-reader, file-picker and completed-download checks remain pending. This text route provides a tested alternative, not evidence that file downloads are now verified.

### Pending
- No new requested-title repository was vetted or added in this pass. Existing authorized-source/assets and identity blockers remain for Tiny Fishing, polytack/PolyTrack, commercial Balatro, Geometry Dash, Snow Rider and Minecraft. After Hours is still accurately Balatro-inspired, not the commercial game.
- Continue targeted quality work and source vetting without random replacements; preserve separately paused cleanup and stop edits after 2026-10-23 15:00 Australia/Sydney.

## 2026-10-21 — pass 17

Base Sites source: 1ad7957aefc0d5e6ba92309fff9fb2fda1028bad (live version 25). GitHub base: 26c2c1145559ab3257d95ff6b69bb6eb013741db. Reopened latest clean source through Sites workflow and verified app.js matched GitHub before editing. Preserve independent community work and each progress log's prior history.

### Implemented
- Fixed a reproduced stale-tab overwrite: reviewing cards in an older tab could replace newer questions/mastery saved by another tab. Added raw-value comparison immediately before card, deck-name and preference writes; either study-key conflict blocks both study-key writes.
- Local-storage events now show a persistent conflict warning before the next edit, including external key removal/clear. Checks read current storage rather than trusting potentially stale event values, ignore unrelated/game/session-storage keys, and preserve the original loaded snapshot and temporary editable/exportable cards.
- Conflict warnings explain that nothing is merged automatically and newer saved data can be loaded after exporting needed changes and reloading. The study hint no longer claims progress is saved when writes are blocked. Previous-snapshot downloads are labelled as this tab's previous data rather than the latest save.
- This is conservative optimistic conflict detection, not a transactional lock: truly simultaneous writes between the comparison and setItem, and the existing two-key non-atomic write window, remain limitations. No forced replacement, automatic merging, game-save changes or audience changes.

### Validation
- New study-conflicts.cjs first reproduced stale-card overwrite, then passed card/deck/preference conflicts, external delete/clear, current temporary-card export, pre-write guards without events, immediate event warnings, unrelated/stale-event handling, independent study saving and storage read failure.
- All regression suites, app.js syntax/diff checks and asset audit (10 bundled routes; 19 HTML asset references) passed.
- Desktop Chrome with two real tabs: first tab saved 2 mastered cards; second tab immediately warned, then changed its temporary view to 0 mastered. Reloading the first retained the newer 2 mastered. For preferences, adding Gummy Bay in the first tab warned the second; its temporary removal of Underleaf did not persist. Reloading showed both favourites and no warning.
- Screenshot inspection confirmed readable desktop warning/export controls. Real completed downloads, mobile layout and screen-reader output remain unverified. Existing import and game-launch regression coverage passed; game engines were not newly playtested this pass.

### Repository review — 21 October 2026 (Australia/Sydney)
- GitHub exact-name search found [PolySandwich45/polytack](https://github.com/PolySandwich45/polytack) and [PolySandwich45/polytack3](https://github.com/PolySandwich45/polytack3). Inspected recursive trees fd9e87636dd4770283da0d251c66b7248119fb82 and 05ffead8d205ac06ad3cc4078d021c96f1512545, plus their complete HTML.
- First contains only an 8,265-byte index.html; second adds an 11-byte README to essentially the same 8,266-byte HTML. Neither tree contains game source/assets, build inputs or a licence file. HTML sets an external jsDelivr base to AZURE2077/polytrack-beta-0.6.0, loads compiled main/worker bundles and redirects game-service requests through a third-party proxy. These are external dependency wrappers, not the requested self-contained authorized game source. Not integrated or executed.

### Pending
- No new games added. Tiny Fishing, polytack/PolyTrack, commercial Balatro, Geometry Dash, Snow Rider and Minecraft still need suitable authorized source/assets and verified identity. After Hours remains correctly Balatro-inspired. No random replacements.
- Preserve separately paused cleanup; continue targeted improvements/source vetting and stop edits after 2026-10-23 15:00 Australia/Sydney.

## 2026-10-20 — pass 16

Base Sites source: 424d36695650c01e95a1cbd3bed11314d8a98365 (live version 24). GitHub base: a2fa784e0b11b0c0d2c511bc34bb36f9e78ca597. Reopened latest clean source through Sites workflow; app.js and style.css matched GitHub before editing. Preserve the independent GitHub community entrypoint and divergent progress-log history.

### Implemented
- Fixed a reproduced Study Desk data-loss path: malformed stored cards fell back to starter cards, and marking one mastered overwrote the unreadable original. Stored cards, deck names and collection preferences now receive shape validation before use; unreadable values stay untouched.
- Either unreadable study key blocks both study-save writes. Temporary study/editing/export remains available, with a persistent warning and temporary-change toast. Invalid game preferences are independently protected without blocking valid study saves.
- Added persistent, responsive warning panels and exact raw-data download controls for preserved cards, decks or preferences. Storage read/write failures show an unavailable warning; successful writes retain the latest successfully saved raw value for export. Normal empty decks and retired game preference IDs remain supported.
- No replacement/reset action was added; users are not silently migrated off damaged data. This is corruption/read/write-failure protection, not atomic two-key writes or cross-tab conflict detection. Existing study features, ten original games, game save keys and audience are unchanged.

### Validation
- New study-storage.cjs first reproduced the original overwrite, then passed malformed JSON/schema preservation, grouped study-write blocking, independent preference protection, normal/empty saves, unavailable read/write warnings, retired favourites and exact raw bytes/filename at download initiation.
- All existing regression suites passed, plus the asset audit (10 bundled routes; 19 HTML asset references), app.js syntax and diff checks.
- Desktop Chrome: marked a Science card mastered and reloaded; mastery remained 1. Favourited Underleaf and reloaded; its favourite remained selected. No warning appeared for healthy storage.
- Corrupt/unavailable-storage branches were tested in isolated DOM fixtures, not by injecting browser state. Completed real file downloads, screen-reader output and physical mobile warning layout remain unverified.

### Pending
- No newly requested game repository was vetted or integrated in this pass. Previous identity/source/reuse blockers remain for Tiny Fishing, polytack/PolyTrack, commercial Balatro, Geometry Dash, Snow Rider and Minecraft. After Hours remains accurately labelled Balatro-inspired.
- Continue source vetting and targeted quality work; do not add random substitutes. Preserve the separately paused cleanup task and stop edits after 2026-10-23 15:00 Australia/Sydney.

## 2026-10-20 — pass 15

Base Sites source: 3029a27ffb00e06042ddcaaae466b9c5931941d5 (live version 23). GitHub base: a578d765683c73d8b77a1cb85bcf146742fbf8fd. Reopened latest clean source through Sites workflow and verified Underleaf HTML and both catalogue files matched GitHub before editing. Branch head was unchanged before synchronization.

### Implemented
- Underleaf manual gathering previously required pointing at canvas food patches. Added four named native buttons for left leaves, berries, crumbs and right leaves, with visible per-patch stock/regrowth and food reward information. They use the same four existing sources, not additional resource pools.
- Refactored the canvas hit handler and new buttons through one guarded gatherSource routine. Rewards, source depletion/regrowth, carry upgrades, sound, visual popups and immediate save use the existing rules.
- Controls are disabled before starting, while manually paused or recovery-paused, and when a source lacks stock. Starting focuses the first food button without scrolling the page. Refresh does not move focus; no global number/letter shortcuts were added.
- Added visible focus outlines and an action-only polite announcement of manual collection, plus keyboard instructions in the collection/player control text. The panel uses two columns and switches to one below 400 CSS pixels; physical narrow-screen rendering remains unverified.
- Existing study features, ten-game catalogue, saves, sharing and independent community/Gummy Bay work preserved.

### Validation
- New underleaf-controls.cjs first failed on the old source because there was no keyboard-focusable manual-gather control. It now passes named/native button checks, intro/start focus, all four sources, exact rewards/storage updates, depletion/regrowth, manual pause, carry upgrades, canvas/button parity and stable focus/no global shortcuts.
- Full regression suites, asset audit (10 bundled routes, 19 HTML references), source and diff checks passed. Existing Underleaf recovery tests continue to cover paused file reads and restoration.
- Desktop Chrome: Space gathered from left leaves; Tab then Enter gathered berries, increasing food from 20 to 24. Pause disabled all four buttons. Resume plus Enter/Space on crumbs/right leaves increased food to 28; source stocks and collection announcements matched. Screenshot inspection confirmed readable controls and a visible focus ring.
- Screen-reader output, physical touch/mobile layout and real file download/upload checks remain pending. No claim of full accessibility conformance.

### Pending
- No new requested-title repository was vetted or integrated this pass. Earlier identity/source/reuse blockers remain for Tiny Fishing, polytack/PolyTrack, commercial Balatro, Geometry Dash, Snow Rider and Minecraft; After Hours is still accurately Balatro-inspired.
- Continue targeted quality improvements and authorized-source vetting without random replacements. Preserve the separately paused cleanup task; stop edits after 2026-10-23 15:00 Australia/Sydney.

## 2026-10-20 — pass 14

Base Sites source: 4cae6767ff556752182ad5517d13a98643b45bef (live version 22). GitHub base: 5a5b214515aa55af26a7fe81965c9d33bfdec307. Reopened clean source using the Sites helper; GitHub head remained unchanged before synchronization. Preserved study features, ten-game catalogue, original-game labels, owner-private access and independent community/Gummy Bay work.

### Implemented
- Added Autumn Drift restoration from pasted JSON or a selected JSON file. Imports require complete, bounded, valid save data including the garden; file selection only fills a validated draft. The separate import action summarizes area, acorns and leaf progress and asks before replacing anything.
- Intentional replacement first backs up the exact current stored save, including damaged bytes, in one previous-save slot. Restore previous garden uses the same validation and confirmation. Confirmation explicitly warns that this replaces the previous backup and that unsaved progress should be exported first.
- A changed main save during confirmation rejects replacement. Backup failure prevents the main write; main-write failure attempts to preserve the older backup. These are optimistic checks/best-effort recovery, not an atomic cross-tab transaction.
- Added copyable Garden JSON text as a download-independent fallback. Current, loaded and previous-save export buttons also expose their exact text before requesting a download; malformed backup text remains available without parsing.
- File reads are size-bounded, cancellable, and ignored after closing the menu/pagehide. Import/restore keeps gameplay paused in the Saves dialog. Keyboard focus trapping now includes the text area and excludes hidden/file controls.

### Validation
- New autumn-recovery.cjs covers invalid/incomplete/oversized text, valid import, cancellation, exact stored backup, previous-save restore, corrupted-save recovery, conflict and backup/write failures, download-text fallback, oversized files rejected before reading, draft-only file selection, cancelled/late file reads and pagehide.
- Full dist/tests/*.cjs regression suite passed, along with source syntax and git diff checks. Asset audit: 10 bundled launch routes, 19 HTML asset references, no missing references.
- Desktop Chrome preview: used Show current save text to capture the actual untouched garden, picked one leaf/earned one acorn, cancelled importing the earlier export (progress kept), confirmed import (zero picked/acorns), then restored the previous save (one picked/acorn). Invalid {} text was rejected without replacement. Inspected the scrollable dialog visually.
- Browser file-picker upload, completed file downloads, physical mobile and screen-reader tests remain unverified. File-read branches are covered by isolated tests. No claim that the earlier browser-download timeout was resolved; text-copy/import is now a browser-tested alternative.

### Pending
- No requested-title repository was newly vetted or added in this pass. Earlier identity/provenance/reuse blockers remain for Tiny Fishing, polytack/PolyTrack, commercial Balatro, Geometry Dash, Snow Rider and Minecraft. After Hours remains explicitly Balatro-inspired.
- Continue source-specific vetting and targeted game quality work without random replacements. Leave the separate cleanup task paused and stop edits after 2026-10-23 15:00 Australia/Sydney.

## 2026-10-20 — pass 13

Base Sites source: d05c50c405e3d39d72699733af4222f928a1fdec (live version 21). GitHub base: 2cca5d39f4e48929d8e6020463a466dee8fb65b4. Reopened latest clean source with Sites workflow; Autumn Drift HTML/script matched GitHub. Existing study features, audience and independent community/Gummy Bay work preserved.

### Implemented
- Reproduced an Autumn Drift startup crash from saved ranks:null. Added a separate bounded save validator for progression, upgrades and garden/leaf data; copies known fields only. Invalid JSON/state and invalid legacy data remain byte-for-byte in storage rather than crashing or being overwritten by a fresh garden.
- Autosave now detects a changed v2 save before writing and pauses on detected cross-tab conflict or storage failure. This is optimistic comparison, not an atomic cross-tab transaction. Invalid/unavailable sessions remain playable temporarily, with a visible saving-paused warning.
- Added a keyboard-focused Saves dialog with status and export controls for the current garden and exact originally loaded save bytes, including malformed data. No save deletion/reset, import or restore operation was added; the UI explicitly states restore is not available yet. Valid legacy acorns still migrate without deleting legacy bytes.
- Kept gameplay rules, rendering cache and other games unchanged. Autumn script cache query bumped to v4.

### Validation
- New autumn-saves.cjs reproduces the original crash before the fix and covers malformed/oversized data preservation, progression/leaf validation, duplicate IDs, legacy migration, read/quota failures, changed-save conflicts, actual keyboard pick/save/reload, menu focus and export initiation using stubbed download APIs.
- All dist/tests/*.cjs regression suites passed, including After Hours, Underleaf, bridge controls, flashcards, curation, launcher, Autumn keyboard and rendering tests. Asset audit passed: 10 bundled routes and 18 HTML asset references; syntax/diff checks passed.
- Desktop Chrome preview: collection launch, Home + Space pick (one leaf/one acorn), Saves status/focus, return-to-play and restart restored the same progress; loaded-save export became available after restart. Screenshot inspection confirmed readable centered dialog and controls.
- Browser download-event checks timed out twice; no completed download was verified. Report export initiation coverage only. Browser extension metadata errors were observed, not a confirmed game-script error. Mobile layout and actual blocked/corrupt browser-storage branches were not exercised (those branches use isolated test fixtures).
- No new requested-title repository was vetted or added this pass. Earlier source/identity/license blockers remain for Tiny Fishing, PolyTrack, commercial Balatro, Geometry Dash, Snow Rider and Minecraft. The user's After Hours remains accurately labeled Balatro-inspired, not the original.

### Next
- Verify real file-download completion and add carefully confirmed import/restore for Autumn Drift before describing exports as an end-to-end recovery workflow.
- Continue targeted quality work and authorized-source vetting; never replace requested titles with unrelated repositories. Stop edits after 2026-10-23 15:00 Australia/Sydney.

## 2026-10-20 — pass 12

Base Sites source: d313d52bf8e8d4dc000fb86ec7c94020b8fdcd73 (live version 20). GitHub base: bc82be56e3de0e7ef83d526d31d1b38e4abfdbc2. Reopened latest clean source through Sites helper and verified Autumn Drift HTML/game script matched GitHub.

### Implemented
- Autumn Drift previously rebuilt its detailed scenery (including 1,500 grass strokes) on every animation frame. Added one offscreen scenery bitmap reused between area, collected-leaf count and display-density changes. Moving leaves, selection, particles and game simulation remain on the live canvas.
- Cached scenery retains the existing drawing code; basket updates invalidate it immediately on the next frame. Extra bitmap resolution is capped at 2400 x 1600 (up to 2x the logical scene, about 15 MiB of RGBA pixels, excluding browser overhead/main canvas). Very-high-DPI scenery may be resampled above that cap; live leaves/UI are not capped by this change.
- If allocating the extra 2D context or compositing fails, disable the cache and use the original renderer. Drawing-context swaps are restored in finally.
- Tool stats are computed once per frame rather than separately for each remaining leaf; pick actions still use the same stats/damage/cooldown path. Save data, progression, gameplay rules and other games unchanged. Bumped Autumn Drift script cache query to v3.

### Validation
- New autumn-rendering.cjs uses the actual game script with instrumented canvas methods. Before the fix, 60 frames redrew scenery 60 times; afterward, 60 unchanged frames of a 900-leaf garden used one scenery redraw and 60 stats calculations. This measures operation counts, not FPS, GPU performance or battery life.
- Tests verify original detailed grass drawing is retained, render-only state remains unchanged, every frame composites the bitmap, basket/area/density changes invalidate it, maximum extra-bitmap dimensions are bounded, missing contexts fall back, and a failed composite restores drawing on the visible context.
- Existing keyboard/gameplay, saves, bridge, flashcards, curation and launcher regression suites passed; 10 bundled routes/17 HTML asset references resolved; syntax/diff checks passed.
- Desktop Chrome preview: restored four previously picked leaves/four acorns; Home + Space increased both to five. Screenshot inspection showed terrain, fence, trees, basket, leaves, selection and controls rendering. No pixel-for-pixel image comparison or hardware/mobile FPS benchmark was performed.

### Pending
- No new game repository qualified or added this pass. Earlier requested-title identity/provenance/reuse blockers remain; no random replacements. After Hours remains labelled Balatro-inspired.
- Physical mobile, high-DPI hardware and actual screen-reader testing remain pending. Preserve independent game/community work, study tools, sharing and the separately paused cleanup task.

## 2026-10-20 — pass 11

Base Sites source: 63ad2351a7bdba5279c85e1d48659a3dcb3985f8 (live version 19). GitHub base: 2f54aa431f2f5282a3640a9d03a5405c60e4fe2d. Reopened latest clean source through Sites helper; Autumn Drift HTML and game script matched GitHub before editing.

### Implemented
- Autumn Drift's leaf canvas was not keyboard-focusable and had no keyboard picking. Added a focusable garden with directional arrow-key leaf selection, Home/End endpoints, and Space/Enter picking. After a leaf is removed, selection advances to a nearby remaining leaf.
- Keyboard actions call the existing pick function: cooldown, damage, equipment reach/multi-pick, ordinary/golden rewards, completion bonus and persistence are unchanged. Repeated activation, modifier chords and composition are ignored; menus/intro block picking.
- Added a visible control hint/focus outline and a polite status naming the selected leaf, health and remaining count. No claim of verified screen-reader compatibility yet.
- Start and menu close return focus to the garden. Upgrade/area menus focus their first enabled action; Tab/Shift+Tab stay within the open menu (including intro). Escape no longer bypasses the intro. During browser QA, opening Upgrades initially left focus on the background button; this was fixed and retested.
- Existing mouse/touch controls, all other games, catalogue, study features, save keys and audience preserved. Bumped Autumn Drift game script cache query to v2.

### Validation
- New autumn-keyboard.cjs failed on the original nonfocusable canvas and passed after the change. Actual game script in jsdom covers directional/edge/Home/End selection, focus, ordinary reward/save path, cooldown/damage, repeat/modifier/composition guards, intro/shop isolation, menu containment, empty gardens and progress announcements.
- All existing .cjs regression tests passed; 10 bundled routes/17 HTML asset references resolved; game syntax and diff checks passed.
- Desktop Chrome preview: Home + Space collected one leaf/one acorn; arrow + Enter collected another; Escape returned from Upgrades and a further Space pick reached three. After preview reload, the saved three-leaf progress returned. Final-code retest focused Back to the leaves inside Upgrades, kept Tab there, returned to the garden with Enter, and End + Space reached four leaves/four acorns.
- Full late-game equipment progression, physical mobile input/layout and actual screen-reader announcement behavior remain unverified. No browser storage injection or user live-save reset.

### Pending
- No new game repositories qualified or added this pass; identity/provenance/reuse blockers for requested titles remain as recorded in earlier reviews. After Hours remains explicitly Balatro-inspired, not the original commercial game.
- Continue targeted source vetting/gameplay QA; preserve independent game/community work and the separately paused cleanup task.

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
