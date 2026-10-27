# Bellwether — named calls

27 October 2026. Source commit `5834ecbb1e38bb158ba9c0de98b61cfaf8509e09`.

## Change and purpose

Whole-flock whistles could disturb a sheep already in a useful position. The new Whistle to selector offers Whole flock or an individual named sheep. A named call moves only that sheep toward the dog if it is 3–4 Manhattan cells away and has a valid destination. Other sheep wait and remain obstacles. It costs one step only if movement occurs. Compass preferences, shelter behavior, quiet walking and original whistle semantics are unchanged.

Changing targets clears the old forecast. Whistle/Space previews the selected call; Guide the flock/Enter commits it. Native selector keys remain native. Opening, pause and dialog guards disable input. Reload/retry/meadow change/reset restore Whole flock. Absent/sheltered options are disabled. The existing v1 key and state shape remain; new strict `{whistle:index}` actions replay through the engine and are deep-copied to avoid external mutation.

## Evidence

29 tests pass: 15 engine, 14 jsdom 26.1.0; all 22 existing checks retained. Both JS files parse. Existing tests retain original 11/9/17-step routes, quiet-route saves, corrupt recovery/quota/reset isolation, progression, pause and navigation coverage. New tests cover single response, unchanged dog/other sheep, range/occupancy/shelter, no-op calls, strict indices/fields, object copying, full campaigns with per-action reload, forecast invalidation, selector defaults, native keys, modal and parent guards, undo and records.

A collision fixture at dog 6, sheep [3,10] has both sheep wait under a whole-flock whistle. Calling Clover alone moves it to 9 while Hazel stays at 10. New campaign fixtures are 12/9/15 steps. The last is two steps shorter than the original fixture; the first is deliberately call-inclusive and is not better than the original 11. No optimum over the combined quiet/call action set is claimed.

This is source/engine/DOM evidence, not natural rendered play, screenshot inspection, native focus/touch/dialog validation, human enjoyment or a complete repository build. The existing rendering security-policy block was not retried or bypassed. This does not earn a qualified improvement pass or publication credit.

## Preservation and status

Started from third-branch `217c10e19c975ba43c52962baeea6d2fbe20f68c`; no AGENTS.md found. First-batch final report re-read: 20 finished, nine historically selected, zero verified live. Second branch remains `3949e3d9f8e2e9846dc4c91c436d90b19bbbd341`, with six of twenty additional passes rendered verified and fourteen pending.

Current main observed at `476228e491fca42224de7f37a8cabf5b06390d8a` includes further catalogue and Gummy Bay changes. Its quality checklist was consulted; player-facing development wording was removed from Bellwether, with development status retained here. That copy change is not counted as substantive improvement. No main files, catalogue entries, other game saves or concurrent edits changed.

The changed main app.js and fourteen non-deleted changed index.html game shells were checked for Switch workspace/playerStudy/studyBtn and had no matches. Root index.html was unchanged from the prior audit. This is a source check, not renewed desktop/mobile or live verification. Existing publication failures were not retried. Separate main audit screenshots do not verify these development changes.

The exact 50-slot ledger remains 19 built, zero qualified improved/browser-tested/integrated/live. Bellwether stays unlisted. Next: render the full loop on desktop/touch, inspect screenshots, assess call-selection clarity and whether selective control improves the puzzle, make the required playtest-led upgrade, then verify and select. Continue 31 unassigned games and fourteen pending second-batch reviews. Automation settings unchanged.
