# Spanwright — bridge-physics research

Research for an original Study Desk game. This note records how Dry Cactus's *Poly Bridge 2* (Steam app 1062160, released 28 May 2020) plays, as far as public pages go in October 2026, plus the earlier *Poly Bridge* manual where a rule is only printed there.

Nothing here is a licence to copy that game. Spanwright uses its own name, logo, levels, writing, vehicles, art, and audio. World names, level names, and layouts from the original are not reused.

## Sources

- Steam store page for app 1062160, pulled 31 Oct 2026: https://store.steampowered.com/app/1062160/Poly_Bridge_2/ — Dry Cactus, 28 May 2020. The page describes a custom bridge physics engine meant to give everyone the same outcome, a new spring, workshop campaigns, a sandbox with more than twenty vehicles, split joints, a first-break indicator, and separate general and unbreaking leaderboards. Higher-resolution video replays are listed. The soundtrack credit on that page is not used here.
- Steam News Hub for the same app: https://store.steampowered.com/news/app/1062160
- Wikipedia, "Poly Bridge 2": eight worlds of 16 levels, plus six harder challenge worlds, 224 levels in all. A spring is the new material. A workshop hosts player levels. https://en.wikipedia.org/wiki/Poly_Bridge_2
- Poly Bridge 2 wiki, "Materials", "Vehicles", "Modes" (Fandom). The materials page lists road, reinforced road, wood, steel, rope, cable, hydraulic, spring, and an unused bungee. Roads are the vehicle-colliding pieces. Rope and cable take tension only. Springs deform and pull back toward a rest length until they break. Joints are the connections, not a material. Stress view is a toggle in simulation. A replay can be saved after a run.
- Developer Alan Lawrance, Steam discussion "Material Properties", 23 Nov 2020: https://steamcommunity.com/app/1062160/discussions/0/2965019884826729183/ — strength figures below. He wrote that the game does not show them in the interface and that they had been stable for a long time.
- NamuWiki, "Poly Bridge 2", building-materials section: costs, maximum lengths, hydraulics, and the note that laying wood or steel over a road no longer reinforces it the way the first game did. https://en.namu.wiki/w/Poly%20Bridge%202
- Poly Bridge 1 manual PDF (Steam app 367450, not 1062160), "Campaign and Simulation Tutorial Basics". Budget overage, stress colours, phases, checkpoints, hydraulics ±50%, split joints, boats and planes, world-map colours, and the simulate controls are written out there. Where this note uses that PDF, it is labelled PB1. https://steamcommunity.com and the CDN manual linked from app 367450.
- Community walkthroughs (GamePretty; Steam guides such as "Under Budget & Under Stress") for phase language, hydraulic percentages, and the names of challenge goals. Those level names and layouts are not reused.

Where a number was not published for Poly Bridge 2, it is marked **Inferred** or credited to the PB1 manual.

## What the game is

A side-view physics puzzle. You draw a span from fixed anchors, spend a budget, and press play. Vehicles drive themselves. They have to reach their flags. The structure sags, snaps, and collapses under load. You rewind, move a joint, and try again.

The store page stresses a deterministic custom engine: the same bridge should do the same thing every time. Simulation speed changes the clock, not the result. Leaderboards split ordinary clears from clears where nothing breaks.

## Materials

Strengths are in the game's force unit, PN. Costs are per metre. The strength column is the November 2020 developer post. Costs and maximum lengths are the NamuWiki PB2 table unless noted. The PB1 guide's hydraulic strength was 1,800 PN and its hydraulic price was $450/m; the PB2 developer later listed hydraulic strength as 2,000 PN, and NamuWiki lists the PB2 hydraulic price as $750/m. Spanwright follows the PB2 pair: 2,000 PN and $750/m.

