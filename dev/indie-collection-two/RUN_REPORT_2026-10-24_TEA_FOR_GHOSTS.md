# Tea for Ghosts — second batch, candidate 33

**Achieved: 13/20 playable and meaningfully improved, 12/20 finished, 0 selected/integrated/live. Tea for Ghosts awaits complete native verification; seven slots remain planned.**

Tea for Ghosts is a calm tea-blending and preference-deduction game. Read six visitors’ requests, choose up to three ingredient scoops, adjust temperature, extraction and dilution, then use tasting feedback to refine the next cup. Restoring a memory invites the next visitor and earns two non-farmable seals. New ingredients and two useful cabinet tools support later service and replay.

## Implementation and improvement

Initial playable commit: [`fa654ca14729275ca06b07db332ae5ff0fdf5f2b`](https://github.com/ThatOneMop/study-desk/commit/fa654ca14729275ca06b07db332ae5ff0fdf5f2b), verified locally with 14 engine and nine DOM checks. The initial commit intentionally skipped CI until the native harness was ready.

Improvement commit: [`561db33ce8a4812f32db81684097346817ecbe48`](https://github.com/ThatOneMop/study-desk/commit/561db33ce8a4812f32db81684097346817ecbe48). Final gameplay corrections: [`b9121c7bb54b61da07ffdbe7739babcc8d6637a7`](https://github.com/ThatOneMop/study-desk/commit/b9121c7bb54b61da07ffdbe7739babcc8d6637a7).

- Live, pure flavour forecasts before brewing and direction-of-change comparisons against the visitor’s last tasting make extraction and dilution legible.
- One-step recipe undo lets players correct a scoop or brewing choice without spending a cup.
- Dynamic scoop controls preserve keyboard focus. Offering a cup brings its feedback into view; choosing a visitor focuses their name. This was checked in the narrow layout.
- Saved scores, journal profiles and feedback must match the recipe that produced them. Strainer provenance preserves old tastings when equipment changes. Initial saves migrate without relying on JSON property order.
- Recipe cards recall the best record even after that cup leaves the recent journal.

The candidate passes **34 local checks: 21 engine and 13 DOM**. Tests cover all six memories, ingredient locks, extraction/dilution, real three-cup departure and restart, immutable brewed cups, seal accounting, both tools, exact saves, corruption recovery, preview purity, undo, keyboard focus, record validation and migration. The strainer reduces harshness from long hot steeps; recipe cards restore a real tasted recipe. Neither tool is cosmetic.

An enumeration of every legal one-to-three-scoop recipe at each visitor’s initial ingredient unlock, with all temperature/steep/water settings and no strainer, found 807 acceptable cups among 13,185 evaluated combinations. The successful distinct blends by visitor were 2, 5, 10, 7, 41 and 27. This confirms alternate solutions; it is not evidence of human enjoyment or play duration.

## Visual and interaction review

Original SVG/CSS art depicts a lamplit tearoom, arched rainy windows, a translucent visitor, tea jars, steam and a cup. There are no external assets or runtime dependencies. The game supports reduced motion and uses native labelled buttons/selects, readable text feedback and confirmable reset/restart.

Local desktop QA completed Mabel’s service. The 390-pixel preview completed Otis’s service, checked temperature and flavour changes, and confirmed the served result comes into view. Narrow screens require scrolling between the visitor and workbench; there is no timer pressure. A browser locator using an overly strict label match was corrected to the observed select ID; this was a QA selector issue, not a game failure.

## Native test correction

[CI 40010604779](https://github.com/ThatOneMop/study-desk/actions/runs/40010604779) passed 298 engine and 224 DOM checks. Tea for Ghosts completed all six desktop services, both equipment purchases, preparation/brewed reloads and recipe recall before a strict-selector failure during repeat visitor navigation. `[data-guest="0"]` matched both the diagnostic body attribute and its button. The corrected selector explicitly targets the button; no game source changed. Harness correction: [`4b5ce3563a49f3b5a24c4e76217345e5795c07dd`](https://github.com/ThatOneMop/study-desk/commit/4b5ce3563a49f3b5a24c4e76217345e5795c07dd). Partial desktop evidence is not counted as a full native pass.

## Scope and comparison

This is a small authored hospitality/deduction game, with six fixed preferences and two equipment purchases. Replay refines recipes and records; it does not create an endless narrative or business economy. There is no sound layer, physical-device touch evidence, human enjoyment study or hours-of-content claim. Its flavour inference and service feedback differ from the first batch’s ingredient-growing/cooking game and from this batch’s spatial planning and action games. It must earn a catalogue place through comparison; it is not automatically selected.

## Regression infrastructure and preservation

The previous Borrowed Gravity run’s motion group timed out during slow Ubuntu dependency downloads, before its gameplay tests. The failed group was retried. That retry passed Wellward desktop/touch and normal RAF, then Ratchet Run desktop, but timed out before its touch result. Partial logs are not treated as a complete suite pass. The new workflow retains every existing native suite and adds Tea for Ghosts; four groups run at most three at a time. Browser job allowance increased from 15 to 25 minutes after observed installation latency left insufficient time for gameplay. No tests were removed. CI configuration commit: [`a34ba0a7e86687f9ef6928fb4bcfe0a56db12748`](https://github.com/ThatOneMop/study-desk/commit/a34ba0a7e86687f9ef6928fb4bcfe0a56db12748).

The first-batch final report was freshly read: 20 finished, nine selected and no verified live URLs. The first batch’s source, saves, catalogue and tests remain intact. Public main was reread at `ed2cf603aa47fc26e4f04216d5704351b72a32a9`; private messaging, movie/TV discovery, Gummy Bay and requested-game work were preserved. All writes are on `indie-collection-two-dev` and scoped to this candidate, collection documentation and its workflow.

Public route/asset checks, nine selected first-batch source hashes, exact twenty-slot ledger, current shell, bridge-pointer and relaxed-collection checks passed locally. The two inherited launcher tests referencing removed `playerStudy` remain unchanged and are not claimed to pass.

The latest public [release 39925660833](https://github.com/ThatOneMop/study-desk/actions/runs/39925660833) still fails GitHub Pages configuration before deployment. Fresh logs again report “Get Pages site: Not Found” and “Create Pages site: Resource not accessible by integration”. No second-batch candidate is integrated into the public catalogue, and no live game link is claimed. Repository development is not blocked.

## Handoff and next steps

The corrected [run 40011208465](https://github.com/ThatOneMop/study-desk/actions/runs/40011208465) passed all **298 engine + 224 DOM = 522 checks**. At the final observation, its new-games browser job was still installing dependencies; no complete native Tea pass is claimed. Planning, motion and craft-and-cargo had already passed in run 40010604779. The only difference between the two tested revisions is the scoped Tea browser selector; all game source is identical.

Inspect the corrected job and its screenshots next. If all six desktop/touch services, saves, failure/restart and navigation pass, record the quality review and mark Tea finished; otherwise fix the observed failure. Then continue Cairn & Cord (slot 34). The task remains active because native verification, seven games, selection and public integration are unfinished.
