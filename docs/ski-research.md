# Ski Lines: Trail Map — rules research

Research for an original Study Desk game. This note records how Yunogames' *Ski Lines: Trail Map* (Steam app 4854120) actually plays, as far as public sources go in October 2026. The full game is listed for November 2026 and was not available to buy; the free demo was.

Nothing below is a licence to copy the game. Winterfold uses its own name, logo, mountains, wording, and code. Real resort names from the demo (Ski Dubai, Grand Tourmalet, Isola 2000, Cardrona, Niseko United, Chamonix, Zermatt–Cervinia, Afriski, Perisher) are not used in our game.

## Sources

- Steam store page: https://store.steampowered.com/app/4854120/Ski_Lines_Trail_Map/ and the `appdetails` API for the same id (pulled 29 Oct 2026).
- Steam news hub: https://steamcommunity.com/app/4854120/allnews/ — patches 0.1.1 through 0.2.4, the demo announcement, sandbox, and the controller post.
- Steam Community threads on app 4854120 (General Discussions), especially:
  - EvanED, “Thoughts/Ideas/Bugs from demo”, and the developer reply (26–28 Oct 2026).
  - Yunogames reply on “Proximity optimization” (snap is intentional).
  - German Hans, “make skier use alternative routes”.
  - h1nich5, “small bugs/ux” (pathing piles up at a direct lift).
  - Emma and Wolffis, “Rescue station end game?”.
  - tarmo888, “Ski Dubai day 39 score 169444 rank #1”.
  - ArrayKnight / Yunogames on sandbox overcrowding expectations, in “Feature suggestion: hide layers”.
- Studio page: https://yunogames.studio/en/ski-lines
- Real Civil Engineer, “I cannot stop playing this game!!” (24 Oct 2026), described by the developer as an older build. The public description calls it Mini Metro crossed with a ski resort. No full transcript was available.
- Store screenshots and the in-game HUD (time, day, score, guest count, tool stocks, day-7 supply cards, game-over card, level select, Isola 2000 record card).
- European piste-colour practice (green / blue / red / black, with orange used for a marked traverse or itinerary) as background only. The game never publishes its own percentages. Wikipedia “Ski run” and the INTERSPORT Rent difficulty chart were used as the real-world reference, not as a claim that the game uses those exact cutoffs.

Where a number or rule was not published, it is marked **Inferred**.

## What the game is

A top-down trail-map strategy sim. You draw ski runs and lifts on a stylised resort map, spend limited tool stocks, and keep guests moving until 18:00. Each morning a new place can appear and you pick one supply card. Runs continue until the hill fails to clear. Players and the developer both describe it as Mini Metro-like: shaped guests, shaped stops, limited resources, and a network you redraw under pressure. The ski-specific parts are the terrain, the one-way runs, the daytime deadline, and the slope colours.

The store also lists a level editor, community maps, roguelike replay, and resorts inspired by real regions. The demo’s playable hills were Ski Dubai (full level, no demo score cap) and Grand Tourmalet (capped around 2,000 points, roughly the first three or four days). Later screenshots show the wider resort list.

## Drawing pistes

Observed:

- One tool, labelled SLOPE, spends a **length budget in metres**. Patch 0.1.1 starts you with **200 m**. The dock shows the remainder, for example “153 m”.
- You draw a freehand curve on the map. Patch notes describe smoother curves, zoom-dependent snapping, and merging into an existing run.
- **Difficulty is computed, not picked.** While the button is held, the game previews a difficulty. Extending the stroke can make that preview easier, and a section can change colour after the stroke grows. The developer’s reply explains the intended rule: **an intersection splits trails into separate sections, and each section has its own difficulty.** A single section that shows two colours is called a bug, not the design.
- Sections are **one-way, in the direction drawn**. The developer confirmed this is intentional. Uphill trails are allowed; the game mentions them in a popup that players often miss. A player who met two opposite one-way ends saw a circle at the join and then broken guest routes.
- You cannot start a stroke on a tree. The game tells you so.
- Runs need snow. Bare ground is opened with a snow cannon (store copy and the cannon tool).
- Trees block a run until cut. Rocks, barriers, cliffs, rivers, and chalets also block routes (29 Sep 2026 scenery post).
- Endpoints do **not** need to be pixel-perfect. The developer said a guest can walk a few metres from a nearby end to a stop or a lift. Players used that to save metres.
- Erasing was changed in 0.1.1 from “delete a whole section” to **metre by metre**, including holding the button to keep removing the same trail. Undo and redo arrived in 0.2.2. Deleting a run refunds what you spent; a player who had put hours in described redrawing trails, lifts, and upgrades as getting the resources back, in the Mini Metro way.
- A hover label reads like “Slope Green - 11 m”: colour plus length of that section.
- The legend counts sections already drawn: Green, Blue, Red, Black, and **Trail** (orange on the map). Trail is the fifth category, used by players as a flatter link (“trail to the right summit”).
- Very short steep bits can hide under a stop icon. Crossing a new winding run over an old straight one can eat the old segment (reported as a bug).

