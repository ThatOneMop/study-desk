# Sweet Network economy (v143)

The goal: grow from about $30 a sale to a few hundred through strains and automation, with no early-game runaway.
The curves below come from `economy-sim.mjs`: `simulateEconomy` for the solo loop and `simulateNetwork` for the loop plus dealers, runners and crew. Each figure is the mean of seeds 1–6.
To reproduce: `node games/gummy-bay-dev/tests/economy-sim.mjs` and `node games/gummy-bay-dev/tests/dealer-network.mjs`.

## Before (origin/main 89cc92f, v141; unchanged by the v142 NPC-effects release): solo loop only

| Day | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12 | 13 | 14 | 15 |
|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|
| $ / unit | 30 | 30 | 40 | 56 | 72 | 102 | **196** | 221 | 246 | 280 | 301 | 306 | 307 | 311 | 309 |

- From day 6 to day 7 the unit price nearly doubled ($102 → $196), because Sunset Gold unlocked at level 6 on the same day the mixer came online.
- There were no running costs, no automation and no network. Revenue was capped by how many customers you could serve by hand, and cash reached about $41.5k on day 15.

## After (v143): solo loop plus the Sweet Network

| Day | Lvl | Unit $ | Top $ | Own $/day | Network $/day | Total $/day | Dealers | Runners | Crew | Dealer units | Busts | Cash |
| 1 | 1 | $30 | $30 | $60 | $0 | $60 | 0 | 0 | 0 | 0 | 0.0 | $110 |
| 2 | 1 | $30 | $30 | $150 | $0 | $150 | 0 | 0 | 0 | 0 | 0.0 | $230 |
| 3 | 2 | $40 | $42 | $198 | $0 | $198 | 0 | 0 | 0 | 0 | 0.0 | $393 |
| 4 | 3 | $56 | $56 | $448 | $0 | $448 | 0 | 0 | 0 | 0 | 0.0 | $661 |
| 5 | 3 | $56 | $56 | $560 | $0 | $560 | 0 | 0 | 0 | 0 | 0.0 | $861 |
| 6 | 4 | $101 | $102 | $1510 | $0 | $1510 | 0 | 0 | 0 | 0 | 0.0 | $1659 |
| 7 | 6 | $124 | $124 | $1855 | $0 | $1855 | 1 | 0 | 0 | 0 | 0.0 | $2352 |
| 8 | 8 | $224 | $224 | $3360 | $0 | $3360 | 2 | 0 | 0 | 0 | 0.2 | $3860 |
| 9 | 8 | $249 | $249 | $4980 | $-281 | $4699 | 2 | 1 | 1 | 6 | 0.2 | $5373 |
| 10 | 8 | $249 | $249 | $4980 | $399 | $5379 | 2 | 1 | 2 | 7 | 0.0 | $6212 |
| 11 | 8 | $264 | $265 | $5280 | $1281 | $6561 | 4 | 1 | 3 | 16 | 0.2 | $7665 |
| 12 | 8 | $292 | $292 | $5840 | $5213 | $11053 | 4 | 2 | 4 | 30 | 0.0 | $16532 |
| 13 | 8 | $296 | $298 | $5926 | $4661 | $10587 | 4 | 2 | 5 | 29 | 0.2 | $25691 |
| 14 | 8 | $297 | $297 | $5947 | $5721 | $11668 | 4 | 2 | 6 | 34 | 0.2 | $34834 |
| 15 | 8 | $297 | $297 | $5947 | $6585 | $12532 | 4 | 2 | 6 | 43 | 0.2 | $45417 |

Column notes: "Unit $" is your own average price per unit. "Network $/day" is dealer takings minus wages and runner fees, so it can go negative on the day you sign someone up. "Busts" is the mean number of busts per day.

- **No early runaway.** Days 1–5 stay at or under $60 a unit, day 6 is about $101 and day 7 about $124. Sunset Gold now unlocks at level 7, which splits the old day-7 doubling over two days.
- **The premium band hits the target.** Days 10–14 sit at $249–$297 a unit, inside the $200–400 target.
- **Automation scales volume, not price.** By day 12 the network roughly doubles daily revenue (about $5k of network takings on top of about $5.8k of your own sales). Dealer units sell at the dealer's price minus their 18–30% cut.
- **Costs are real.** Wages are paid at midnight (grower $60, bench hand $80), each runner trip costs $20–30, and the first dealer days run at a loss until their customer lists fill up.

## Systems

- **Dealers.** Four recruitable dealers, one per district, each with their own signing fee, cut, customer cap, stock cap, caution and honesty:
  - Benny Boardwalk (Old Town): level 3, $300 to sign, 30% cut, 5 customers, holds 16 packs
  - Mo Marmalade (East Market): level 5, $800, 25% cut, 7 customers, 24 packs
  - Cleo Caramel (West Harbor): level 6, $1600, 22% cut, 9 customers, 32 packs
  - Dex Dimple (North Heights): level 8, $3000, 18% cut, 11 customers, 40 packs

  Each district has 12 named customers. You assign them to a dealer, and each one orders every 18–30 hours between 9:00 and 23:00.
- **Restock and collect.** Restock and collect in person at the dealer's stall, or let a runner do it. Packs already promised in agreed deals are held back from restocking.
- **Risk.**
  - Bust chance per sale is `(0.004 + 0.03·heat/100) · (1.25 − caution) · √qty`. A bust takes the dealer's stock and half of what they owe you, sends them to lie low for 2 days, and adds 8 heat.
  - Less honest dealers sometimes shortchange you, skimming 10–30% of a sale with a chance of `(1 − honesty)/2`.
  - Above 40 heat, a runner can be stopped for a bike check, which costs the cargo.
- **Runners.** Pip on a BMX (level 4, $400, carries 10 packs, $20 a trip) and Rosa Rollerblades (level 6, $1100, carries 18 packs at 1.4× speed, $30 a trip). They carry packs from your stockroom to the dealers and bring the takings home. Set them to auto or send them by hand.
- **Crew.** Growers plant and harvest about 4 raw every 3 hours. Bench hands pack one unit every 40 minutes, including mixed strains, using your mixer and ingredients. Both work 8:00–20:00.
  - Crew slots depend on property: starter flat 1, workshop 2, big workshop 4.
  - Two slot upgrades cost $900 and $2200 and need the workshop or better.
  - Crew members appear as figures working at racks and benches in your workshop.
- **Phone app.** The 🍬 Sweet Network app has Dealers, Runners, Crew and Log tabs. A summary card on the phone home screen shows what you're owed and any dealers who are lying low.
- **Copy.** All in-game text is family-friendly candy-trade wording.

## Tests

- `tests/dealer-network.mjs` covers the module: economics identity, restock, bust risk, runners, crew, save/load, and the sim curve bounds.
- `tests/dealer-game.cjs` runs the system through the real game.js in the vm harness.
- `tests/economy-sim.mjs` now expects $200–400 a unit on day 10.
