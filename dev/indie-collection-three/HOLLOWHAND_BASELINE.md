# Hollowhand — slot 75 playable baseline and record correction

Date: 3 November 2026

## Source and scope

Initial playable source was committed at [a5689da0](https://github.com/ThatOneMop/study-desk/commit/a5689da0e1c4fc2a3d71cc4f9c0f4fb9c8f7d279). The previous run's ledger/report writes failed during automatic approval review timeouts; this report reconciles that already-existing source without counting it twice.

The original card combat game uses three energy and ordered spark, attack, guard and healing actions. Four encounters offer earned deck additions or removal of a starter attack. Original CSS mask art and independently keyed local saving are included. Source lives in `games/hollowhand/`, with engine/browser tests and a dedicated verification workflow.

## Correction

[9650ca40](https://github.com/ThatOneMop/study-desk/commit/9650ca407c27b551e5a87d2eed134c6f319f147c) counts each encounter-winning turn. Previously, the recorded route showed10 turns despite requiring13. New records include all winning turns. A versioned, one-time decode migration adjusts old in-progress counters and completed best records without changing health, deck, seed or progress. Existing save key remains unchanged.

This is a correctness repair, **not** a substantive gameplay improvement pass. Slot75 remains improved=false and browserTested=false: the latter denotes full qualification in this ledger, not the absence of baseline browser evidence.

## Evidence

Initial [CI41600311297](https://github.com/ThatOneMop/study-desk/actions/runs/41600311297) passed four engine checks and two rendered victories; its turn display was inaccurate.

Current [CI41607453268](https://github.com/ThatOneMop/study-desk/actions/runs/41607453268) passed:

- Six engine checks, including an independent count of completed turns, migration of every state on the winning route, and repeated-decode idempotence.
- Desktop1280×1000 and touch-emulated390×844 Chromium four-encounter wins:53 actions,13 turns,17 health and three earned Moon cleave additions.
- Exact save/reload after each action; loss/retry; best retention after restart; native Space/Escape; pause; corrupt-save preservation/recovery; quota fallback; standalone Games navigation; no page errors or horizontal overflow.
- Repository source syntax/Freedoom structure and nine first-batch release integrity checks.

Artifact13217342626 SHA256: `f669d5c06c246cd3b65d1df881c681bd052adbeaa84790ced22c7e2a7b1dea23`. Download integrity verified. Inspected `desktop-won.png` and `touch-won.png`: the corrected13-turn record is visible; cards and completion text remain readable without horizontal clipping. Phone vertical scrolling remains substantial.

These are automated interaction checks plus agent visual assessment. They do not establish human enjoyment, physical-device performance, full keyboard career coverage or embedded-shell qualification.

## Most important weaknesses and next work

All four foes use the same intent cycle and art. The tested reward strategy always adds Moon cleave; other rewards have not demonstrated competitive value. Fixed starting seed and a six-card pool limit replay variation. On mobile, scrolling the hand can hide current health and intent.

The next substantial pass should make enemy behaviors distinct, create meaningful deck/reward tradeoffs and keep critical combat information accessible on phones. Then verify alternative rewards, keyboard career, actual embedded bridge behavior, saves and restart before qualification and comparison. No finished-selection claim is made.

## Durable status and preservation

Batch3 has exactly50 slots: **35 built,34 substantially improved,34 fully browser-qualified,15 unbuilt (76–90),0 active catalogue integrations,0 verified live releases**. Historical integrations remain recorded separately. Batch2's20 candidates and20/20 additional-round evidence are preserved.

Fresh main remains `fa57730f70904ae5f15e47fe0c7e55dc28144c88`. Its PR110 exact14-game curation and release gate remain unchanged; no catalogue changes or publishing retries were made. No AGENTS.md was found in the current recursive development tree. Concurrent Numberworks, Gummy Bay and requested-GitHub-games work is preserved by editing only Hollowhand source/tests and this batch's documentation. The hourly automation is unchanged.
