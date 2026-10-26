# Moss Commons

Third collection slot 52. Original compact settlement-planning prototype. Spend limited timber on connected houses, gardens, wells and paths. Houses create population demand; wells supply water and boost adjacent gardens; fertile land offers another way to meet food requirements. Win by supporting at least three houses with enough food and water for all residents. No timers, idle resource generation or arbitrary production quotas.

Three small authored sites vary rocks, fertile plots and timber budgets (20/19/18). A demonstrated seven-building layout costs 17 timber at each site; an alternative second-site route spends 18, uses a path and meets the food requirement with one unwatered fertile garden. These are validation examples, not claims of optimal strategy or lengthy content. Unlimited undo and retry support experimentation; records track timber remaining after a win. Additional houses increase requirements rather than creating free points.

Original CSS village artwork and native plot buttons/select controls. Minimum 44px targets, visible focus, text labels independent of art, projected resource totals and invalid-placement explanations are implemented. Keyboard uses native Tab/Enter/Space/select behavior. Actual rendering, native activation, touch and mobile layout remain unverified. Pause/dialog and same-origin parent visibility guards prevent construction while inactive.

Only `study-desk-moss-commons-v1` is used. The save stores site, bounded construction journal and local records. Decoder replays connectivity, costs, occupied plots, rocks, completion and unlock consistency. Corrupt data stays untouched until confirmed recovery/reset. Storage failures allow a temporary session. Local records are not authenticated scores.

## Verification

`node --test tests/moss-commons-engine.cjs`

`NODE_PATH=/path/to/node_modules node --test tests/moss-commons-dom.cjs` with jsdom 26.1.0.

Nine tests pass (six engine, three DOM), plus both script syntax checks. Campaigns cover all three sites, save/reload after every build, progression, resource forecasts, undo/records, alternate fertile/path layout, exact nonstacking yields, connectivity, map edges, invalid builds, input ownership, exhausted-budget loss/retry, malformed journals, navigation markup, pause/parent guards, reset isolation, corrupt recovery and quota failure. Dialog APIs are simulated.

No rendered play, screenshots, native keyboard/touch validation, full repository build or human-enjoyment claim. This is an initial prototype, not a completed improvement pass. Next: naturally play on desktop/touch and inspect screenshots; assess whether the food/water/connection trade-offs have enough depth and whether forecasts make demand clear. Implement a substantive playtest-led improvement before catalogue selection. Existing games, shared navigation and saves are untouched.