**Inferred colour bands**, because no patch lists percentages. They follow the usual European order and the observed fact that a longer, gentler extension makes a section easier, so the band is the **average grade of that section along the drawn direction** (positive means downhill):

| Colour | Average grade along the stroke | Who it is for |
| --- | --- | --- |
| Trail (orange) | About −12% (slightly uphill) through +6% | Slow link anyone can use, including a gentle climb |
| Green | About 6–16% downhill | Easiest skiers |
| Blue | About 16–25% | Intermediates |
| Red | About 25–40% | Strong intermediates |
| Black | About 40–58% | Experts |
| Rejected | Uphill steeper than about 12%, or downhill steeper than about 58% | Cliff or impossible climb |

A local step that is far steeper than the average still counts as a cliff so a line cannot tunnel through a rock band. These cutoffs are a design stand-in, not a measured value from the demo.

## Lifts

The legend has three types, with counts of how many you have built:

- **Ski lift** — the surface / drag lift. The 29 Sep 2026 post says its path must be clear at ground level. Trees, cliffs, and other obstacles block it. It used to fly through forests and up cliffs; that was removed.
- **Chair lift** — the middle type. Screenshots show it spanning forest between stops.
- **Cabin lift** — the long gondola. Players build fewer of these.

Patch 0.1.1 starts you with **4 lift tokens**. The dock shows how many tokens remain. A daily card can grant **+4 lift** tokens. A day-39 player said the early game is mostly lift capacity, and that a lucky streak of +4 lift cards was what carried a full upper-mountain mesh.

**Not published:** token cost per type, seat counts, speeds, or maximum length. **Inferred** for Winterfold, so the three legend types stay distinct and the early game is capacity:

| Type | Tokens | Seats on the line | Pace | Span | Terrain |
| --- | --- | --- | --- | --- | --- |
| Ski lift | 1 | 4 | Slow | Short, about 190 m | Clear ground only. No trees, rocks, rivers, fences, or cliffs |
| Chair | 1 | 8 | Medium | About 360 m | May cross trees. Not rocks or cliffs. May cross a narrow river |
| Cabin | 2 | 16 | Fast | About 620 m | May cross trees, rocks, and cliffs. Terminals still need a footing |

Lifts are drawn as a straight grey line and always run **uphill**. Guests do not ride them down. Cabins or chairs animate along the cable. Upgrades, below, raise seats and pace.

## Points of interest

Legend rows, matching the icons on the map:

| Stop | Icon | Notes |
| --- | --- | --- |
| Station | Square | Where guests arrive, and where “home” is |
| Summit | Triangle | The developer joked that the triangle is the main character |
| Viewpoint | Diamond | |
| Rescue | Cross / plus | Late-game pile-up on the small indoor hill |
| Snow park | Star | |
| Bar / Cafe | Cup | Winterfold calls this a cafe only |
| Restaurant | Plate / crossed utensils | |
| Refuge | House | |

The sidebar count is how many of that icon exist, not how many you have connected.

Observed behaviour:

