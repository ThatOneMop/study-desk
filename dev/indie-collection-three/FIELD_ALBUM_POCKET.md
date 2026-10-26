# Field Album pocket — 27 October 2026

Source: [283fa96a252613fb9de44e5eea88d22da16886ac](https://github.com/ThatOneMop/study-desk/commit/283fa96a252613fb9de44e5eea88d22da16886ac).

## Before and after

The source offered only the current packet's finds. Every unused find disappeared at the next survey, so a player could not reserve a useful species for a later arrangement. The new one-use field pocket holds one unplaced find; the other two must be placed. On a later survey the player selects a different, unplaced find to replace with the pocket species. Whichever species is replaced leaves the draft. No extra album slot or survey is added.

The pocket is separate from the existing rearrangement. Players can undo either action. Same-survey use, identical-species swaps, taken cards and starting a pocket on the final survey reject without consuming anything. The UI names both species before replacement, disables the stored card and explains when the pocket becomes available.

The v1 key and old actions/records are unchanged. Optional derived pocket fields appear only when used. The action-journal cap becomes 21: 18 survey/placement actions plus rearrangement, pocket and replacement. Records and unrelated saves are preserved.

## Validation

- 33 tests pass: 18 engine and 15 jsdom 26.1.0. All 26 prior tests remain passing.
- Exact species carry, no extra placement, later packet replacement, one-use guards and input immutability.
- Full 21-action journals combining both allowances on all three trails, with engine save/reload after every action; old journals retain their original derived shape.
- Unused-pocket completion, invalid/taken/identical/late trades, undo/retry and malformed-journal rejection.
- UI card disabling, pocket messaging and named replacement, selection without mutation, pause/rearrangement/native keyboard guards, reload across packets, full album completion and isolated reset.
- Existing campaigns, progression, missed-target recovery, seed changes, corrupt-save handling and quota warnings continue to pass. Both gameplay scripts pass syntax checks.

This is engine/DOM evidence only. There was no rendered browser play, screenshot inspection, physical touch test or full-repository build from the partial workspace.

## Preservation and remaining work

Development base: 640b746d2675e9f72ee9cf3bf5ea6c7014cce005. Re-read remote source/tests and ledger before editing; no AGENTS.md in the development tree. First-batch baseline still records 20 finished, nine source-selected and zero verified live URLs.

Main observed: f81a5ff53c44f3e6c1ee995537e19e1da304e52e. Changes since 7be343a4b7638a11b75c273c88c744c4de834099 are Gummy Bay and credits; launcher index/app are unchanged and the inspected diffs contain no Switch workspace text. Main, the catalogue, all other games and their saves were not modified.

Third batch remains **17/50 built, 0 improved, 0 browser-tested, 0 integrated, 0 verified live**, with exactly fifty slots and 33 unassigned. Second additional round remains **6/20 rendered verified, 14 pending**. No new published game URL.

The previously recorded rendering security-policy blocker was not bypassed or retried. This source-led refinement does not qualify as the required rendered-play improvement pass. Natural play should assess whether delaying a find creates useful decisions, whether replacement is clear, and whether the extra controls fit mobile screens. Keep Field Album unlisted pending that work.

Publishing was not retried; the existing Pages configuration barrier remains unresolved. Source commits do not establish a live release. Continue independent candidate work while retaining the pending rendered tests and final selection obligations.
