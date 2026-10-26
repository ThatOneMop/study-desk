# Soundings directional surveys — 26 October 2026

Implementation: `95bc2808de3dce9257d98bd32eef0fb5c40c6f94` on `indie-collection-three-dev`.

## Before and after

Source inspection found that every survey was a one-fuel nearest-distance reading. Players now choose between that cheap reading and a two-fuel bearing survey. Bearings report compass directions to both beacons, without distances or identities. This resolves some ambiguity at a higher fuel cost; careless repeated surveys can exhaust the recovery budget.

North is up; a diagonal direction means the corresponding quadrant, not a precise angle. Duplicate directions are retained and Here denotes a beacon at the selected square. Recovered beacons keep transmitting. The notebook filters candidate pairs against both evidence types. Players can revisit any recorded reading for free, including after reload.

Existing v1 saves replay unchanged. New bearing actions use the same validated two-field action shape. Duplicate surveys are rejected free and corrupt data remains protected. No shared save keys or other games changed.

## Evidence and limits

**16 tests pass (10 engine, 6 jsdom 26.1.0)** and both scripts pass syntax checks. Existing tests remain. Both the distance-only and bearing-first policies solve all 300 possible beacon pairs within fuel using visible notebook evidence. Additional checks cover mirrored equal-distance clues, duplicate/Here bearings, true-pair retention, persistent signals, combined filtering, survey overspending/loss/retry, old saves, new journals, no-cost rereading, reload and pause/dialog guards.

The UI campaign uses known targets to verify handlers; engine policies are automated reasoning tests. Dialog APIs are simulated. No natural rendered play, screenshots, native keyboard/touch activation, full repository build or enjoyment claim. This source refinement does not satisfy the required rendered-playtest-led improvement.

## Status and preservation

Exactly 50 third-batch slots remain: **11 built, 0 improved/browser-tested/integrated/live**. Second additional round: **20 source upgrades, 6 rendered-verified, 14 pending**. First collection remains preserved.

Main `dc88f09cfb30cae92e3f0e9afe65cd2f7ddaf4f7` and second branch `3949e3d9f8e2e9846dc4c91c436d90b19bbbd341` are unchanged. The recorded navigation and publication findings were not repeated; browser restrictions were not retried or bypassed. Only Soundings source/tests and third-batch documentation change. No catalogue integration or live release.

Next: naturally play with both survey choices on desktop/touch; inspect compass/readout clarity and whether the fuel trade-off is worthwhile. Implement a substantive playtest-led improvement, then verify saves/reload, failure/retry, restart and navigation before selection. Continue the 39 unbuilt candidates independently while rendering is blocked.
