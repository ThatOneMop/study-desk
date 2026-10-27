# Fallow Table transplanting — 27 October 2026

Implementation: [bcf3ccd43d098c567c250c4d48b3dd3d6723ede3](https://github.com/ThatOneMop/study-desk/commit/bcf3ccd43d098c567c250c4d48b3dd3d6723ede3).

## Change
Source inspection found that crops could never move after planting. For one work point, an immature crop can now move to any empty bed. It retains its growth and planted yield, while soil, water and previous-harvest history remain in each bed. No soil refund or additional soil charge occurs. The destination's water and neighbours determine subsequent growth: moving beans alters squash shade immediately.

Native destination selector and Move growing crop button expose the action, with crop/growth/yield/cost feedback. T is available on page/bed focus without taking keys from other controls. Empty sources, same/occupied/invalid destinations, ripe crops and exhausted work reject freely. Undo restores the whole previous state. The existing v1 journal adds a strictly checked transplant action without changing existing save keys or state fields.

## Evidence and limits
34 tests passed: 20 engine and 14 jsdom 26.1.0, including all original 27. Three transplant-inclusive campaigns run through actual DOM controls with save/reload after every action. They finish with 10/8/5 work points left; these are coverage examples, not optimality or improved-score claims. Original routes still pass with unchanged 13/11/8 scores.

Tests cover crop/growth/yield transfer, immutability, moisture and shade consequences, bed resource/history preservation, eligibility, strict journals, undo/retry, native controls, selector changes without saving, pause/modal guards, ripe rejection, existing loss/navigation/recovery/quota paths. Both scripts parse; local asset references, unique HTML IDs, bridge-first loading and absence of Switch workspace controls pass.

No rendered/browser play, screenshot inspection, physical touch, native-dialog verification or human enjoyment evidence. No full repository build claim from this partial source recovery. This source-informed mechanic is **not** counted as the required rendered-play-led improvement. Assess whether transplant timing provides meaningful choices, whether it creates dominant planting strategies, and whether destination selection reads comfortably on mobile.

## Preservation and status
The first-batch final report was reread (20 finished, nine historically source-selected, zero verified live). Third branch began at 46b1c61fd155c43623e6ea78fcb8763d9ed588e7; no AGENTS.md exists in that tree. Current Fallow Table engine, README/save rules and third ledger were inspected before editing. Second branch remains 3949e3d9f8e2e9846dc4c91c436d90b19bbbd341.

Main remains 55c330d9ec493afc40e81e89a371f64cbd5bd8b0, unchanged from its last shell audit. Existing catalogue/navigation, both earlier collections and concurrent Gummy Bay changes remain untouched. Previously recorded browser security-policy and publication barriers were not retried or bypassed. No live release is claimed.

Third: **20/50 built; 0 qualified improved; 0 browser-tested; 0 integrated; 0 live**. Second additional round: **6/20 verified, 14 pending**. The candidate remains unlisted. Next: rendered review, substantive observed improvement and follow-up verification before selection; continue the remaining 30 distinct candidates independently.
