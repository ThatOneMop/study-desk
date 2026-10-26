# Gummy Bay systems brief

Roadmap after v124. Mechanics and numbers come from the public 0.4.6 write-up. Names, products and copy are original gummy-shop material. `mix-core.mjs` and `sim-formulas.mjs` hold the formulas, and the tests lock every number below. v125 wires the four starter ingredients into the bench; the other twelve ingredients and the rest of these systems stay unwired.

v125 stores one craving per customer, writes a price request into the existing message thread, and holds heat from 21:00 to 05:00. During that window patrols are out and notice range is 45 m. The phone and HUD read `gameplaySnapshot()` and `subscribeGameplay`.

## 1. Effect mixing

A product carries `effects[]`, at most 8. There are 34 effects and 16 ingredients in `mix-core.mjs`. Each ingredient has a price, an effect it adds, an unlock tier, and a transforms map. 114 pairs change an effect. Bright and Shambling are never rewritten. Four ingredients are available immediately: Citrus peel, Bay fizz, Sugar glaze and Sour dust. The other twelve unlock one tier at a time from tier 7 through tier 18.

Mixing reads the list as it stands, then walks it in order. A rewrite is skipped when the destination is already on that list, so order can change the result. The ingredient's own effect is appended if it is missing and the list has room. Value is half-even `round(base × (1 + sum of bonuses))`. Addictiveness is `min(1, base + sum of effect addictiveness)`. The same set of effects always gets the same `recipeName`. A set the player has not made before is worth 80 XP.

The first mixing bench makes 10 units at 6 game minutes each. The second makes 20 units at 3 game minutes each. A full batch of either is 60 game minutes. The bench itself is marked for tier 2.

## 2. Customers

The first district, Wharf Row, should start with 14 customers. Each profile needs standards, weekly spend as a min and max, orders per week as a min and max, an order time, a preferred day, an affinity per base gummy, three preferred effects, a chance they call the police, and a base craving. Those fourteen profiles are not authored yet.

Loyalty runs from 0 to 5 and starts at 2. Craving runs from 0 to 1. Normalised loyalty is loyalty / 5.

Enjoyment is three weighted parts: affinity 0.3, preferred effects 0.4, quality 0.3. Quality scores are 0, 0.25, 0.5, 0.75 and 1. The public sources do not say how those three parts are added together, so the module exports the weights and does not invent a total.

Appeal of a listed product is `enjoyment + 1 - 2 × clamp(price / (2 × value), 0, 1)`. The order roll takes the best match at 50%, the second at 25%, and the third and fourth at 12.5% each. Anything under 0.05 appeal is ignored.

Weekly order count is `round(min + (max - min) × clamp(max(craving, loyalty / 5), 0, 1))`. Days between orders are `max(1, round(7 / count))`. Weekly budget is `rankMultiplier × (min + (max - min) × clamp(loyalty / 5, 0, 1))`.

## 3. Deals

A text order can be accepted, countered or rejected. Rejecting costs 0.5 loyalty.

The player picks one of four windows: 00:00, 06:00, 12:00 and 18:00. The customer walks to that district's deal spot. Pay is

`price × (1 + 0.2 curfew + 0.2 rain + 0.1 quick + 0.15 × quality tiers)`

plus $10 for each extra unit when satisfaction is at least 0.99. Quick means the handoff is inside 60 minutes of the window opening. The quality bonus applies when the delivery is at least 0.2 of a tier above the request.

A counter is refused when the new total is at least three times a typical order (`weekly budget / order count`). Otherwise the customer compares value propositions. At or under market value the score is `clamp(value / unit, 0, 2)`. Over market value it is `clamp((value / unit) ^ 2.5, 0, 2)`. Quantity falls in a straight line from 1 at the asked amount to 0 at none or at double. A clearly better score is accepted. A score under 0.12 is refused. An enjoyment test can still accept it. Anything left is a roll:

`chance = clamp(1 - (gap - 0.2 × drive) / 0.9, 0, 1)`

where drive is `clamp(max(craving, loyalty / 5), 0, 1)`. An accepted counter is 5 XP.

A sample score is the best enjoyment, plus up to 0.2 from loyalty, 0.2 from craving, and 0.2 from friends who already buy. The acceptance table is 4% at 0.1, then 10, 33, 48, 63, 78, 85, 88, 94 and 100% at the published scores up to 1. Between those points the module interpolates in a straight line. A successful sample is 50 XP.

After a delivery, loyalty changes by `clamp(satisfaction, 0, 1) - 0.5` and craving rises by `addictiveness / 5`. A player handoff is 20 XP. A runner handoff is 10 XP. On a dry night, craving falls by 0.0625 and never goes under that customer's base. At 0.33 or more, the customer can walk up unprompted. The wait is `4320 - 2160 × craving` minutes, then each minute has chance `0.5 × craving / 1440`.

## 4. Progression

Eleven titles, five tiers each: Driftwood, Hawker, Stallhand, Counter, Shelf, Borough, Wharf, Coast, Bay, Keeper, Founder. Through Keeper, the budget multiplier is `1 + 0.25 × (rank + (tier - 1) / 4)`, which is 0.0625 per tier, and tier V matches the next title's tier I. Founder I is 3.5. Each further Founder step adds 0.10, up to nine extra steps. The rank bar belongs on the sleep summary, which the UI pass draws.

## 5. Economy

Cash is what a fine can take. The card is the bank. The ATM cap stays $10,000 a week. Four wash fronts run for 24 hours, with capacity $2,000, $4,000, $6,000 and $8,000, costing $4,000, $10,000, $20,000 and $50,000. A property ladder with employee caps is still missing its published counts, so it is not invented here.

## 6. Staff

Daily pay is Gardener $200, Mixer $300, Packer $200, Sweeper $100. The signing fee is `daily + min(100 × already hired, 500)`. Wages come out of a cash envelope on that worker's bed or locker. An empty envelope stops the worker. A priority checklist is due every 0.5 seconds. "Why aren't you working?" is a dialogue the UI can open from the worker's status.

## 7. Runners and suppliers

One runner per district, a 20% cut, at most 10 assigned customers, walking at 1.2 m/s, with a robbery roll still to be specified as a probability. Suppliers leave dead drops on credit. The 30 minutes per item figure is the intended pace. Neither is in the live town yet.

## 8. Rival crew and the law system

Each district has a candy-crew influence from 0 to 1. Unlocking a customer subtracts 0.075. Graffiti subtracts 0.05. The next district opens at 0.3 or below. A rival runner can take an order from a customer whose loyalty is under 1.25. Below that line the player keeps it with probability `clamp(4 × loyalty / 5, 0, 1)`.

The law system is more than the heat meter. Daily pressure, four pursuit levels, checkpoints, bystander calls, and hiding in dumpsters and bushes are still open. The live curfew is 21:00–05:00, notice range is 45 m, and the body search is already in the game.

## What the other passes can read

`subscribeGameplay` already emits `craving-ask`, `craving-changed`, `curfew` and `starter-offer`. `gameplaySnapshot()` returns day, time, heat, the curfew flag, police notice `{range, suspicion}` and one craving record per customer. The next wiring step should add effects, loyalty and rank to that same snapshot rather than new screens in this module.
