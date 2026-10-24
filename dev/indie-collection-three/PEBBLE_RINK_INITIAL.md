# Pebble Rink — initial implementation

25 October 2026. Slot 43. Source commit `2fd5e3af77d206f05f0231e8dda5435e0909ab34`. Unlisted development prototype.

## Gameplay

Aim and release three stones on a small curling rink. Angle sets the line, weight sets initial speed, and left/right curl bends the early trajectory. Friction slows stones; banks, fixed islands and previously delivered stones affect subsequent shots. Inner/middle/outer rings award 3/2/1 points at rest. Meet each rink's target to unlock the next; best scores remain on the club card.

Three compact authored rinks offer open ice, a central island and a channel between islands. These are variations within one original physics game, not separate candidate slots. No existing game engine or outside collection was imported. Original Canvas shapes and CSS supply the artwork. No runtime packages or compile step are required.

Sliders/select and tapping the ice aim the shot. Arrow keys adjust line/weight and Space releases. Undo replays the preceding shot journal, restoring displaced stones too. Retry preserves earned cards. The full shot outcome is resolved and saved at release; animation displays deterministic intermediate frames. Reload skips remaining animation with the same outcome. Pause, help and confirmation dialogs suspend animation; hidden tabs pause until explicit resume. Saves use only `study-desk-pebble-rink-v1`; corrupt saves are preserved until confirmed recovery.

## Tests and limits

Five engine tests pass: solver-derived legal wins on all three rinks, sequential unlocks, exact save roundtrips, opposite curl directions, collision displacement, bank/island boundaries, animation endpoint equality, natural loss, undo/retry and malformed state rejection.

Three DOM tests pass: all rinks completed through ordinary control handlers, reload during animation, pause/resume, keyboard aim, misses, undo/retry, cancelled dialogs, isolated reset and corrupt-save recovery. Canvas and animation scheduling are mocked in these tests. They verify wiring and deterministic state, not pixel appearance, physical touch or human enjoyment. The Games href is checked; real launch/navigation awaits browser verification.

Syntax and exact fifty-slot/count/catalogue-exclusion checks pass. Full repository build/integrity suites were not run from the partial checkout recovered after workspace pruning. Changes are made against the current GitHub tree and the final diff is checked for only intended new game/tests and third-batch records. No existing catalogue/game/second-batch files are changed.

Prior browser-policy denial remains unresolved and was not bypassed. No new browser test or screenshot, completed improvement credit or live-release claim. Physics tuning, aiming clarity, responsiveness and visual quality need actual rendered play. No hours-of-content claim.

## Totals and next work

Third batch: **3 implemented / 0 improved / 0 browser-tested / 0 integrated / 0 live**. Forty-seven slots remain unassigned and count as zero. Second batch remains twenty initially complete and 6/20 additional upgrades verified. First-batch baseline remains twenty finished and nine selected. Main `85d941d59e8897585606e5a67f4413a710643067` and second-batch branch are untouched. Existing publication/control audit was not retried as new progress.

Next: play the rendered core loop, inspect desktop/touch layouts and natural collision/curl behaviour, implement a substantive improvement based on observations, and verify progression, loss/retry, saves, reset, launch/navigation. Do not integrate until those gates pass. Continue all outstanding second-batch obligations and the remaining third-batch candidates.
