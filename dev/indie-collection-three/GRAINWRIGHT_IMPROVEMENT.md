# Grainwright substantive improvement — 3 November 2026

Candidate71 remains unlisted on `indie-collection-three-dev`. Implementation [7e239081706f2dcfa893dc7f13befc067f4dce99](https://github.com/ThatOneMop/study-desk/commit/7e239081706f2dcfa893dc7f13befc067f4dce99), rendered-review corrections [68fc6022a075144bd0b448586dcab92daf25e1ac](https://github.com/ThatOneMop/study-desk/commit/68fc6022a075144bd0b448586dcab92daf25e1ac) and mobile workbench adjustment [ca14da7e87abd83cb4a4801396a93da08d45964b](https://github.com/ThatOneMop/study-desk/commit/ca14da7e87abd83cb4a4801396a93da08d45964b).

## Observed weakness and concrete upgrade

The inspected baseline had only three purchases, all earned within six tested deliveries. Single-station cutting was reliable without a competing objective; wide strokes lacked risk guidance, and selection/width reset on reload.

After earning a triple plane, players can choose furniture commissions: Window bench, Wave shelf and Crown rail. Each has two separate seals. Clean workmanship requires no tear-out during the entire job (sanding cannot erase that history); efficiency requires delivery within7/8/9 strokes. Either seal opens the next design. A scraper removes one layer across the selected width without tear-out, but costs two strokes instead of the plane's one. Wide plane cuts followed by sanding can beat a clean scraper route, so the tool choice has a consequence. Existing fine abrasive helps efficient repairs. New seals reward5 coins once; replay cannot farm the award.

Tested clean routes use8/10/10 strokes with scrapers; efficient routes use7/8/9 with plane cuts and repairs. These are successful routes, not claims of global optimality. Regular generated commissions remain available without contract budgets. Switching projects or returning to regular work requires confirmation; coins, tools and earned seals persist.

The UI now reports both directional footprints, overcut risk and expected tear-out before cutting, shows the active goal and seal progress, uses readable station/grain labels, and saves station/width preferences separately. Existing v1 career saves migrate with their coins and tools. Unreadable game saves remain protected until explicit recovery.

The first improved render revealed the preview was below the tools on phones and the six-seal completion message incorrectly suggested another unlock. Follow-up commits moved the preview above the tools, hid irrelevant risk advice after delivery, added a complete-portfolio message and compacted the phone workbench. No cosmetic change or test alone was counted as the substantive pass.

## Validation

CI41526097917 at ca14da7e87abd83cb4a4801396a93da08d45964b passed seven engine checks and24 rendered completions: six regular commissions plus six furniture seals in each desktop1280×1000 and touch-emulated390×844 Chromium context. Earned tool unlocks, clean scraper routes, efficient plane/repair routes, every-action exact reload, station/width persistence, failed clean-contract sanding/retry, six-seal completion feedback, spoil/retry preservation, native Space/Escape, pause, corrupt/quota recovery and standalone Games navigation passed without page errors or horizontal overflow.74 bundled routes/286 HTML references, source syntax/Freedoom structure and nine first-batch integrity checks passed. Artifact13179787224 sha256:34af5571ea7c3c64e07355bd4f12f7edb5b3184bfaf304b75f6a7aa21a6e1332 verified; final touch-scraper-0.png, touch-seal-2-efficient.png and desktop-seal-2-efficient.png inspected. Automated reliability and agent visual assessment; not human enjoyment or physical-device testing.

[Passing workflow](https://github.com/ThatOneMop/study-desk/actions/runs/41526097917). Earlier iteration41525306878 also passed; its screenshots led to the feedback/layout corrections. Seven distinct engine checks are counted once, although the browser harness also imports that test module.

## Assessment and next work

The optional efficiency goals make multi-station planning useful and the clean goals introduce a real speed/finish tradeoff. The final phone screenshot keeps the board, goal, preview and primary cutting controls in one workbench view. The finished profile and labels are readable, but artwork still reads as abstract timber stations, not a polished animated furniture scene. Three furniture designs/six seals are a short portfolio, not a deep campaign or proof of lasting enjoyment. No audio or measured playtime claim. Selection remains pending.

Next: verify actual embedded bridge visibility/navigation, hidden confirmation/input ownership, rendered legacy-save migration and unrelated-save isolation. Exercise portfolio confirmation cancellation and efficiency-failure feedback. Reassess reserve versus selection after those checks; do not count full qualification yet.

## Counts and preservation

Third batch31/50 built,31/50 substantially improved,30/50 fully browser-qualified;19 unbuilt. Grainwright has rendered improvement evidence but is not yet counted in the ledger's full-qualification browserTested total. Exactly50 candidate slots remain. Second-batch additional round remains20/20 complete. Active integration/live remain0/0 under the existing release-scope hold, with25 historical third-batch and9 second-batch releases retained in the ledger.

Main re-read at fa57730f70904ae5f15e47fe0c7e55dc28144c88 remains unchanged. Preserve PR110's current14-game curation; no unchanged publication failure was retried and no new live URL is claimed. The existing Switch workspace/navigation audit still applies to unchanged main; Grainwright adds no Switch workspace control. First-batch sources/tests and Numberworks, Gummy Bay, requested-GitHub-games and their saves were not edited. No automation was modified or paused.
