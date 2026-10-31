# Lanewright — road-network research

Research for an original Study Desk game. This note records how Dinosaur Polo Club's *Mini Motorways* plays, as far as public pages go in October 2026. It is a mechanics reference only.

Nothing here is a licence to copy that game. Lanewright uses its own name, cities, colours, writing, interface, drawing and synthesised audio. Real city names from the original, its logo, its building art, its pin graphics, and its soundtrack are not reused. Composer credit on the original is not used; music in Lanewright is generated in the page.

## Sources

- Wikipedia, "Mini Motorways", retrieved 31 Oct 2026: https://en.wikipedia.org/wiki/Mini_Motorways — Dinosaur Polo Club, puzzle strategy, follow-up to *Mini Metro* (2015). Apple Arcade 19 September 2019; Windows and macOS 20 July 2021; Nintendo Switch 11 May 2022. Designers Robert Curry and Niamh Fitzgerald. Artists Poppy de Raad and Blake Wood. The gameplay section is the main rules source below. Metacritic is listed as 80 (iOS), 87 (PC) and 81 (Switch). The article's map list, as of September 2026, names 25 cities and notes later additions (Istanbul, Singapore) in the same section.
- Steam store page, app 1127500: https://store.steampowered.com/app/1127500/Mini_Motorways/ — the public feature list: drawing roads in a city that grows differently each game, upgrades including highways and roundabouts, a creative mode with unlimited tools, a stress-free endless mode that lets you keep building after the city stops, an expert mode, daily and weekly challenges, colour-blind and night palettes, and a soundtrack that grows with the city.
- Miraheze, "Gameplay": https://minimotorways.miraheze.org/wiki/Gameplay — houses send cars to same-coloured destinations, pins mark demand, a full loop back to the house is described there as a trip, destinations can upgrade into a circle form with higher demand, and an unserved destination starts a countdown that ends the city. Cars slow or stop at intersections and red lights, and speed up on motorways.
- Miraheze, "Maps": https://minimotorways.miraheze.org/wiki/Maps — each map is simplified terrain. City challenges unlock after 1,000 trips in normal mode. 600 trips on a challenge unlocks expert mode. Daily and weekly challenges are separate.
- Miraheze, "Daily Challenge": https://minimotorways.miraheze.org/wiki/Daily_Challenge — one shared seed a day, reset 00:00 GMT, one posted score. The map and modifiers are randomised, and a daily run can use a map the player has not unlocked yet.
- Fandom, "Mini Motorways" and "Upgrades": https://mini-motorways.fandom.com/wiki/Mini_Motorways and https://mini-motorways.fandom.com/wiki/Upgrades — Sunday choice of two bundles. Road tiles are the basic currency (about 30 or 40 at the start, depending on the city; **inferred** from that page's "30 or 40" line, not from a city-by-city table). Bridges and tunnels are each bundled with 20 road tiles. A bridge or tunnel crossing spends one special piece for the whole stretch, and still spends a road tile per segment. Motorways come with 10 road tiles, do not spend road tiles themselves, and cap at 9. Roundabouts and traffic lights are available on every map. Mountain cities start with one tunnel.
- Steam Community guide "Quick Mini Motorways Strategy Guide" by a player (file 2553726183): https://steamcommunity.com/sharedfiles/filedetails/?id=2553726183 — houses do not end the game; only a destination's pin timer does. Square buildings and circle buildings differ in how fast pins gather. Traffic lights let one axis through without the usual intersection slowdown. Roundabouts need the surrounding tiles free of buildings, so they have to be placed before the city fills in. Motorways are the tool for a long same-colour commute that would otherwise cut through other traffic.
- Wikipedia's summary of the 15 December 2019 write-up it cites for the pin caps: seven pins on a square building and ten on a circular building start the warning timer. Cars prefer a building that is already on a timer. An arrival shaves the timer. Once the pin count is back inside the cap, the timer drains on its own and the extra demand splits back into ordinary pins.
- Wikipedia timing note: an in-game week is about two and a half minutes unless the speed control is faster.
- Public play footage (including civil-engineering channels that treat the game as a network puzzle) shows the same loop: drag roads on a grid, right-drag to refund tiles, pause on Sunday for a binary upgrade, and lose when one destination's ring completes. Those videos are not transcribed here and none of their words, layouts or captions are reused.

