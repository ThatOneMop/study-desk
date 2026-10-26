# Moss Commons initial prototype — 26 October 2026

Source: `c9ebfeb6b75d6e7f698a29e6e63e88c760295823` on `indie-collection-three-dev`.

## Implemented game

Slot 52 is a compact settlement-planning game. Houses shelter two people each and create food/water demand. Wells supply water and boost adjacent gardens; fertile plots can support an alternative food layout. Every building or path must join the existing settlement. Paths extend reach cheaply but spend timber without directly supporting residents.

Three authored sites vary rocks, fertile plots and timber budgets. Players inspect projected resources before committing, undo freely and replay for more timber remaining. Original CSS village art, native controls, labels independent of art, invalid-build feedback, pause/visibility guards and isolated journal-validated saves are included.

A tested route completes each site using 17 timber. An alternate second-site route uses 18 timber, a path and an unwatered fertile garden. These examples establish playable choices, not optimal strategies or substantial content hours. The game models settlement capacity, not a real-time colony simulation.

## Verification

**Nine tests pass: six engine, three jsdom 26.1.0**, plus both gameplay script syntax checks. Campaign routes complete all sites with exact saves/reloads after each build. Additional coverage checks nonstacking garden yields, population demand, connectivity and edge neighbors, invalid builds, immutable action input, finite-budget loss, undo/retry, malformed journals, forecasts, progression, navigation markup, pause/parent guards, reset isolation, corrupt recovery and quota failure.

Dialogs are simulated. No rendered play, screenshot inspection, native keyboard/touch activation, mobile layout, full repository build or human-enjoyment claim. This is an initial prototype; it has not earned improvement-pass credit.

## Status and preservation

Exactly 50 third-batch slots: **12 built; 0 improved/browser-tested/integrated/live**; 38 remain unbuilt. Second additional round remains **20 source upgrades, 6 rendered-verified, 14 pending**. First collection remains preserved at the reported 20 finished and nine selected source entries.

Main `dc88f09cfb30cae92e3f0e9afe65cd2f7ddaf4f7` and second branch `3949e3d9f8e2e9846dc4c91c436d90b19bbbd341` are unchanged. Existing workspace/publication findings were not repeatedly rechecked; browser restrictions were not retried or bypassed. Only new Moss Commons source/tests and third-batch documentation change. Existing games/saves, catalogue, Gummy Bay and concurrent work are untouched. No public integration or live release.

Next: rendered natural desktop/touch play and screenshot inspection; assess capacity trade-offs, forecast readability and replay depth. Implement a substantial playtest-led improvement, then verify exhaustion/undo/retry, saves/reload, restart and navigation before selection.