| Material | Strength | Cost | Max length | What it does |
| --- | --- | --- | --- | --- |
| Road | 900 PN | $200/m | 2 m | The driving surface. Vehicles collide with road, not with the other materials. Resists tension and compression. |
| Reinforced road | 1,500 PN | — | — | Listed by the developer. NamuWiki says PB2 no longer lets you reinforce a road by drawing wood or steel over it (that was PB1, +300 PN for wood and +600 PN for steel). Not a Spanwright tool. |
| Wood | 800 PN | $180/m | 2 m | Cheapest brace. Tension and compression. |
| Steel | 2,000 PN | $450/m | 4 m | Stronger and longer than wood. Tension and compression. |
| Rope | 1,200 PN | $220/m | Unlimited | Tension only. Goes slack in compression. |
| Cable | 2,200 PN | $400/m | Unlimited | Tension only, stronger and dearer than rope. |
| Hydraulic | 2,000 PN | $750/m | 4 m | Rigid piston. Can extend or shorten. |
| Spring | 960 PN | $380/m | 3 m | Soft. Pushes or pulls toward its rest length, then breaks. New in PB2. |

Joints themselves are free. You pay for length. **Inferred** from the guides, which price members by the metre and never list a joint fee.

Hydraulics change length by up to 50% either way (PB1 manual). A longer piston therefore travels further in metres. Springs can be set compressed, neutral, or stretched (community guides talk in percentages such as 30% or 40%). NamuWiki describes a spring's pressure as adjustable, including a trampoline-like abuse if you push it.

Rope and cable do not hold a wheel and do not hold compression. A deck still has to be road if anything is going to drive on it.

## Joints, anchors, split joints

- Anchors are the fixed bolts already in the level. They do not move.
- A joint is a pin where members meet. Pins do not resist bending on their own. Triangles do.
- Building snaps to a grid. Members run from joint to joint.
- You can cross two members without them joining. They only share load if they share a joint.
- Split joints are two (PB2 store page: also three-way) pins in the same place that can be told to let go on a chosen phase. The PB1 manual says a split that is closed again while the two halves overlap will carry stress, and can be opened later. Drawbridges use this so a leaf can lift without tearing the member that tied it down.
- The PB1 manual tells you to zoom in and check which side of a split each member belongs to.

Spanwright uses two-way split joints, grid snapping, free pins, and fixed anchors. Three-way splits are a PB2 extra; a two-way hinge covers the drawbridge levels in this campaign.

## Stress view

PB1 manual: toggle with T during simulation. The picture runs from low (green, or white in the colour-blind palette) through medium (yellow / grey) to high (red / black). The toolbar also shows the current peak stress. The PB2 wiki describes the same toggle.

The published pages do not give the numeric cutoffs between low, medium, and high. **Inferred bands** used as a stand-in: under 45% of that member's strength is low, 45–78% is medium, above 78% is high. A member at or above 100% is about to snap.

PB2's store page adds a first-break indicator so you can see which piece failed first when a collapse is messy.

World-map colours in the PB1 manual: white not cleared, yellow cleared over budget, green under budget, blue under budget and under 100% stress. PB2's store page keeps a separate unbreaking leaderboard, so "nothing broke" remains a first-class goal.

## Budget

Each level has a dollar budget. Cost is length times the price above.

PB1 manual: you may overspend by up to 50% and still finish, then come back for a cleaner score. Past that, the level does not count. Under budget is the better clear. Under budget and under 100% stress is the best clear.

**Inferred for PB2**, because the store page no longer prints the 50% sentence but players and guides still treat "under budget" and "unbreaking" as the two challenge goals on top of simply arriving. Spanwright keeps the PB1 50% ceiling, a budget star, and an unbroken star.

## Vehicles, checkpoints, flags

The PB2 wiki's default vehicle table (masses can be edited in the sandbox):

