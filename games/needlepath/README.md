# Needlepath

Original third-collection slot 47. A compact, untimed embroidery route puzzle with original SVG/CSS artwork and no runtime dependencies.

## Play
Start at green pin 1. Front stitches run horizontally; back stitches run vertically. Every stitch changes face. Visit every flower endpoint before the gold finish. Plain pins are optional turning points. Passing over a flower does not collect it; the status names missed flowers. Never revisit a pin or overlap thread on the same face. One knot costs two thread and changes face without moving.

Three authored samplers unlock sequentially, with budgets 22/30/32 and overall fine-ribbon targets 12/14/18. Each also records two separate studies: seamless (no knot) and knotwork (knot used). Knotwork fine targets are 14/16/18. These are alternate ways to solve three boards, not additional levels or a content-hours claim.

Choose a study to focus the optional read-only thread guide. It suggests a next move toward the shortest finish of that style, reports a blocked route or conservatively reports unknown after a bounded search. Study choice never prevents a normal finish. Both styles save their best legal action journal. Trace one as pale numbered lines under a new attempt to compare patterns. The caption identifies the knot's position. Hiding/showing a trace never spends thread or plays a move.

Click/tap pins, or use arrow keys to focus and Enter/Space to stitch. K ties a knot; U undoes. Unlimited undo/retry preserve ribbons and patterns. P remains reserved for the Study Desk bridge. Pause and dialogs guard actions. Embedded Games returns to the parent Collection; standalone Games opens the launcher.

## Saves
Only `study-desk-needlepath-v1` is used. Existing v1 saves retain ribbons, level and current journal. The optional `studies` field holds three pairs of independently replay-validated winning journals. An older save can infer only its current winning pattern; numeric historical records never invent routes. Each pattern must finish legally in the correct style and agree with the recorded best score. Study selection and trace visibility are session-only.

Invalid saves are preserved until confirmed recovery/reset. Storage failure leaves a playable temporary session. Scoped reset does not touch other games.

## Validation
Run `node --test tests/needlepath-engine.cjs` and, with jsdom 26.1.0 available, `node --test tests/needlepath-dom.cjs`. Together these pass 24 checks including all 31 original winning routes, advice at 1,262 reachable prefixes, both study optima, independent best-pattern replacement, legacy migration, invalid-pattern rejection, skipped flowers and UI guards.

Qualification CI 41163130615 passed desktop and 390×844 touch-emulated browser play through both studies on all three boards, traces, saves/reloads, loss/undo/retry, keyboard, pause/dialog guards, scoped reset/recovery and standalone Games navigation. Screenshots were inspected, including desktop and phone patterns/records. This is automated route and layout evidence, not human-enjoyment or physical-device testing.

`tests/needlepath-catalog-browser.cjs` checks real catalogue search/group/sort/favourites, launch, knotwork completion, trace, shell pause/restart, Collection/Games return and saved re-entry. The promotion workflow also runs the six previously released third-batch suites and repository asset/integrity checks.

## Assessment
Distinct relaxed route planning with useful knot tradeoffs, separate mastery records and optional comparison. Three small boards limit depth; an enabled guide can solve them quickly. Selected for variety alongside the action, dice tactics, racing and craft games, without claiming a long campaign.
