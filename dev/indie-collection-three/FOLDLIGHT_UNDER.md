# Foldlight under-folding — 28 October 2026

Implementation: [bb255e048f6cbccea5d103460df6fe22d904c949](https://github.com/ThatOneMop/study-desk/commit/bb255e048f6cbccea5d103460df6fe22d904c949).

## Before and after
Source review found that a fold always covered stationary layers. The new Tuck underneath option places the turned, reversed moving stack beneath stationary paper instead. Its geometry and one-fold cost remain the same; stationary top colours stay visible, while future folds may expose the rearranged buried layers. Empty destinations receive the same turned stack in either mode.

A native checkbox and U shortcut on page/pane focus select the mode. Exact previews, match counts and layer inspection reflect it. Retry, pattern changes and reset return to over-folding. Mode selection is transient across reload; committed under:true actions replay through the existing v1 save. Only strict true is allowed; original actions still mean over-folds.

## Evidence and limits
21 checks pass: 11 engine, 10 jsdom 26.1.0, including all original 14. New full routes use under-folds and finish in 4/6/5 moves through DOM controls and per-action save/reload. These are feasible examples, not optimality or speed-improvement claims.

Checks cover bottom insertion with moving-layer reversal/face flipping, stationary top preservation, unchanged geometry and unique paper conservation, empty destinations, strict flags, caller copying, malformed journal rejection, full campaigns, undo, retry, original journals, mode previews and native/pause/modal guards. Both scripts parse. Existing loss/retry/navigation/corrupt-recovery/quota checks remain passing.

No rendered play, inspected screenshot, native touch/dialog verification, human enjoyment evidence or full-repository build is claimed. This source-informed mechanic does not count toward rendered-qualified improvements. Next: evaluate whether over/under choices deepen sequence planning and whether the mode is clear on desktop/mobile; implement a substantive observed improvement before qualification.

## Preservation
First-batch final report reread: 20 finished, nine historically source-selected, zero verified live. Third head was 9a289aedc32c542607015bc7b5ca2d09d034a8eb and its tree contains no AGENTS.md. Current Foldlight source, README/save rules and ledger were inspected.

Main remains 55c330d9ec493afc40e81e89a371f64cbd5bd8b0, unchanged from the prior shell audit. Second remains 3949e3d9f8e2e9846dc4c91c436d90b19bbbd341. Changes are limited to Foldlight source/tests and third-batch documentation. No Switch workspace control or catalogue entry was added. Earlier collections, saves, navigation and concurrent Gummy Bay work are preserved. Existing rendering security-policy/publication barriers were not retried or bypassed; no live release claimed.

Third: **21/50 built; 0 qualified improved; 0 browser-tested; 0 integrated; 0 live**. Second additional round: **6/20 verified, 14 pending**. Foldlight remains unlisted; 29 third-batch slots remain unassigned.
