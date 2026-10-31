# Tumbleglass integration — 31 October 2026

## Shipped change

Third-batch slot 50 now has a rendered-playtest-led improvement: saved Bare hands, Steady hand and Second setting studies on its three existing trays. The clamp must change the bead layout; the lift study requires lifting an already nested bead. Each technique retains its shortest actual winning journal. Existing v1 journals, unlocks and records remain compatible. Desktop bench and reordered phone controls keep the tray close to its direction pad; H/L marks identify targeted beads. Embedded Games returns to Collection; hidden-page inputs and pending reset confirmations are guarded; native Escape restores controls.

Before: all three initial trays were naturally completed in 3/5/5 ordinary tilts, with no lasting reason to explore either tool. After: distinct useful-clamp routes and nested-bead recovery routes create alternate planning goals. Natural changed play completed the first tray's clamp study in three moves and the final tray's recovery study in six, retaining its earlier five-move general record. This is a compact spatial puzzle, not an hours-of-content claim. Automated routes and agent observations are not human enjoyment evidence.

## Source and verification

- Implementation: 6fc74fdb18b8d5de7b7b0a853a8091219196a7ac.
- Browser harness wait fix: ad44e2cfbb0f76011da1878ed074801ab9f686df. First run 41191541484 had a premature asynchronous Collection assertion after its first nine desktop wins; game behavior did not need changing for that issue.
- Final layout/source: e1804e43a6372487d39c06766bc904a4676781cf. Candidate run 41191843917/job124510047357 passed 29 focused checks and 18 UI-driven technique wins on desktop/emulated touch, including every-action reload, undo/retry, native Escape, focus, advice/recovery, pause, parent-hide reset guard, navigation, corrupt recovery, isolated reset, storage failure and no page errors/overflow.
- Candidate artifact13039275949 SHA256 bc897cf09d0b28280cbac2f0dc6c3e7272468e7b4225b503680a72c82b05f251. Earlier candidate artifact13039295651 SHA256 a10adad708597aa9da9613e6c34fa8c4464b8024082d6b49e26d2883dd72a8e9 supplied reviewed onboarding/study/desktop-win screenshots. Final narrow layout also reviewed in a 390px iframe with native keyboard activation.
- Catalogue integration: c9eebba0c66efd8f8d8979260edb8e2d6307cb62, based on main51dabae98504065aebcbea35c1eaf23555ee3ce3. Fresh branch checks caught concurrent Creekhold work and rebuilt the proposed catalogue patch on its new base. Creekhold, Spanwright, Gummy Bay, earlier batches and all other existing source/saves preserved.
- Promotion run41191942404/job124510339384 passed **242 focused checks**, all ten selected third-batch gameplay and real-catalogue desktop/touch suites, shell/curation/credits checks, **60 bundled routes /303 references with none missing**, and nine first-batch selected-route integrity checks. Catalogue has61 entries (60 bundled,1 external); this is distinct from third-batch counts.
- Final promotion artifact13038879597:279 files, SHA25618cb009d833ea379917f828d48c49becc0128e116fbc6f2f419f63bb70598d50. Inspected tumbleglass-catalog/touch-search-favourite.png, touch-tray-victory.png and desktop-saved-return.png: cover/card, wrapping, controls, pause state and saved return are readable. No horizontal overflow or page/asset failures in assertions.
- Release documentation commit6ac7007406ff0a3f438b23439a8f09008ee798aa changes only the game README after tested integration; gameplay assets match the tested commit.

## Selection

Selected for simultaneous motion, locking-order decisions, targeted rescue and relaxed undo. This differs from Beepline's programming and Reedbreaker's combat movement. The three authored trays remain a limited campaign; technique studies deepen replay rather than increasing level counts. Original CSS/SVG assets; no third-party collection imported. Emulated touch qualification is not physical-device testing.

## Navigation/publication audit

No Switch workspace text found in latest main index.html/app.js, Spanwright shell or Tumbleglass shell. Actual deployed catalogue before integration already showed concurrent Creekhold, with Games/Collection/search/group/sort/favourite controls intact; no current stale-publication evidence or permission blocker. Promotion tests verified desktop/touch catalogue navigation and absence of workspace-switch buttons. Historical Pages configuration failures were not retried.

Live deployment evidence and final ledger counts are appended after the Pages result and direct route check. Hourly schedule and other automations remain unchanged.

## Live verification and counts

Pages run **41192642375** for release6ac7007406ff0a3f438b23439a8f09008ee798aa succeeded. Live https://thatonemop.github.io/study-desk/index.html#games showed61 catalogue entries and the Tumbleglass card. Normal UI launch succeeded. Right/down/left earned Bare hands in3 moves; retry, clamp bead1/down/right/left earned Steady hand in3 moves while keeping Bare hands. In-game Games returned to Collection with the session retained. Direct https://thatonemop.github.io/study-desk/games/tumbleglass/index.html and reload preserved the completed board, unlocked second tray, general record and both studies. No deployment barrier remains. Desktop/touch navigation was verified in promotion; live route exercised in cloud Chromium.

Third batch: **24/50 built;10/50 substantially improved;10/50 browser-tested;10/50 integrated;10/50 live**. There remain14 built candidates needing qualification and26 unbuilt slots. The second-batch additional round remains20/20 verified; earlier sources, saves and catalogue entries preserved. No first/second-batch games or concurrent Creekhold/Spanwright additions count toward these50.

Next: Soundings, then the remaining distinct candidates; preserve this exact50-slot ledger. The task is unfinished, so the existing hourly schedule is retained and no other automations were modified.
