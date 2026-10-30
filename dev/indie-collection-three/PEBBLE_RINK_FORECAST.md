# Pebble Rink forecast — 31 October 2026

Implementation: 479bc100196112461058c4538f559b233908a653.

## Observed weakness and change
Curl and weight setup show only a short straight aim guide; future collision displacement cannot be compared while choosing the next shot.

Before: Only committed shots or replay reveal curves, rebounds and scoring displacement.

After: Optional read-only whole-shot forecast draws curved trajectories and hollow resting stones, reports individual scoring gains/losses, and updates while adjusting angle/weight/curl. Normal release commits; hide restores unassisted play.

## Evidence and limits
Managed Sites/CUA rendered baseline released weight70 straight, then reloaded its resolved2-point result. Curl selection retained a straight aiming guide, leaving prospective curve/collision consequences unclear. Added optional dashed trajectories and hollow resting positions for every affected stone, with per-stone and total scoring forecasts. Rendered comparison predicted right curl total2→4 versus straight collision2→5, including existing stone2→3. Released straight and reloaded: exact5-point result; third straight forecast5→6 resolved to6 and unlocked island rink. Inspected baseline, collision forecast and island rebound screenshots. Island forecast correctly shows a central hit rebounding short for0 points.16 focused engine/DOM checks pass, including2 new forecast tests for nonmutation, collision score equivalence, control updates, pause and transient reload behavior. CUA initial animation did not visibly settle before reload; reload skips playback by design. Uninterrupted rendered playback needs explicit CI validation. Full remaining campaigns, touch layout, hidden reset/recovery and catalogue navigation remain pending; no full qualification credit.

The engine, physics, three-shot allowance, save schema and key are unchanged. This is original Canvas rendering with no external assets. Existing games/catalogue and main were untouched. Current main7b5ab86417d57b6eab7e8de7a8f8fc75d9556250 remains the verified Moon Dial release. No repeat publication investigation or automation change was needed.

## Counts and next step
Third ledger remains exactly50 slots:24 built,2 fully improved,2 browser-tested,2 integrated,2 live. Pebble Rink is not counted as qualified and remains unlisted. Second collection remains complete with20 additional improvements and9 selected upgrades live. Next finish Pebble Rink rendered campaigns/touch and hidden-action checks before selection. Evidence is agent review and automated tests, not human enjoyment or measured content-hours.