Where a number is not printed in those pages it is marked **Inferred**.

## What the game is

A top-down traffic puzzle on a pale grid. You do not drive. You draw a road network, with a limited pile of tiles, so that small cars can keep up with demand. The picture stays calm — soft ground, hard-edged buildings, almost no decoration — while the problem gets sharper.

The score is trips. A trip is a pin collected at a destination (Wikipedia and the public scoring explanations agree that the points equal pins collected; the Miraheze page also describes the car returning home, which is the rest of the loop but not an extra point).

## Houses, destinations, cars, pins

- Houses are the round buildings. Each holds two cars. Cars leave only when a same-coloured destination has a pin waiting, and they pathfind on what you drew.
- Destinations are the other buildings. They generate pins over time. A square is the ordinary form. A circle is an upgraded destination and asks for more trips.
- Pins are the demand pips around a destination. Seven on a square, or ten on a circle, is the overflow line. Past that, a ring timer starts. If the ring completes, the city stops and the score is final.
- Cars already on the way, and cars choosing a new job, prefer a destination whose ring is running. Arrivals remove pins and nibble the ring. Under the cap again, the ring empties by itself.
- A house with nowhere to send its cars does not, by itself, end the run. The failure is always a destination. (The Steam strategy guide is explicit about this, against the intuition carried over from *Mini Metro*.)
- New houses and destinations appear in zones as the clock runs. Colours are added over the course of a run, not all at once. **Inferred** from play descriptions: a run starts on two colours and later colours arrive with the weeks, up to a handful rather than the full palette on minute one.
- Cars are not instant. They queue. An intersection slows them, sometimes to a stop. A red light stops them. A motorway speeds them and skips the streets in between. Bridges and tunnels are how a road crosses water and mountains; on some challenge modifiers they are faster too. Lanewright does not copy those modifier names.

## Roads and the pointer

- Roads snap to a square grid and run orthogonally or on the diagonal.
- Each new grid step spends one road tile. Deleting a segment refunds it.
- Drawing is a drag. Erasing is a right-drag, or an erase mode on a touch screen.
- You can run out of tiles with the city still alive. That is the usual reason a Sunday choice matters.
- The map can be panned and zoomed. Touch play needs a draw gesture, a separate erase control, and a pinch zoom. **Inferred** from the iOS release and from standard play of the touch version; the store page does not print the gesture list.

## Sunday upgrades

At the end of each in-game week the clock pauses and you pick one of two offers. Both offers include road tiles. One of them includes a special tool. Sometimes the other offer is only more road tiles.

| Tool | What the public pages say | Lanewright reading |
| --- | --- | --- |
| Road tiles | The basic stock. Cities start around 30 or 40. | Spent per grid step. Refunded on erase. |
| Bridge | Crosses water. One bridge covers a whole stretch, however long. Still spends road tiles per step. Cannot branch into a junction of bridges. | Same economy. A shoreline edge, with land on one side, is an ordinary road. |
| Tunnel | Crosses a mountain. Same "one tool for the whole stretch" rule. Mountain maps start with one. | Same economy. |
| Traffic light | Alternates which axis may pass. Lets the green axis skip the usual intersection crawl. Often considered the weakest tool. | Two phases, horizontal and vertical. |
| Roundabout | A one-way circle on a 3×3. Does not spend road tiles. The four tiles around the centre must be free of buildings, so it is placed early. Cars barely slow down. | Placed on a grid point whose touching cells are land and empty. Short reservation instead of a full stop. |
| Motorway | A single fast link from A to B. Flies over roads and water. Does not fly over mountains. Does not spend road tiles. Ends sit on the grid. The curve can be nudged for visibility without changing the trip. Cap of 9 in the original. | One fast graph edge. The bow is visual. Mountains block the line. |

Deleted specials return to the pile. In the original, a deleted motorway waits until cars already on it have finished. Lanewright returns the piece immediately and sends those cars to look for another path, so a delete is never a stuck car.

## Time, score, modes, unlocks

