# Needlepath

Third collection slot 47. Original standalone stitching-route prototype; not in the public catalogue. No external assets or dependencies at runtime. All artwork is authored SVG and CSS.

## Play

Start at green pin 1. Front stitches are horizontal, back stitches vertical; each stitch changes face. Stitch every flower endpoint before finishing at gold. Optional plain pins let the needle turn. A thread passing over a pin does not visit it. Pins cannot be revisited and thread cannot overlap on the same face. Opposite faces may cross. One knot costs two thread and changes face without moving.

Every coordinate interval costs one thread. Three authored samplers have budgets 22/30/32 and three-ribbon goals 12/14/18. Completing one opens the next. Unlimited undo and retry preserve completed records. Optional routes and length optimization provide compact replay, not a content-hours claim.

Click/tap pins; native Tab and Enter/Space activation; arrow keys move pin focus. K ties a knot, U undoes. P is left for the Study Desk bridge. Pause, guide and confirmation dialogs guard actions. Touch targets are designed at 44px minimum; actual mobile layout and touch usability are unverified.

## Saves

Only `study-desk-needlepath-v1` is used. Version, current sampler, replayable action journal and least-thread records are serialized. Decode validates bounds, legal replay and sequential unlocks, and strips extra fields. No other game's data is read or changed. An unreadable save is preserved until explicit recovery or reset; storage-write failure leaves a playable temporary session. Record numbers are bounded local metadata, not authenticated scores.

## Checks

`node --test tests/needlepath-engine.cjs`

`NODE_PATH=/path/to/jsdom/node_modules node --test tests/needlepath-dom.cjs`

DOM checks use jsdom 26.1.0 with simulated dialog methods; no runtime npm package is added to the repository. Eleven engine tests enumerate 31 winning routes (6/14/11), including knot and knot-free choices in each sampler; seven DOM tests cover progression, saves, retries, controls, blocking states and navigation markup. These are automated engine/DOM checks, not rendered-browser, native keyboard synthesis, touch, screenshots or human-enjoyment evidence. Serve from repository root with a normal static server for future authorized rendered review.

## Remaining

Render and play all samplers naturally on desktop and touch, inspect the cloth/thread/flower distinction and passing-over-pin clarity, assess whether optimization is enjoyable and sufficiently deep, then make a substantive playtest-led improvement. Verify real dialogs, navigation and saves/reload. Do not promote this prototype before those gates.

## Optional thread guide

Ask the thread guide to see one next move toward the least-thread finish and its total thread/ribbon forecast. It can warn that no finish remains even when a local stitch is legal. It never moves the needle or spends thread. Advice is hidden by default and after reload; saves remain byte-compatible with the initial journal format. A bounded search returns “unknown” rather than claiming impossibility when its work limit is reached.

The guide was checked against all 1,262 reachable action prefixes and the independent initial winning-route fixture. Source/engine inspection motivated it; this is not a credited rendered-playtest improvement. Rendered usability and visual highlighting remain pending.


## Rendered-play refinement — 31 October 2026

Baseline browser play crossed flower 5 without collecting it, then completed the 12-thread route. The journal only rewarded the shortest overall route: knotwork alternatives had no separate mastery target. Added seamless and knotwork studies, independently validated best action journals, six attainable style-specific fine-pattern goals (not six new levels), opt-in saved-pattern traces, and study-aware advice. Passing a flower now names the missed endpoint. Focus restoration no longer replaces useful feedback with “already stitched.” Embedded Games returns to the parent collection.

Saves retain key/version and ordinary ribbons. Missing study data is initialized empty; only an actually replayable current completed journal can be inferred. Older numeric records never invent a saved route. Recorded patterns are validated by full legal replay and style. Study selection and trace visibility are session-only.

Qualification is tracked in the separate second refinement report/ledger; do not interpret source implementation as public integration. Automated browser verification runs on GitHub Actions, including desktop and 390px touch emulation.
