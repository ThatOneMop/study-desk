# Gummy Bay v145 — Wheels & Weather

Built on top of v144 (#43 feel pass): gradual steering lock (`steerStep`), speed-based FOV (`driveFov`), docked driving HUD, hidden phone action buttons while driving and story events held while driving or in a chase are all kept. The v144 van path remains as the fallback when no car is active.

## Vehicles
- **Honest Al's Pre-Loved Motors** (dodgy used-car lot, Old Town west): buyable cars with distinct weight/grip/top speed/trunk size. Walk up, open the lot menu, buy; the bought car becomes your active vehicle.
- **Get in / out**: walk to the driver door and press F; F again to exit beside the car (exit point is collision-checked).
- **Arcade handling** (`car-physics.mjs`): mass and weight transfer, grip-limited lateral slip, drift latch on Space (handbrake) with a low-speed release, braking and reverse, wall slide/bounce.
- **Feel**: chase camera that leans into turns and shakes on impacts, engine tone pitched by RPM (Web Audio, gears), tyre skid marks (pooled decals, smaller pool on Low).
- **Trunk**: cars carry stock (T opens the trunk; move items between pockets and trunk). Trunk stock is exempt from foot body searches, but a pull-over by a cruiser seizes part of it.
- **Police cars**: in a pursuit, Sugar Squad cruisers spawn and chase you along the road. They refill your heat while they can see you.
- **Losing them**: break line of sight (corners, alleys, distance). Once no officer or cruiser sees you, the chase ladder cools and clears: "They lost you." If a cruiser reaches you while you're slow or stopped, it's a pull-over (cartoon, family-friendly: candy confiscated, no weapons).
- **Ambient traffic**: skipped. It wasn't cheap enough on Low (each car is several draw calls plus pathing), so it's left out.

## Weather
- Deterministic daily schedule (seeded by day): dry, showers, rain, storm. Rain arrives and eases in windows during the day.
- **Phone**: a weather card on the phone home screen ("Raining now / Tomorrow: …"), with a 3-day forecast menu.
- **Visuals**: instanced rain streaks, a pooled splash budget, puddle decals, wet road sheen (roughness/metalness lerp on road materials) and an overcast lighting/fog grade.
- **Audio**: a filtered-noise rain bed scaled by intensity.
- **NPCs**: a share of walkers open candy-coloured umbrellas; the rest hurry (run for cover).
- **Low quality**: about half the drops, a smaller splash budget, no puddle reflections, and the ~20 cloud sprites skipped in steady rain (the overcast grade already fills the sky). Saved with the game.

## Draw calls (Low, shot mode, renderer.info.render.calls)
| View | main v144 dry | v145 rain |
|---|---|---|
| Overview (16,11.5,46) | 335 | 319 |
| Spawn street (0,1.7,8 → −Z) | 311 | 296 |
| Old Town main street | 230 | 212 |
| Used-car lot | 210 | 194 |

Old Town main street stays ≤250. The overview and spawn views were already above 250 on main before this change; rain on Low nets 16–18 fewer calls than main dry. In-game Low while driving in rain: about 146–170 calls.

## Tests
- `tests/car-physics.mjs`: physics sanity (acceleration, top speed, braking time-to-stop, drift latch/release, walls, trunk moves).
- `tests/weather.mjs`: schedule determinism, rain windows, forecast copy.
- `tests/vehicle-game.cjs`: game.js integration covering lot, purchase, enter/drive/exit, trunk vs body search, cruisers spawn, refill, losing them, pull-over seizure, Low rain budget, phone forecast and save/load.
