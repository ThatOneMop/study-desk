# Gummy Bay v123: a gardener on the tents and a seller on the street

v122 stepped the world at a fixed 1/60 second and made a new gummy maker walk the workshop. Gardening and selling were still timers: crops changed every four seconds, and packs became cash at 90% with no customer in the room. Schedule 1’s crew is people who go to the work. This pass does that for the two roles still standing still.

## Implemented

- A hired gardener whose route is Walks the route moves inside the current property, from the supply side of the room to an assigned tent. At the tent they harvest a mature crop (four raw units, trimmers and shelf space required), spend one watering-can charge on a dry or thirsty plant, or plant an empty tent from soil and an unlocked seed. The job takes about 1.2 seconds of simulation time once they arrive. They do not refill the can. Irrigation still waters on its own.
- A hired seller on the same route walks a straight line to the customer on an agreed deal and hands over the packs the player already set aside. Pay, XP, heat and the thread’s sold status match a player delivery. A second visit does not pay again. With no agreed deal they wait. They do not run the 90% unnamed sale.
- The roster for both roles can switch back to Background timer. That path is the previous instant loop.
- The first time a seller is assigned, or the property changes, they start about six metres from the current customer when that approach is clear. Later orders continue from where they are standing.

## Saves

The save version stays 3 and the slot key stays `gummybay-v3-{story|free}-{1|2|3}`. `route` is `walk` or `timer` on each staff role. A missing or invalid route loads as `timer`, which is what every existing v3 save has. `fresh()` sets gardener and seller to `walk` before normalize, and normalize keeps an explicit walk. New games walk. Old games keep the timer until the player changes the roster.

## Limits

The seller does not flood-fill the 10× town. A blocked straight line stops the delivery and leaves the packs in the bag. The gardener stays inside the property bounds and does not walk to the sink. Guest sessions do not draw these two workers. The crafting camera is still the bench parented to the camera. Town collision is still the authored set. Below about 4 FPS the world still catches up only a quarter second per frame.
