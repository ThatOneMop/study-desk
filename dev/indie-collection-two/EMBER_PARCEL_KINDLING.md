# Ember Parcel: carried kindling — 24 October 2026

The initial prototype consumed timber immediately. Short routes offered few resource choices and phone controls were separated from the map. This initial improvement allows packing adjacent timber for one warmth, carrying two bundles and stoking each for four warmth later without scorching gardens. Carrying fuel costs actions and warmth now but can support later ice/water crossings or rescue an ember at zero warmth. Legacy route layouts, records and save key remain unchanged; replayed actions derive the new inventory without discarding old saves.

The map now retains full terrain contrast. The compact phone title and horizontally scrollable route chooser allow the full map and direction controls to appear together at 390×844; pack/stoke follow directly below. Keyboard G selects pack mode, B stokes, and M selects melt. The guide explains costs and tradeoffs. Native confirmations still interrupt route/retry changes and remain a known unfinished UX issue.

Rendered desktop verification: moved east, packed timber, reloaded with one bundle, deliberately used the last five warmth, then stoked back to four. Existing delivery records survived. Rendered phone-size verification: packed starting-side timber, moved east, melted ice, stoked and completed the ice delivery. Desktop and 390×844 screenshots were inspected. These were ordinary UI clicks and keyboard actions, not a human enjoyment study or physical touch-device testing.

Ten engine and three DOM tests pass, including the original four routes, bounded inventory, exact saved action replay, garden preservation, zero-warmth rescue, undo and mutually exclusive pack/melt controls. Public route/assets and nine first-batch source hash checks pass. Full native touch campaign coverage remains pending; no completion or selection is inferred from passing unit tests.

Counts: second batch 18 playable, 18 initially improved, 17 finished; additional round remains 6/20 because this is Ember's initial pass. Two candidates remain unbuilt. Third batch stays 0/50 built/improved/browser-tested/integrated/live. Zero catalogue additions or live releases in this increment. Existing main integration, first-batch work and saves are untouched. The already-investigated publication limitation was not retried.

Next: native desktop/touch campaign coverage and confirmation UX, then a separate substantive additional-round upgrade; finish slots 39–40 and remaining additional upgrades before final slate selection. No timers, repeated levels or gameplay-hour claims were added.

Gameplay commit: `e3d85c8aea11d14934aecfa0cb34899019f0ccf4`. Complete local regression: **702 engine/interface checks passed**. This excludes unrun native touch coverage.
