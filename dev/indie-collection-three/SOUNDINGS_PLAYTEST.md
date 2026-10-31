# Soundings rendered improvement checkpoint — 31 October 2026

Baseline: main 88105787fd71d0cd279b0a6031995d741ae2eecd; development 74d113c375fbc134094837c0aa2927f2f6cc0cf6. First/second collections and ten third-batch releases preserved. Latest existing navigation audit and live publication succeeded in the preceding checkpoint; no unchanged publishing failure retried.

## Observed weakness and substantial change

In the original rendered first sector, C3 bearings returned N + NW, A1 distance 1 narrowed four pairs, and B1 bearings isolated B1/C2. Recovery left three fuel. Survey costs were visible but choosing which measurement was worth buying required manually enumerating all hypotheses, and recovery fuel was not separately shown.

Added a free per-square survey planner: possible readings partition the current evidence-compatible pairs, show worst remaining ambiguity and identify readings that provide no new deduction. A visible recovery reserve explains survey fuel and warns when a survey will end the voyage. No hidden targets or seed enter the planning function. Choice and risk remain with the player.

Also: single keyboard chart tab stop with arrow selection, stronger possible-location borders, native Escape/close restoration, parent-hidden resume/confirmation guards, and embedded Collection return. Existing saves replay unchanged.

## Natural rendered evidence

- Before upgrade: chart 1 sector 1 victory, three fuel; screenshot inspected after bearings. Original candidate outlines were faint.
- After upgrade: sector 2 C3 bearing NE + SW, D2 planner explicitly showed area sweep leaves all 16 pairs versus bearings at most four; bearings E + SW established E2. Recovered E2; B4 bearing NE + W established A4; recovered A4, two fuel left. Reload preserved victory and next-sector unlock.
- Sector 3: C3 bearing SE + W; D4 planner compared Sound at most four pairs, no-information sweep, bearings at most two. Bearings NW + S established D5; recovery, A3 distance 0 and recovery completed with three fuel.
- Arrow Up/Right selected D2 without spending. Desktop screenshot inspected: readable three-column planner, visible reserve, stronger chart outlines; no clipped text in inspected views.
- Retry dialog dismissed with native Escape; board remained usable. New voyage changed to chart 2 and retained records. Eight deliberate soundings used survey allowance; planner warned the next survey spends recovery reserve. Ninth sounding lost; retry/reload restored chart 2 with 14 fuel and records intact.

These are agent observations, not a human enjoyment study. Automated route regression is separate evidence. Emulated touch and full source checks must pass in CI and screenshots must be inspected before qualification. Actual catalogue integration/live route checks remain a separate step.

## Local checks

28 tests pass: 17 engine and 11 jsdom. Existing exhaustive all-300-pair policies and 100 seeded campaigns retained. New planner partitions independently checked for all 25 selections in 100 evidence states; free planning, no-information classification, reserve accounting, roving focus, native-close simulation and hidden-dialog guards covered. Syntax checks pass. Browser CI workflow added; its results are not presumed here.
