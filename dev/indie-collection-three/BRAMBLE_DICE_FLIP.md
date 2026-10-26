# Bramble Dice — opposite-face choice

2026-10-27 · Implementation `8e7d63d094d7f7431ba5790d00ab0d6463e0b016`.

Source inspection found that keeping or random rerolling were the only ways to manage the current handful. Players can now spend one reroll to turn any single die to its opposite face: 1↔6, 2↔5, 3↔4. Both actions share two charges per combat turn. Turning deliberately ignores keep pins but preserves jobs, pins, other dice and the RNG state. Thus players choose reliable single-die adjustment versus random multi-die improvement. Low faces can still matter with Acorn Sling. No new game, equipment or campaign content is counted.

Each die has a Turn over button showing the next face and cost; F works on the focused die card. Native controls retain their keys. Existing phase/pause/guide/dialog restrictions apply. A new combat turn replenishes the budget; retry resets the journal and keeps the record. Old v1 save fixtures retain exact health, RNG and victory outcomes. New entries are replayed flip actions; existing best records are preserved, though expanded choices may improve future scores.

19 tests pass: 11 engine and 8 jsdom 26.1.0, retaining all previous 13. Coverage includes shared budget, mixed actions, no-op reversal costing both charges, invalid indexes/extra fields, deterministic RNG and other-die preservation, setup preservation, turn replenishment, reward/terminal guards, new/old journal reload, button labels/values, focused-card shortcut/native-form/repeat/modifier guards, pause/guide and full seed-42 Acorn Sling campaign with an opening flip. Retry retains its victory record. The original 25 seeded equipment routes remain passing. Both scripts pass syntax checks. DOM dialogs and events are simulated; this is not natural rendered play or human-enjoyment evidence.

No rendered improvement credit, screenshots, native touch/mobile assessment, full repository build or live release. Next inspect actual die-card layout and play varied allocations with low-die gear; assess whether predictable flips overwhelm random rerolls, implement the required substantial rendered-led improvement, then verify saves, progression, loss/retry and navigation before selection. The existing security-policy browser blocker was not bypassed; publication was not retried unchanged.

Starting third head `d6dd032ccb632e2d89d37b04a832da27cbea3cdc`; main observed `eefdcbcd98a59a1d0970a4f133bd88f0660b0612`. New main delta contains Gummy Bay/credits changes and no added Switch workspace matches; shared launcher/catalogue untouched. No AGENTS.md in the third tree. First final report re-read: 20 finished/improved, 9 source-selected, 0 verified live.

Exactly 50 third slots remain: 15 built prototypes, 0 improved/browser-tested/integrated/live. Second additional round remains 6/20 verified, 14 pending. Independent implementation remains possible; do not pause as complete.
