# Reefwright — plan a channel before cutting

## Observed weakness

Reviewed retained phone midgame image touch-midgame.png from native run 40731810668/artifact 12835223971. The board/controls are readable but ecological totals sit below the board. Source inspection confirms previews only assess a single cut, making a two-square channel difficult to compare before spending the first cut. This is automated rendered baseline review, not new direct interactive play.

## Change

Before: Two selective cuts exist, but only one can be previewed. Testing a second removal requires committing the first and undoing it later.

After: After a valid cut preview, Plan a second cut holds the first square visibly without spending. Selecting a different habitat forecasts the combined ecological result; Confirm both cuts commits both existing replay actions. X cancels the whole plan, invalid/duplicate cuts cannot commit, and Undo restores one square and cut at a time. The two-cut allowance, habitat supply, scoring and version-one saves are unchanged.

The tested reef exposes the tradeoff: the first removal reduces vitality from 27 to 24, while the pair restores 27 and creates a seventh thriving nursery. This does not automatically recommend a cut or solve the reef. Five authored coasts remain compact; the upgrade deepens comparison rather than adding repetitive levels.

## Evidence

Implementation: [92639e4](https://github.com/ThatOneMop/study-desk/commit/92639e48c7e2409f05f7911f67402707e9537b2b), following [existing selective cuts](https://github.com/ThatOneMop/study-desk/commit/0db09c81e7d4227733b4a9f16a6cd839187895f1).

58 focused checks pass: 31 engine + 27 DOM. Existing five original and five cut-assisted campaigns preserved. New paired-cut case starts at 27 vitality, drops to 24 after the first cut, then restores 27 and raises thriving nurseries 6→7 after both. Pure planning, atomic invalid/duplicate rejection, exact replay, no deck advancement, cancel, Enter confirmation, reload and two-step undo pass. Native desktop/touch routes added for all five cut-assisted campaigns plus paired plan/cancel/confirm/reload/undo; CI 40751257296 pending.

[Native CI 40751257296](https://github.com/ThatOneMop/study-desk/actions/runs/40751257296) remains pending. Baseline [artifact 12835223971](https://github.com/ThatOneMop/study-desk/actions/runs/40731810668/artifacts/12835223971) supplied the inspected phone image. Changed screenshots have not yet been reviewed; no new direct interactive-browser play, physical-device or human enjoyment claim.

## Checkpoint

Inspect exact-source CI 40751257296 and paired-preview/committed desktop and touch screenshots, verify loss/retry/saves/reset/navigation, and evaluate readability before credit. Additional round remains 15/20.

Second collection: 20 initially finished, 15/20 additional verified, 35 recorded passes. Third: 24/50 built, zero qualified improved/browser-tested/integrated/live. No new catalogue integration or live release. First-batch sources/saves and concurrent main/Gummy Bay work preserved. Main remains 55c330d; earlier Switch-workspace audit and resolved Pages publication remain unchanged.
