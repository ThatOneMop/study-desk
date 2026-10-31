# Bramble Dice

Original, unlisted third-collection candidate 46. Four dice are allocated to attack, guard or pooled repair against three creatures with visible cyclic intents. Choose equipment between encounters, recover health and aim to return home in fewer turns. Static HTML/CSS/JS; no runtime dependencies or external art.

## Opposite-face choice

Turn over one die for one reroll: 1↔6, 2↔5, 3↔4. This is a deterministic alternative to rerolling multiple unkept dice. Both actions share the two-reroll budget, replenished at the start of a combat turn. Turning ignores keep pins deliberately and preserves all jobs and keeps. It does not advance the random sequence. Buttons show the resulting face and cost; F on a focused die card performs the action. Native select/button keys, held repeats, modifier shortcuts, pause and guide/dialog states retain their input ownership. There is no undo; the resulting combat preview is updated immediately.

This opens decisions beyond keeping versus rerolling. With Acorn Sling, a low attack die may be worth preserving; a deterministic higher face may instead help guard a dangerous intent or supply pooled repair. No new equipment or enemies are counted. Old v1 journals and exact outcome fixtures still replay identically. New flip journal entries use the existing save key `study-desk-bramble-dice-v1`. Existing best records remain, although expanded choices can enable better future scores.

## Verification and remaining work

`node --test tests/bramble-dice-engine.cjs tests/bramble-dice-dom.cjs` with jsdom 26.1.0 installed outside the repository and NODE_PATH set appropriately: 19 passing checks (11 engine, 8 DOM). Original 13 retained, including 25 seeded equipment routes and old save fixtures. New checks cover cost/RNG/other-die/setup preservation, mixed flip/reroll budget, invalid actions, new-turn replenishment, reward/terminal guards, save/reload, keyboard/native control ownership, pause/guide and a complete seed-42 Acorn Sling route with an opening flip. Retry restores the budget and retains the record. Syntax checks pass.

Source inspection motivated this refinement; no rendered-playtest improvement credit. Native touch/keyboard, the extra button's mobile layout, readability and balance still need actual browser play and screenshot inspection. No full repository build, deployment, human enjoyment or hours-of-content claim. Keep off the catalogue until the required rendered-led improvement and checks are complete.

## Reserve a die

A fourth job, **Reserve for next turn**, trades one die's entire current-turn contribution for its exact face in the same slot next turn. Only one die can be reserved. It contributes no attack, guard, repair or equipment bonus; other jobs resolve as before. The face also survives a reward clearing and appears after choosing equipment. It can then be rerolled or turned over normally. All four RNG draws still occur before replacing the reserved slot, preserving the normal stream for the other dice.

Choose Reserve in a die's select or press 4 on its focused card. Moving the reserve to another die clears the previous job to unassigned, requiring an explicit replacement before resolving. Setup saves immediately; the face itself is reserved only on resolution. Retry resets the reserve and retains the best record. Existing v1 journals replay identically; new resolve journals use slot value 4 and at most one such slot. No save migration is required.

The expanded suite has 27 passing checks (15 engine, 12 jsdom), including the original 19, exact old-save fixtures, carry across reward/reload, current-turn cost and gear exclusion, RNG preservation, multiple-reserve rejection, native keyboard ownership and full reserve-opening engine/DOM campaigns. This is source-derived work pending natural rendered play and screenshot inspection, not completed improvement credit. Assess how often holding a high or low face is useful against upcoming intents, whether reserve is confused with Keep, and whether the extra job fits mobile controls comfortably.

### Rendered planning pass — 31 October 2026

Compare this plan bookmarks a complete allocation for the current handful. Changing jobs then shows both health outcomes and reserved dice; Swap with comparison exchanges complete plans, or restores a bookmarked plan from an incomplete trial. This is a free planning operation, not an undo of a committed roll or turn. Changing dice, resolving, restarting, or reloading clears the comparison. Current job selections still save in the existing v1 format.

The following enemy intent is now visible before committing, making the reserve decision informed. The comparison uses the existing exact forecast, including armour, conditional gear, kill cancellation and unavoidable thorns. Hidden shell/page guards prevent resume or reset confirmation while the game is not visible.

Validation: 32 focused tests (15 engine,17 DOM). One manually controlled rendered seed-one expedition completed in ten turns, using reserve carry, both conditional equipment types, plan comparisons and deterministic flips; victory and best record survived reload. Desktop comparison and victory screenshots inspected. Keyboard allocation/compare and confirmed retry also worked, retaining the ten-turn record. Mobile/touch, rendered loss, full integration checks and live release remain pending. No additional authored encounters or playtime claim.
