# Tea for Ghosts — alternative blends and tasting guidance

28 October 2026. Additional-round slot 33 is now verified; this is one additional pass, not a new candidate or a second count for its earlier pending spoon upgrade.

## Observed weakness and change

Rendered Mabel test: a 27-point cup gave useful flavour/temperature feedback, but Refine this blend removed those comments from the service panel. Live arrows showed only change direction; comparing multiple ideas meant rebuilding recipes or losing one to single-step undo.

Before: Whole-scoop original service had no retained refinement; the pending half-measure/refine upgrade retained a recipe but still offered only one draft and hid tasting guidance during preparation.

After: Earned half measures and recipe refinement now pair with a saved alternative tray: set one blend aside, alter ingredients/extraction/dilution, and exchange both drafts without spending an attempt. Both recipes survive reload and subsequent cups during a visit. Historical tasting notes stay beside the live preview, with no hidden target or predicted score revealed. Restart/visitor change clear the tray; memories, earned tools and history remain. Paused reset/recovery confirmations cannot mutate saves.

Gameplay commit: `d13dc0058e7f888725b75a9629ab3ed6af63ea7d`; incorporates pending half-measure/refinement source `a66b0a0cc55289c94fe7d845401d11d2065b1aae`. Native-test correction: `c8ecf518d2a0ef17c409c3b37c457a3b8d00272d`. Copy follow-up: `faab0da850e6716edfaead258508c4bc32eb6aeb`.

## Evidence

- 27 engine and 17 DOM checks pass, including saved alternatives, fractional tools, migration, invalid trays, exact restoration, attempt accounting, visit scope and paused confirmations.
- Rendered desktop walkthrough improved Mabel from 27 to 100 after retaining two recipes across reload and keyboard swaps. A 390px pointer walkthrough improved Otis from 87 to 100 using earned half scoops and the tray, then naturally reached a third-cup departure and checked cancelled/confirmed retry. The memory book and equipment survived.
- CI 40671107031 on c8ecf518d2a0ef17c409c3b37c457a3b8d00272d passed all seven jobs: 527 engine + 360 DOM = 887 checks, asset/syntax, exact twenty-slot and nine first-batch source-integrity gates. Native browser job 122761302287 passes all six Tea visitor services on desktop and emulated touch, all three tools/unlocks, the half-measure 87-to-100 refinement route, both saved alternatives, keyboard Enter/Space swaps, every planned/poured reload, natural loss/retry, bridge pause, isolated recovery/reset and navigation.
- 34 Tea screenshots retained in artifact 12808832756. Inspected desktop-alternative-comparison, touch-half-measure-refined and touch-refinement-success: alternative recipe, live profile and retained tasting notes are readable and wrap within the viewport; both records and equipment persist. Phone page still needs substantial scrolling. ZIP SHA256 6afa08c3da8d64b729f06d6317918bb7ee7931f662b6b037b03adeb9d72e1f13. Automated routes and agent walkthroughs are reliability evidence, not human enjoyment or physical-device testing.
- Copy-only follow-up faab0da850e6716edfaead258508c4bc32eb6aeb clarifies that a poor last cup ends this visit without denying earlier successes, and explicitly names the tray in restart confirmation. All 44 focused checks rerun successfully; the revised departure was observed after three native UI offerings at 390px. This two-string follow-up was not included in the earlier CI screenshot/source snapshot; mechanics are unchanged.

The first native attempt (40670487254) exposed a harness error: keyboard selection emitted each intermediate change, so Undo correctly restored the immediately preceding option. The corrected route makes a single native arrow adjustment. No game logic was changed to accommodate the test.

## Quality and boundaries

This remains a compact flavour-deduction game with six authored visitors, unlocked ingredients, three tools and record improvement. The tray makes it practical to compare different blends and extraction choices without memorizing and rebuilding each recipe. Historical feedback stays visible during those choices, while the target and score remain unknown until tasting. It does not add an invented campaign length. Long phone scrolling and fixed preferences remain limitations; no physical-device, human-enjoyment, audio or hours-of-content claim.

Current second batch: 20/20 initially playable, improved and finished; 11/20 additional passes verified; 31 meaningful passes total; zero final selections by this workflow. Thirteen earlier second-batch entries already exist on main through concurrent work and are preserved. This upgrade has zero new catalogue integrations and zero verified live routes.

Third batch remains exactly 50 slots, 24 built and zero improved/browser-tested/integrated/live. First-batch source/save keys/catalogue entries remain unchanged. Main was reread at `55c330d9ec493afc40e81e89a371f64cbd5bd8b0` before writing this development-only checkpoint. The earlier Switch workspace and live-navigation audit remains applicable to unchanged main; the previous Pages configuration blocker is resolved. No automation settings changed.

Next: Complete the nine remaining additional-round rendered reviews and substantive iterations; prioritize Pocket Palaeo's shallow fixed-site progression and pending resin-jacket decisions. Then compare the full improved slate, integrate selected finished games using a fresh main tree, and continue the separate fifty-game collection.
