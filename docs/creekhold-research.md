# Creekhold — research notes on Timberborn

Research for an original Study Desk game. This note records how Mechanistry's *Timberborn* (Steam app 1062090) plays, as far as public sources describe it. Creekhold uses none of that game's name, factions, logos, art, interface text, audio, or map layouts. Beavers are a real animal; Creekhold's colonists are an original species (nibs) with original writing.

Where a number was not published, it is marked **Inferred**.

## Sources

- Official wiki, Weather: https://timberborn.wiki.gg/wiki/Weather (temperate, drought, badtide, cycle definition, first-event durations, handicap behaviour, badtide contamination ramp).
- Official wiki, Fluids: https://timberborn.wiki.gg/wiki/Fluids (water vs badwater, irrigation, contamination range, pumps, water wheels and current).
- Official wiki, Water Wheels and Power Shaft: https://timberborn.wiki.gg/wiki/Water_Wheels and https://timberborn.wiki.gg/wiki/Power_Shaft (undershot wheels, flooded axles, horizontal vs vertical shafts).
- Official wiki, Reservoir: https://timberborn.wiki.gg/wiki/Reservoir (player-built storage: diversion, discharge, spillway, retaining walls).
- Official wiki, Game Mode: https://timberborn.wiki.gg/wiki/Game_Mode (Easy / Normal / Hard / Custom tables: population, food and water, season lengths, handicaps, injury, refunds).
- Official wiki, Needs, Well-Being, Breeding, Folktails, Iron Teeth category pages (hunger, thirst, sleep, shelter, wellbeing bonuses, lodges vs breeding pods).
- Official wiki, Forester: https://timberborn.wiki.gg/wiki/Forester (logs → inventor → lumber mill → planks, power, then gears and foresters).
- Jakub Wisznewski / Mechanistry, “Deep Dive: Designing the dynamic irrigation and water systems in Timberborn”, Game Developer: https://www.gamedeveloper.com/design/deep-dive-timberborn-s-water-mechanics (cellular water, virtual pipes, dams vs levees vs floodgates, drought evaporation).
- Mechanistry, Timberborn 1.0 notes on the wiki page “Two Days to Launch — Building the Beaver Way”: 3D water, irrigation, badwater, aqueducts, pumps and tanks, half-tile dam spill, floodgates, valves.
- Early public Steam posts from the Timberborn news hub (droughts replacing an earlier “dry season”, wood industry, difficulty presets, map editor). The fandom “User Interface” page repeats an older preset table; the official Game Mode page is the later one and is the table cited below.
- A player write-up of the handicap formula is quoted on the official Weather page (AlcatorSK, Reddit, linked from the wiki). That quote is a player explanation of the published settings, not a developer spec.

Public pages move. Figures below are from those pages as read on 31 Oct 2026.

## What the game is

A 3D colony builder. A small group of beavers builds a settlement on a ruined, layered landscape and lives off a river that does not run all year. The player places structures on a voxel grid, the river is a simulated fluid, and the failure state is an empty colony: no food, no stored water, or a population that never replaces itself.

The store and the developer diaries describe four pressures that stack:

1. Keep drinkable water through a drought, when sources stop.
2. Keep food, which depends on irrigated ground near clean water.
3. Later, survive a badtide, when the same sources run contaminated.
4. Grow the colony vertically: levees, platforms, stairs, and power shafts, not only a flat town.

Creekhold keeps those four pressures and the building vocabulary (dam, levee, gate, pump, tank, wheel, shaft, lodge, farm, saw, gears, science desk). It does not keep the post-apocalyptic timberpunk setting, the faction names, or the fiction.

## Water

### Cellular flow

The Game Developer deep dive is the clearest public description of the simulator:

- The map is layers of blocks. Each tile holds a water depth.
- Tiles connect to four neighbours by “virtual pipes”. The sim tries to level the water surfaces.
- A separate current (momentum) is estimated from how much water moved between ticks, compared with earlier ticks. A shallow stream over a dam spills gently; dumping a reservoir onto a plain floods.
- The tick is on the order of a few hundred milliseconds **(as stated in that article)**.
- Water evaporates. Evaporation is easy to ignore while sources are running and obvious once they stop.
- Depth also irrigates nearby ground. Crops and trees need that green ground. Aquatic crops in the full game need to sit in water; dryland crops need the irrigated bank.

