# Bramble Dice

Original, unlisted third-collection candidate 46. Four dice are allocated to attack, guard or pooled repair against three creatures with visible cyclic intents. Choose equipment between encounters, recover health and aim to return home in fewer turns. Static HTML/CSS/JS; no runtime dependencies or external art.

## Opposite-face choice

Turn over one die for one reroll: 1↔6, 2↔5, 3↔4. This is a deterministic alternative to rerolling multiple unkept dice. Both actions share the two-reroll budget, replenished at the start of a combat turn. Turning ignores keep pins deliberately and preserves all jobs and keeps. It does not advance the random sequence. Buttons show the resulting face and cost; F on a focused die card performs the action. Native select/button keys, held repeats, modifier shortcuts, pause and guide/dialog states retain their input ownership. There is no undo; the resulting combat preview is updated immediately.

This opens decisions beyond keeping versus rerolling. With Acorn Sling, a low attack die may be worth preserving; a deterministic higher face may instead help guard a dangerous intent or supply pooled repair. No new equipment or enemies are counted. Old v1 journals and exact outcome fixtures still replay identically. New flip journal entries use the existing save key `study-desk-bramble-dice-v1`. Existing best records remain, although expanded choices can enable better future scores.

## Verification and remaining work

`node --test tests/bramble-dice-engine.cjs tests/bramble-dice-dom.cjs` with jsdom 26.1.0 installed outside the repository and NODE_PATH set appropriately: 19 passing checks (11 engine, 8 DOM). Original 13 retained, including 25 seeded equipment routes and old save fixtures. New checks cover cost/RNG/other-die/setup preservation, mixed flip/reroll budget, invalid actions, new-turn replenishment, reward/terminal guards, save/reload, keyboard/native control ownership, pause/guide and a complete seed-42 Acorn Sling route with an opening flip. Retry restores the budget and retains the record. Syntax checks pass.

Source inspection motivated this refinement; no rendered-playtest improvement credit. Native touch/keyboard, the extra button's mobile layout, readability and balance still need actual browser play and screenshot inspection. No full repository build, deployment, human enjoyment or hours-of-content claim. Keep off the catalogue until the required rendered-led improvement and checks are complete.
