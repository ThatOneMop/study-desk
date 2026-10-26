# Gummy Bay parity checklist

Original gummy shop. The numbers in `docs/gummy-bay/briefs/systems.md` are the roadmap. `[x]` is in the playable v125 loop. `[~]` is tested in a formula module and not wired. `[ ]` is still open.

## Playable now

- [x] First-person move, look, jump, crouch and sprint
- [x] Grow, water and harvest
- [x] Shape, pack, list, negotiate and hand over a deal
- [x] Relationships, samples and a last sale
- [x] One stored craving per customer, a temporary budget bump, and a text that asks for a price without reserving packs
- [x] Day 1 starter batch: four packed Pine Pops, then Jules texts an agreed two-for-$30 handoff. Growing and crafting come after that sale
- [x] Curfew 21:00–05:00: customers stay at their usual spot, heat does not cool off, and patrols notice from 45 m even before the first gummy is made. `gameplaySnapshot().curfew`, `gameplaySnapshot().police` and a `curfew` event are the hook
- [x] Walking gardener, gummy maker and sales assistant
- [x] Properties, a van, day and night, police as a heat meter, and version-3 saves

## Ranked gaps

1. [x] Effect mixing on the bench. The four starter ingredients apply the effect list, half-even value, a stable recipe name and 80 XP for a new set. Old mixed slots keep their index. The hands-on station steps stay; Mk1's 6 minutes per unit is recorded in `mix-bench.mjs`. The other twelve ingredients stay locked.
2. [~] Customer simulation. Appeal, order count, budget, counters, samples, delivery loyalty and craving decay are tested in `sim-formulas.mjs`. Wharf Row does not yet have 14 profiled customers, and loyalty is not the live 0–5 relationship.
3. [ ] Phone and HUD. Owned by the UI pass. Gameplay exposes snapshot and events. The messages list already shows a craving text because it is ordinary thread data.
4. [ ] Police as a law system: daily pressure, four pursuit levels, checkpoints, bystander calls, and hiding. Curfew is 21:00–05:00 with a 45 m notice range. The body search and the heat meter are already live.
5. [~] Progression. Eleven titles and the 0.0625 tier step are tested. The sleep summary does not show a rank bar, and tiers do not unlock ingredients in the live game.
6. [~] Economy. Cash, card and the $10,000 weekly ATM cap are live. The four 24-hour wash fronts are tested and not built. Property employee caps are not numbered yet.
7. [~] Staff. The tested roster is Gardener, Mixer, Packer and Sweeper with the signing fee and a 0.5 s checklist. The live crew is still gardener, maker and seller. Envelopes and the unpaid line are not in the world.
8. [~] Runners. Cut, cap and walk speed are tested. One runner per district, the robbery roll and supplier credit drops are not in the town.
9. [~] Rival candy crew. Unlock, graffiti and the 0.3 district gate are tested. District influence is not stored on the save.

## Saves

Live saves stay `gummybay-v3-{story|free}-{1|2|3}`, version 3. A missing `cravings` object loads as `{}`. Wiring a later system has to migrate the same slots. The formula modules do not read or write saves.

## Next build

Next: the 14 Wharf Row profiles and the deal walk, then the rank bar data on the sleep summary, then the rest of the law system beyond curfew notice. Leave screens, character models and presentation to the passes that own them.
