# Gummy Bay v120 — direct parcel handling and dead letters

The direction is an original, hands-on underground business game. Schedule I's official Steam description (https://store.steampowered.com/app/3164500/Schedule_I/, consulted 2026-10-24) describes a progression from manual manufacture/distribution to properties, workers and automation. This pass addresses one piece of that tactile experience; it does not recreate its content or claim that Gummy Bay is now comparably polished.

## Implemented

- E grabs the aimed, reachable parcel directly. G uses an eye-directed target rather than the first nearby item; owned and wall-obscured items are excluded.
- Carrying follows eye height, crouch and vertical look. Exponential easing replaces frame-dependent horizontal tracking and instant vertical snapping. Swept wall/roof checks remain authoritative.
- Throws follow vertical aim. Shift+G releases gently. Existing host-authoritative actions and inventory remain in place.
- Added instanced slat seams, metal straps, label marks, ground-contact shading and an occluded target outline. Fixed reusable resources; no new shadow-casting lights or texture downloads.
- Four original shipping-note discoveries are recorded when parcels are picked up and persisted in the shared notebook. These are flavour discoveries, not new production mechanics or a claimed quest chain. They do not grant money or modify business stock.
- Carry controls remain visible while holding a parcel.

## Validation and limits

See evidence/v120-final-tests.json for the completed check results. Tests include actual game functions with mocked DOM/WebGL, save roundtrips, direct E interaction and pitched throw, occluded/owned targeting, 30/120 FPS carry convergence, crouching and stable visual resources. Two previous boot assertions now check the intended eased movement above the raised floor rather than expecting immediate vertical teleportation.

The managed preview at http://terminal.local:4173/ reported “Error creating WebGL context”. This is not a rendered visual, audio, performance or live co-op acceptance test. No claim is made that the opening or the complete graphics/physics overhaul is finished. New geometry and the wider playfeel still require a working GPU browser.
