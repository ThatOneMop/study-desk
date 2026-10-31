# Kiln Chorus

Third collection slot54. An original, relaxed thermal scheduling game: manage shared chamber heat while clay pieces respond at different speeds, accumulate glaze within distinct firing bands, and draw each piece before overheating. Three compact authored loads introduce fast/slow pottery, drawing-order tradeoffs and narrow firing bands. Replay pursues fuel records; unlimited undo and retry support experimentation. No measured content-duration or human-enjoyment claim.

## Controls and planning

Select Stoke (+3 chamber heat, one fuel), Bank (−1), Vent (−3), Soak (hold warm chamber, one fuel), or a ready piece to draw. Drawing cools the chamber before the remaining clay responds. A one-use baffle holds one selected piece's temperature during an action while glaze can still accumulate. Exact forecasts show each consequence before commitment.

Optional **Rehearse a firing plan** previews a multi-action sequence without changing the actual kiln. Remove the last step to compare branches, commit only the first action, or discard the plan. The remaining sequence stays editable after a commit; the final commit closes rehearsal automatically. Draft wins never award records or unlock loads. Pause, dialogs, real undo and reload discard drafts.

Native buttons support keyboard and pointer/touch; 1–4 select heat controls, A/B/C select draws, and Enter performs the selected action when native control focus does not own the key. Warm original SVG pottery, numeric/patterned bands and lettered pieces do not depend on colour alone. Mobile layout stacks panels; long plans scroll. Games returns to the collection, including inside its iframe. Pause and hidden-parent guards block gameplay and reset confirmation.

## Saves

Only `study-desk-kiln-chorus-v1` is used. Bounded journals replay through validated rules; records and older action journals remain compatible. Rehearsal is transient. Corrupt saves are preserved until confirmed recovery, blocked storage allows a temporary session, and reset affects only this game's key. Records are local achievements, not authenticated scores. The 96-action journal bound is a storage guard, not a gameplay target.

## Verification

Run:
- `node --test tests/kiln-chorus-engine.cjs`
- `NODE_PATH=/path/to/node_modules node --test tests/kiln-chorus-dom.cjs` (jsdom26.1.0)
- Repository CI runs `tests/kiln-chorus-browser.cjs` and `tests/kiln-chorus-catalog-browser.cjs` with Playwright Chromium.

31 focused checks (14 engine,17 DOM) cover thermal/glaze rules, all three loads, rehearsal branching/isolation/commit/discard, save compatibility, loss/undo/retry, native keyboard ownership, visibility/dialog guards, corrupt recovery, isolated reset and storage failure. Candidate CI41205500760 passed desktop1280×1000 and touch-emulated390×844 campaigns.

Natural rendered desktop play completed and reloaded all three loads with 3/4/2 fuel remaining, rehearsed alternative safe/overheating branches and checked one-step commit/reload. Screenshots were inspected for readable pottery, controls and actual-versus-preview separation. Touch-emulated Chromium is not physical-device testing.

See `dev/indie-collection-three/KILN_CHORUS_REHEARSAL.md` and the fifty-slot ledger for exact implementation, catalogue regression and publication evidence. Earlier source-only baffle/soak refinements are historical work, not separate rendered improvement credits. Exhaustive legacy state exploration excluded baffles and soak, so its fuel ceilings do not establish optimality for the expanded controls.