- New stops appear as days pass. The demo announcement’s example is a new station “in exactly the wrong place”.
- A disconnected stop **flashes**. A player noted this is less useful when the shape is a duplicate and nobody currently needs it. That sentence is the clearest evidence for **Mini Metro shapes**: a guest is a shape, and any stop with the same shape can satisfy them.
- Guests can use a line whose end is merely near the icon (developer: they walk a few metres).
- Rescue gathers a crowd that is hard to empty. One player got past day 20 on the small hill by building green, blue, and red into the viewpoint, an orange trail to a side summit, and a lift straight out of the viewpoint. Several colours to the same stop is a real strategy, which only makes sense if different guests cannot all share one colour.
- Wolffis called rescue the key point of that hill.

**Inferred guest model:**

- Each guest has a **shape** (the stop they want) and a **skill** (green, blue, red, or black).
- They appear at stations through the morning and early afternoon.
- They may ski a run of their skill or easier. Trail links are open to everyone but slow. They prefer a run that matches their skill when one exists, so a green highway does not automatically solve a red guest.
- They ride any lift.
- They want that shape, then a station, before dusk.
- If two legal runs of the same colour join the same pair of stops, the demo sends everyone down the shorter one. Players asked for balancing; the developer had not changed it as of 28 Oct 2026. A direct lift is also over-used: guests who want the cross will queue for a lift aimed at the cross instead of riding a different lift and skiing the last bit.
- Winterfold keeps the shorter-route preference, but adds a queue penalty so a badly jammed line will spill onto a free legal alternative. That is a small, stated departure, made so a second run is worth building.

## Resources, points, and the morning draft

There is no cash shop. The top-bar figure is **score** (the game-over card labels it SCORE). Tool stocks are the only thing you spend.

Starting stocks after patch 0.1.1 (the trail and lift numbers were already those values; cannons, trees, and upgrades were raised):

- 200 m of trail
- 4 lift tokens
- 4 snow cannons (was 1)
- 20 tree removals (was 0)
- 4 upgrades (was 0)

The dock is SLOPE (metres), LIFT, CANNON, CUT TREES, UPGRADE, each with a number left. Hotkey digits 1–5 sit on those buttons in screenshots.

Each new morning opens a three-card draft: “Choose an upgrade for today.” The day-7 screenshot shows:

- LIFT +4
- SLOPE +200 m
- UPGRADE +2

You take one. **1 reroll** is showing, with the line “A new reroll every week.”

**Inferred:** cannon and tree cards also exist in the deck (+2 cannons, +8 cuts), because otherwise those stocks never grow and the store’s “choose your expansions” line would ignore two of the five tools. Only the three cards above were visible in public shots, so the extra two are marked as an inference. Weights favour lift, slope, and upgrade.

Score rises all day. A four-day loss on a high resort showed 2,863. A strong Ski Dubai run reached day 39 with 169,444 and a leaderboard rank. Grand Tourmalet’s demo stopped near 2,000 points. **Inferred scoring:** points when a guest reaches their shape and again when they get back to a station, higher for a harder skill and for a later day, so long runs pull away from early ones.

Deleting a run, lift, cannon, or upgrade refunds what it cost. Tree cuts come back only through undo (see below), not as a refund when you erase a run.

## Day, clock, and speed

Observed:

- The clock uses an `7H25` style and runs from roughly **07:30 to 18:00**.
- At 18:00 the clock turns red. If guests are still out, the card says they are still on the slopes at 18:00. That is the loss. The developer’s sandbox post says the normal rule is that every skier must be home before 6 PM.
- The guest readout is `on the hill / today’s crowd`, such as 17/70 early, 70/70 late, 60/80 on a failed closing, 100/100 on a large hill. The denominator grows with the day and the resort. It is not a separate ticket price.
- Speed buttons sit in the top bar: pause, play, and faster steps. As of the 26 Oct feedback, **Ctrl slowed and Shift sped up**. Patch 0.2.4 (28 Oct) replaced those with **Q and E**. Page Up / Page Down zoom; Shift with arrows or Page Up / Page Down pans and zooms faster.
- The hill is paused for the draft. Players build while paused or while the clock runs.
- A successful closing rolls to the next morning, shows the new day number, deals cards, and reveals new stops.
- Losing ends the run. The card shows score, days, a medal line (“Second star” on one four-day loss), Retry, and Main menu. Best score is kept.