| Vehicle | Mass (PG) | Mass (kg) | Speed (m/s) |
| --- | --- | --- | --- |
| Vespa | 1.5 | 6 | 3 |
| Compact car | 3.5 | 14 | 5 |
| Taxi | 4 | 16 | 5 |
| Sports car | 4 | 16 | 12 |
| Model T | 4.5 | 18 | 3 |
| Pickup | 5 | 20 | 3 |
| Van | 6 | 24 | 4 |
| Truck | 7 | 28 | 3 |
| Dump / flatbed / articulated bus | 14 | 56 | 2–3 |
| Container / tanker | 21 | 84 | 3 |

Other rows on that page include ambulance, bulldozer, dune buggy, fire truck, limo, monster truck, school bus, steamcar, and tow truck. Sandbox order is lightest to heaviest, vespa through tanker.

Rules from that page:

- A vehicle starts when its phase says so.
- It is finished only when it touches its flag after every checkpoint that belongs to it. Reaching the flag early does not count; the wiki quotes the warning "Vehicle reached flag without touching checkpoint".
- If several flags match, one is enough.
- Falling out of the map, or drowning (half the wheels underwater), fails the level if it happens before the vehicle is done. After it is done, falling does not undo the clear.
- Checkpoint kinds called out on the wiki and in the PB1 manual: ordinary markers, stop, reverse, speed change, and "start another phase". Speed changes are absolute, not stacked. Ordered markers are marked so they must be taken in sequence.
- A stop checkpoint holds the vehicle until a later phase releases it.
- Boats and planes are crashing vehicles. They follow a lane and break what they hit. The PB1 manual draws that lane in the build view so you can route around it or lift a leaf out of the way.

Spanwright uses an original roster whose masses stay in that light-to-heavy spread (cycle through cistern), original names, and the same checkpoint, flag, drown, and barge-lane rules. Planes are not in this campaign; barges are the crashing traffic.

## Phases, hydraulics, simulate, replay

A level is a timeline of lettered phases, left to right (PB1 manual). A phase can release vehicles, send a barge, arm hydraulics, and open or close splits.

Hydraulic control (PB1 manual and NamuWiki): you pick which pistons move on which phase. Armed pistons drive toward their ±50% setting. Unarmed ones are not driven. Split joints are armed the same way.

Simulation:

- Build, then play. Physics runs, vehicles drive, phases fire on the clock.
- Speed buttons scale the whole clock, including the vehicles (PB1 manual).
- Stress view can be toggled during the run.
- Pause, then reset back to the intact build. The first broken member stays marked.
- After the run, replay it. PB2's store page is about video replays you can share; Spanwright keeps an in-browser replay scrubber, not a video file and not a share service.

The PB2 wiki's three modes are build, simulation, and sandbox. Sandbox adds vehicles, anchors, and the phase list. Campaign play is build plus simulation.

## Worlds and challenge goals

Wikipedia: 8 worlds × 16 levels, plus 6 challenge worlds, 224 levels. Public walkthroughs use the original world and level titles; those are not part of Spanwright.

Challenge goals that show up across the manual, the store page, and the guides:

- Finish at all (vehicles make their flags, spend no more than 150% of the budget).
- Under budget.
- Unbreaking / under 100% stress.
- Some challenge levels ask for both at once.

PB1 also unlocked "unlimited materials" and "unlimited budget" cheats after a perfect world. Spanwright does not add those cheats. The yard sandbox is the unlimited table, opened after the first clear.

## What Spanwright keeps

Grid-snapped pins and anchors, the material table above, tension-only rope and cable, hydraulic phases at ±50%, spring preload, stress colours plus an ink palette, a 50% overspend ceiling, budget and unbroken stars, checkpoints and flags, barge lanes, a deterministic fixed-step simulate and replay, six small worlds, and a sandbox.

## What Spanwright does not take

The name, logo, interface art, vehicle designs, music, sound effects, level maps, world names, written hints, and the workshop, leaderboards, and share-replay services. Audio is synthesised in the page. Drawing is procedural. Progress stays in `localStorage` under `study-desk-spanwright-v1`.
