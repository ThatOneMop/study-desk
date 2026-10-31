# Moss Commons — rendered conversion improvement

31 October 2026. Baseline: main2f773b6603cbfa4cd64a68e73dcc894ff1b737d2; development83b7da8feb6b91580e834a5a942b10d1c91e8f71. First and second collections preserved; second batch20/20 additional-round passes,9 live. Third batch24 built and11 fully qualified/live. Exactly50 third-batch ledger slots. No repository AGENTS.md in the observed development tree. Plain static HTML/JS, node/jsdom checks and GitHub-hosted Chromium conventions retained.

## Observed play and weakness

Played Meadow bend using orchard7, homes11/13/17 and wells16/18: a standard win with4 timber. In the unlocked neighbourhood, homes7/11/17, well6, gardens8/16 and well18 gave local services to all three homes, but only2 food for6 residents, with3 timber left. Local-access messaging could feel like completion while capacity still failed. Replacing the early garden required undoing later construction or finding room for another food producer; relocation could change position, but not building use.

## Change

Convert building changes an occupied plot's use for1 labour timber plus any increase in its original nominal cost. It never refunds timber, cannot convert the hall or an empty plot, and does not consume an action for invalid/same-use requests. Connections remain; population, orchard yield, irrigation and service access are recomputed. A path can become infrastructure, or an underperforming garden an orchard, at a premium over choosing the right type initially. Unlimited undo remains the free alternative. No new timers or repeated levels.

A clear Still needed line separates missing houses, food/water capacity and local access. Forecasts show conversion cost and final totals. Chart arrows and roving focus improve keyboard use. Native Escape/close restores controls; parent-hidden confirmation/resume cannot mutate the settlement; embedded Games requests the actual Collection.

## Rendered after behavior

Reloaded the played underfed neighbourhood, selected garden8 → orchard: forecast1 timber,7 food,6 water,3/3 local access. Converted and won. Reload preserved the challenge record; undo restored the garden and timber; native Escape cancelled retry without disabling chart input, then conversion won again. Screenshot of the completed neighbourhood was inspected.

Played Split ridge with wells11/17, fertile gardens6/16 and homes13/8/21: standard win with2 timber and8 food. This confirms the original irrigation strategy still works alongside orchards and conversion. These are agent observations, not human enjoyment measurements. Remaining sites and touch qualification use separate recorded-route regressions.

## Validation and next step

38 focused tests pass locally (23 engine,15 jsdom); both gameplay scripts and browser test parse. Browser CI covers all three sites in conversion-assisted irrigation, orchard and neighbourhood modes, an additional underfed-neighbourhood repair, per-action reload, relocation, loss/undo/retry, native Escape, keyboard/touch, parent-hidden guards, navigation and storage recovery/reset/quota. Its result and screenshots must be reviewed before completed improvement/browser-test credit or catalogue selection. Source-only prior refinements are not counted as this rendered improvement pass.

Next: run candidate CI, inspect desktop/mobile screenshots, address any weak layout or runtime behavior, then assess catalogue selection. The last live/source audit and cache fix were just verified in the Soundings release; main is unchanged, so that investigation is not repeated as new work. No automation settings were changed.
