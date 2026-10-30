# Stencil Studio catalogue promotion — 30 October 2026

Candidate 41 was qualified by CI 41038068546 (27 focused checks and complete desktop/native-touch-emulated campaigns). The curated main baseline is 184368dfcf0f68352014b850e5283c6c6fe545ed: 49 entries, including concurrent Winterfold, Lane Eight and Gummy Bay work.

## Implementation

- 47691bb8005d8d0ecd06a37ff9d8dc8e7a549c48 adds the finished game, original SVG cover, concise three-commission scope, local credits, searchable aliases and automatic third-collection grouping. All previous 49 catalogue objects are unchanged. Only Stencil Studio game files are introduced.
- 55da1ef2ffa43989ed034413f19a3cc5b6b69bfb fixes a real rendered integration failure: a top-level Games link to an already-current #games URL left the player open. A same-origin/current-frame validated study-collection message now returns through the launcher, keeping the iframe and save. Standalone Games remains a normal link. Launcher script query is versioned for this change.

## Evidence

Initial promotion CI 41045721309 passed 27 focused checks, catalogue/credits/all50 route wiring, relaxed catalogue and launcher checks, and all three desktop and touch-emulated game campaigns. It then failed the in-game Games return check. Artifact12971654665 (SHA2563043ddd48abdba39cd8215eb9dba9ea924c2b40e48ebb4b487180a5f746a66a1) contains the failure and earlier gameplay screenshots. Inspected desktop-failure and desktop-search-favourite: the failure retained the player as reported; cover, collection group, filter and card were readable. Corrected source passes local game, curation and expanded origin/source validation assertions.

Live pre-release audit: the public launcher had49 games, no Switch workspace controls, catalog.js?v=second-selected-20261029 and app.js?v=curated-20261029, matching current main. No current publishing or stale-asset discrepancy was observed. No first/second game source, save keys or automation schedules were changed.

Corrected CI41046183733 at55da1ef2ffa43989ed034413f19a3cc5b6b69bfb passed27 focused checks, five launcher/catalogue suites, complete desktop and touch-emulated game campaigns, actual catalogue search/group/sort/favourite/launch/bridge pause/return/restart/saved re-entry, 49 bundled routes/252 HTML references and all9 first-batch release integrity checks. Artifact12973080542 SHA256d35a942b7c25118896f3434e6a687e0433a456dbeaa7a21278fe18fdbb8eebed contains24 screenshots. Reviewed touch-search-favourite, touch-saved-return and desktop-saved-return: cover and card readable, controls intact at390px, no horizontal page overflow; phone catalogue/game requires vertical scrolling. Returned sessions keep the in-game pause until Resume.

Main was re-read at184368dfcf0f68352014b850e5283c6c6fe545ed and fast-forwarded without force to tested commit55da1ef2ffa43989ed034413f19a3cc5b6b69bfb. Existing49 entries and all unrelated game source remain unchanged.

## Live verification and counts

Pages run41046450059 succeeded. The public catalogue now has50 entries (49 bundled +1 external). CUA live search and launch succeeded; Paper garden was completed naturally in3 operations, unlocking Harbour flags. Reopening https://thatonemop.github.io/study-desk/games/stencil-studio/index.html retained the complete board and3-operation record. Both embedded Games return and standalone return worked; pause/resume worked. A live screenshot was inspected. Catalogue token stencil-20261030 and launcher token stencil-navigation-20261030 were observed. No Switch workspace controls, stale-publication discrepancy or deployment blocker. Mobile verification is CI touch emulation, not a physical phone.

Third batch: exactly50 slots;24 built,1 substantively improved,1 browser-tested,1 integrated,1 live. Other23 built candidates remain unlisted and26 slots unbuilt. Second batch remains20/20 additionally improved and9 selected upgrades live. No automation change. Next: render/play Moon Dial and improve its most important observed weakness, then qualify it before catalogue integration. No content-hours or human-enjoyment measurement is claimed.