The 1.0 notes add: waterfalls, badwater mixing, pressure, flow over several vertical layers (aqueducts), and flow speed changing how hard a water wheel works.

**Inferred for a small browser sim:** a stable version of this is a relaxation step. Each tick, if cell A's surface (solid top + depth) is higher than a neighbour's surface, move a fraction of the difference, capped by the water actually sitting in A. Scanning in alternating directions reduces a one-way bias. Current for wheels is the volume that crossed the cell this hour. That is the model Creekhold uses. It does not copy whatever numerical solver Mechanistry ships.

### What blocks water

Public descriptions agree on three different tools, and they are not interchangeable:

| Tool | Public behaviour |
| --- | --- |
| Levee | Solid. Water does not pass. Stacked to raise a wall or a platform. Water can sit on top and become an aqueduct. |
| Dam | Not solid. Spills once water is high enough. The 1.0 notes say a dam “allows water to spill above half a tile”. The deep dive says the dam regulates flow rather than using a hard on/off, because a hard gate oscillates and makes waves. |
| Floodgate | Player-set height. Closed, it is a wall. Open, it is closer to a dam or a gap. Used to hold a reservoir and to steer a badtide. |

Valves (fill and throttle), contamination barriers, and irrigation barriers exist in the full game. Reservoirs are not a single building. Players assemble them: a diversion upstream of the storage, a retaining wall (levees), a controlled discharge, and a spillway so the rest of the river still has somewhere to go (Reservoir wiki).

Water sources add fluid during temperate weather. They fade off at the start of a drought. Badwater sources add badwater except during drought. Pumps pull fluid off the map into a stored “water” good. Stored water is what beavers drink. The 1.0 notes are explicit that beavers do not drink the river: pumped water is the safe supply, and tanks are how it lasts a drought.

Creekhold follows that split. Nibs drink stored water. A paw pump moves clean river water into tanks. A stick dam has a crest above the riverbed so a pool forms upstream and the downstream side stays low. A clay levee is a full wall. A sluice gate has a height the player sets. Map edges marked as outlets delete water so a river can leave the map.

## Weather

Three weathers, from the Weather wiki:

- **Temperate.** Sources make clean water. Badwater sources, if the map has them, make badwater. This is when the colony stores food and water.
- **Drought.** Sources stop. Evaporation continues. The only water left is whatever is in tanks or still sitting in reservoirs. Pumps and water wheels on a dry bed do nothing.
- **Badtide.** Sources that would have made water instead make badwater. Contamination of a water source starts at 50% and rises to 100% over 12 hours, then falls the same way near the end. At 50% the fluid neither irrigates nor contaminates. Above 50% it contaminates ground and kills plants quickly (the wiki gives 0.2–0.3 days once a plant is on contaminated ground). Beavers who wade or swim in it can become contaminated. Bots do not.

A **cycle** is one temperate season plus one hazardous season. New games start temperate. Drought and badtide lengths roll between a minimum and a maximum, then a handicap shrinks the early rolls. The wiki's player quote describes the handicap opening at a fraction (for example 20% or 38%) and climbing to 100% across a set number of cycles. Early droughts are short on purpose so a new colony can finish a dam.

Badtide chance is a separate setting (40% in the published presets). A long streak of droughts raises the chance of a badtide, and the chance resets when a badtide actually happens. The first cycles can be set to “no badtide” (5 on Easy, 4 on Normal, 3 on Hard in the Game Mode table).

### Published difficulty (Game Mode wiki)

The page has been edited over time. This is the table on the official Game Mode page as fetched for these notes:

| Setting | Easy | Normal | Hard |
| --- | --- | --- | --- |
| Starting adults | 9 (another column on the same page says 8) | 9 or 8 | 9 or 8 |
| Starting children | 4 | 4 | 4 |
| Food consumption | 40% or 60% | 100% | 100% |
| Water consumption | 40% or 60% | 100% | 100% |
| Starting food | 300 | 130 | 90 |
| Starting water | 250 | 0 | 0 |
| Temperate days | 16–19 | 13–17 | 5–8 |
| Drought days | 2–4 | 5–9 | 15–30 |
| Drought handicap | about 25% for 8 cycles, or 20% for 10 | about 38% for 5–6 cycles | 20% for 12–15 |
| Cycles before badtides | 5 | 4 | 3 |
| Badtide days | 1–3 | 4–8 | 15–30 |

