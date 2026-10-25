# Soundings initial prototype — 26 October 2026

Source: `53b115faa06a46e8b7512a6f1cae13caa5e964b8` on `indie-collection-three-dev`.

## New game

Slot 51 introduces sonar deduction and salvage. Two hidden beacons share a chart. Each buoy reports Manhattan distance to the nearer beacon, so multiple readings must be reconciled. A notebook filters possible pairs and marks certain locations without choosing the next sounding. Fourteen fuel pays for soundings (one each) and recovery attempts (three each); misses waste fuel and can lose the attempt.

Recovered beacons continue transmitting. Retry repeats the chart; New voyage changes the seed while preserving sector unlocks and casual best-fuel records. Three sectors use distinct placements under the same rules. They are not separate games or three authored campaigns. Original CSS chart art, numbered readings, symbol/accessible-label feedback and native controls are implemented.

## Evidence

**10 tests pass: 6 engine and 4 jsdom 26.1.0**, plus both script syntax checks. A deterministic policy using only revealed notebook evidence solves all 300 possible beacon pairs within fuel, as well as 100 seeded three-sector campaigns. This is solvability evidence, not human enjoyment or a content-hours measurement.

Coverage includes true-pair retention, nearest readings and persistent signals, losses/retry/new charts, invalid/duplicate inputs, owned action journals, corrupt saves and unlock/record consistency. DOM tests exercise campaigns using known targets, certainty labels, save/reload, navigation markup, pause/dialog/parent guards, reset isolation, recovery and quota failure. Dialogs are simulated. These UI routes are handler verification, not natural deduction play.

No rendered play, screenshots, native keyboard/touch validation, mobile layout, full repository build or human-enjoyment claim. No improvement-pass credit is awarded.

## Preservation and next steps

Exactly 50 third-batch slots: **11 built; 0 improved/browser-tested/integrated/live**; 39 remain unbuilt. Second additional round remains **20 source upgrades, 6 rendered-verified, 14 pending**. First collection report remains preserved at 20 finished and nine selected source entries.

Main `dc88f09cfb30cae92e3f0e9afe65cd2f7ddaf4f7` and second branch `3949e3d9f8e2e9846dc4c91c436d90b19bbbd341` are unchanged since the last run. The navigation audit and latest failed Pages Configure evidence were not repeated; rendering restrictions were not retried or bypassed. Shared catalogue, existing games/saves, Gummy Bay and concurrent work are untouched. This source commit is not a live release.

Next: natural rendered desktop/touch play and screenshot inspection; assess notebook clarity, nearest-beacon ambiguity, fuel tension and replay value. Implement a substantial playtest-led improvement and verify failure/retry, saves/reload, restart and launch/navigation before integration.