**Inferred timetable for a playable day:** 80 real seconds at 1× covers 07:30–18:00. Guests arrive from about 08:20 until about 14:00, leaving the rest of the afternoon to empty the hill. Speeds are pause, 1×, 2×, and 4×.

Isola 2000’s record card shows three day medals at **7, 10, and 14 days**, plus a best score and a histogram of past runs. Difficulty on the resort list is a row of one to four diamonds. Isola is marked Easy with one diamond; Ski Dubai is marked with four. Sandbox is a separate button on the resort card.

Winterfold uses the same three-medal idea. Thresholds differ per hill so the first hill can be finished in a sitting; Isola’s 7 / 10 / 14 is the published easy-resort set and is used on the hardest authored hill.

## Snow cannons, trees, upgrades

- **Cannon.** Places a patch of snow so a run can cross bare ground. The dock count is how many you can still place. The store says cannons themselves can be upgraded. **Inferred:** base radius about 78 m, two upgrades, each spent upgrade point widening the patch.
- **Cut trees.** Patch 0.1.1 made forests much denser and gave 20 removals so the tool mattered. Patch 0.2.3 made cutting precise: one tree per click, or a drag for many, and undo puts a tree back. The developer had previously said permanent cutting was a deliberate difference from redrawing runs. Undo is the way a tree returns; there is no replant tool.
- **Upgrade.** A stock of upgrade points. The tool selects the thing under the cursor. Patch 0.2.4 made that pick work when a run passes under a lift or a cannon sits on a stop. **Inferred effects:** a lift gains seats and pace (three ranks), a run is groomed so guests move a little faster (two ranks), a cannon widens (two ranks). Each rank spends one point.

Right-hand modes are separate from those tools: **move** (pan), **draw** (pencil), and **delete** (trash). Drawing uses whichever dock tool is active.

## Lose, score, levels, modes

- **Lose** when 18:00 arrives and any guest is not back at a station. Sandbox, per the 3 Sep 2026 post, removes that deadline, gives unlimited tools, and drops the score pressure. One player still saw a sandbox run end from overcrowding and wanted a sandbox save; that conflicts with the developer post, so Winterfold follows the developer: sandbox does not close the hill and does not game-over.
- **Score** is the top-bar total and the result card. Days survived are shown beside it. Leaderboards exist on Steam; we only keep a local best-score board.
- **Resort medals** are day milestones. Isola shows 7, 10, and 14. A separate “star” line appears on the result card.
- **Modes in the demo UI:** Daily challenge (a countdown such as “6h remaining”), Weekly challenge, the resort list, and Sandbox on each resort. Continue and New Game sit on the resort card. Records include a percent rank and a score histogram.
- **Progression** inside a run is the morning card and the new stops, which the store calls roguelike. Resort unlocks are not described in detail; the resort list shows several hills with best-day text, so a hill can be replayed.

Winterfold does not copy Steam daily or weekly challenges (those need a shared clock and a leaderboard). It has three authored hills with medal unlocks, an endless hill, sandbox on each unlocked hill, and a local board.

## HUD layout to echo (not to trace)

- Left paper column: original logo, hill name, difficulty diamonds, stop counts, slope-colour counts, lift counts, other buildings (cannons), Settings, Quit.
- Map: pale paper, faint contours, soft hill shading, snow, sketchy pines, thick coloured runs with direction marks, grey lift lines, white stop icons, altitude labels.
- Top right: clock, day, score, guests, pause / play / faster.
- Bottom dock: Slope, Lift, Cannon, Cut trees, Upgrade, with stocks.
- Right edge: move, draw, delete.
- Morning: three supply cards and a weekly reroll.
- Result: why the hill closed, score, days, best, retry, menu.

## What Winterfold changes on purpose

- Original title, logo, hills, and sentences. No real resort names, flags, or map imagery.
- Colour percentages, lift seats, and cannon radius are inferred and listed as such above.
- Guests will leave a shorter run once its queue is clearly worse than a free legal run.
- No Steam daily, weekly, workshop, or online rank. Local medals, local board, sandbox, and endless instead.
- Cafe, not a bar. Family-friendly copy.
- Tree, rock, river, and cliff art is drawn in code. No downloaded assets.
