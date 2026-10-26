# Schedule I parity checklist

Gummy Bay is an original gummy-shop game. This list tracks the browser loop against the systems named for a Schedule I-style business sim. Mechanics are recreated in original code. Schedule I assets are not used.

Status is the playable v124 build. `[x]` is in the game. `[~]` is present with a real limit. `[ ]` is still open.

## Core loop

- [x] First-person move, look, jump, crouch, and sprint
- [x] Grow tents, soil, water charges, and a harvest of four
- [x] Shape and pack at the worktable
- [~] Mix four ingredients. A mix renames the gummy, raises its price, and gives a favourite-flavour budget bump. Effects do not yet change the sale in any other way, and mixes do not stack
- [x] Player-set listings, text negotiation, and a three-hour deal deadline
- [x] Samples, a 0–100 relationship, and a last-sale memory
- [x] Customer cravings. A repeat product raises a stored level, a missed day lowers the effective level, a matching craving pays a little more, and a strong craving texts for a price without reserving packs
- [x] Walking gardener and walking gummy maker
- [~] Walking sales assistant. Completes an agreed deal for the agreed price. The first approach is a straight line, and with no deal they do not sell
- [x] Three properties, lights, irrigation, press, bench, van, and stockroom
- [x] XP levels that unlock strains
- [x] Day and night lighting, and a phone for messages, listings, deals, and the wallet
- [x] Version-3 saves on `gummybay-v3-{story|free}-{1|2|3}`

## Town, heat, and crew

- [x] Five customers with a daily route through town
- [x] Curfew from 22:00 to 06:00. Customers stay at their usual spot, the clock says CURFEW, and heat does not cool off overnight. Police sight range is unchanged
- [x] Police patrol, suspicion, pursuit, search, and heat from a witnessed sale
- [~] Hired help is one gardener, one maker, and one sales assistant. There is no district dealer who takes a cut
- [~] Parcels can be carried and throw notes. They are not a customer dead-drop channel
- [~] Laundry exists as a sink for cash. It is not a front-business loop
- [~] Co-op host and guest. Guests do not run the field crew or the town clock

## Still open

1. Mix effects that customers react to beyond the favourite-flavour budget bump
2. A hired dealer who sells in one part of town and takes a cut, separate from the walking sales assistant
3. Dead-drop handoffs as a customer sales channel
4. A laundering loop with a front business, beyond the current laundry action
5. Point the crafting camera at the real worktable. Camera and town collision sit next to the movement and visuals work

The seller’s straight line and the gardener’s can refill sit with pathing and movement. This checklist does not move those.
