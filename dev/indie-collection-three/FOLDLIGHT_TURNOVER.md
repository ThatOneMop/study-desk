# Foldlight whole-sheet turnover — 28 October 2026

Source: [9af4c55b48f6f67f68683d7c5d8789278604d034](https://github.com/ThatOneMop/study-desk/commit/9af4c55b48f6f67f68683d7c5d8789278604d034).

## Before and after
Source inspection found that another face could only be exposed through a crease fold. The new optional whole-sheet turnover mirrors all panes left-to-right, reverses each stack and flips every paper face without merging panes. It spends one move from the existing allowance. Turning twice restores the exact paper but costs two moves.

Choose the turnover checkbox, use the existing preview and layer inspection, and commit. Crease/side/under controls disable and crease marks disappear in this mode. T toggles on page/pane focus; native controls retain keys. Retry/new pattern/reset clear the transient mode. The optional {type:'flip'} action replays through the existing v1 journal; original saves, under-folds and records remain valid. UI calls allowance units moves to include turnovers.

## Evidence and limits
27 tests pass, 14 engine and 13 jsdom 26.1.0, including all original 21:
NODE_PATH=/tmp/foldlight-turn/node_modules node --test tests/foldlight-engine.cjs tests/foldlight-dom.cjs

All three alternate routes use exactly one turnover and finish in 4/5/6 moves, compared with original 3/4/5-fold routes. They are coverage alternatives, not faster or optimal route claims. Fixtures: tests/fixtures/foldlight-flip.json. Each move is driven through controls and saved/reloaded. Tests cover mirroring, layer reversal/face flipping, conservation, involution, allowance limits, strict malformed-action rejection, undo/retry, pure exact previews, disabled irrelevant controls, native keys, shortcuts and pause/modal guards. Existing tests retain wins, loss/retry, progression, corrupt-save recovery, quota failure, reset isolation and navigation.

Both scripts parse. Unique/used IDs, bridge-first order and absence of workspace-switch controls pass static checks. No rendered play, screenshots, actual touch/native-dialog evidence, enjoyment rating, full-repository build or live verification. Known browser security-policy rejection was not retried or bypassed.

This is a source-informed refinement, not a qualified improvement. The three compact targets remain the same. Rendered play must determine whether turnover adds useful planning and whether its mirror direction and mode are understandable. No duration claims.

## Preservation and counts
Re-read first-batch final report, third tree/ledger and candidate source/README. No AGENTS.md in third tree. Static conventions retained. Starting heads: third ea0db4ef2b223003cd8daab80d37270f70bf2ee7; main 55c330d9ec493afc40e81e89a371f64cbd5bd8b0; second 3949e3d9f8e2e9846dc4c91c436d90b19bbbd341. Unchanged launcher remains under the prior clean audit; no deployment retry or new rendered navigation claim.

Third ledger remains exactly fifty slots: **22 built, 0 qualified improved, 0 browser-tested, 0 integrated, 0 live**. Second additional round remains **6/20 verified; 14 pending**. First batch and concurrent main/Gummy Bay/second work unchanged. No public entry or automation changes.

Next: supported rendered before/after play and screenshot review, then a substantive observation-led improvement before qualification. Continue remaining distinct candidates while rendering is unavailable.