- A week is about 150 seconds at 1× (Wikipedia: two and a half minutes). Speed controls scale the clock.
- The score on the result screen is the trip count.
- Daily challenge: one seed for the UTC day, one posted score, may use a city you have not unlocked. Weekly challenge: one seed for the ISO week, repeated attempts, best score kept. Both exist from the start in the original.
- Maps unlock through play. The published challenge gates (1,000 trips to open a city's challenges, 600 to open expert) are campaign goals, not the rule for opening the next map. **Inferred:** the next map opens by reaching a trip milestone on the map before it. Lanewright uses that reading, with lower milestones so a short Study Desk session can move, while a careful player still needs several weeks on a city.
- Creative / stress-free modes exist on Steam: unlimited tools, and building after a loss. Lanewright's sketchbook is the unlimited, no-loss table. The ordinary city run still ends when a ring fills.
- The expert mode and the long modifier list (named challenges such as permanent roads) are not rebuilt piece by piece. Daily and weekly runs pick one plain modifier so the seed changes the pressure without a second rulebook.

## Look, sound, feel

Public reviews, as summarised on Wikipedia and the store page, keep returning to the same three things: a minimal drawing, a soundtrack that stays soft while the city gets louder in the data, and a difficulty that is real without feeling cruel. Eurogamer's description of the audio, quoted on Wikipedia, is "a chilled tumbler of pips and muttering hums and clicks and whistles and honks". Rock Paper Shotgun, again via Wikipedia's reception section, noted that the little warning sounds tell you a junction is unhappy without making the loss feel like a siren.

Visually the original is a near-empty page: pale ground, water as flat colour, mountains as soft masses, roads as light strokes with rounded joins, buildings as one colour of circle or rounded square, cars as small lozenges, pins as a row of pips, and the failure state as a ring around one building. Shadows are short. Nothing is textured like a real city. New buildings pop in. Cars turn instead of snapping their nose.

Lanewright keeps that *kind* of picture — cream paper, a few saturated inks, round joins, a ring that fills — and none of the original shapes, palette entries, or audio. Sound is a generated pentatonic pad plus short tones for a tile, a trip, a warning tick and a stopped city. It adds a voice as the week number rises. It is not a transcription of the Disasterpeace score.

## What Lanewright deliberately changes

- Original title, original eight cities, original copy.
- No trains, no GIF export, no online leaderboard, no expert modifier catalogue.
- Saves stay in `localStorage` under `study-desk-lanewright-v1`.
- A headless simulation can run a scripted network, so demand growth and the ring loss can be tested without the canvas.
- Balance is aimed at a careful player lasting several in-game weeks, not at the original's high-score chase. Pin rates below are **Inferred** working numbers for that target, not leaked originals. The public pages do not print pins per second.

## Working numbers used in Lanewright

These are design choices for this replica, tuned so an unconnected destination dies in roughly a minute and a half, and a player who keeps connecting same-coloured buildings lasts several weeks.

| Knob | Value | Why |
| --- | --- | --- |
| Week | 140 seconds at 1× | Near the published two-and-a-half-minute week, and a readable Sunday. |
| Square cap / circle cap | 7 / 10 | The published overflow lines. |
| Ring | 15 seconds once over the cap | Long enough to redraw a junction, short enough that ignoring it loses. |
| Week-1 square pin rate | 0.105 / second, plus a short opening grace | Two cars on a short road can keep a new square under the cap. |
| Later weeks | +0.03 pins/second per week, and a further +0.018 after week 5; circles ×1.62 | Demand climbs even if you stop building. |
| Road speed | about 2.75 tiles/second; motorway about 6 | A long commute is a real choice, not a teleport. |
| Intersection hold | about 0.22 seconds, plus a half-tile wait if another car is already in the shared junction; roundabout about 0.06 | Queues form at crosses and not at gentle bends. |
| Opening road pile | about 38–46 tiles, Sunday bundles about 7–15 | Roughly a third under the first tuning, so a kept-up city spends the pile down instead of finishing with a surplus. |
| Cars per house | 2 | As published. |
| New colours | weeks 1, 2, 4, 6, 8, up to six | The palette arrives before the map is full. |
