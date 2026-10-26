# HUD, phone and UI brief

Original art only. Gummy Bay keeps its own town, names and products. This is the UI roadmap. Bind to state the systems agent already exposes. Where a reading does not exist, add a thin adapter and leave the simulation alone.

## 1. HUD

- Top-centre compass bar with objective icons and distances in metres.
- Cash, card and the clock with weekday at top right.
- An 8-slot hotbar plus a cash slot at bottom centre.
- An objective list on the left.
- A centre dot crosshair with the `[E] ...` prompt.
- Replace the 5-dot heat meter with a police banner: `POLICE CALLED` / `UNDER ARREST` / `WANTED` / `WANTED - ARMED`, plus a search countdown bar.

## 2. Phone shell

Tab raises a portrait phone in the lower right (about 360×640 CSS px) and frees the mouse. It has a status bar on top and a home grid with badges. Hotkeys: T for messages, M for the map, J for the journal.

## 3. Messages

A thread list with mugshots, unread dots and previews. Deal bubbles offer Accept / Counter / Reject. The Counter sheet has a product picker, a quantity stepper, a price field and a fair-price hint, then a success-% readout and a deal-window picker (Late night / Morning / Afternoon / Night).

## 4. Contacts

A graph view with mugshot nodes joined by connection lines. Locked contacts are greyed out with a padlock. The detail card shows loyalty hearts, a craving bar, 3 preferred effects (revealed after the first deal), standards and district.

## 5. Apps

- Products: rows with icon, name, effect chips, market value, a price input and a Listed toggle. Tapping expands the recipe.
- Runners: cards showing cash held, stock and up to 10 assigned customers.
- Deliveries: shop tabs, an item grid, quantity, destination property, a $200 fee and an ETA.
- Map: an illustrated top-down view with icons and tooltips.
- Journal: quests with checkboxes.

## 6. Handover

A two-pane drag-and-drop between the hotbar or backpack and the customer's request slots. It shows the ask, the price and a Done button, and flags you as dealing to the police while it is open.

## 7. Sleep summary

Earnings, deals, XP gained and an animated rank bar with a rank-up banner. A curfew warning toast at 20:30 and a "you should sleep" prompt at 04:00.

## 8. Tutorial

Quest-driven through texts from a mentor (Grandpa Gus), using compass markers, with no blocking modals.

## Adapter notes for the systems agent

These UI readings are projections. They do not write saves.

| Reading | Source today | Still missing |
| --- | --- | --- |
| Weekday clock | `day` and `time`. Day 1 is Monday. | None. |
| Compass metres | Player `x`/`z`, `yaw` (0 faces north, −Z), `track`, and up to three deal customers. | Quest-marker events from the tutorial. |
| Police banner | `heat >= 40` or an officer watching/stopping → POLICE CALLED. Pursuit → WANTED. `police.search.remaining` (4s) → UNDER ARREST and the countdown. | `police.armed === true` is the only switch for WANTED - ARMED. Nothing sets it yet. |
| Existing police sentence | `#policeStatus` still shows the simulation's own stop, pursuit and search lines so comply rules stay visible. | — |
| Phone badges | Unread = last thread message is from them. Deals and an active listing get counts. | A real unread flag. |
| Curfew / sleep toasts | Once per day at 20:30 and, after day 1, at 04:00. | Sleep summary, rank and rank-up are not simulated. |
| Messages | Thread list with mugshots and an unread dot when their last text is newest. Accept calls `offer` at their counter. Counter sends `offer` at the typed price. Chance is 100% at or under `thread.max` and 0% above. | Reject does not exist, so the button stays disabled. Deal windows follow the clock and do not reschedule. Product and quantity stay on the text already sent. |
| Contacts | Graph of the five customers, loyalty hearts from the relationship score, craving bar from `cravingState`, district from their street position. One preferred effect after a deal or a receipt. | Locked contacts, standards, and the other two preferred effects are not simulated. |
| Products | Marketplace rows call the existing `list` action with that row’s price and quantity. The recipe is the strain’s mix. | There is no unlist. Runners, paid deliveries, handover and Grandpa Gus are still not simulated. |
