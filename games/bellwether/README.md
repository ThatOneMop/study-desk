# Bellwether

An original, turn-based herding puzzle: walk behind sheep to push them away, whistle to pull distant sheep toward the dog, and steer the flock around rocks into a shelter gate. There is no clock, damage or irreversible loss. Wrong routes can be undone, including after an arrival; retry preserves records.

Three authored meadows introduce open positional pressure, a narrow whistle passage, and a three-sheep split pasture. These are compact puzzles, not a claim of long-form content. The fixed compass preferences and simultaneous collision rules give predictable responses. Every move shows exact destinations before confirmation. Two sheep choosing the same cell both wait; neither can move through an occupied starting cell. Sheltered sheep leave the board permanently for that attempt.

## Controls and rules

- Choose a direction or whistle, then **Guide the flock**. The green outline is the next dog position; amber circles are sheep destinations. Tap an orthogonally adjacent dog square to select that direction.
- Arrow keys / WASD select a direction; Space selects whistle; Enter commits; Z undoes. Native button/link/summary keyboard behavior takes priority. The opening gate, pause and confirmation dialogs block gameplay.
- After a walk, sheep at Manhattan distance 1–2 move one step away if possible. A whistle moves sheep at distance 3–4 one step closer; nearby sheep wait. Rocks, sheep and the dog block movement. Dogs cannot enter the shelter.
- Clover prefers N/E/S/W, Hazel E/S/W/N and Pip S/W/N/E among valid moves that change distance in the required direction. The exact preview avoids requiring this order to be memorized.
- Best step counts unlock subsequent meadows. Replay any unlocked meadow and improve the record. Undo never removes an earned record.

All SVG illustrations and CSS are original in this repository; no external assets, fonts, runtime dependencies or audio. Reduced-motion CSS removes the arrival pulse.

## Save contract

`study-desk-bellwether-v1` stores `{version:1, level, moves, records}`. Moves are validated direction/whistle strings or single-sheep `{whistle:index}` objects replayed through the same engine; invalid/locked/post-win journals are rejected. Records are bounded positive integers or null, with sequential unlocks. The 512-action journal cap is a defensive storage bound, not a content objective or timed challenge. Undo/retry remains available at the cap. Previews are temporary and never written as actions.

Unreadable data is preserved until explicit recovery. Quota/storage failures leave a temporary playable session and show a warning. Reset only replaces this game's key. Other games' saves are never modified. The shared Study Desk bridge is loaded first; trusted parent hide messages pause the shell and clear the prediction.

## Validation and pending work

`node --test tests/bellwether-engine.cjs tests/bellwether-dom.cjs` (jsdom 26.1.0 required for the latter). The fixture routes were generated with breadth-first search and replayed via engine and DOM controls, with reload after each action. Shortest routes using the original walk/whistle action set are 11/9/17 steps. Quiet-enabled fixture routes also complete in 11/9/17 steps; no additional content hours are claimed. This is an automated graph result, not human play or an enjoyment score.

Rendered browser access remains blocked in this work context. No screenshot inspection, real mobile touch, native focus/dialog behavior or rendered layout assessment is claimed. Keep the game unlisted until natural rendered play, a substantive observed-weakness improvement pass, and follow-up verification. In particular assess the compass tie-breaking, whether the forecast makes decisions satisfying, the easier second meadow, mobile board size and dog/sheep readability.

## Quiet paws source refinement

The Quiet paws toggle lets the dog walk one square without moving any sheep. It costs one step in the route record, just like a normal move. Use it to reposition around a settled flock, then switch it off to apply pressure again. Whistles are unaffected. Walls, rocks, sheep and the gate still block the dog.

The toggle clears any pending forecast; selecting a new direction shows the exact quiet result. Buttons, keyboard and adjacent-square taps share the mode. It defaults off on reload, retry, meadow change and reset, and is disabled while paused or in a dialog. This preference is not part of the saved game; committed quiet actions are stored as `quiet-north/east/south/west` in the existing v1 journal. Old journals, records and save keys remain unchanged.

This upgrade addresses a source-observed lack of controlled repositioning. It is not yet a rendered-play improvement pass. Check whether quiet movement improves planning without making herding too easy, plus native touch, focus and layout, before integration.

## Named-call source refinement

Choose Whole flock, Clover (gold), Hazel (violet) or Pip (blue) in Whistle to. A named whistle moves only that sheep; the others wait and still occupy their starting cells. The existing 3–4-cell Manhattan range, compass preference, obstacles and gate rules remain. The dog stays still. A successful call costs one step; a blocked, out-of-range or sheltered target costs nothing. Changing the target discards the old forecast. Choose Whistle again and inspect the preview before committing.

The native selector works with touch or Tab/arrow keys. Space on the page chooses the current call; native selector keys are not intercepted. Quiet paws only changes walking, so a named call works in either walking mode. Reload/retry/meadow change/reset default to Whole flock. Sheltered or absent sheep cannot be selected. Pause, opening and dialogs disable the selector and committing.

The v1 save key and state shape remain unchanged. New actions store `{whistle:0}`, `{whistle:1}` or `{whistle:2}`; invalid fields/indices and impossible calls reject. Action objects are copied into and out of saved state. Old journals, quiet actions and records remain valid.

29 tests pass (15 engine, 14 jsdom 26.1.0), retaining all 22 previous checks. Named-call fixtures complete the three meadows in 12/9/15 steps, with UI save/reload after each action. The original fixtures remain 11/9/17; calls provide an additional tool, not a requirement to use a slower first-meadow route. The last new fixture saves two steps over the original route. No global optimum across quiet-plus-call actions is claimed. A separate collision fixture shows two sheep both waiting for the same destination under a flock whistle, while a named call moves one safely.

This refinement addresses a source-observed lack of selective control. It is not a rendered-play improvement pass. Natural rendered desktop/touch play, screenshots, balance, readability and feedback review remain pending. The candidate stays unlisted. The player-facing development label was removed in line with the current quality checklist; that copy edit is not counted as a substantive improvement.
