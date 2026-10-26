# Gummy Bay v124: cravings and curfew

v123 already had relationships, samples, daily routes, police, and heat. Two Schedule I-style gaps were still empty: customers did not come back hungry for one product, and the night did not change the town. This pass adds both, in original gummy terms.

## Cravings

Each customer can store one craving: product index, level 0–100, the day and time of the last sale, and the day and time they last texted. A sale of the same product adds 18, plus 4 for each extra pack up to three. A different product keeps 40% of the effective level, then adds the same gain. The stored level does not tick down by itself. Each missed day lowers the effective level by 12, and that drop stops after eight days. The same calendar day keeps the full level.

While a text offer is priced, a matching craving with any effective level adds `level × 0.0015` to that customer’s budget for that offer only. The contact’s base budget is restored immediately after.

At effective level 40 or more, with no open deal and no negotiation in progress, the customer texts asking for a price. Level 80 asks for two. They will not text again for 120 game minutes. The text does not create a deal and does not reserve packs. The check runs about every 15 simulation seconds on the host, and not during a police search.

A player delivery and a walking seller both record the sale. The phone, HUD and contact cards are not changed here. `subscribeGameplay` receives `craving-ask`, `craving-changed` and `curfew`. `gameplaySnapshot()` returns the day, time, heat, curfew flag and one craving record per customer. An ask is also written into the existing message thread, so the current messages list can show it without a new screen.

## Curfew

From 22:00 through 06:00 `gameplaySnapshot().curfew` is true, and a `curfew` event fires when that flag changes. Each customer’s routine adds a 22:00 stop at their usual meeting spot. Earlier stops are unchanged, including the 20:00 phone stop. Heat stops decaying during curfew. It does not rise just for being outside, and police sight stays on the existing heat bands. Sleep still clears heat and sets the clock to 08:00.

## Saves

The save version stays 3. A missing or invalid `cravings` object loads as `{}`. Old slots keep their cash, stock, deals, and staff routes.

## Limits

Curfew does not widen police sight at midnight. A craving text does not auto-accept a price. The seller is still a straight line. The gardener still does not refill the can. A hitch still catches up at most a quarter second.