The same page shows two slightly different drafts of the easy consumption rate (40% and 60%) and the starting adult count (8 and 9). Both are cited so this note does not pretend the wiki is a single frozen number. The design intent is stable even where the cells differ: Easy starts with stored water and short droughts, Normal starts thirsty, Hard starts with less food and long droughts. Custom mode exposes the same knobs.

An older fandom table (7 adults, drought handicap 50% for 7 cycles on Normal) matches earlier public posts. Creekhold does not need those older numbers; the later official table is enough to see the curve.

Typical badtide play, from the Weather and Reservoir pages:

- Shut a floodgate and treat the badtide like a drought, living on the clean reservoir and the tanks.
- Or let the bad water stay in the main channel, keep it off the fields with barriers, and irrigate from a side pool.

Creekhold's sour tide is the first of those plans: sluice gates close, tanks and a clean pool carry the colony, and a gravel filter slowly cleans a neighbour cell. There is no second fluid good, no bots, and no pressurizer.

Drought length in Creekhold grows by a fixed step each cycle instead of a random roll, so the same map is testable. The shape matches the published curve: early hazards are a few days, later ones are longer, and sour tides wait until the faction has seen at least one dry spell. Real-time days are shorter than a leisurely Timberborn session **(Inferred: Timberborn's wall-clock day depends on the speed slider and is not a fixed public number)**. Creekhold's day is about fifty seconds at 1× so a first dry spell arrives in a few minutes and a long run still covers many cycles.

## Power

From the Water Wheels page, the Power Shaft page, and the public power guide on timberborn.org:

- Wheels are undershot. They care about horizontal current under the axle, not a waterfall dropping onto them.
- Deeper water does not help by itself. A deep slow pool can be worse than a shallow fast channel. Players narrow the channel with levees, gates, or terrain.
- If the water reaches the axle, the wheel is flooded and stops.
- Wheels in a row share current through their axles. Shafts carry power to buildings. Horizontal shafts do not jump a floor. Vertical shafts do, and they cost gears as well as planks.
- Water wheels stop in a drought unless a reservoir is still flowing through them. That is the usual reason to build a second generator.

Faction power, from the same public guides:

- Folktails get wind turbines. Wind ignores drought and ignores badwater, and it varies with the weather.
- Iron Teeth get engines that burn logs at a steady rate, compact and large wheels, and later a geothermal engine. Engines are the drought-proof option and they compete with building for wood.

Creekhold: a paddle wheel reads current and goes idle if the cell is almost dry or deep enough to cover it. Cog shafts link orthogonally. A rising shaft links a step up. The Reed Circle gets a reed fan (steady-ish wind, no fuel). The Cog Lodge gets a log engine (steady power, eats logs). A hand saw runs slowly with no power. The power saw and the gear press need a connected supply. If demand exceeds supply, every machine on that network slows by the same fraction.

## Needs, wellbeing, day and night

The Needs wiki splits needs into required, positive, and negative.

Required, with the figures published on that page:

| Need | Rough daily use | If it fails |
| --- | --- | --- |
| Hunger | about 2.67 food, decay 80/day on their meter | Work slows, then the beaver dies. A full beaver starves in about 5 days; one already starving, sooner. |
| Thirst | about 2.13 water | Movement slows, then death. Similar multi-day clock. |
| Sleep | a few hours a night; sheltered sleep restores faster than sleeping outside | Exhaustion. Homeless beavers walk to the district centre, or collapse if the walk is too far. |
| Shelter | restored by sleeping indoors | Folktails in particular breed poorly or not at all without it. |

Positive needs (nutrition variety, social buildings, decorations, monuments, fun) add wellbeing. Wellbeing, once it crosses thresholds, raises work speed, kit growth, movement, and life expectancy. The colony average is what the top-left meter shows. Reaching a wellbeing of 15 on Folktails is the public unlock for the other faction.

Wet fur, bee stings, chipped teeth, injuries, and contamination are extra statuses. Contamination is the one Creekhold keeps, because it is the badtide's direct effect on a colonist: they work worse until they recover at the hearth.

Working hours are a player setting. The Breeding page warns that more than 18 hours of work makes Folktails too exhausted to reproduce, which implies a day/night split and a long enough night to sleep. **Inferred:** the default day is a bright work period and a dark sleep period, and beavers stop ordinary jobs to sleep. Creekhold uses a fixed day: work from 05:00 to 20:00, sleep otherwise, and a colonist who is exhausted sleeps even in daylight. The map tints with the hour.

Creekhold's meters are 0–100 and the daily consumption is lower than 2.67 food because a browser colony is smaller and the days are shorter in wall-clock time. The relationships are the same: thirst kills faster than hunger, stored goods are the only thing that satisfies them, and a colonist who never reaches a pump dies when the starting crates run out.

## Population and the two factions

Breeding wiki and the faction category pages:

**Folktails.** Population is housing. Two adults can have a kit when wellbeing is positive, they have no negative effect, and their lodge has a spare bed. A one-bed mini lodge never produces a kit. Larger lodges grow the colony faster. Kits take days to grow up (the page uses 5 days in its staffing example). Life expectancy and that growth time decide how many kits a stable colony is carrying.

**Iron Teeth.** Kits come from breeding pods fed with berries and water, not from spare beds. Pods plus wellbeing set the population. The page warns that raising wellbeing without raising food and water can cause a famine, because the same pods support more beavers. Advanced pods later produce adults directly. Housing still matters for the shelter need, but it is not the breeding cap. Rowhouses pack many beds into a small footprint.

Other public faction contrasts Creekhold echoes, without using the names:

| | Nature-leaning faction | Industry-leaning faction |
| --- | --- | --- |
| Homes | Lodges, breeding from spare beds | Packed bunks, breeding from a workshop that spends food and water |
| Power when the river is dry | Wind | An engine that burns logs |
| Water | Standard pumps | A deeper pump |
| Mood | Hives, blossom, slower comfort buildings | Bells, a grill, a clockwork hauler |
| Risk | A full lodge and no spare bed means zero growth | A vat that outruns the farms means a famine |

Creekhold's Reed Circle is the housing-capped faction. The Cog Lodge's berry vat spends berries and water and will not start a kit unless a bunk is free, which is stricter than Iron Teeth pods. That cap is deliberate: a tiny map should not be able to breed itself to death in one unattended hour. The vat still asks for food and water, so the famine warning still applies.

Starting headcount in the published presets is a handful of adults plus a few children (about 8–9 and 4). Creekhold starts eight adults and no kits, with beds exactly full, so the first building the player adds is what allows a birth. Ages are spread so they do not all die of old age on the same day.

## Jobs, goods, and science

The Forester page spells out the wood chain in log-equivalents:

- A lumberjack flag costs nothing and turns trees into logs. (Creekhold charges a small timber-mark cost so the building is a placed object with a work radius.)
- An inventor (12 logs in that example) makes science.
- A lumber mill (15) turns logs into planks and wants power, from a power wheel or a water wheel.
- An industrial mill wants more power.
- A forester is unlocked through the inventor and plants trees so the colony does not strip the map.

A Steam post from early access describes the same chain in words: every beaver can cut, but planks and then gears need workshops, and foresters replant. Gears are the third tier and gate the taller power and industry buildings. Science points are the unlock currency. The wiki's Numbercruncher note (Iron Teeth) is a powered science building that does not need a worker; Folktails lean on inventors and observatories. Creekhold uses one wonder desk that needs a nib, plus a trickle of ideas from the hearth so a colony that has not built the desk yet can still buy a first licence.

Haulers are a job of their own in Timberborn: goods sit in small piles and someone has to carry them. Creekhold folds carrying into the worker's trip (a timber nib walks to a tree, chops, and walks back) and adds a haul post that increases what one trip brings home. A clockwork porter on the Cog side is an extra pair of building-hands and does not eat.

Builders are employed by the district and raise blueprints. Creekhold's nibs on builder duty walk to a blueprint that already touches the path network and stand there until the posts are up. Resources are spent when the blueprint is placed, and a cancelled frame refunds most of them. The Game Mode page puts refunds at 90% on Easy and 75% on Normal and Hard. Creekhold refunds 80% of a frame and 65% of a finished building, on every difficulty, so demolishing a mistake is safe but not free.

## Districts, paths, and height

Public district behaviour, as described across the wiki's district and path pages and years of patch notes **(the exact radius-versus-paths history is only summarised here)**:

- The district centre is the root. It is also the emergency shelter.
- A building works when a path connects it to that centre. Disconnected blueprints do not get builders.
- Beavers belong to a district. Another district needs its own centre, its own paths, and a way to pass goods (distribution posts, crossings).
- Vertical movement is stairs between path heights. Platforms and overhangs are walkable floors. Levees are the usual support.
- Terrain blocks and explosives (and later a dirt excavator) raise or lower the ground itself. Irrigation range changes with that height: the fluids page says a step up shortens contamination distance sharply.

Creekhold's rule is the path rule. The hearth is walkable. Footpaths, stairs, platforms, and bridges extend the network. A workplace must touch that network or the blueprint is refused. Nibs do not swim; the public game lets beavers swim, and Creekhold drops that so “can I build here?” stays visible in the path overlay. A second hearth works once a footpath joins it to the first. A disconnected hearth is a shelter with nobody in it.

Height: clay levees stack four high and water treats the stack as solid. Stick platforms stack three high, water flows under them, and stairs are how a nib climbs one floor at a time. A root cracker lowers dirt by one. An earth fill raises it by one. A creek bridge is a path that may be laid over water.

## Maps and the shape of a session

The wiki's map category says the game ships maps and a map editor, and that players share more maps through the workshop. The early Steam posts describe the editor as: sculpt height with the future river in mind, place sources and set their strength, paint trees and berries, mark a starting location.

Public map design, restated without using their map names:

- A first map is one river, a flat bank, and more berries than you need, so the lesson is “pump, tank, dam” before the first drought.
- A middle map forks. One arm is the reservoir, the other is the spillway. Building across the wrong arm floods the town or leaves the pump dry.
- A late map is a canyon. Flat ground is scarce, the first sour tide comes sooner, and stairs are part of reaching the water.

Creekhold's three bends follow that lesson plan and none of the official layouts: Willow Bend, Split Current, Ash Gorge. Each can be played on Gentle, Steady, or Harsh. Gentle's first dry spell is short and the stores are fuller. Harsh starts with less water than a full temperate season, a longer dry spell, and an earlier sour tide. The numbers are original; only the direction of the curve comes from the Game Mode table.

## Controls, as publicly shown

Store clips, the wiki's interface notes, and ordinary city-builder convention for this game line up on:

- Edge scrolling and WASD to move the camera, mouse wheel to zoom, and a rotate control (often the middle mouse or Q and E).
- A build bar grouped by jobs: paths, water, housing, food, wood, power, wellbeing.
- A ghost of the building under the cursor, green when legal.
- Speed buttons, including pause.
- Overlays or toggles for water and for what is connected.

Creekhold uses that shape because it is how this kind of game is operated, with touch added for a phone: one finger pans, a pinch zooms, a tap places. Nothing is bound to a Timberborn hotkey chart; Creekhold's keys are listed in its own help panel.

## What Creekhold deliberately does not copy

- The title, the wordmark, the beaver mascot, faction names (Folktails, Iron Teeth), district-centre fiction, badwater as a named substance, and any tutorial sentence.
- Building counts, hit points, and science costs as a spreadsheet. Creekhold's costs are small so a first dam fits in one sitting. The order (path and dam and pump first, then planks, then gears, then a filter and a deep pump) follows the public chain.
- Bots, grease, books, monuments, aquifers, and the full crop list. The comfort buildings are a story fire, a splash pool, lanterns, a blossom arch, and a shift bell.
- Multiplayer, the map editor, and workshop sharing.
- Any audio. Creekhold's sounds are short oscillators: a wood click, a low dam thud, a wind for the dry spell, a sour drone, and an original eight-bar loop. No soundtrack is sampled.

## Fairness check this research implies

A new colony on the easy preset should live through the first drought if it pumps into a tank while the river is running and puts a dam downstream of that pump so the bed does not empty on day one. A colony that places nothing should drink the starting crates during the wet season and die of thirst once the river stops, because there is no pump and no tank. That is the headless test in `tests/creekhold-smoke.cjs`. If the test only passes by giving the idle colony a free well, the drought is not actually doing the work the wiki describes.
