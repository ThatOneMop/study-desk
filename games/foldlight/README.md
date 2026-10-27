# Foldlight

Original paper-folding puzzle for third-batch slot 61. Fold a two-sided printed sheet across horizontal or vertical creases to match a target's occupied cells, top colours and layer counts. Moving stacks reflect across the crease, reverse layer order, turn every face over, and land above stationary stacks. Every piece of paper is conserved.

This is a layered reflection/sequence puzzle, distinct from stencil printing, line stitching, bead sliding, sowing and the existing resource games. Three authored targets use different two-sided prints and folded silhouettes. Recorded routes use 3/4/5 folds within allowances of 5/6/7; these are compact examples, not proven minima or content-duration claims. Fewest-fold records, undo and unlocked-pattern replay support route refinement.

## Hosting and controls
Static files with no build or production dependency. Serve the repository root and open games/foldlight/. The Study Desk bridge loads first. Games navigation returns to ../../index.html#games. Unlisted until rendered review and selection.

Choose a side and crease in the native controls, optionally preview, then Make this fold. A dashed line marks the crease. Tap paper panes to inspect their layers from top to bottom. Letter codes and layer counts supplement colour. Top, bottom, left and right sides are explicit; out-of-frame and empty-side folds reject without cost.

Tab/Enter/Space operate controls; on page/pane focus F folds, U toggles underneath, V previews, Z undoes. Other controls retain their keys. Pause, confirmation dialogs, document hiding and trusted parent hide messages guard input. There is no clock. Undo works after a win or allowance loss; restart retains records.

Original CSS paper panes, folded-corner highlights and amber/lake/rose printed faces require no external assets. Two workbench columns stack below 680px. Native controls have 44px minimum targets; paper panes have 48px mobile minimum height. These are source properties, not inspected rendered-layout or physical-touch evidence.

## Saves
The isolated study-desk-foldlight-v1 key stores {version:1,level,moves,records}. Legacy journal actions remain {side,crease}; an under-fold adds under:true (other values reject); replay rejects invalid folds, locked levels, overlong journals, post-win actions and malformed records. Records store the fewest folds. Preview, selection and crease choices are transient. Unreadable data is preserved until confirmed recovery/reset. Quota errors permit temporary play. Reset only touches this game's key.

## Verification
With jsdom 26 available through NODE_PATH:

    node --test tests/foldlight-engine.cjs tests/foldlight-dom.cjs

14 checks (seven engine, seven DOM). Every campaign action is driven through controls and reloaded. Other checks cover reflection/stack reversal/face flipping, conservation of all 36 unique pieces across all legal depth-two folds, strict rejection, exact target semantics, allowance loss/undo/retry, record/unlock persistence, read-only previews, stack inspection, keyboard/native focus guards, pause/modals/parent messages, corrupt recovery and isolated reset/quota. Fixtures are tests/fixtures/foldlight-routes.json.

No full repository build or rendered/browser test claimed. No screenshot inspection, native touch/dialog verification or human enjoyment evidence. This initial playable is not yet improved, selected, integrated or live. Known limits: three compact fixed patterns, no folding animation or audio, and colour/stack inspection may need clearer onboarding. Next: naturally render/play desktop and mobile, inspect screenshots, evaluate crease readability and sequence reasoning, then implement a substantive observed improvement before qualification.


## Tuck underneath (pending rendered review)

Source review found that every fold had to cover stationary layers. The new native **Tuck underneath existing layers** control instead inserts the reversed, face-flipped moving stack below stationary paper. This preserves its visible top colour while changing buried layers that later folds may expose. Geometry, conservation and one-fold cost are identical; empty destinations receive the same stack in either mode.

The exact preview, match count and top-to-bottom layer inspection use the chosen mode. U toggles it on page/pane focus; other controls retain their keys. Mode persists while planning, resets on retry/new pattern/reset, and is transient across reload. The committed under:true action persists in the existing v1 journal. Original saves still mean over-folds.

21 checks pass (11 engine, 10 DOM), retaining the original 14. Under-inclusive example routes finish in 4/6/5 folds (not optimality or faster-route claims). Tests cover bottom insertion, reversed faces/order, stationary top preservation, identical geometry, conserved paper, empty destinations, strict flags, three full routes with per-action DOM save/reload, undo, original journals, exact previews, reset and native/pause/modal guards.

This is a substantive source-informed option, not a rendered-qualified improvement. It remains unlisted. Rendered play must assess whether over/under choices deepen sequence planning, whether the mode is understandable, and whether previews/inspection need refinement before qualification.

## Whole-sheet turnover (pending rendered review)

Source inspection found that exposing another face always required a crease fold. The optional whole-sheet turnover mirrors all panes left-to-right, reverses each stack and flips every face without merging panes. It costs one move from the existing allowance. Turnover twice restores the exact board but spends two moves. This changes access to buried colours while preserving the total paper and pane-height distribution.

Select Turn the whole sheet over instead, preview using the existing checkbox, then commit. Crease, side and under-fold controls are disabled in turnover mode and crease marks disappear. T toggles mode on page/pane focus, leaving native controls alone. Undo works normally; mode resets on retry/new pattern/reset and is transient across reload. Journal action {type:'flip'} is optional in the existing v1 key. Original crease/under journals and records remain valid. UI counts are now called moves because turnover also spends the allowance.

27 checks pass (14 engine, 13 jsdom 26.1.0), including all original 21. Three alternate routes with one turnover each complete in 4/5/6 moves, versus original 3/4/5-fold routes. These demonstrate reachable alternatives, not faster solutions or optimality. Per-action control-driven save/reload, exact previews, stack reversal and face mirroring, conservation, involution, strict actions, allowance exhaustion, undo/retry, disabled unrelated controls and keyboard/native/pause/modal guards pass. Fixtures: tests/fixtures/foldlight-flip.json. Both scripts parse and used/unique IDs, bridge order and absence of workspace-switch controls pass static checks.

This is a source-informed option, not a rendered-qualified improvement. No screenshot, native touch, enjoyment, full-repository build or live evidence. The existing browser security-policy blocker was not retried or bypassed. Rendered play must evaluate whether turnover creates useful planning rather than redundant moves, and whether its mode and mirror direction are clear. Foldlight remains unlisted.
