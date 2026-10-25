# Last Lighthouse portable prism — source checkpoint

25 October 2026. Source commit: `561cacd84e10bf4400a93d7bd78f224470b793ce`. Candidate 40; additional-round completion remains **6/20**.

## Design and before/after

Source-based hypothesis: the three compact harbours only allow rotation of six fixed relays. No new rendered observation was possible. A single portable prism now allows spatial routing decisions: placing or moving costs one power; rotation cycles straight/slash/backslash for free. Moving removes the previous prism. Lighthouse, fixed relays, rocks, convoy berths and the lifeboat berth reject placement. There is no passive timer or added repetitive campaign.

This creates an explicit resource choice. The three retained test routes rely on the prism for the rescue beam: removing it makes that signal miss. Each rescues the lifeboat then shelters both ships, requiring one crank because placement plus three signals costs seven power against six starting power. Each finishes with two hull and two power. These routes prove reachability and resource interaction, not player enjoyment or optimality.

Coordinate selectors use columns left-to-right and rows top-to-bottom (1–7), with a placement-cost preview and a separate confirmation button. Keyboard 7 or the outlined prism rotates it. Paused/invalid/finished operations are blocked. Space on a focused button now leaves native button activation intact rather than also signalling. Undo restores placement, orientation and power; retry retains records and restores the original setup.

## Evidence

13 engine and 5 jsdom checks pass. Coverage includes all original six ships and rescue paths, legacy journal defaults, three prism-dependent rescue/convoy routes with exact save roundtrips, relocation/undo, supply exhaustion, invalid cells/journals, caller-object isolation, keyboard controls, reload, pause, retry cancellation/confirmation, scoped corrupt-save recovery and return-link markup. Both scripts pass syntax checks. Existing storage key and journal version are unchanged; new actions serialize primitive coordinates, and old histories have no prism.

The browser security-policy blocker remains unchanged. No alternate browser surface or CI rendering was used as a workaround. DOM events/dialogs are simulated. No rendered desktop/mobile play, screenshot inspection, actual touch, human-enjoyment evidence or full-repository validation is claimed. New source remains pending rendered review, and the original three short harbours remain a depth limitation.

## Next steps and preservation

Perform supported rendered before/after play, assess routing choice and balance, inspect the controls and beam at phone width, iterate from observed weakness, and verify progression/loss/retry, saves, restart/navigation and screenshots before credit. Keep unfinished upgrades off the catalogue.

No edits to main, earlier collections, Gummy Bay, requested-game work or third-batch source. Main observed at `85d941d59e8897585606e5a67f4413a710643067`; third branch at `ab12bd0d63f2a4cdc4579be3f811a6f4693c1161` (six built prototypes, zero improved/browser-tested/integrated/live). Prior Switch workspace/publication audit remains applicable; no unchanged publishing retry. Source commit is not a live release.
