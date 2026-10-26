# Gummy Bay parity checklist

Original gummy shop. The numbers in `docs/gummy-bay/briefs/systems.md` are the roadmap. `[x]` is in the playable v124 loop. `[~]` is tested in a formula module and not wired. `[ ]` is still open.

## Playable now

- [x] First-person move, look, jump, crouch and sprint
- [x] Grow, water and harvest
- [x] Shape, pack, list, negotiate and hand over a deal
- [x] Relationships, samples and a last sale
- [x] One stored craving per customer, a temporary budget bump, and a text that asks for a price without reserving packs
- [x] Curfew 22:00–06:00: customers stay at their usual spot, and heat does not cool off. The clock label is the UI pass. `gameplaySnapshot().curfew` and a `curfew` event are the hook
- [x] Walking gardener, gummy maker and sales assistant
- [x] Properties, a van, day and night, police as a heat meter, and version-3 saves

## Ranked gaps

1. [~] Effect mixing. `mix-core.mjs` has 34 effects, 16 ingredients, 114 rewrites, half-even value, a deterministic name, 80 XP and the two bench speeds. The live mixer is still the flat four-ingredient bonus.
2. [~] Customer simulation. Appeal, order count, budget, counters, samples, delivery loyalty and craving decay are tested in `sim-formulas.mjs`. Wharf Row does not yet have 14 profiled customers, and loyalty is not the live 0–5 relationship.
3. [ ] Phone and HUD. Owned by the UI pass. Gameplay exposes snapshot and events. The messages list already shows a craving text because it is ordinary thread data.
4. [ ] Police as a law system: daily pressure, a 45 m cone, four pursuit levels, a 21:00–05:00 curfew, checkpoints, a body search, bystander calls, and hiding. v124 heat and the 22:00 curfew stay until this replaces them.
5. [~] Progression. Eleven titles and the 0.0625 tier step are tested. The sleep summary does not show a rank bar, and tiers do not unlock ingredients in the live game.
6. [~] Economy. Cash, card and the $10,000 weekly ATM cap are live. The four 24-hour wash fronts are tested and not built. Property employee caps are not numbered yet.
7. [~] Staff. The tested roster is Gardener, Mixer, Packer and Sweeper with the signing fee and a 0.5 s checklist. The live crew is still gardener, maker and seller. Envelopes and the unpaid line are not in the world.
8. [~] Runners. Cut, cap and walk speed are tested. One runner per district, the robbery roll and supplier credit drops are not in the town.
9. [~] Rival candy crew. Unlock, graffiti and the 0.3 district gate are tested. District influence is not stored on the save.

## Saves

Live saves stay `gummybay-v3-{story|free}-{1|2|3}`, version 3. A missing `cravings` object loads as `{}`. Wiring a later system has to migrate the same slots. The formula modules do not read or write saves.

## Next build

Wire `mix-core.mjs` into the mixing bench, then the 14 Wharf Row profiles and the deal walk. Leave screens, character models and the law-system presentation to the passes that own them.
