# Seedwake initial implementation — 27 October 2026

Source commit: [018d8c74baec589351be660fc3519352a1652ecc](https://github.com/ThatOneMop/study-desk/commit/018d8c74baec589351be660fc3519352a1652ecc).

## Implemented
Slot 60, third collection: lift every seed from one bed and sow around an eight-bed ring. Only an exact-capacity final landing blooms; its seeds become that bed's flower. Complete a three-species bouquet. Limited gusts reverse sow direction, creating a choice between immediate blooms and future pile arrangements. Flowers beyond a filled request still spend seeds, so the exact forecast warns about excess harvests.

Three authored gardens change initial piles, capacities, requests and gust budgets. Current examples finish in 5, 7 and 8 handfuls; no optimality or duration claim. Unlimited planning/undo/retry, fewest-handful records, sequential unlocks, exact pile/landing previews, original SVG flowers, native button/checkbox controls and responsive CSS are implemented. The isolated v1 replay save preserves progress, rejects impossible journals, retains unreadable data until recovery and tolerates quota errors.

This is a distinct sowing-and-exact-landing loop, not Fallow Table's growth/rotation or another existing game's renamed copy. Known scope is a compact fixed puzzle campaign; deeper replayability is not claimed.

## Checks performed
- 12 engine tests and eight jsdom 26.1.0 tests passed (20 total).
- Every route action was driven through DOM controls, saved, reloaded and continued through all three wins. No state injection was used to skip those campaigns.
- Exact landing, passed-through capacity, overshoot, multi-lap seed distribution, reverse cost, excess flower spending, conservation across all legal depth-three routes per garden, terminal guards and final-turn victory.
- Loss/reload/undo/retry, record retention, garden navigation, forecasts without mutation, keyboard/native-control ownership, pause/modal/trusted-parent guards, corruption recovery, isolated reset and quota failure.
- Both scripts parse. New local asset references, unique IDs and bridge-first order pass. Games link points to the existing root catalogue.
- These are engine/DOM checks, not rendered playtesting, inspected screenshots, native touch evidence or human enjoyment. No full repository build claim from this partial recovery.

## Audit and preservation
First-batch FINAL_REPORT.md was reread: 20 finished, nine historically source-selected, zero verified live. Second branch stayed at 3949e3d9f8e2e9846dc4c91c436d90b19bbbd341; its additional checklist still reports 6/20 verified. Third head before work was 40e6d429566c1dc5d8ed14270910163c75d0d203. No AGENTS.md was found in current main or third trees. Repository README and test conventions were reread.

Main was fec6f229630e04f272e585521c0685ad5491ba72. Changes since 9e15e3cd07f59f2eba83ea11c95f285cf259e314 are Gummy Bay-only; its changed index shell has no Switch workspace/playerStudy/studyBtn matches. New Seedwake shell has none. Previously audited launcher navigation remains unchanged. No fresh desktop/mobile navigation claim.

Only new Seedwake source/tests plus this report and the third ledger are written. Main, both earlier collections, existing saves and catalogue entries remain untouched. Existing browser security-policy and deployment barriers were not retried or bypassed. No source commit is represented as a live release.

## Counts and next work
Third: **20/50 built; 0 qualified improved; 0 browser-tested; 0 integrated; 0 live**. Exactly 50 ledger slots remain, with 30 unassigned. Second additional round: **6/20 verified; 14 pending**, all additional upgrades source-implemented.

Seedwake stays unlisted until rendered play, screenshot inspection and a substantive observed improvement pass. Evaluate ring order/mobile readability, timing-free pacing, exact-capacity decisions, gust value and replay depth. Then verify wins, loss/retry, saves/reload, reset and navigation on desktop/touch before comparing it with the wider slate.
