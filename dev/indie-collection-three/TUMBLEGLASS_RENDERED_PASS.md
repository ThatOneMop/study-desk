# Tumbleglass rendered improvement checkpoint — 31 October 2026

Development branch only. First collection and second collection sources/saves unchanged. Third-batch slot 50 remains one game with three compact trays.

## Observed weakness and change

Natural browser play completed Amber & tide, The divider and Three reflections using ordinary tilts in 3/5/5 moves. There was no persistent progression reason to use the targeted tools. At 1348×926, controls were below the board, requiring scrolling to operate the tools. This observation, rather than the earlier source-only clamp/adviser/lift changes, motivated this pass.

Added Glassmaker’s studies: Bare hands (no tools); Steady hand (clamp must actually change the resulting bead positions, with no lift); Second setting (lift an already nested bead out, then finish). Each tray stores its shortest winning journal for each technique. The clamp cannot earn credit by holding an already blocked bead. The lift cannot earn Second setting by moving a loose bead. Optional study records are replay-validated under the same v1 key; old saves remain valid and do not receive unproven awards. Undo/retry keep studies. Desktop bench puts board beside controls; phone layout is compact and stacked; selected targets have H/L marks. Embedded Games uses study-collection. Fixed hidden-page input and pending reset guards and native dialog close refresh.

## Rendered evidence so far

Managed Sites preview, cloud Chromium, normal UI actions only. Baseline all three wins; after change, Three reflections went up/down/right, lifted nested bead 1 up, clamped bead 1 while moving left, then down. It earned Second setting in six moves while retaining the earlier five-move general record. Reload retained the study and board. Native Escape canceled a clear-progress dialog. Screenshots inspected: original board with controls below fold; revised desktop bench with board, selects and direction buttons together. These are agent-operated checks, not human enjoyment evidence or a content-hours claim.

## Validation and remaining work

29 focused checks pass locally: 16 engine and 13 jsdom 26.1.0. Existing exhaustive advisor graph (1,127 states), original campaign, tools, save journals and recovery retained. Added nine legal distinct technique routes, real clamp effect, nested-bead lift requirement, best-route retention, invalid study journals, old saves, study UI/reload/undo/reset and hidden dialog controls. jsdom runs with pretendToBeVisual because the implementation now respects document.hidden.

Candidate CI will play all nine studies via desktop keys and emulated touch buttons, reload after every action, verify navigation, modal cancellation, pause, corruption recovery, isolated reset and storage failure. Inspect resulting screenshots before qualified count changes. Public catalogue remains unchanged until qualification and selection.
