# Foldlight

Original paper-folding puzzle for third-batch slot 61. Fold a two-sided printed sheet across horizontal or vertical creases to match a target's occupied cells, top colours and layer counts. Moving stacks reflect across the crease, reverse layer order, turn every face over, and land above stationary stacks. Every piece of paper is conserved.

This is a layered reflection/sequence puzzle, distinct from stencil printing, line stitching, bead sliding, sowing and the existing resource games. Three authored targets use different two-sided prints and folded silhouettes. Recorded routes use 3/4/5 folds within allowances of 5/6/7; these are compact examples, not proven minima or content-duration claims. Fewest-fold records, undo and unlocked-pattern replay support route refinement.

## Hosting and controls
Static files with no build or production dependency. Serve the repository root and open games/foldlight/. The Study Desk bridge loads first. Games navigation returns to ../../index.html#games. Unlisted until rendered review and selection.

Choose a side and crease in the native controls, optionally preview, then Make this fold. A dashed line marks the crease. Tap paper panes to inspect their layers from top to bottom. Letter codes and layer counts supplement colour. Top, bottom, left and right sides are explicit; out-of-frame and empty-side folds reject without cost.

Tab/Enter/Space operate controls; on page/pane focus F folds, V previews, Z undoes. Other controls retain their keys. Pause, confirmation dialogs, document hiding and trusted parent hide messages guard input. There is no clock. Undo works after a win or allowance loss; restart retains records.

Original CSS paper panes, folded-corner highlights and amber/lake/rose printed faces require no external assets. Two workbench columns stack below 680px. Native controls have 44px minimum targets; paper panes have 48px mobile minimum height. These are source properties, not inspected rendered-layout or physical-touch evidence.

## Saves
The isolated study-desk-foldlight-v1 key stores {version:1,level,moves,records}. Journal actions are exactly {side,crease}; replay rejects invalid folds, locked levels, overlong journals, post-win actions and malformed records. Records store the fewest folds. Preview, selection and crease choices are transient. Unreadable data is preserved until confirmed recovery/reset. Quota errors permit temporary play. Reset only touches this game's key.

## Verification
With jsdom 26 available through NODE_PATH:

    node --test tests/foldlight-engine.cjs tests/foldlight-dom.cjs

14 checks (seven engine, seven DOM). Every campaign action is driven through controls and reloaded. Other checks cover reflection/stack reversal/face flipping, conservation of all 36 unique pieces across all legal depth-two folds, strict rejection, exact target semantics, allowance loss/undo/retry, record/unlock persistence, read-only previews, stack inspection, keyboard/native focus guards, pause/modals/parent messages, corrupt recovery and isolated reset/quota. Fixtures are tests/fixtures/foldlight-routes.json.

No full repository build or rendered/browser test claimed. No screenshot inspection, native touch/dialog verification or human enjoyment evidence. This initial playable is not yet improved, selected, integrated or live. Known limits: three compact fixed patterns, no folding animation or audio, and colour/stack inspection may need clearer onboarding. Next: naturally render/play desktop and mobile, inspect screenshots, evaluate crease readability and sequence reasoning, then implement a substantive observed improvement before qualification.
