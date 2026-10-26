# Moss Commons — relocation refinement

2026-10-26. Implementation: `040436f94bdc1f060afe42d642dac532a6dec39c`.

Source analysis identified rigid construction order: fixing an early placement required undoing every later building. Relocation now moves a building or path for one timber, keeping later construction. The hall cannot move; destinations must be empty and buildable. A flood fill verifies that every occupied plot remains connected to the hall after the move. This is stricter than checking destination adjacency and prevents orphaned branches.

Food recalculates from the final layout. Moving a house away from a crowded orchard can restore its six-food capacity without removing a later well. Moving gardens/wells can change fertility and irrigation. Players choose between a paid move and free undo followed by rebuilding. A labelled source selector, selected destination and total-resource forecast precede commitment. Undo restores both layout and timber. New exact {kind:'move',from,p} entries replay alongside unchanged legacy construction journals. Every action still spends at least one timber, so the twenty-action save bound remains sufficient.

19 tests pass: 12 engine and 7 jsdom 26.1.0, including all previous fourteen checks. New coverage: orchard recovery without removing later buildings, full connectivity, invalid/malformed sources/destinations/budgets, three successful relocation campaigns with per-action reload, exact legacy saves, preview/commit separation, pause, undo, completion/retry/records and save isolation. Both scripts pass syntax checks. Demonstrated relocation routes leave 3/2/1 timber; no global optimality claim. Dialogs are simulated.

No rendered browser play, screenshot inspection, native keyboard/touch/layout assessment, human-enjoyment evidence or full repository build. The prior rendering security-policy blocker was not bypassed. This is a source-led refinement, not a completed improvement pass. Next: naturally play the redesign flow on desktop/touch, inspect its selectors and resource forecasts, assess cost/orchard balance, then make a substantive rendered-play-led improvement before selection.

Starting third head: `72f9a8b9ca2660e8869fabc177680f6cdb789ef5`. Main observed: `eefaf658169313cbf5b0c334e6f32d98d3a68191`. Main changes since the last audit affect Gummy Bay QA/gameplay files; no new Switch workspace matches appear in added diff lines. Shared catalogue/navigation and concurrent work are untouched. No unchanged publishing failure was retried, and no fresh rendered navigation or deployment claim is made. No AGENTS.md was found in the third-branch tree. First-batch final report still records twenty finished/improved, nine selected source and zero verified live.

Ledger retains exactly fifty third-batch slots: **14 built, 0 improved, 0 browser-tested, 0 integrated, 0 verified live**. Second additional-round counts remain **6/20 verified, 14 pending**. This game stays off the public catalogue.
