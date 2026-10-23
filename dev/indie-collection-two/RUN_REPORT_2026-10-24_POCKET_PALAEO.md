# Pocket Palaeo — second-batch candidate 30

## Scope and baseline

The first-batch final report was re-read at `c03682dc435ecdaacd94966273d789dd90e9f7b1`: 20 finished, nine selected, 66 improvement passes and zero verified live releases. These games are excluded from this batch. The separate second-batch ledger still contains exactly twenty new slots, overall numbers 21–40.

Public main was re-read at `ed2cf603aa47fc26e4f04216d5704351b72a32a9`, including the private-messaging and movie/TV work. This increment writes only `indie-collection-two-dev`; first-batch sources, saves, catalogue entries and tests, Gummy Bay and requested-game work remain intact.

## Implemented loop

Pocket Palaeo is an original excavation and supported-lifting game. Pick through deep soil, switch to a gentle brush as bone appears, clear the surrounding matrix, and distribute reusable braces along a connected specimen. Choose a lifting point: graph distance and heavy bones determine the load on each span. Poor support cracks or fractures bones; resin repairs cracks before lifting. After a fracture, reopen the excavation without losing museum records or purchased tools.

Three sites contain six articulated specimens. Condition earns up to three research seals per specimen; improvements award only the difference, so repeated recovery cannot farm currency. Spend seals on a fan brush that clears adjacent cells, a fourth reusable sling, or extra resin. Recoveries unlock the later sites; revisit them for better condition or alternate support arrangements. The museum, fieldwork, tools and currency reload by replaying validated actions under the isolated key `study-desk-pocket-palaeo-v1`.

The ochre/green field-journal presentation uses original SVG fossil graphs, distinct fern/wing/coil/skull details and CSS soil textures. No external game or asset pack was imported. These stylized specimens are game designs, not a scientific simulation.

## Meaningful improvement pass

The initial playable version passed **18 engine + 9 DOM = 27 checks**, including the entire six-specimen museum campaign.

- Lifting now stages an exact condition forecast before explicit confirmation. It identifies overload and fracture risk without changing the save; cancellation preserves all progress.
- Gold highlights show soil still trapping the specimen. Green anchors, red overloaded spans and numerical loads explain where braces are needed.
- Fast mouse and touch strokes interpolate across skipped grid cells, with each cell worked once per stroke. Cancellation and blur stop the stroke; fracture stops further excavation.
- Distinct specimen details and a constrained tray keep the bones aligned with the soil grid at desktop and phone widths.
- Touch controls activate on a completed stationary release, suppress duplicate compatibility clicks, and preserve keyboard activation. Native diagnostics showed Chromium delivering pointer down/up but no click on the first control after a fast drag; this correction handles that case without test delays.
- Full action journals refuse further writes at the replay limit, preserving reloadable progress.

Final candidate checks: **22 engine + 17 DOM = 39 passed**. They cover three sites/six perfect specimens, all purchases, connected support graphs, tool effects, deep/shallow excavation, border clearance, fracture/retry, limited resin, non-farmable records, locks, exact replay, malformed saves, immutable forecasts, fast strokes, keyboard focus, confirmation/cancel, blocked storage and isolated recovery/reset.

Direct browser visual review inspected the desktop and 390px phone layouts, exposed-bone/grid alignment, trapped-soil and overload feedback. A manually chosen three-brace plan recovered Reedfin at 100% condition and funded the fan brush through the phone interface. Automated browser and full regression evidence follows.

## Validation status

**Completed result: 10/20 playable, improved and finished; 10 meaningful passes; 0 selected, integrated or verified live.** Ten slots remain planned. This increment adds one finished game; first-batch, Nightshift and Afterlight games are excluded.

Exact-source [CI 39990612900](https://github.com/ThatOneMop/study-desk/actions/runs/39990612900) passed **425 engine/interface checks** (240 engine, 185 DOM), all ten complete desktop/touch campaigns and public preservation gates. Pocket Palaeo completed six perfect recoveries, all purchases, every-site exact reloads, native fast strokes, keyboard navigation, safe/dangerous previews, deliberate fracture, restart cancellation/confirmation, isolated save recovery/reset and return navigation. No uncaught browser errors were reported.

[Browser artifacts](https://github.com/ThatOneMop/study-desk/actions/runs/39990612900/artifacts/12518351510) retain 238 screenshots, including 34 Pocket Palaeo captures. Representative desktop cradle/final-museum and phone final-museum images were visually inspected, alongside direct browser QA. Touch emulation is not physical-device testing or a human enjoyment study.

Earlier native runs exposed three input bugs after passing the engine/interface checks: a missing compatibility click after fast dragging, a compatibility click retargeted onto an opened dialog, and a zero-detail touch click duplicating excavation. All were fixed in the game’s touch handling and covered by five additional DOM checks before the final passing native run. No failing browser run is counted as a pass.

Public checks already passed locally: 19 bundled routes/55 HTML asset references, nine first-batch selected-source hashes, exact twenty-slot selection gate, current shell, bridge-pointer and relaxed collection. Two inherited tests still reference the removed `playerStudy` element; those tests and the public shell are unchanged and are not claimed to pass.

## Commit evidence

- Initial playable: `56a94c7b79a35c4407e266e51fe4be3e83c83673`.
- Lift previews, stroke interpolation, art/alignment and browser regression: `43cb384a92add2715aefe414cbc7aa5435f7fe57`.
- Touch diagnostics: `352c19ef122d680c42c79c96b950514c9f499ed1`.
- Touch-release correction: `b681dd37d5efed4b133cbd26c619313ecef601dd`.
- Retargeted-click correction: `d7f940334afe98828517629fd84f7f671728f08c`.
- One-action-per-touch-tap correction: `fac96672c40a85256d0c32eaf2a60aba994161b5`.
- Integration commits: none. Published game URLs: none.

## Assessment and remaining work

Careful manual excavation leads into an understandable graph-support decision. The museum funds real tool improvements; it is more than a score display. This differs from Wellward's continuous winch physics and from first-batch crafting/cleaning loops. See [candidate comparison](COMPARISON.md).

Depth is modest: three fixed sites, six specimens and three upgrades, with better-condition recovery as the main replay goal. The fixture uses 283 ordinary actions to finish the collection and buy every upgrade; that is evidence of reachability, not a human duration estimate. There is no procedural discovery, sound layer, physical-device test, full screen-reader audit or human enjoyment study. Phone use requires scrolling between fieldwork and the museum. No multi-hour-content claim is made.

Next is Static Orchard, slot 31, with charging/releasing electric fruit and chaining arcs through moving pests. Ten slots remain concepts and are not counted. Reserve final batch work for additional improvements, comparative selection, integration against freshly read main, and release regression.

The latest public release [39925660833](https://github.com/ThatOneMop/study-desk/actions/runs/39925660833), rechecked on 24 October 2026 Sydney time, passes route/assets validation but fails **Configure GitHub Pages**; preparation, upload and publishing are skipped. Development commits are not live deployment. No second-batch game has been integrated into the public catalogue or verified live.
